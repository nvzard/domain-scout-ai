/**
 * Domain Availability Checker Core Library
 * Handles InstantDomainSearch hashing, AI/ChatGPT input parsing, batching, and API requests.
 * Compatible with Chrome, Firefox, and Node.js.
 */

(function (global) {
  /**
   * Common TLDs set for intelligent recognition in ChatGPT parentheticals and markdown tables
   */
  const COMMON_TLDS = new Set([
    'com', 'net', 'org', 'io', 'ai', 'co', 'app', 'dev', 'tech', 'xyz', 'me', 'info', 'biz',
    'club', 'online', 'store', 'site', 'cloud', 'space', 'design', 'agency', 'pro', 'live',
    'digital', 'world', 'link', 'today', 'media', 'network', 'top', 'gg', 'so', 'cc', 'to',
    'in', 'uk', 'ca', 'de', 'fr', 'eu', 'au', 'us', 'ch', 'nl', 'se', 'no', 'es', 'it', 'tv'
  ]);

  /**
   * Check if a token looks like a valid TLD
   * @param {string} str
   * @returns {boolean}
   */
  function isTld(str) {
    if (!str) return false;
    const clean = str.replace(/^\./, '').trim().toLowerCase();
    if (COMMON_TLDS.has(clean)) return true;
    return /^[a-z]{2,24}$/.test(clean);
  }

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
   * Strip leading list numbering, bullets, emojis, and labels iteratively
   * @param {string} str
   * @returns {string}
   */
  function stripListPrefixes(str) {
    let text = str;
    let prevText;
    do {
      prevText = text;
      // Strip emojis and bullet characters
      text = text.replace(/^[\p{Extended_Pictographic}\u200d\uFE0F\s*•▪▫→➢✓✔✅⚡💡🚀🔥🎯⭐️📌💎🔹+\-–—#]+/u, '');
      // Strip label prefixes (e.g. "Idea #1:", "Option 2 -", "Name 1. ", "Domain 1: ")
      text = text.replace(/^(?:idea|option|name|domain|startup|suggestion|brand|item)\s*#?\d*(?::\s*|[-–—]\s*|\]\s*|\)\s*|\.\s+)/i, '');
      // Strip standard numbering (e.g. "1. ", "1) ", "1: ", "1 - ", "#1 ")
      text = text.replace(/^#?\d+(?:\.\s+|\)\s*|:\s*|[-–—]\s*|\]\s*)/, '');
      // Clean any trailing spaces or remaining bullet symbols
      text = text.replace(/^[\s*•▪▫→➢✓✔✅⚡💡🚀🔥🎯⭐️📌💎🔹+\-–—#]+\s*/u, '');
    } while (text !== prevText);
    return text;
  }

  /**
   * Try parsing TLD list from parenthetical / bracket text
   * e.g. "(.com, .io, .ai)", "(com / io / co)", "(.ai only)", "(.com or .co)"
   * @param {string} content
   * @returns {string[] | null}
   */
  function extractTldsFromParentheses(content) {
    if (!content) return null;
    const raw = content.trim().replace(/^[\(\[\{]/, '').replace(/[\)\]\}]$/, '').trim();
    if (!raw) return null;

    const parts = raw
      .split(/[,/|]|\s+(?:or|and|only|preferred)\s+/i)
      .map(p => p.trim().replace(/^\./, '').toLowerCase())
      .filter(Boolean);

    if (parts.length === 0) return null;

    const validTlds = parts.filter(p => isTld(p));
    if (validTlds.length > 0 && validTlds.length === parts.length) {
      return validTlds;
    }
    return null;
  }

  /**
   * Check if a line is conversational fluff, markdown headers, or divider to ignore
   * @param {string} line
   * @returns {boolean}
   */
  function isIgnoredLine(line) {
    const trimmed = line.trim();
    if (!trimmed) return true;

    // Markdown headers (# Heading, ## Subheading, ### Section)
    if (/^#{1,6}\s+/.test(trimmed)) return true;

    // Markdown horizontal rules (---, ***, ___)
    if (/^[-*_]{3,}\s*$/.test(trimmed)) return true;

    // Markdown code blocks (``` or ~~~)
    if (/^(`{3,}|~{3,})/.test(trimmed)) return true;

    // Conversational filler lines from ChatGPT / LLMs
    const conversationalRegex = /^(?:here\s+(?:are|is)|sure|certainly|below\s+(?:are|is)|let\s+me\s+know|hope\s+this|these\s+are|prompt:|category:|suggestions?:|options?:|ideas?:|note:|feel\s+free\s+to|what\s+do\s+you\s+think|which\s+one\s+do\s+you\s+prefer)\b/i;
    if (conversationalRegex.test(trimmed) && trimmed.length > 15) {
      return true;
    }

    return false;
  }

  /**
   * Clean and sanitize a raw domain / word string
   * Handles ChatGPT outputs: markdown bold/italics, quotes, emojis, numbered list prefixes,
   * markdown links, notes in parentheses/brackets, descriptions after dashes/colons/pipes/arrows/equals,
   * protocols, query parameters, paths, ports, and extra characters.
   * @param {string} raw
   * @returns {string}
   */
  function cleanDomainInput(raw) {
    if (!raw) return '';
    let text = raw.trim();

    // 1. Strip leading emojis, symbols, numbering, bullets, and prefix labels iteratively
    text = stripListPrefixes(text);

    // 2. Markdown link format: [Text](URL) -> inspect URL or link text
    const linkMatch = text.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1].trim();
      const linkUrl = linkMatch[2].trim();
      let chosen = '';
      if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(linkText)) {
        chosen = linkText;
      } else if (linkUrl) {
        chosen = linkUrl;
      } else {
        chosen = linkText;
      }
      text = text.replace(linkMatch[0], chosen);
    }

    // 3. Normalize protocol / www early
    text = text.replace(/^https?:\/\//i, '');
    text = text.replace(/^www\./i, '');

    // 4. Strip quotes and markdown bold/italic/code wrapping
    text = text.replace(/^[`"'\u201c\u201d\u2018\u2019*_\s]+/, '').replace(/[`"'\u201c\u201d\u2018\u2019*_\s]+$/, '');

    // 5. Strip em-dash (—), en-dash (–), horizontal bar (―), double dash (--) and everything after
    text = text.replace(/[\u2014\u2013\u2015—–―].*$/, '');

    // 6. Strip spaced dash (" - "), colon with space (": "), pipe ("|"), arrow ("->", "=>", "→"), equals (" = ")
    text = text.replace(/(\s+-\s+|\s*[:|]\s+|\s*(?:->|=>|→|↦)\s*|\s*=\s+).*$/, '');

    // 7. Strip double slash comments
    text = text.replace(/\s*\/\/.*$/, '');

    // 8. Strip parenthetical / bracket explanations: "(...)", "[...]", "{...}"
    text = text.replace(/[\(\[\{][^\)\]\}]*[\)\]\}]/g, '');

    // 9. Normalize domain text
    text = text.trim().toLowerCase();
    text = text.replace(/^https?:\/\//i, '');
    text = text.replace(/^www\./i, '');
    text = text.split('/')[0].split('?')[0].split('#')[0];
    text = text.split(':')[0];
    text = text.replace(/[^a-z0-9.-]/g, '');

    // Strip leading/trailing dots or hyphens
    text = text.replace(/^[-.]+|[-.]+$/g, '');

    return text.trim();
  }

  /**
   * Try parsing markdown table
   * @param {string} inputText
   * @param {string[]} defaultTlds
   * @returns {Array<{ raw: string, tlds: string[] | null }> | null}
   */
  function parseMarkdownTable(inputText, defaultTlds) {
    const lines = inputText.split(/[\r\n]+/);
    const tableRows = lines.filter(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
    if (tableRows.length < 2) return null;

    const items = [];
    let headerFound = false;
    let nameColIdx = -1;
    let tldColIdx = -1;

    for (const row of tableRows) {
      const trimmed = row.trim();
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
        headerFound = true;
        continue;
      }

      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map(c => c.trim());

      if (cells.length === 0) continue;

      if (!headerFound) {
        const lowerCells = cells.map(c => c.toLowerCase());
        const hasHeaderWord = lowerCells.some(c => 
          /^(name|domain|domain\s*name|idea|startup|brand|keyword|#|no\.?)$/i.test(c)
        );

        if (hasHeaderWord) {
          cells.forEach((c, idx) => {
            const lower = c.toLowerCase();
            if (/^(domain|name|domain\s*name|idea|startup|brand)$/i.test(lower) && nameColIdx === -1) {
              nameColIdx = idx;
            } else if (/^(tld|extension|ext)$/i.test(lower) && tldColIdx === -1) {
              tldColIdx = idx;
            }
          });
          headerFound = true;
          continue;
        }
      }

      let rawName = '';
      let rawTld = '';

      if (nameColIdx !== -1 && cells[nameColIdx]) {
        rawName = cells[nameColIdx];
        if (tldColIdx !== -1 && cells[tldColIdx]) {
          rawTld = cells[tldColIdx];
        }
      } else {
        let targetIdx = 0;
        if (/^\d+$/.test(cells[0]) && cells.length > 1) {
          targetIdx = 1;
        }
        rawName = cells[targetIdx] || '';
        if (cells.length > targetIdx + 1 && isTld(cells[targetIdx + 1])) {
          rawTld = cells[targetIdx + 1];
        }
      }

      if (!rawName) continue;

      const extracted = parseLine(rawName, defaultTlds);
      if (extracted.length > 0) {
        if (rawTld && isTld(rawTld)) {
          const cleanTld = rawTld.replace(/^\./, '').toLowerCase();
          extracted.forEach(item => {
            item.tlds = [cleanTld];
          });
        }
        items.push(...extracted);
      }
    }

    return items.length > 0 ? items : null;
  }

  /**
   * Parse a single line into items with potential explicit TLDs
   * @param {string} line
   * @param {string[]} defaultTlds
   * @returns {Array<{ raw: string, tlds: string[] | null }>}
   */
  function parseLine(line, defaultTlds) {
    let text = line.trim();
    if (isIgnoredLine(text)) return [];

    // Remove leading emojis, symbols, and bullets iteratively first
    text = stripListPrefixes(text);

    // Check for Parenthetical TLD format (e.g. "**LaunchScout** (.com, .io, .ai) - Description")
    const parenTldMatch = text.match(/^([`"'\u201c\u201d\u2018\u2019*_a-zA-Z0-9.-]+)\s*([\(\[\{][^\)\]\}]+[\)\]\}])/);
    if (parenTldMatch) {
      const rawName = cleanDomainInput(parenTldMatch[1]);
      const parenContent = parenTldMatch[2];
      const extractedTlds = extractTldsFromParentheses(parenContent);

      if (rawName && extractedTlds && extractedTlds.length > 0) {
        return [{ raw: rawName, tlds: extractedTlds }];
      }
    }

    // Handle line with description separator: em-dash, colon, dash, pipe, arrow, tab, equals
    if (/[\u2014\u2013\u2015—–―]|\s+-\s+|\s*[:|]\s+|\s*(?:->|=>|→|↦)\s*|\s*=\s+|\s*\/\/\s*|\t/.test(text)) {
      if (text.includes('\t')) {
        const tabParts = text.split('\t').map(p => p.trim()).filter(Boolean);
        if (tabParts.length > 0) {
          const cleaned = cleanDomainInput(tabParts[0]);
          if (cleaned) {
            if (tabParts.length > 1 && isTld(tabParts[1])) {
              return [{ raw: cleaned, tlds: [tabParts[1].replace(/^\./, '').toLowerCase()] }];
            }
            return [{ raw: cleaned, tlds: null }];
          }
        }
      }

      const stripped = cleanDomainInput(text);
      if (stripped) return [{ raw: stripped, tlds: null }];
    } else {
      // Comma / semicolon separated
      const subTokens = text.split(/[,;]+/);
      const results = [];
      for (const st of subTokens) {
        const cleaned = cleanDomainInput(st);
        if (cleaned) results.push({ raw: cleaned, tlds: null });
      }
      return results;
    }

    return [];
  }

  /**
   * Parse a raw input string supporting ChatGPT/AI output formats, markdown tables,
   * JSON arrays, newlines, commas, semicolons, tabs, and items with notes/descriptions.
   * Expands base names with given default TLDs, and handles specific TLDs entered directly.
   * 
   * @param {string} inputText - Raw text input
   * @param {string[]} defaultTlds - Array of preferred TLDs (e.g. ['com', 'io', 'ai'])
   * @returns {{ name: string, hash: string, tlds: string[] }[]} Grouped payload for bulk check
   */
  function parseDomainPayload(inputText, defaultTlds = ['com', 'io', 'ai']) {
    if (!inputText || typeof inputText !== 'string') return [];

    // Normalize tlds (strip leading dot, lowercase)
    const normalizedDefaultTlds = defaultTlds
      .map(t => t.replace(/^\./, '').trim().toLowerCase())
      .filter(Boolean);

    let rawItems = [];

    // 1. Try parsing JSON (if input starts with [ or {)
    const trimmed = inputText.trim();
    if (trimmed.startsWith('[') || (trimmed.startsWith('{') && !trimmed.startsWith('{\n'))) {
      try {
        const parsedJson = JSON.parse(trimmed);
        if (Array.isArray(parsedJson)) {
          parsedJson.forEach(item => {
            if (typeof item === 'string') {
              const cleaned = cleanDomainInput(item);
              if (cleaned) rawItems.push({ raw: cleaned, tlds: null });
            } else if (item && typeof item === 'object') {
              const nameVal = item.name || item.domain || item.label || item.title || item.keyword;
              const tldVal = item.tld || item.ext || item.extension;
              if (nameVal && typeof nameVal === 'string') {
                const cleaned = cleanDomainInput(nameVal);
                if (cleaned) {
                  const tlds = tldVal ? [tldVal.replace(/^\./, '').toLowerCase()] : null;
                  rawItems.push({ raw: cleaned, tlds });
                }
              }
            }
          });
        }
      } catch (e) {
        // Not valid JSON, fallback to text parsing
      }
    }

    // 2. Try parsing Markdown Table if no JSON items
    if (rawItems.length === 0) {
      const tableItems = parseMarkdownTable(inputText, defaultTlds);
      if (tableItems && tableItems.length > 0) {
        rawItems = tableItems;
      }
    }

    // 3. Line-by-line parsing
    if (rawItems.length === 0) {
      const lines = inputText.split(/[\r\n]+/);
      for (const line of lines) {
        const parsed = parseLine(line, defaultTlds);
        if (parsed.length > 0) {
          rawItems.push(...parsed);
        }
      }
    }

    const grouped = new Map();

    for (const item of rawItems) {
      const token = item.raw;
      if (!token) continue;

      // Filter out obvious noise words if no dot (e.g. "com", "io", "http", "domain")
      if (!token.includes('.') && /^(https?|www|domain|domains|com|net|org|io|ai)$/i.test(token)) {
        continue;
      }

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

        // If item has explicit TLDs (from parenthetical or table)
        if (item.tlds && Array.isArray(item.tlds) && item.tlds.length > 0) {
          for (const tld of item.tlds) {
            grouped.get(baseName).tlds.add(tld);
          }
        } else {
          // Fallback to user's preferred default TLDs
          for (const tld of normalizedDefaultTlds) {
            grouped.get(baseName).tlds.add(tld);
          }
        }
      }
    }

    return Array.from(grouped.values()).map(entry => ({
      name: entry.name,
      hash: entry.hash,
      tlds: Array.from(entry.tlds)
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
