/**
 * Domain Scout AI Generator Core Library
 * Provides client-side AI domain generation and autonomous reiteration loops.
 * Compatible with Chrome, Firefox, and Node.js.
 */

(function (global) {
  // Common linguistic root databases for the Smart Semantic AI Brain
  const INDUSTRY_DICTIONARY = {
    // Discovery / Directories / Product Hunt alternatives / Curation
    curation: [
      'hunt', 'scout', 'spot', 'shelf', 'base', 'list', 'curate', 'deck', 'vault', 'stack',
      'launch', 'rank', 'radar', 'feed', 'index', 'board', 'find', 'nest', 'grid', 'pulse',
      'pick', 'forge', 'show', 'drop', 'hub', 'crate', 'bay', 'stream', 'dock', 'wave'
    ],
    // AI / Machine Learning / Smart Automation
    ai: [
      'mind', 'neural', 'cortex', 'synapse', 'agent', 'brain', 'bot', 'prompt', 'logic', 'sense',
      'vector', 'axon', 'intel', 'cogni', 'optic', 'spark', 'flow', 'tensor', 'hyper', 'omni',
      'auto', 'gen', 'synth', 'smart', 'algo', 'nova', 'deep', 'core', 'prism', 'matrix'
    ],
    // Developer Tools / Cloud / Infrastructure
    devtools: [
      'code', 'dev', 'stack', 'git', 'dock', 'ship', 'build', 'forge', 'hub', 'node',
      'pipe', 'flow', 'byte', 'script', 'host', 'sync', 'hook', 'dash', 'craft', 'pack',
      'cloud', 'infra', 'scale', 'mesh', 'wire', 'port', 'rail', 'block', 'layer', 'core'
    ],
    // Fintech / Payments / Crypto / Business
    business: [
      'pay', 'cash', 'mint', 'coin', 'vault', 'ledger', 'trade', 'yield', 'flow', 'fund',
      'capital', 'asset', 'lend', 'spend', 'bill', 'worth', 'prime', 'fin', 'pocket', 'bank',
      'scale', 'metric', 'grow', 'pulse', 'hedge', 'vest', 'swift', 'apex', 'bold', 'peak'
    ],
    // Design / Media / Content / Creative
    creative: [
      'pixel', 'canvas', 'craft', 'studio', 'draw', 'frame', 'muse', 'glow', 'lens', 'shade',
      'form', 'glyph', 'vibe', 'vector', 'blend', 'art', 'palette', 'scene', 'draft', 'cast',
      'look', 'motif', 'tint', 'layer', 'focus', 'shine', 'type', 'font', 'press', 'ink'
    ],
    // General high-converting startup prefixes & suffixes
    prefixes: [
      'get', 'try', 'use', 'go', 'open', 'hyper', 'meta', 'omni', 'super', 'nova',
      'zen', 'pure', 'true', 'smart', 'pro', 'rapid', 'swift', 'prime', 'next', 'apex',
      'ever', 'bright', 'clear', 'vivid', 'bold', 'peak', 'aura', 'fast', 'quick', 'neo'
    ],
    suffixes: [
      'ly', 'ify', 'io', 'hq', 'lab', 'hub', 'space', 'box', 'app', 'flow',
      'stack', 'kit', 'desk', 'dock', 'lane', 'wire', 'point', 'loop', 'craft', 'base',
      'pulse', 'forge', 'wave', 'nest', 'grid', 'sync', 'spot', 'vault', 'node', 'deck'
    ],
    // Short brandable abstract prefixes
    abstractRoots: [
      'nov', 'bre', 'vel', 'nex', 'lum', 'syn', 'vol', 'str', 'tra', 'om',
      'dyn', 'cal', 'zen', 'arc', 'sol', 'vort', 'kin', 'aer', 'tal', 'fen',
      'lux', 'rad', 'vex', 'clar', 'plur', 'val', 'prim', 'opt', 'gen', 'kiv'
    ]
  };

  /**
   * Stop words to filter out from user concept prompts
   */
  const STOP_WORDS = new Set([
    'suggest', 'me', 'some', 'domain', 'domains', 'ideas', 'idea', 'name', 'names',
    'for', 'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'with', 'to', 'from',
    'alternative', 'alternatives', 'like', 'similar', 'good', 'best', 'creative',
    'modern', 'cool', 'catchy', 'brandable', 'startup', 'tool', 'platform', 'app',
    'website', 'service', 'product', 'help', 'please', 'give', 'generate', 'create'
  ]);

  /**
   * Extract meaningful keywords from prompt
   * @param {string} prompt
   * @returns {string[]}
   */
  function extractKeywords(prompt) {
    if (!prompt) return ['launch', 'scout'];
    const clean = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const rawTokens = clean.split(/\s+/).filter(Boolean);
    const keywords = rawTokens.filter(t => t.length >= 2 && !STOP_WORDS.has(t));
    
    // If all words were filtered, fallback to raw tokens
    if (keywords.length === 0) {
      return rawTokens.filter(t => t.length >= 2).slice(0, 4);
    }
    return keywords.slice(0, 6);
  }

  /**
   * Detect category affinity based on prompt keywords
   * @param {string} prompt
   * @returns {string}
   */
  function detectCategory(prompt) {
    const lower = prompt.toLowerCase();
    if (/\b(?:ai|gpt|llm|intelligence|agent|smart|neural|model|prompt|bot|machine)\b/i.test(lower)) return 'ai';
    if (/\b(?:hunt|product|directory|launch|curat|curation|discover|find|listing|catalog|shelf)\b/i.test(lower)) return 'curation';
    if (/\b(?:dev|code|git|api|cloud|deploy|docker|infra|program|engineer|build|server)\b/i.test(lower)) return 'devtools';
    if (/\b(?:pay|payment|payments|fin|finance|fintech|money|crypto|invest|trade|bank|banking|cash|invoice|ledger|stock|fund)\b/i.test(lower)) return 'business';
    if (/\b(?:design|art|ui|ux|photo|video|brand|font|draw|color|media|craft|edit)\b/i.test(lower)) return 'creative';
    return 'curation';
  }

  /**
   * Smart Client-Side Semantic AI Naming Brain
   * Generates creative, distinct, high-brandability startup names without needing any API key.
   * 
   * @param {string} prompt - User prompt / topic
   * @param {Set<string>|Array<string>} [excludedNames] - Names already taken or used in previous rounds
   * @param {number} [count=15] - Number of domain ideas to generate
   * @returns {string[]} Array of domain base names
   */
  function generateWithSmartBrain(prompt, excludedNames = new Set(), count = 15) {
    const exclusions = excludedNames instanceof Set ? excludedNames : new Set(excludedNames || []);
    const keywords = extractKeywords(prompt);
    const category = detectCategory(prompt);
    const catWords = INDUSTRY_DICTIONARY[category] || INDUSTRY_DICTIONARY.curation;
    const prefixes = INDUSTRY_DICTIONARY.prefixes;
    const suffixes = INDUSTRY_DICTIONARY.suffixes;
    const abstractRoots = INDUSTRY_DICTIONARY.abstractRoots;

    const generated = new Set();

    // Helper to add clean name if not excluded
    function tryAdd(candidate) {
      if (!candidate) return;
      const clean = candidate.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length >= 3 && clean.length <= 16 && !exclusions.has(clean) && !generated.has(clean)) {
        generated.add(clean);
      }
    }

    // Pattern 1: Keyword + Category Word (e.g. "HuntScout", "LaunchShelf", "SpotStack")
    keywords.forEach(kw => {
      catWords.forEach(cw => {
        if (kw !== cw) {
          tryAdd(`${kw}${cw}`);
          tryAdd(`${cw}${kw}`);
        }
      });
    });

    // Pattern 2: Prefix + Keyword (e.g. "GetLaunch", "NovaScout", "ZenHunt", "HyperSpot")
    keywords.forEach(kw => {
      prefixes.forEach(p => {
        tryAdd(`${p}${kw}`);
      });
    });

    // Pattern 3: Keyword + Modern Brandable Suffix (e.g. "Launchly", "Scoutify", "Huntbase", "Spotflow")
    keywords.forEach(kw => {
      suffixes.forEach(s => {
        tryAdd(`${kw}${s}`);
      });
    });

    // Pattern 4: Abstract Root + Suffix / Keyword portmanteau (e.g. "Noviqo", "Brevio", "Veltis", "Nexflow")
    abstractRoots.forEach(ar => {
      suffixes.forEach(s => {
        tryAdd(`${ar}${s}`);
      });
      keywords.forEach(kw => {
        tryAdd(`${ar}${kw}`);
      });
    });

    // Pattern 5: Direct Category Word + Suffix combinations
    catWords.forEach(cw => {
      suffixes.forEach(s => {
        if (cw !== s) {
          tryAdd(`${cw}${s}`);
        }
      });
      prefixes.forEach(p => {
        if (p !== cw) {
          tryAdd(`${p}${cw}`);
        }
      });
    });

    // Convert to array and shuffle for natural variety
    const pool = Array.from(generated);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, count);
  }

  /**
   * Format the AI prompt including taken-domain exclusions for LLMs
   * @param {string} prompt
   * @param {Array<string>} [exclusions=[]]
   * @param {number} [count=15]
   * @returns {string}
   */
  function buildPromptWithExclusions(prompt, exclusions = [], count = 15) {
    if (!exclusions || exclusions.length === 0) {
      return `Suggest ${count} creative, modern, short, and brandable domain name ideas for the following concept:
"${prompt}"

Requirements:
- Short (4-12 characters), memorable, and brandable.
- Return ONLY the domain names as a plain numbered list.
- Do not include explanation sentences.`;
    }

    const takenList = exclusions.slice(0, 20).join(', ');
    return `We are searching for available domain names for: "${prompt}".

IMPORTANT: The following domain names were already checked and are ALREADY TAKEN / REGISTERED:
${takenList}

Please suggest ${count} BRAND NEW, DIFFERENT domain name ideas for "${prompt}".
- Strictly DO NOT suggest or repeat any of the taken names above.
- Try different word combinations, coined words, short syllables, or prefixes/suffixes.
- Return ONLY the domain names as a plain list.`;
  }

  /**
   * Call ChatGPT Web Session (if user has an active session on chatgpt.com)
   * @param {string} promptText
   * @param {Array<string>} [exclusions=[]]
   * @returns {Promise<string>}
   */
  async function generateWithChatGptWeb(promptText, exclusions = []) {
    // 1. Fetch active session token from chatgpt.com
    const sessionRes = await fetch('https://chatgpt.com/api/auth/session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!sessionRes.ok) {
      throw new Error('Not logged into ChatGPT web session. Please log in at chatgpt.com or use Built-in AI.');
    }

    const sessionData = await sessionRes.json();
    const accessToken = sessionData && sessionData.accessToken;
    if (!accessToken) {
      throw new Error('ChatGPT session token not found. Please ensure you are logged into chatgpt.com.');
    }

    // 2. Generate UUIDs for conversation
    const messageId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const fullPrompt = buildPromptWithExclusions(promptText, exclusions, 15);

    const payload = {
      action: 'next',
      messages: [
        {
          id: messageId,
          author: { role: 'user' },
          content: {
            content_type: 'text',
            parts: [fullPrompt]
          }
        }
      ],
      model: 'text-davinci-002-render-sha',
      parent_message_id: messageId,
      timezone_offset_min: new Date().getTimezoneOffset()
    };

    const convRes = await fetch('https://chatgpt.com/backend-api/conversation', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'text/event-stream'
      }
    });

    if (!convRes.ok) {
      throw new Error(`ChatGPT returned HTTP ${convRes.status}: ${convRes.statusText}`);
    }

    // 3. Read SSE Stream
    const reader = convRes.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          try {
            const data = JSON.parse(line.slice(6));
            const parts = data?.message?.content?.parts;
            if (parts && parts.length > 0) {
              fullText = parts[0];
            }
          } catch (e) {
            // Ignore partial SSE JSON
          }
        }
      }
    }

    if (!fullText) {
      throw new Error('Empty response from ChatGPT web session');
    }

    return fullText;
  }

  /**
   * Call Chrome Built-in On-Device AI (Gemini Nano via window.ai)
   * @param {string} promptText
   * @param {Array<string>} [exclusions=[]]
   * @returns {Promise<string>}
   */
  async function generateWithChromeAi(promptText, exclusions = []) {
    const isFirefox = typeof navigator !== 'undefined' && (/firefox/i.test(navigator.userAgent) || /fxios/i.test(navigator.userAgent));
    if (isFirefox) {
      throw new Error('Chrome Built-in AI is not supported on Firefox.');
    }

    const aiApi = (typeof window !== 'undefined' && window.ai && window.ai.languageModel)
      ? window.ai.languageModel
      : (typeof globalThis !== 'undefined' && globalThis.ai && globalThis.ai.languageModel ? globalThis.ai.languageModel : null);

    if (!aiApi) {
      throw new Error('Chrome Built-in AI (Gemini Nano) is not available in this browser.');
    }

    const session = await aiApi.create({
      systemPrompt: 'You are an expert startup brand naming assistant. Provide short, creative, memorable domain name suggestions.'
    });

    const fullPrompt = buildPromptWithExclusions(promptText, exclusions, 15);
    const result = await session.prompt(fullPrompt);
    if (session.destroy) session.destroy();
    return result;
  }

  /**
   * Call Custom API Provider (OpenAI, Gemini, Groq, OpenRouter)
   * @param {string} provider - 'openai' | 'gemini' | 'groq' | 'openrouter'
   * @param {string} apiKey
   * @param {string} promptText
   * @param {Array<string>} [exclusions=[]]
   * @returns {Promise<string>}
   */
  async function generateWithCustomApi(provider, apiKey, promptText, exclusions = []) {
    if (!apiKey) {
      throw new Error(`API Key for ${provider.toUpperCase()} is required.`);
    }

    const fullPrompt = buildPromptWithExclusions(promptText, exclusions, 15);

    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${errJson.error?.message || res.statusText}`);
      }

      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    let endpoint = 'https://api.openai.com/v1/chat/completions';
    let model = 'gpt-4o-mini';

    if (provider === 'groq') {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      model = 'llama-3.3-70b-versatile';
    } else if (provider === 'openrouter') {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      model = 'meta-llama/llama-3.2-3b-instruct:free';
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a professional startup naming expert. Return domain name ideas as a clean list.' },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0.8
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(`${provider.toUpperCase()} API error: ${errJson.error?.message || res.statusText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  const ENGINE_DISPLAY_NAMES = {
    'smart_brain': 'Smart Brain (Offline)',
    'chatgpt_web': 'ChatGPT Session',
    'chrome_ai': 'Chrome Browser AI',
    'openai': 'OpenAI (GPT-4o)',
    'gemini': 'Google Gemini',
    'groq': 'Groq',
    'openrouter': 'OpenRouter',
    'auto': 'Auto AI'
  };

  /**
   * Get formatted display label for an AI engine key
   * @param {string} engineKey
   * @returns {string}
   */
  function getEngineDisplayName(engineKey) {
    if (!engineKey) return 'AI Engine';
    return ENGINE_DISPLAY_NAMES[engineKey] || engineKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  /**
   * Unified AI Generator Dispatcher with engine resolution metadata
   * @param {Object} options
   * @param {string} options.prompt
   * @param {string} [options.provider='auto'] - 'auto' | 'chatgpt_web' | 'smart_brain' | 'chrome_ai'
   * @param {string} [options.apiKey]
   * @param {Array<string>} [options.exclusions=[]]
   * @returns {Promise<{ output: string, engine: string }>}
   */
  async function generateIdeasWithEngine(options = {}) {
    const prompt = options.prompt || '';
    const provider = options.provider || 'auto';
    const apiKey = options.apiKey || '';
    const exclusions = options.exclusions || [];

    if (!prompt.trim()) {
      throw new Error('Please enter a description or prompt for domain ideas');
    }

    // 1. Explicit Custom API keys (if provided)
    if (['openai', 'gemini', 'groq', 'openrouter'].includes(provider)) {
      const output = await generateWithCustomApi(provider, apiKey, prompt, exclusions);
      return { output, engine: provider };
    }

    // 2. Explicit Chrome AI
    if (provider === 'chrome_ai') {
      const output = await generateWithChromeAi(prompt, exclusions);
      return { output, engine: 'chrome_ai' };
    }

    // 3. Explicit ChatGPT Web Session
    if (provider === 'chatgpt_web') {
      const output = await generateWithChatGptWeb(prompt, exclusions);
      return { output, engine: 'chatgpt_web' };
    }

    // 4. Explicit Smart Local Semantic Brain
    if (provider === 'smart_brain') {
      const names = generateWithSmartBrain(prompt, exclusions, 15);
      return {
        output: names.map((n, idx) => `${idx + 1}. **${n}**`).join('\n'),
        engine: 'smart_brain'
      };
    }

    // 5. 'auto' mode: tries Chrome AI (on supported Chromium browsers) -> ChatGPT web session -> Smart Local Brain
    try {
      const isFirefox = typeof navigator !== 'undefined' && (/firefox/i.test(navigator.userAgent) || /fxios/i.test(navigator.userAgent));
      if (!isFirefox && typeof window !== 'undefined' && window.ai && window.ai.languageModel) {
        const output = await generateWithChromeAi(prompt, exclusions);
        return { output, engine: 'chrome_ai' };
      }
    } catch (e) {
      // Chrome AI not active or failed, continue
    }

    try {
      const output = await generateWithChatGptWeb(prompt, exclusions);
      return { output, engine: 'chatgpt_web' };
    } catch (e) {
      // ChatGPT session not logged in or blocked, use Smart Local Brain
      const names = generateWithSmartBrain(prompt, exclusions, 15);
      return {
        output: names.map((n, idx) => `${idx + 1}. **${n}**`).join('\n'),
        engine: 'smart_brain'
      };
    }
  }

  /**
   * Unified AI Generator Dispatcher
   * @param {Object} options
   * @param {string} options.prompt
   * @param {string} [options.provider='auto'] - 'auto' | 'chatgpt_web' | 'smart_brain' | 'chrome_ai'
   * @param {string} [options.apiKey]
   * @param {Array<string>} [options.exclusions=[]]
   * @returns {Promise<string>}
   */
  async function generateIdeas(options = {}) {
    const result = await generateIdeasWithEngine(options);
    return result.output;
  }

  /**
   * Autonomous Iteration Engine:
   * Generates ideas, checks availability via InstantDomainSearch,
   * and if not enough available domains are found, re-prompts AI with taken-domain exclusions!
   * 
   * @param {Object} params
   * @param {string} params.prompt - User idea / prompt
   * @param {string[]} [params.defaultTlds=['com', 'io', 'ai']] - Preferred TLDs
   * @param {string} [params.provider='auto']
   * @param {string} [params.apiKey='']
   * @param {number} [params.targetAvailableCount=10] - Stop once this many available domains are found
   * @param {number} [params.maxRounds=3] - Maximum iteration rounds
   * @param {function(Object)} [params.onProgress] - Live progress updates
   * @param {Object} [params.domainCheckerInstance] - Injected DomainChecker instance
   * @returns {Promise<{ availableDomains: Array<Object>, allResults: Array<Object>, rounds: number, totalChecked: number, availableCount: number, prompt: string, engine: string, engineName: string }>}
   */
  async function huntAvailableDomains(params = {}) {
    const {
      prompt,
      defaultTlds = ['com', 'io', 'ai'],
      provider = 'auto',
      apiKey = '',
      targetAvailableCount = 10,
      maxRounds = 3,
      onProgress = () => {},
      domainCheckerInstance = (typeof global !== 'undefined' && global.DomainChecker ? global.DomainChecker : null)
    } = params;

    if (!domainCheckerInstance) {
      throw new Error('DomainChecker module is required for availability verification.');
    }

    const accumulatedResultsMap = new Map(); // key: domain string -> result obj
    const takenBaseNames = new Set();
    const evaluatedBaseNames = new Set();

    let round = 1;
    let resolvedEngine = provider === 'auto' ? 'smart_brain' : provider;

    while (round <= maxRounds) {
      const currentAvailableCount = Array.from(accumulatedResultsMap.values()).filter(r => r.isAvailable).length;

      // Check if target already achieved
      if (currentAvailableCount >= targetAvailableCount) {
        break;
      }

      onProgress({
        round,
        maxRounds,
        step: 'brainstorming',
        message: round === 1 
          ? `🤖 Brainstorming domain ideas with AI...`
          : `🔁 Round ${round}/${maxRounds}: Re-prompting AI to suggest alternatives avoiding ${takenBaseNames.size} taken names...`,
        availableCount: currentAvailableCount,
        totalChecked: accumulatedResultsMap.size,
        takenCount: takenBaseNames.size
      });

      // 1. Generate ideas with exclusions
      let aiRawOutput = '';
      try {
        const genResult = await generateIdeasWithEngine({
          prompt,
          provider,
          apiKey,
          exclusions: Array.from(takenBaseNames)
        });
        aiRawOutput = genResult.output;
        if (genResult.engine) {
          resolvedEngine = genResult.engine;
        }
      } catch (err) {
        // If external provider fails on follow-up round, seamlessly fallback to Smart Brain
        if (provider !== 'smart_brain') {
          const names = generateWithSmartBrain(prompt, takenBaseNames, 15);
          aiRawOutput = names.map((n, idx) => `${idx + 1}. **${n}**`).join('\n');
          resolvedEngine = 'smart_brain';
        } else {
          throw err;
        }
      }

      // 2. Parse domain payload
      const candidatePayload = domainCheckerInstance.parseDomainPayload(aiRawOutput, defaultTlds);

      // Filter out any candidates already evaluated in previous rounds
      const freshPayload = candidatePayload.filter(c => !evaluatedBaseNames.has(c.name));
      freshPayload.forEach(c => evaluatedBaseNames.add(c.name));

      if (freshPayload.length === 0) {
        // If AI returned all duplicates, generate with Smart Local Brain directly
        const backupNames = generateWithSmartBrain(prompt, evaluatedBaseNames, 15);
        const backupPayload = domainCheckerInstance.parseDomainPayload(backupNames.join('\n'), defaultTlds);
        backupPayload.forEach(c => {
          if (!evaluatedBaseNames.has(c.name)) {
            evaluatedBaseNames.add(c.name);
            freshPayload.push(c);
          }
        });
      }

      if (freshPayload.length === 0) {
        // Cannot find any more fresh names
        break;
      }

      onProgress({
        round,
        maxRounds,
        step: 'checking',
        message: `⚡ Checking availability for ${freshPayload.length} new candidates across [${defaultTlds.map(t => '.' + t).join(', ')}]...`,
        availableCount: currentAvailableCount,
        totalChecked: accumulatedResultsMap.size,
        currentBatchCount: freshPayload.length
      });

      // 3. Check availability in bulk via InstantDomainSearch
      const freshNamesText = freshPayload.map(p => p.name).join('\n');
      const batchResults = await domainCheckerInstance.checkDomains(freshNamesText, defaultTlds, {
        batchSize: 50,
        delayMs: 100
      });

      // 4. Ingest results and collect taken names
      for (const res of batchResults) {
        if (!accumulatedResultsMap.has(res.domain)) {
          accumulatedResultsMap.set(res.domain, res);
        }
        if (res.isRegistered) {
          takenBaseNames.add(res.name);
        }
      }

      const updatedAvailable = Array.from(accumulatedResultsMap.values()).filter(r => r.isAvailable);

      onProgress({
        round,
        maxRounds,
        step: 'analyzing',
        message: `Found ${updatedAvailable.length} available domain${updatedAvailable.length === 1 ? '' : 's'} so far (${accumulatedResultsMap.size} checked).`,
        availableCount: updatedAvailable.length,
        totalChecked: accumulatedResultsMap.size,
        availableList: updatedAvailable
      });

      // If we have met or exceeded target available count, stop iterating
      if (updatedAvailable.length >= targetAvailableCount) {
        break;
      }

      round++;
    }

    const allResults = Array.from(accumulatedResultsMap.values());
    const availableDomains = allResults.filter(r => r.isAvailable);

    return {
      availableDomains,
      allResults,
      rounds: Math.min(round, maxRounds),
      totalChecked: allResults.length,
      availableCount: availableDomains.length,
      prompt,
      engine: resolvedEngine,
      engineName: getEngineDisplayName(resolvedEngine)
    };
  }

  // Export module
  const AiGenerator = {
    INDUSTRY_DICTIONARY,
    STOP_WORDS,
    ENGINE_DISPLAY_NAMES,
    getEngineDisplayName,
    extractKeywords,
    detectCategory,
    generateWithSmartBrain,
    buildPromptWithExclusions,
    generateWithChatGptWeb,
    generateWithChromeAi,
    generateWithCustomApi,
    generateIdeasWithEngine,
    generateIdeas,
    huntAvailableDomains
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AiGenerator;
  } else {
    global.AiGenerator = AiGenerator;
  }
})(typeof window !== 'undefined' ? window : globalThis);
