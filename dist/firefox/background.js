/**
 * Background Service Worker / Script for Domain Scout AI
 * Handles long-running AI domain hunts and bulk availability checks in the background.
 * Ensures domain generation and checking continue seamlessly even when the popup window is closed.
 * Compatible with Chrome MV3 (service worker) and Firefox MV3 (background script).
 */

if (typeof importScripts === 'function') {
  try {
    importScripts('domain-checker.js', 'ai-generator.js');
  } catch (e) {
    console.warn('Domain Scout background: importScripts notice:', e);
  }
}

// Storage abstraction
const storageEngine = (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local)
  ? chrome.storage.local
  : (typeof browser !== 'undefined' && browser.storage && browser.storage.local ? browser.storage.local : null);

async function getStoredData(keys) {
  if (storageEngine) {
    return new Promise((resolve) => {
      storageEngine.get(keys, (res) => resolve(res || {}));
    });
  }
  return {};
}

async function setStoredData(obj) {
  if (storageEngine) {
    return new Promise((resolve) => {
      storageEngine.set(obj, () => resolve());
    });
  }
}

// Broadcast message safely to any open popup / options page
function broadcastMessage(msg) {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      const p = chrome.runtime.sendMessage(msg);
      if (p && typeof p.catch === 'function') {
        p.catch(() => {}); // Safe catch when popup is not open
      }
    } else if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendMessage) {
      const p = browser.runtime.sendMessage(msg);
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    }
  } catch (e) {
    // Harmless if no receiving end is active
  }
}

// Active search state tracker
let currentSearch = null;

/**
 * Start an AI domain hunt in the background
 * @param {Object} payload
 * @param {string} [searchId]
 */
async function startAiHuntBackground(payload, searchId) {
  if (!payload || !payload.prompt) return;

  // Cancel any currently active search
  if (currentSearch && currentSearch.status === 'running') {
    currentSearch.isCancelled = true;
    if (currentSearch.abortController) {
      try { currentSearch.abortController.abort(); } catch (_) {}
    }
  }

  const abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const sid = searchId || `ai_${Date.now()}`;
  const searchObj = {
    id: sid,
    type: 'ai',
    status: 'running',
    isCancelled: false,
    abortController,
    prompt: payload.prompt,
    progress: {
      round: 1,
      maxRounds: payload.maxRounds || 3,
      step: 'brainstorming',
      message: '🤖 Brainstorming domain ideas with AI...',
      availableCount: 0,
      totalChecked: 0
    }
  };
  currentSearch = searchObj;

  // Reset previous results in storage and record active search
  await setStoredData({
    lastResults: [],
    lastAiMeta: null,
    searchState: {
      status: 'running',
      type: 'ai',
      searchId: sid,
      prompt: payload.prompt,
      progress: searchObj.progress
    }
  });

  const domainChecker = (typeof DomainChecker !== 'undefined') ? DomainChecker : (typeof globalThis !== 'undefined' ? globalThis.DomainChecker : null);
  const aiGen = (typeof AiGenerator !== 'undefined') ? AiGenerator : (typeof globalThis !== 'undefined' ? globalThis.AiGenerator : null);

  if (!aiGen || !domainChecker) {
    const errorMsg = 'AI Generator or Domain Checker core library not loaded in background.';
    searchObj.status = 'error';
    await setStoredData({
      searchState: { status: 'error', type: 'ai', searchId: sid, error: errorMsg }
    });
    broadcastMessage({ type: 'SEARCH_ERROR', searchId: sid, error: errorMsg });
    return;
  }

  try {
    const huntResult = await aiGen.huntAvailableDomains({
      prompt: payload.prompt,
      defaultTlds: payload.defaultTlds || ['com', 'io', 'ai'],
      provider: payload.provider || 'openrouter',
      apiKey: payload.apiKey || '',
      modelOverride: payload.modelOverride || '',
      targetAvailableCount: payload.targetAvailableCount || 10,
      maxRounds: payload.maxRounds || 3,
      domainCheckerInstance: domainChecker,
      isCancelled: () => searchObj.isCancelled,
      signal: abortController ? abortController.signal : undefined,
      onProgress: async (progress) => {
        if (searchObj.isCancelled) return;
        searchObj.progress = progress;
        // Save progress to storage so reopening popup gets latest state
        await setStoredData({
          searchState: {
            status: 'running',
            type: 'ai',
            searchId: sid,
            prompt: payload.prompt,
            progress
          }
        });
        // Broadcast live progress to popup if open
        broadcastMessage({
          type: 'SEARCH_PROGRESS',
          searchId: sid,
          progress
        });
      }
    });

    if (searchObj.isCancelled) {
      searchObj.status = 'cancelled';
      await setStoredData({
        searchState: { status: 'idle', searchId: sid }
      });
      broadcastMessage({ type: 'SEARCH_CANCELLED', searchId: sid });
      return;
    }

    searchObj.status = 'completed';
    const lastAiMeta = {
      prompt: payload.prompt,
      rounds: huntResult.rounds,
      totalChecked: huntResult.totalChecked,
      availableCount: huntResult.availableCount,
      engine: huntResult.engine,
      engineName: huntResult.engineName || (aiGen.getEngineDisplayName ? aiGen.getEngineDisplayName(huntResult.engine || payload.provider) : (huntResult.engine || payload.provider)),
      fallbackWarning: huntResult.fallbackWarning || null
    };

    // Save final results in storage
    await setStoredData({
      lastResults: huntResult.allResults,
      lastAiMeta,
      currentFilter: 'available',
      searchState: {
        status: 'completed',
        type: 'ai',
        searchId: sid,
        availableCount: huntResult.availableCount,
        rounds: huntResult.rounds,
        fallbackWarning: huntResult.fallbackWarning
      }
    });

    broadcastMessage({
      type: 'SEARCH_COMPLETED',
      searchId: sid,
      result: huntResult,
      lastAiMeta
    });
  } catch (err) {
    if (searchObj.isCancelled) {
      searchObj.status = 'cancelled';
      await setStoredData({
        searchState: { status: 'idle', searchId: sid }
      });
      broadcastMessage({ type: 'SEARCH_CANCELLED', searchId: sid });
      return;
    }

    console.error('Background AI Hunt error:', err);
    searchObj.status = 'error';
    const errorMsg = err.message || 'AI Generation failed';
    await setStoredData({
      searchState: {
        status: 'error',
        type: 'ai',
        searchId: sid,
        error: errorMsg
      }
    });
    broadcastMessage({
      type: 'SEARCH_ERROR',
      searchId: sid,
      error: errorMsg
    });
  }
}

