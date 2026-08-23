/**
 * Domain Availability Checker Core Library
 * Handles InstantDomainSearch hashing, input parsing, batching, and API requests.
 * Compatible with Chrome, Firefox, and Node.js.
 */

(function (global) {
  /**
   * Compute 32-bit signed integer hash matching InstantDomainSearch algorithm
   * @param {string} s - Input base name
   * @param {number} seed - Seed value (default: 42)
   * @returns {string} Signed 32-bit integer string
   */
  function hashCode(s, seed = 42) {
    let a = seed;
    for (let i = 0; i < s.length; i++) {
      a = (((a << 5) - a) + s.charCodeAt(i)) | 0;
    }
    return a.toString();
  }

  /**
   * Clean and sanitize a raw domain / word string
   * Strips bullets, numbered list prefixes, descriptions after dashes/colons/pipes,
   * protocols, query parameters, paths, ports, and extra characters.
   * @param {string} raw
   * @returns {string}
   */
  function cleanDomainInput(raw) {
    if (!raw) return '';
    let text = raw.trim();

    // 1. Strip leading bullets or numbering (e.g. "1. ", "1) ", "* ", "- ", "• ")
    text = text.replace(/^[\s*•\-–—]*\d+[\.\)]\s*/, '').replace(/^[\s*•\-–—]+\s*/, '');

    // 2. Strip em-dash (—), en-dash (–), horizontal bar (―), double dash (--) and everything after
    text = text.replace(/[\u2014\u2013\u2015—–―].*$/, '');

    // 3. Strip spaced dash (" - "), colon with space (": "), pipe ("|") and everything after
    text = text.replace(/(\s+-\s+|\s*[:|]\s+).*$/, '');

    // 4. Normalize domain text
    text = text.trim().toLowerCase();
    text = text.replace(/^https?:\/\//i, '');
    text = text.replace(/^www\./i, '');
    text = text.split('/')[0].split('?')[0].split('#')[0];
    text = text.split(':')[0];
    text = text.replace(/[^a-z0-9.-]/g, '');

    return text.trim();
  }

  /**
   * Parse a raw input string supporting newlines, commas, semicolons, tabs, spaces,
   * and items with notes/descriptions (e.g. "LaunchList — very clear...").
   * Expands base names with given default TLDs, and handles specific TLDs entered directly.
   * 
   * @param {string} inputText - Raw text input (Format 1: lines, Format 2: commas, Format 3: notes)
   * @param {string[]} defaultTlds - Array of preferred TLDs (e.g. ['com', 'io', 'ai'])
   * @returns {{ name: string, hash: string, tlds: string[] }[]} Grouped payload for bulk check
   */
  function parseDomainPayload(inputText, defaultTlds = ['com', 'io', 'ai']) {
    if (!inputText || typeof inputText !== 'string') return [];

    // Normalize tlds (strip leading dot, lowercase)
    const normalizedDefaultTlds = defaultTlds
      .map(t => t.replace(/^\./, '').trim().toLowerCase())
      .filter(Boolean);

    // First process line-by-line to safely handle notes that may contain commas
    const lines = inputText.split(/[\r\n]+/);
    const rawTokens = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check if line contains a dash or description separator
      if (/[\u2014\u2013\u2015—–―]|\s+-\s+|\s*[:|]\s+/.test(trimmed)) {
        const stripped = cleanDomainInput(trimmed);
        if (stripped) rawTokens.push(stripped);
      } else {
        // Line might contain comma or semicolon separated names
        const subTokens = trimmed.split(/[,;]+/);
        for (const st of subTokens) {
          const cleaned = cleanDomainInput(st);
          if (cleaned) rawTokens.push(cleaned);
        }
      }
    }

    const grouped = new Map();

    for (const token of rawTokens) {
      if (!token) continue;

      // Check if token contains dots (e.g. "name3.com" or "sub.domain.co.uk")
      const dotIndex = token.indexOf('.');
      if (dotIndex !== -1) {
        const baseName = token.substring(0, dotIndex);
        const specificTld = token.substring(dotIndex + 1);

        if (!baseName || !specificTld) continue;

        if (!grouped.has(baseName)) {
          grouped.set(baseName, {
            name: baseName,
            hash: hashCode(baseName, 42),
            tlds: new Set()
          });
        }
        grouped.get(baseName).tlds.add(specificTld);
      } else {
        // Raw base name without TLD (e.g. "name1", "launchlist")
        const baseName = token;
        if (!baseName) continue;

        if (!grouped.has(baseName)) {
          grouped.set(baseName, {
            name: baseName,
            hash: hashCode(baseName, 42),
            tlds: new Set()
          });
        }
        for (const tld of normalizedDefaultTlds) {
          grouped.get(baseName).tlds.add(tld);
        }
      }
    }

    return Array.from(grouped.values()).map(item => ({
      name: item.name,
      hash: item.hash,
      tlds: Array.from(item.tlds)
    }));
  }

  /**
   * Check a single batch of domain names via InstantDomainSearch bulk check API
   * @param {{ name: string, hash: string, tlds: string[] }[]} batch
   * @returns {Promise<Array<Object>>}
   */
  async function checkBatch(batch) {
    if (!batch || batch.length === 0) return [];

    const payload = { names: batch };
    const url = 'https://cloud.instantdomainsearch.com/services/bulk-check';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://instantdomainsearch.com',
        'Referer': 'https://instantdomainsearch.com/'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API returned HTTP status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return (data && Array.isArray(data.results)) ? data.results : [];
  }

  /**
   * Parse results from API into structured domain status items
   * @param {Array<Object>} rawResults
   * @returns {Array<{ domain: string, name: string, tld: string, isAvailable: boolean, isRegistered: boolean, isAftermarket: boolean, marketPrice?: number, marketUrl?: string, raw: Object }>}
   */
  function processResults(rawResults) {
    return rawResults.map(res => {
      const name = res.label || '';
      const tld = res.tld || '';
      const domain = tld ? `${name}.${tld}` : name;
      const isRegistered = Boolean(res.isRegistered);
      const registryStatus = res.registryStatus || '';
      
      // Matches python script criteria: not registered and registryStatus is not "unavailable"
      const isAvailable = !isRegistered && registryStatus !== 'unavailable';

      // Aftermarket check
      const markets = Array.isArray(res.markets) ? res.markets : [];
      const isAftermarket = isRegistered && markets.length > 0;
      let marketPrice = null;
      let marketName = null;

      if (isAftermarket) {
        // Look for lowest price or first available price
        for (const m of markets) {
          if (m.price && typeof m.price === 'number') {
            marketPrice = m.price / 100; // price in USD
            marketName = m.market || 'Marketplace';
            break;
          }
        }
      }

      return {
        domain,
        name,
        tld,
        isAvailable,
        isRegistered,
        isAftermarket,
        marketPrice,
        marketName,
        raw: res
      };
    });
  }

  /**
   * Run bulk domain check with batching and progress callbacks
   * @param {string} inputText
   * @param {string[]} defaultTlds
   * @param {Object} [options]
   * @param {number} [options.batchSize=50]
   * @param {number} [options.delayMs=150]
   * @param {function({ processed: number, total: number, percentage: number })} [options.onProgress]
   * @returns {Promise<Array<Object>>}
   */
  async function checkDomains(inputText, defaultTlds = ['com', 'io', 'ai'], options = {}) {
    const batchSize = options.batchSize || 50;
    const delayMs = options.delayMs !== undefined ? options.delayMs : 150;
    const onProgress = options.onProgress || (() => {});

    const payload = parseDomainPayload(inputText, defaultTlds);
    if (payload.length === 0) return [];

    let allRawResults = [];

    for (let i = 0; i < payload.length; i += batchSize) {
      const batch = payload.slice(i, i + batchSize);
      const rawResults = await checkBatch(batch);
      allRawResults.push(...rawResults);

      const processedCount = Math.min(i + batchSize, payload.length);
      onProgress({
        processed: processedCount,
        total: payload.length,
        percentage: Math.round((processedCount / payload.length) * 100)
      });

      if (i + batchSize < payload.length && delayMs > 0) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    return processResults(allRawResults);
  }

  // Export for browser & node / testing
  const DomainChecker = {
    hashCode,
    cleanDomainInput,
    parseDomainPayload,
    checkBatch,
    processResults,
    checkDomains
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DomainChecker;
  } else {
    global.DomainChecker = DomainChecker;
  }
})(typeof window !== 'undefined' ? window : globalThis);
