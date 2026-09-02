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
   * Format error message from API response
   * @param {string} provider
   * @param {Response} res
   * @param {Object} errJson
   * @returns {string}
   */
  function formatApiError(provider, res, errJson = {}) {
    const rawMsg = errJson.error?.message || errJson.message || errJson.error?.metadata?.raw || '';
    if (res.status === 401) {
      return `Invalid ${provider.toUpperCase()} API Key. Please verify your key.`;
    }
    if (res.status === 429) {
      if (rawMsg.includes('rate-limited') || rawMsg.includes('temporarily') || rawMsg.includes('quota')) {
        return `Selected model is temporarily busy or rate-limited. Please select another free model (e.g. Auto Router) or try again shortly.`;
      }
      return `${provider.toUpperCase()} rate limit reached. Please wait a moment or try another model.`;
    }
    if (rawMsg) {
      return `${provider.toUpperCase()} error: ${rawMsg}`;
    }
    return `${provider.toUpperCase()} API request failed (HTTP ${res.status}: ${res.statusText})`;
  }

  /**
   * Call Custom API Provider (OpenAI, Gemini, Groq, OpenRouter)
   * @param {string} provider - 'openai' | 'gemini' | 'groq' | 'openrouter'
   * @param {string} apiKey
   * @param {string} promptText
   * @param {Array<string>} [exclusions=[]]
   * @param {string} [modelOverride='']
   * @returns {Promise<string>}
   */
  async function generateWithCustomApi(provider, apiKey, promptText, exclusions = [], modelOverride = '') {
    if (!apiKey || !apiKey.trim()) {
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
        throw new Error(formatApiError('gemini', res, errJson));
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text || !text.trim()) {
        throw new Error('Gemini returned an empty response. Please try again.');
      }
      return text;
    }

    let endpoint = 'https://api.openai.com/v1/chat/completions';
    let model = 'gpt-4o-mini';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    };

    if (provider === 'groq') {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      model = 'llama-3.3-70b-versatile';
    } else if (provider === 'openrouter') {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      model = 'openrouter/free';
      headers['HTTP-Referer'] = 'https://github.com/domain-scout';
      headers['X-Title'] = 'Domain Scout AI';
    }

    // Allow caller to override the model (e.g. user-selected free model for OpenRouter)
    if (modelOverride && modelOverride.trim()) {
      model = modelOverride.trim();
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional startup naming expert. Return ONLY a plain numbered list of creative, brandable domain name ideas. Do NOT include reasoning, explanations, conversational filler, or intro text.'
          },
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(formatApiError(provider, res, errJson));
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    let content = choice?.message?.content || choice?.text || '';

    // Handle models that store response in reasoning / reasoning_details
    if (!content && choice?.message?.reasoning) {
      content = choice.message.reasoning;
    }
    if (!content && choice?.message?.reasoning_details && Array.isArray(choice.message.reasoning_details)) {
      content = choice.message.reasoning_details.map(d => d.text || '').filter(Boolean).join('\n');
    }
    if (!content && typeof choice?.message === 'string') {
      content = choice.message;
    }

    if (!content || !content.trim()) {
      throw new Error(`${provider.toUpperCase()} model (${model}) returned an empty response. Try selecting another model (e.g., Auto Free Router).`);
    }

    return content;
  }

  const ENGINE_DISPLAY_NAMES = {
    'smart_brain': 'Smart Brain (Offline)',
    'openai': 'OpenAI (GPT-4o mini)',
    'gemini': 'Google Gemini',
    'groq': 'Groq (Llama 3)',
    'openrouter': 'OpenRouter'
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
   * @param {string} [options.provider='smart_brain'] - 'smart_brain' | 'openai' | 'gemini' | 'groq' | 'openrouter'
   * @param {string} [options.apiKey]
   * @param {Array<string>} [options.exclusions=[]]
   * @returns {Promise<{ output: string, engine: string }>}
   */
  async function generateIdeasWithEngine(options = {}) {
    const prompt = options.prompt || '';
    const provider = options.provider || 'smart_brain';
    const apiKey = options.apiKey || '';
    const modelOverride = options.modelOverride || '';
    const exclusions = options.exclusions || [];

    if (!prompt.trim()) {
      throw new Error('Please enter a description or prompt for domain ideas');
    }

    // 1. Cloud API providers
    if (['openai', 'gemini', 'groq', 'openrouter'].includes(provider)) {
      const output = await generateWithCustomApi(provider, apiKey, prompt, exclusions, modelOverride);
      return { output, engine: provider };
    }

    // 2. Smart Local Semantic Brain (default / offline)
    const names = generateWithSmartBrain(prompt, exclusions, 15);
    return {
      output: names.map((n, idx) => `${idx + 1}. **${n}**`).join('\n'),
      engine: 'smart_brain'
    };
  }

  /**
   * Unified AI Generator Dispatcher
   * @param {Object} options
   * @param {string} options.prompt
   * @param {string} [options.provider='smart_brain'] - 'smart_brain' | 'openai' | 'gemini' | 'groq' | 'openrouter'
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
   * @param {string} [params.provider='smart_brain'] - 'smart_brain' | 'openai' | 'gemini' | 'groq' | 'openrouter'
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
      provider = 'smart_brain',
      apiKey = '',
      modelOverride = '',
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
    let resolvedEngine = provider || 'smart_brain';

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
          modelOverride,
          exclusions: Array.from(takenBaseNames)
        });
        aiRawOutput = genResult.output;
        if (genResult.engine) {
          resolvedEngine = genResult.engine;
        }
      } catch (err) {
        // On round 1, surface the external provider error to the user (e.g. invalid key, model busy)
        if (round === 1) {
          throw err;
        }
        // If external provider fails on subsequent rounds, seamlessly fallback to Smart Brain
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