/**
 * Start a manual bulk check in the background
 * @param {Object} payload
 * @param {string} [searchId]
 */
async function startManualCheckBackground(payload, searchId) {
  if (!payload || !payload.text) return;

  if (currentSearch && currentSearch.status === 'running') {
    currentSearch.isCancelled = true;
  }

  const sid = searchId || `manual_${Date.now()}`;
  const searchObj = {
    id: sid,
    type: 'manual',
    status: 'running',
    isCancelled: false,
    progress: { processed: 0, total: 0, percentage: 0 }
  };
  currentSearch = searchObj;

  await setStoredData({
    lastResults: [],
    lastAiMeta: null,
    searchState: {
      status: 'running',
      type: 'manual',
      searchId: sid,
      progress: searchObj.progress
    }
  });

  const domainChecker = (typeof DomainChecker !== 'undefined') ? DomainChecker : (typeof globalThis !== 'undefined' ? globalThis.DomainChecker : null);

  if (!domainChecker) {
    const errorMsg = 'Domain Checker core library not loaded in background.';
    searchObj.status = 'error';
    await setStoredData({
      searchState: { status: 'error', type: 'manual', searchId: sid, error: errorMsg }
    });
    broadcastMessage({ type: 'SEARCH_ERROR', searchId: sid, error: errorMsg });
    return;
  }

  try {
    const results = await domainChecker.checkDomains(payload.text, payload.preferredTlds, {
      batchSize: 50,
      delayMs: 150,
      onProgress: async (progress) => {
        if (searchObj.isCancelled) return;
        searchObj.progress = progress;
        await setStoredData({
          searchState: {
            status: 'running',
            type: 'manual',
            searchId: sid,
            progress
          }
        });
        broadcastMessage({
          type: 'SEARCH_PROGRESS',
          searchId: sid,
          progress
        });
      }
    });

    if (searchObj.isCancelled) {
      searchObj.status = 'cancelled';
      await setStoredData({
        searchState: { status: 'idle', searchId: sid }
      });
      broadcastMessage({ type: 'SEARCH_CANCELLED', searchId: sid });
      return;
    }

    searchObj.status = 'completed';
    const availableList = results.filter(r => r.isAvailable);

    await setStoredData({
      lastResults: results,
      lastAiMeta: null,
      currentFilter: availableList.length > 0 ? 'available' : 'all',
      searchState: {
        status: 'completed',
        type: 'manual',
        searchId: sid,
        availableCount: availableList.length,
        totalChecked: results.length
      }
    });

    broadcastMessage({
      type: 'SEARCH_COMPLETED',
      searchId: sid,
      results,
      availableCount: availableList.length
    });
  } catch (err) {
    if (searchObj.isCancelled) {
      searchObj.status = 'cancelled';
      await setStoredData({
        searchState: { status: 'idle', searchId: sid }
      });
      broadcastMessage({ type: 'SEARCH_CANCELLED', searchId: sid });
      return;
    }

    console.error('Background manual check error:', err);
    searchObj.status = 'error';
    const errorMsg = err.message || 'Check failed';
    await setStoredData({
      searchState: {
        status: 'error',
        type: 'manual',
        searchId: sid,
        error: errorMsg
      }
    });
    broadcastMessage({
      type: 'SEARCH_ERROR',
      searchId: sid,
      error: errorMsg
    });
  }
}

/**
 * Cancel any ongoing search
 */
async function cancelActiveSearch() {
  if (currentSearch && currentSearch.status === 'running') {
    currentSearch.isCancelled = true;
    if (currentSearch.abortController) {
      try { currentSearch.abortController.abort(); } catch (_) {}
    }
    currentSearch.status = 'cancelled';
  }
  await setStoredData({
    searchState: { status: 'idle' }
  });
  broadcastMessage({ type: 'SEARCH_CANCELLED' });
}

// Runtime message dispatcher
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !message.type) return;

    if (message.type === 'START_AI_HUNT') {
      startAiHuntBackground(message.payload, message.searchId);
      sendResponse({ status: 'started' });
      return true;
    }

    if (message.type === 'START_MANUAL_CHECK') {
      startManualCheckBackground(message.payload, message.searchId);
      sendResponse({ status: 'started' });
      return true;
    }

    if (message.type === 'CANCEL_SEARCH') {
      cancelActiveSearch();
      sendResponse({ status: 'cancelled' });
      return true;
    }

    if (message.type === 'GET_SEARCH_STATUS') {
      sendResponse({
        currentSearch: currentSearch ? {
          id: currentSearch.id,
          type: currentSearch.type,
          status: currentSearch.status,
          prompt: currentSearch.prompt,
          progress: currentSearch.progress
        } : null
      });
      return true;
    }
  });
}

// Export for testing / Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    startAiHuntBackground,
    startManualCheckBackground,
    cancelActiveSearch,
    getCurrentSearch: () => currentSearch
  };
}
