/**
 * Popup Controller for Domain Availability Checker
 * Cross-browser compatible (Google Chrome, Firefox, Edge, Brave, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let preferredTlds = ['com', 'io', 'ai'];
  let currentResults = [];
  let currentFilter = 'available'; // 'available' | 'all' | 'aftermarket'
  let searchTerm = '';
  let isChecking = false;

  // DOM Elements
  const domainInput = document.getElementById('domainInput');
  const tldChipsContainer = document.getElementById('tldChipsContainer');
  const newTldInput = document.getElementById('newTldInput');
  const btnAddTld = document.getElementById('btnAddTld');
  const btnResetTlds = document.getElementById('btnResetTlds');
  const quickTldButtons = document.querySelectorAll('.tld-quick-pill');

  const btnSample = document.getElementById('btnSample');
  const btnClearInput = document.getElementById('btnClearInput');
  const btnCheck = document.getElementById('btnCheck');
  const btnCheckText = document.getElementById('btnCheckText');

  const progressContainer = document.getElementById('progressContainer');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressText = document.getElementById('progressText');
  const progressPercent = document.getElementById('progressPercent');

  const resultsDashboard = document.getElementById('resultsDashboard');
  const countAvailable = document.getElementById('countAvailable');
  const countTaken = document.getElementById('countTaken');
  const countAftermarket = document.getElementById('countAftermarket');
  const countTotal = document.getElementById('countTotal');

  const filterTabs = document.querySelectorAll('.filter-tab');
  const tabCountAvail = document.getElementById('tabCountAvail');
  const tabCountAll = document.getElementById('tabCountAll');
  const tabCountMarket = document.getElementById('tabCountMarket');

  const statCardAvailable = document.getElementById('statCardAvailable');
  const statCardTaken = document.getElementById('statCardTaken');
  const statCardAftermarket = document.getElementById('statCardAftermarket');
  const statCardTotal = document.getElementById('statCardTotal');

  const searchFilterInput = document.getElementById('searchFilterInput');
  const btnCopyAvailable = document.getElementById('btnCopyAvailable');
  const btnExport = document.getElementById('btnExport');
  const resultsList = document.getElementById('resultsList');
  const toastEl = document.getElementById('toast');
  const registrarDropdown = document.getElementById('registrarDropdown');

  let activeDropdownDomain = null;
  let activeDropdownBtn = null;

  // Registrar search / buy URL endpoints
  const REGISTRAR_URLS = {
    godaddy: (domain) => `https://www.godaddy.com/domainsearch/find?checkType=search&domainToCheck=${encodeURIComponent(domain)}`,
    hostinger: (domain) => `https://www.hostinger.com/domain-name-search?domain=${encodeURIComponent(domain)}`,
    spaceship: (domain) => `https://www.spaceship.com/domain-search/?query=${encodeURIComponent(domain)}`,
    domaincom: (domain) => `https://www.domain.com/registration/?search=${encodeURIComponent(domain)}`,
    namecheap: (domain) => `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}`
  };

  // Cross-browser safe URL opener
  function openExternalUrl(url) {
    try {
      if (typeof chrome !== 'undefined' && chrome.tabs && typeof chrome.tabs.create === 'function') {
        chrome.tabs.create({ url });
      } else if (typeof browser !== 'undefined' && browser.tabs && typeof browser.tabs.create === 'function') {
        browser.tabs.create({ url });
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  function closeRegistrarDropdown() {
    if (activeDropdownBtn) {
      activeDropdownBtn.classList.remove('is-open');
    }
    activeDropdownBtn = null;
    activeDropdownDomain = null;
    if (registrarDropdown) {
      registrarDropdown.classList.add('hidden');
    }
  }

  function openRegistrarDropdown(btn, domain) {
    if (activeDropdownBtn === btn && !registrarDropdown.classList.contains('hidden')) {
      closeRegistrarDropdown();
      return;
    }

    closeRegistrarDropdown();

    activeDropdownBtn = btn;
    activeDropdownDomain = domain;
    btn.classList.add('is-open');

    if (!registrarDropdown) return;

    registrarDropdown.classList.remove('hidden');

    const rect = btn.getBoundingClientRect();
    const dropdownWidth = 175;
    const dropdownHeight = 220;

    let left = rect.right - dropdownWidth;
    if (left < 8) left = 8;
    if (left + dropdownWidth > window.innerWidth - 8) {
      left = window.innerWidth - dropdownWidth - 8;
    }

    let top = rect.bottom + 4;
    if (top + dropdownHeight > window.innerHeight - 8) {
      top = rect.top - dropdownHeight - 4;
      registrarDropdown.classList.add('opens-up');
    } else {
      registrarDropdown.classList.remove('opens-up');
    }

    registrarDropdown.style.top = `${top}px`;
    registrarDropdown.style.left = `${left}px`;
  }

  // Sample data
  const sampleDomains = [
    "LaunchList — products get listed for discovery",
    "TinyLaunch — specifically fits small founders",
    "FoundersList — community-oriented",
    "LaunchBase",
    "ProductList",
    "LaunchShelf",
    "StartupShelf",
    "Noviqo",
    "Brevio",
    "Novli"
  ];

  // Cross-browser Storage Helpers
  const storageEngine = (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local)
    ? chrome.storage.local
    : (typeof browser !== 'undefined' && browser.storage && browser.storage.local ? browser.storage.local : null);

  async function getStoredData(keys) {
    if (storageEngine) {
      return new Promise((resolve) => {
        storageEngine.get(keys, (res) => {
          if (chrome.runtime && chrome.runtime.lastError) {
            console.warn('Storage read error:', chrome.runtime.lastError);
            resolve({});
          } else {
            resolve(res || {});
          }
        });
      });
    } else {
      // LocalStorage fallback
      const out = {};
      for (const k of keys) {
        const val = localStorage.getItem(`dc_${k}`);
        if (val) {
          try { out[k] = JSON.parse(val); } catch { out[k] = val; }
        }
      }
      return out;
    }
  }

  async function setStoredData(obj) {
    if (storageEngine) {
      return new Promise((resolve) => {
        storageEngine.set(obj, () => resolve());
      });
    } else {
      for (const [k, v] of Object.entries(obj)) {
        localStorage.setItem(`dc_${k}`, JSON.stringify(v));
      }
    }
  }

  // Load Persisted State
  async function loadPersistedState() {
    try {
      const data = await getStoredData(['domainInput', 'preferredTlds', 'lastResults', 'currentFilter']);
      if (data.preferredTlds && Array.isArray(data.preferredTlds) && data.preferredTlds.length > 0) {
        preferredTlds = data.preferredTlds;
      }
      if (data.domainInput) {
        domainInput.value = data.domainInput;
      }
      if (data.lastResults && Array.isArray(data.lastResults) && data.lastResults.length > 0) {
        currentResults = data.lastResults;
        currentFilter = data.currentFilter || 'available';
        renderResults();
      }
    } catch (e) {
      console.warn('Could not load storage state', e);
    }
    renderTldChips();
  }

  async function persistState() {
    try {
      await setStoredData({
        domainInput: domainInput.value,
        preferredTlds,
        lastResults: currentResults,
        currentFilter
      });
    } catch (e) {
      console.warn('Could not save storage state', e);
    }
  }

  // Toast Notification
  let toastTimer = null;
  function showToast(message, durationMs = 2500) {
    if (toastTimer) clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.remove('hidden');
    toastTimer = setTimeout(() => {
      toastEl.classList.add('hidden');
    }, durationMs);
  }

  // Render TLD Chips
  function renderTldChips() {
    tldChipsContainer.innerHTML = '';
    preferredTlds.forEach((tld, idx) => {
      const chip = document.createElement('div');
      chip.className = 'tld-chip';
      chip.innerHTML = `
        <span>.${escapeHtml(tld)}</span>
        <span class="tld-remove" data-index="${idx}" title="Remove .${escapeHtml(tld)}">×</span>
      `;
      tldChipsContainer.appendChild(chip);
    });
  }

  function addTld(rawTld) {
    const cleaned = rawTld.replace(/^\./, '').trim().toLowerCase();
    if (!cleaned) return;
    if (!preferredTlds.includes(cleaned)) {
      preferredTlds.push(cleaned);
      renderTldChips();
      persistState();
    }
    newTldInput.value = '';
  }

  function removeTld(index) {
    if (index >= 0 && index < preferredTlds.length) {
      preferredTlds.splice(index, 1);
      renderTldChips();
      persistState();
    }
  }

  // Event Listeners for TLDs
  tldChipsContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.tld-remove');
    if (removeBtn) {
      const idx = parseInt(removeBtn.getAttribute('data-index'), 10);
      removeTld(idx);
    }
  });

  btnAddTld.addEventListener('click', () => {
    addTld(newTldInput.value);
  });

  newTldInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTld(newTldInput.value);
    }
  });

  btnResetTlds.addEventListener('click', () => {
    preferredTlds = ['com', 'io', 'ai'];
    renderTldChips();
    persistState();
    showToast('Reset to default (.com, .io, .ai)');
  });

  quickTldButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tld = btn.getAttribute('data-tld');
      addTld(tld);
    });
  });

  // Sample & Clear
  btnSample.addEventListener('click', () => {
    domainInput.value = sampleDomains.join('\n');
    persistState();
    showToast('Sample names loaded');
  });

  btnClearInput.addEventListener('click', () => {
    domainInput.value = '';
    currentResults = [];
    resultsDashboard.classList.add('hidden');
    persistState();
    showToast('Cleared');
  });

  domainInput.addEventListener('input', () => {
    persistState();
  });

  // Keyboard shortcut Cmd/Ctrl + Enter to trigger check
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (!isChecking) {
        startCheck();
      }
    }
  });

  // Core Check Execution
  async function startCheck() {
    const text = domainInput.value.trim();
    if (!text) {
      showToast('Please enter at least one name or domain');
      domainInput.focus();
      return;
    }

    if (preferredTlds.length === 0) {
      showToast('Please add at least one TLD preference');
      return;
    }

    isChecking = true;
    btnCheck.disabled = true;
    btnCheckText.textContent = 'Checking...';
    progressContainer.classList.remove('hidden');
    progressBarFill.style.width = '0%';
    progressPercent.textContent = '0%';
    progressText.textContent = 'Preparing bulk request...';

    try {
      const results = await DomainChecker.checkDomains(text, preferredTlds, {
        batchSize: 50,
        delayMs: 150,
        onProgress: ({ processed, total, percentage }) => {
          progressBarFill.style.width = `${percentage}%`;
          progressPercent.textContent = `${percentage}%`;
          progressText.textContent = `Checked ${processed} of ${total} names...`;
        }
      });

      currentResults = results;
      const availableList = results.filter(r => r.isAvailable);

      // Auto select available filter if any found, else all
      if (availableList.length > 0) {
        currentFilter = 'available';
      } else {
        currentFilter = 'all';
      }

      renderResults();
      persistState();

      if (availableList.length > 0) {
        showToast(`🎉 Found ${availableList.length} available domain${availableList.length > 1 ? 's' : ''}!`);
      } else {
        showToast('Check complete. No available domains found.');
      }
    } catch (err) {
      console.error('Domain check failed:', err);
      showToast(`Error: ${err.message || 'Check failed'}`);
    } finally {
      isChecking = false;
      btnCheck.disabled = false;
      btnCheckText.textContent = 'Check Availability';
      setTimeout(() => {
        progressContainer.classList.add('hidden');
      }, 500);
    }
  }

  btnCheck.addEventListener('click', startCheck);

  // Results Rendering & Filtering
  function renderResults() {
    if (!currentResults || currentResults.length === 0) {
      resultsDashboard.classList.add('hidden');
      return;
    }

    resultsDashboard.classList.remove('hidden');

    const totalCount = currentResults.length;
    const availableItems = currentResults.filter(r => r.isAvailable);
    const takenItems = currentResults.filter(r => r.isRegistered && !r.isAftermarket);
    const aftermarketItems = currentResults.filter(r => r.isAftermarket);

    // Update Counts
    countAvailable.textContent = availableItems.length;
    countTaken.textContent = takenItems.length;
    countAftermarket.textContent = aftermarketItems.length;
    countTotal.textContent = totalCount;

    tabCountAvail.textContent = availableItems.length;
    tabCountAll.textContent = totalCount;
    tabCountMarket.textContent = aftermarketItems.length;

    // Update Tab UI
    filterTabs.forEach(tab => {
      if (tab.getAttribute('data-filter') === currentFilter) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Filter Items
    let filtered = currentResults;
    if (currentFilter === 'available') {
      filtered = availableItems;
    } else if (currentFilter === 'aftermarket') {
      filtered = aftermarketItems;
    }

    // Apply Search Term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => item.domain.toLowerCase().includes(term));
    }

    // Render List Items
    closeRegistrarDropdown();
    resultsList.innerHTML = '';

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = searchTerm 
        ? `No domains matching "${searchTerm}"` 
        : `No ${currentFilter === 'available' ? 'available' : currentFilter} domains in this search`;
      resultsList.appendChild(empty);
      return;
    }

    filtered.forEach(item => {
      const row = document.createElement('div');
      let statusClass = 'is-taken';
      let badgeHtml = '<span class="domain-status-badge badge-taken">Taken</span>';

      if (item.isAvailable) {
        statusClass = 'is-available';
        badgeHtml = '<span class="domain-status-badge badge-available">Available</span>';
      } else if (item.isAftermarket) {
        statusClass = 'is-aftermarket';
        const priceStr = item.marketPrice ? `$${item.marketPrice.toLocaleString()}` : 'For Sale';
        badgeHtml = `<span class="domain-status-badge badge-aftermarket">${priceStr}</span>`;
      }

      row.className = `domain-item ${statusClass}`;
      
      const baseName = item.name;
      const tld = item.tld;

      let continueBtnHtml = '';
      if (item.isAvailable) {
        continueBtnHtml = `
          <button class="btn-continue" data-domain="${escapeHtml(item.domain)}" title="Register ${escapeHtml(item.domain)}">
            <span>Continue</span>
            <svg class="chevron-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        `;
      }

      row.innerHTML = `
        <div class="domain-left">
          <span class="domain-name">${escapeHtml(baseName)}<span class="tld-part">.${escapeHtml(tld)}</span></span>
          ${badgeHtml}
        </div>
        <div class="domain-right">
          ${continueBtnHtml}
          <button class="btn-item-action btn-copy-single" data-domain="${escapeHtml(item.domain)}" title="Copy ${escapeHtml(item.domain)}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      `;

      resultsList.appendChild(row);
    });
  }

  // Filter Tabs Event Listeners
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      currentFilter = tab.getAttribute('data-filter');
      persistState();
      renderResults();
    });
  });

  // Stat Card Clicks to Quick Filter
  statCardAvailable.addEventListener('click', () => {
    currentFilter = 'available';
    persistState();
    renderResults();
  });
  statCardTaken.addEventListener('click', () => {
    currentFilter = 'all';
    persistState();
    renderResults();
  });
  statCardAftermarket.addEventListener('click', () => {
    currentFilter = 'aftermarket';
    persistState();
    renderResults();
  });
  statCardTotal.addEventListener('click', () => {
    currentFilter = 'all';
    persistState();
    renderResults();
  });

  // Search Filter Input
  searchFilterInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    renderResults();
  });

  // Results List Actions (Continue Dropdown & Single Domain Copy)
  resultsList.addEventListener('click', (e) => {
    // 1. Continue dropdown trigger
    const continueBtn = e.target.closest('.btn-continue');
    if (continueBtn) {
      e.stopPropagation();
      const domain = continueBtn.getAttribute('data-domain');
      if (domain) {
        openRegistrarDropdown(continueBtn, domain);
      }
      return;
    }

    // 2. Single Domain Copy
    const copyBtn = e.target.closest('.btn-copy-single');
    if (copyBtn) {
      const domain = copyBtn.getAttribute('data-domain');
      if (domain) {
        copyToClipboard(domain);
        showToast(`Copied ${domain}`);
      }
      return;
    }
  });

  // Registrar Dropdown Item Selection
  if (registrarDropdown) {
    registrarDropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.dropdown-item');
      if (item && activeDropdownDomain) {
        const registrarKey = item.getAttribute('data-registrar');
        const urlFn = REGISTRAR_URLS[registrarKey];
        if (urlFn) {
          const targetUrl = urlFn(activeDropdownDomain);
          openExternalUrl(targetUrl);
          closeRegistrarDropdown();
        }
      }
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (registrarDropdown && !registrarDropdown.classList.contains('hidden')) {
      if (!registrarDropdown.contains(e.target) && !e.target.closest('.btn-continue')) {
        closeRegistrarDropdown();
      }
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRegistrarDropdown();
    }
  });

  // Close dropdown on scrolling results list
  resultsList.addEventListener('scroll', () => {
    if (registrarDropdown && !registrarDropdown.classList.contains('hidden')) {
      closeRegistrarDropdown();
    }
  });

  // Copy Available List
  btnCopyAvailable.addEventListener('click', () => {
    const available = currentResults.filter(r => r.isAvailable).map(r => r.domain);
    if (available.length === 0) {
      showToast('No available domains to copy');
      return;
    }
    const text = available.join('\n');
    copyToClipboard(text);
    showToast(`Copied ${available.length} available domain${available.length > 1 ? 's' : ''}!`);
  });

  // Export Results
  btnExport.addEventListener('click', () => {
    if (!currentResults || currentResults.length === 0) {
      showToast('No results to export');
      return;
    }

    const available = currentResults.filter(r => r.isAvailable);
    const content = [
      '# Domain Availability Report',
      `# Generated: ${new Date().toISOString()}`,
      `# Total Checked: ${currentResults.length} | Available: ${available.length}`,
      '',
      '## AVAILABLE DOMAINS:',
      ...(available.map(r => r.domain)),
      '',
      '## ALL RESULTS:',
      ...(currentResults.map(r => `${r.domain}\t${r.isAvailable ? 'AVAILABLE' : (r.isAftermarket ? 'FOR_SALE' : 'REGISTERED')}`))
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `domain-check-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported results to file');
  });

  // Clipboard Helpers
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopyTextToClipboard(text);
      });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  }

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial load
  loadPersistedState();
});
