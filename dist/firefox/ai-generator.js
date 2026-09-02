/**
 * Domain Scout AI Generator Core Library
 * Provides client-side AI domain generation and autonomous reiteration loops.
 * Compatible with Chrome, Firefox, and Node.js.
 */

(function (global) {
  // Rich multi-industry concept & keyword lexicons for the Smart Semantic AI Brain
  const INDUSTRY_DICTIONARIES = {
    ecommerce: [
      'mart', 'store', 'vault', 'depot', 'market', 'bazaar', 'outlet', 'stash', 'corner',
      'box', 'crate', 'cart', 'shop', 'supply', 'merch', 'goods', 'bay', 'hub', 'haven', 'drop'
    ],
    food_delivery: [
      'eats', 'bite', 'dash', 'drop', 'meal', 'crave', 'feast', 'dish', 'chef', 'munch',
      'taste', 'nom', 'chow', 'kitchen', 'table', 'cook', 'yum', 'grub', 'fork', 'express',
      'swift', 'fresh', 'pantry', 'snack', 'speedy', 'quick', 'runner'
    ],
    coffee_beverage: [
      'brew', 'bean', 'beans', 'roast', 'roasters', 'cafe', 'cup', 'sip', 'perk', 'grind',
      'espresso', 'latte', 'drip', 'mocha', 'bar', 'pour', 'steam', 'mug', 'aroma', 'java',
      'press', 'blend', 'roastery', 'caffeine', 'den', 'house', 'lounge'
    ],
    cloud_finops: [
      'trim', 'cut', 'slash', 'save', 'saver', 'opt', 'opti', 'shrink', 'less', 'drop',
      'guard', 'finops', 'ops', 'cost', 'spend', 'bill', 'scale', 'stack', 'cloud', 'infra',
      'audit', 'watch', 'wise', 'prune', 'curb', 'pare', 'down', 'ctrl'
    ],
    gaming_collectibles: [
      'zone', 'quest', 'dex', 'play', 'cards', 'loot', 'guild', 'realm', 'haven', 'den',
      'vault', 'hub', 'club', 'verse', 'deck', 'stash', 'arcade', 'forge', 'slab', 'pack',
      'tcg', 'meta', 'mon', 'box', 'mart', 'corner', 'goods'
    ],
    fitness_wellness: [
      'fit', 'gym', 'pulse', 'vital', 'lift', 'flex', 'stride', 'motion', 'peak', 'core',
      'shape', 'fuel', 'glow', 'heal', 'active', 'stamina', 'track', 'form', 'sweat', 'run',
      'body', 'zen', 'flow'
    ],
    real_estate: [
      'nest', 'roof', 'haven', 'dwell', 'abode', 'loft', 'estate', 'space', 'pad', 'key',
      'door', 'terra', 'plot', 'place', 'home', 'casa', 'realty', 'land', 'stay', 'living'
    ],
    business: [
      'pay', 'cash', 'mint', 'coin', 'vault', 'ledger', 'trade', 'yield', 'flow', 'fund',
      'capital', 'asset', 'lend', 'spend', 'bill', 'worth', 'prime', 'fin', 'pocket', 'bank',
      'scale', 'wealth', 'wallet', 'token', 'grow', 'pulse', 'hedge', 'vest', 'swift', 'apex'
    ],
    ai: [
      'mind', 'neural', 'cortex', 'synapse', 'agent', 'brain', 'bot', 'prompt', 'logic', 'sense',
      'vector', 'axon', 'intel', 'cogni', 'optic', 'spark', 'flow', 'tensor', 'hyper', 'omni',
      'auto', 'gen', 'synth', 'smart', 'algo', 'nova', 'deep', 'core', 'prism', 'matrix'
    ],
    devtools: [
      'code', 'dev', 'stack', 'git', 'dock', 'ship', 'build', 'forge', 'hub', 'node',
      'pipe', 'flow', 'byte', 'script', 'host', 'sync', 'hook', 'dash', 'craft', 'pack',
      'cloud', 'infra', 'scale', 'mesh', 'wire', 'port', 'rail', 'block', 'layer', 'core'
    ],
    curation: [
      'hunt', 'scout', 'spot', 'shelf', 'base', 'list', 'curate', 'deck', 'vault', 'stack',
      'launch', 'rank', 'radar', 'feed', 'index', 'board', 'find', 'nest', 'grid', 'pulse',
      'pick', 'forge', 'show', 'drop', 'hub', 'crate', 'bay', 'stream', 'dock', 'wave'
    ],
    creative: [
      'pixel', 'canvas', 'craft', 'studio', 'draw', 'frame', 'muse', 'glow', 'lens', 'shade',
      'form', 'glyph', 'vibe', 'vector', 'blend', 'art', 'palette', 'scene', 'draft', 'cast',
      'look', 'motif', 'tint', 'layer', 'focus', 'shine', 'type', 'font', 'press', 'ink'
    ],
    education: [
      'learn', 'study', 'brain', 'academy', 'skill', 'mentor', 'tutor', 'class', 'ed',
      'scholar', 'mind', 'quest', 'chalk', 'course', 'guide', 'know', 'campus', 'read', 'wise'
    ],
    travel: [
      'trip', 'voyage', 'trek', 'roam', 'path', 'route', 'fly', 'glide', 'ride', 'fleet',
      'drift', 'hop', 'way', 'compass', 'map', 'tour', 'journey', 'trail', 'jet'
    ],
    social: [
      'vibe', 'circle', 'tribe', 'club', 'gang', 'hang', 'link', 'hive', 'loop', 'crowd',
      'pulse', 'guild', 'feed', 'squad', 'band', 'chat', 'cast', 'folk', 'room', 'crew'
    ],
    security: [
      'shield', 'guard', 'vault', 'lock', 'safe', 'fort', 'armor', 'sentry', 'ward', 'seal',
      'crypto', 'key', 'haven', 'wall', 'defend', 'gate', 'secure', 'pass', 'trust'
    ],
    marketing: [
      'growth', 'boost', 'reach', 'scale', 'viral', 'rank', 'hook', 'funnel', 'convert',
      'click', 'lead', 'pulse', 'surge', 'amp', 'pitch', 'gain', 'ad', 'spark', 'hype'
    ],
    productivity: [
      'task', 'flow', 'sync', 'desk', 'track', 'board', 'pace', 'work', 'align', 'plan',
      'organize', 'focus', 'notion', 'hub', 'suite', 'doc', 'sheet', 'note', 'time', 'cal'
    ],
    pets: [
      'pet', 'pup', 'paw', 'bark', 'meow', 'fur', 'tails', 'hound', 'pooch', 'whiskers',
      'fetch', 'paws', 'leash', 'snout', 'buddy', 'vet', 'pack'
    ]
  };

  // Comprehensive subject entity dictionary (maps topic concepts to concise brand roots)
  const SUBJECT_ENTITIES = {
    'pokemon': ['poke', 'pokemon'],
    'aws': ['aws', 'cloud'],
    'amazon': ['aws', 'cloud', 'prime'],
    'coffee': ['coffee', 'brew', 'roast', 'cafe', 'bean'],
    'cafe': ['cafe', 'brew', 'coffee', 'roast'],
    'tea': ['tea', 'brew', 'chai', 'leaf'],
    'food': ['food', 'meal', 'eats', 'bite', 'dish'],
    'fitness': ['fit', 'gym', 'vital'],
    'gym': ['gym', 'fit', 'lift'],
    'workout': ['fit', 'lift', 'gym', 'sweat'],
    'crypto': ['crypto', 'coin', 'token', 'chain'],
    'bitcoin': ['btc', 'coin', 'crypto', 'sats'],
    'estate': ['estate', 'realty', 'home', 'nest'],
    'realestate': ['estate', 'realty', 'home', 'nest'],
    'property': ['estate', 'realty', 'home', 'nest'],
    'pet': ['pet', 'pup', 'paw'],
    'dog': ['pup', 'dog', 'hound', 'paw'],
    'cat': ['cat', 'kitty', 'paw'],
    'hunt': ['hunt', 'scout', 'launch', 'spot'],
    'product': ['hunt', 'launch', 'scout', 'shelf'],
    'ai': ['ai', 'mind', 'agent', 'bot', 'cortex'],
    'code': ['code', 'dev', 'stack', 'byte', 'git'],
    'developer': ['dev', 'code', 'stack', 'git'],
    'dev': ['dev', 'code', 'stack', 'git'],
    'travel': ['travel', 'trip', 'roam', 'trek', 'voyage'],
    'music': ['beat', 'tune', 'sound', 'sonic', 'audio'],
    'video': ['video', 'clip', 'film', 'reel', 'cast'],
    'design': ['design', 'pixel', 'craft', 'studio', 'ui'],
    'health': ['health', 'care', 'med', 'vital', 'cure'],
    'book': ['book', 'read', 'page', 'shelf', 'novel'],
    'car': ['auto', 'car', 'ride', 'drive', 'gear'],
    'game': ['game', 'play', 'quest', 'loot', 'zone'],
    'gaming': ['game', 'play', 'quest', 'loot', 'zone'],
    'spend': ['aws', 'cloud', 'spend', 'cost'],
    'spends': ['aws', 'cloud', 'spend', 'cost']
  };

  // High-affinity modifiers mapped by intent & domain
  const INTENT_MODIFIERS = {
    'store': ['mart', 'vault', 'store', 'shop', 'box', 'deck', 'drop', 'hub', 'depot', 'goods', 'loot', 'bay', 'corner'],
    'shop': ['mart', 'vault', 'store', 'shop', 'box', 'deck', 'drop', 'hub', 'depot', 'goods', 'loot', 'bar', 'lab', 'cup', 'den'],
    'decrease': ['cut', 'trim', 'save', 'less', 'opt', 'slash', 'guard', 'wise', 'drop', 'finops', 'curb', 'down', 'cost', 'spend'],
    'reduce': ['cut', 'trim', 'save', 'less', 'opt', 'slash', 'guard', 'wise', 'drop', 'finops', 'curb', 'down', 'cost', 'spend'],
    'cut': ['cut', 'trim', 'save', 'less', 'opt', 'slash', 'guard', 'finops', 'cost', 'spend'],
    'save': ['save', 'saver', 'cut', 'trim', 'guard', 'wise', 'less', 'cost', 'spend'],
    'spends': ['cut', 'trim', 'save', 'less', 'opt', 'slash', 'guard', 'wise', 'drop', 'finops', 'cost', 'bill'],
    'spend': ['cut', 'trim', 'save', 'less', 'opt', 'slash', 'guard', 'wise', 'drop', 'finops', 'cost', 'bill'],
    'cost': ['cut', 'trim', 'save', 'less', 'opt', 'slash', 'guard', 'wise', 'drop', 'finops', 'bill'],
    'costs': ['cut', 'trim', 'save', 'less', 'opt', 'slash', 'guard', 'wise', 'drop', 'finops', 'bill'],
    'delivery': ['dash', 'drop', 'swift', 'express', 'box', 'nom', 'munch', 'feast', 'fresh', 'quick', 'rush', 'go', 'speedy', 'runner'],
    'deliver': ['dash', 'drop', 'swift', 'express', 'box', 'nom', 'munch', 'feast', 'fresh', 'quick', 'rush', 'go', 'speedy', 'runner'],
    'tracker': ['track', 'pulse', 'sync', 'log', 'meter', 'watch', 'flow', 'desk', 'base', 'hub', 'ops'],
    'track': ['track', 'pulse', 'sync', 'log', 'meter', 'watch', 'flow', 'desk', 'base', 'hub', 'ops'],
    'payments': ['pay', 'wallet', 'vault', 'mint', 'cash', 'trade', 'flow', 'pass', 'hub', 'base', 'sats'],
    'payment': ['pay', 'wallet', 'vault', 'mint', 'cash', 'trade', 'flow', 'pass', 'hub', 'base', 'sats'],
    'pay': ['wallet', 'vault', 'mint', 'cash', 'trade', 'flow', 'pass', 'hub', 'base'],
    'alternative': ['scout', 'spot', 'base', 'shelf', 'deck', 'vault', 'launch', 'rank', 'radar', 'feed', 'hub', 'nest'],
    'directory': ['scout', 'spot', 'base', 'shelf', 'deck', 'vault', 'launch', 'rank', 'radar', 'feed', 'hub', 'nest', 'list'],
    'platform': ['hub', 'base', 'stack', 'dock', 'deck', 'spot', 'space', 'nest', 'grid', 'flow', 'core', 'lab'],
    'service': ['hub', 'desk', 'lab', 'stack', 'ops', 'base', 'spot', 'flow', 'box', 'suite'],
    'app': ['hub', 'desk', 'box', 'space', 'stack', 'flow', 'sync', 'lab', 'base']
  };

  // High-converting startup prefixes & action prefixes
  const BRAND_PREFIXES = [
    'get', 'try', 'go', 'use', 'pure', 'true', 'smart', 'super', 'nova',
    'zen', 'pro', 'rapid', 'swift', 'prime', 'next', 'apex', 'bold', 'peak',
    'aura', 'fast', 'quick', 'neo', 'daily', 'all', 'hey', 'my', 'the', 'snap'
  ];

  // Modern brandable suffixes
  const BRAND_SUFFIXES = [
    'ly', 'ify', 'io', 'hq', 'lab', 'hub', 'box', 'app', 'flow', 'stack',
    'kit', 'desk', 'dock', 'point', 'loop', 'craft', 'base', 'pulse', 'forge',
    'wave', 'nest', 'grid', 'sync', 'spot', 'vault', 'node', 'deck', 'co',
    'den', 'zone', 'mart', 'house', 'club', 'room', 'bar', 'drop', 'dash', 'bite'
  ];

  // Backward compatibility dictionary reference
  const INDUSTRY_DICTIONARY = INDUSTRY_DICTIONARIES;

  /**
   * Stop words to filter out from user concept prompts
   */
  const STOP_WORDS = new Set([
    'suggest', 'me', 'some', 'domain', 'domains', 'ideas', 'idea', 'name', 'names',
    'for', 'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'with', 'to', 'from',
    'good', 'best', 'creative', 'modern', 'cool', 'catchy', 'brandable', 'startup',
    'website', 'help', 'please', 'give', 'generate', 'create',
    'looking', 'need', 'want', 'build', 'make', 'find', 'which', 'that', 'this',
    'can', 'how', 'about'
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
   * Detect matching category affinity based on prompt keywords
   * @param {string} prompt
   * @returns {string}
   */
  function detectCategory(prompt) {
    const lower = prompt.toLowerCase();
    
    if (/\b(?:poke|pokemon|tcg|card|cards|collect|collectible|collectibles|slab|dex|anime)\b/i.test(lower)) return 'gaming_collectibles';
    if (/\b(?:coffee|cafe|espresso|latte|roast|roastery|brew|bean|beans|caffeine|cappuccino|mocha)\b/i.test(lower)) return 'coffee_beverage';
    if (/\b(?:food|delivery|meal|eats|dish|dine|dining|restaurant|kitchen|cook|lunch|dinner|snack|grub|munch|crave|taste|bite)\b/i.test(lower)) return 'food_delivery';
    if (/\b(?:aws|spend|spends|cost|costs|bill|bills|finops|cloudcost|infra|cloudspend|trim|decrease|reduce|slash|save\s+money)\b/i.test(lower)) return 'cloud_finops';
    if (/\b(?:shop|store|storefront|mart|retail|ecommerce|e-commerce|merch|merchandise|boutique|cart|bazaar)\b/i.test(lower)) return 'ecommerce';
    if (/\b(?:pet|dog|cat|pup|puppy|kitty|kitten|paw|bark|vet|animal|grooming|adopt|shelter)\b/i.test(lower)) return 'pets';
    if (/\b(?:fitness|fit|gym|workout|exercise|muscle|train|training|yoga|pulse|vital|crossfit|runner|running)\b/i.test(lower)) return 'fitness_wellness';
    if (/\b(?:real\s*estate|realty|property|rent|rental|house|housing|home|apartment|condo|flat|loft|dwell)\b/i.test(lower)) return 'real_estate';
    if (/\b(?:ai|gpt|llm|intelligence|agent|smart|neural|model|prompt|bot|machine|copilot)\b/i.test(lower)) return 'ai';
    if (/\b(?:dev|code|git|api|cloud|deploy|docker|infra|program|engineer|build|server|cli|sdk)\b/i.test(lower)) return 'devtools';
    if (/\b(?:pay|payment|payments|fin|finance|fintech|money|crypto|invest|trade|bank|banking|cash|invoice|ledger|stock|fund|wallet|token|btc)\b/i.test(lower)) return 'business';
    if (/\b(?:learn|study|tutor|course|academy|school|teach|education|edtech|scholar|class)\b/i.test(lower)) return 'education';
    if (/\b(?:travel|trip|flight|hotel|tour|voyage|trek|roam|vacation|nomad|flight)\b/i.test(lower)) return 'travel';
    if (/\b(?:design|art|ui|ux|photo|video|brand|font|draw|color|media|craft|edit|graphic)\b/i.test(lower)) return 'creative';
    if (/\b(?:hunt|product|directory|launch|curat|curation|discover|find|listing|catalog|shelf)\b/i.test(lower)) return 'curation';
    if (/\b(?:security|privacy|shield|guard|auth|pass|protect|vpn|cyber|safe|lock|vault)\b/i.test(lower)) return 'security';
    if (/\b(?:market|marketing|seo|growth|ads|advert|traffic|sales|lead|funnel|viral)\b/i.test(lower)) return 'marketing';
    if (/\b(?:task|todo|notes|productivity|notion|calendar|schedule|organize|collab|workflow)\b/i.test(lower)) return 'productivity';
    
    return 'curation';
  }

  /**
   * Normalize and extract root forms for a single word
   * @param {string} word
   * @returns {string[]}
   */
  function normalizeWordRoots(word) {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length < 2) return [];

    const roots = new Set([clean]);

    // Handle common plurals (do not strip if ending in 'ss' like fitness)
    if (clean.endsWith('s') && !clean.endsWith('ss') && clean.length > 3) {
      roots.add(clean.slice(0, -1));
    }
    // Handle 'ies' -> 'y' (e.g. deliveries -> delivery)
    if (clean.endsWith('ies') && clean.length > 4) {
      roots.add(clean.slice(0, -3) + 'y');
    }
    // Handle 'ing' -> base (e.g. tracking -> track)
    if (clean.endsWith('ing') && clean.length > 5) {
      roots.add(clean.slice(0, -3));
    }
    // Handle 'er' / 'ers' (e.g. tracker -> track, roasters -> roast)
    if (clean.endsWith('ers') && clean.length > 5) {
      roots.add(clean.slice(0, -3));
    } else if (clean.endsWith('er') && clean.length > 4) {
      roots.add(clean.slice(0, -2));
    }

    return Array.from(roots);
  }

  /**
   * Dissect user prompt into primary subject anchors and domain modifiers
   * @param {string[]} keywords
   * @param {string} prompt
   * @returns {{ subjectRoots: string[], modifiers: string[], userKeywords: string[] }}
   */
  function dissectPromptSemantics(keywords, prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const subjectRoots = new Set();
    const modifiers = new Set();
    const userKeywords = [];

    // 1. Check for specific subject entities in prompt
    for (const [entityKey, roots] of Object.entries(SUBJECT_ENTITIES)) {
      if (lowerPrompt.includes(entityKey) || keywords.some(k => k === entityKey || k.includes(entityKey))) {
        roots.forEach(r => subjectRoots.add(r));
      }
    }

    // 2. Check for specific intent modifiers in prompt
    for (const [intentKey, mods] of Object.entries(INTENT_MODIFIERS)) {
      if (lowerPrompt.includes(intentKey) || keywords.some(k => k === intentKey || k.includes(intentKey))) {
        mods.forEach(m => modifiers.add(m));
      }
    }

    // 3. Process direct raw keywords
    keywords.forEach(kw => {
      const stems = normalizeWordRoots(kw);
      stems.forEach(s => {
        if (s.length >= 2 && s.length <= 10) {
          userKeywords.push(s);
          // If no predefined subject was matched, treat all keywords as subject roots
          if (subjectRoots.size === 0) {
            subjectRoots.add(s);
          }
        }
      });
    });

    // 4. Enrich modifiers from detected category
    const cat = detectCategory(prompt);
    const catWords = INDUSTRY_DICTIONARIES[cat] || INDUSTRY_DICTIONARIES.curation;
    catWords.slice(0, 15).forEach(cw => modifiers.add(cw));

    // Fallback if subjectRoots is still empty
    if (subjectRoots.size === 0) {
      subjectRoots.add('launch');
      subjectRoots.add('scout');
    }

    return {
      subjectRoots: Array.from(subjectRoots),
      modifiers: Array.from(modifiers),
      userKeywords
    };
  }

  /**
   * Calculate brandability and phonetic appeal score (higher is better)
   * @param {string} name
   * @param {string[]} subjectRoots
   * @param {string[]} userKeywords
   * @returns {number}
   */
  function scoreBrandability(name, subjectRoots, userKeywords) {
    if (!name || name.length < 3 || name.length > 15) return -100;
    
    let score = 50;

    // Sweet spot length for startup brands: 5 to 9 characters
    if (name.length >= 5 && name.length <= 9) {
      score += 40;
    } else if (name.length === 10 || name.length === 11) {
      score += 25;
    } else if (name.length === 4 || name.length === 12) {
      score += 15;
    } else if (name.length > 13) {
      score -= 30;
    }

    // Subject Root relevance (primary anchor bonus)
    const lower = name.toLowerCase();
    for (const root of subjectRoots) {
      if (lower.startsWith(root) || lower.endsWith(root)) {
        score += 60;
        break;
      } else if (lower.includes(root)) {
        score += 40;
        break;
      }
    }

    // Additional boost if directly contains raw user keyword
    for (const uk of userKeywords) {
      if (lower.includes(uk)) {
        score += 20;
        break;
      }
    }

    // Penalize 5 consecutive consonants or 3 consecutive identical letters
    if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(name)) score -= 40;
    if (/(.)\1\1/i.test(name)) score -= 50;

    // Reward healthy vowel-consonant flow
    const vowels = (name.match(/[aeiouy]/gi) || []).length;
    const ratio = vowels / name.length;
    if (ratio >= 0.28 && ratio <= 0.52) {
      score += 15;
    }

    return score;
  }

  /**
   * Smart Client-Side Semantic AI Naming Brain
   * Generates creative, highly relevant, brandable startup and domain names without needing any API key.
   * 
   * @param {string} prompt - User prompt / topic
   * @param {Set<string>|Array<string>} [excludedNames] - Names already taken or used in previous rounds
   * @param {number} [count=15] - Number of domain ideas to generate
   * @returns {string[]} Array of domain base names
   */
  function generateWithSmartBrain(prompt, excludedNames = new Set(), count = 15) {
    const exclusions = excludedNames instanceof Set ? excludedNames : new Set(excludedNames || []);
    const keywords = extractKeywords(prompt);
    const { subjectRoots, modifiers, userKeywords } = dissectPromptSemantics(keywords, prompt);

    const candidatesWithMeta = [];
    const seenNames = new Set();

    function addCandidate(candidate, tier, type, primaryRoot = '') {
      if (!candidate) return;
      const clean = candidate.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length >= 4 && clean.length <= 15 && !exclusions.has(clean) && !seenNames.has(clean)) {
        seenNames.add(clean);
        const score = scoreBrandability(clean, subjectRoots, userKeywords) + (tier * 12);
        candidatesWithMeta.push({ name: clean, score, tier, type, primaryRoot: primaryRoot || clean });
      }
    }

    // TIER 1: Primary Subject Roots + High-Affinity Modifiers
    // Examples:
    // "pokemon store" -> pokemart, pokevault, pokestore, pokeshop, pokedeck, pokebox, pokedrop
    // "decrease aws spends" -> awscut, awstrim, awscost, awsspend, awsopt, cloudtrim, cloudcut, spendcut, costcut, spendless
    // "coffee shop" -> coffeebar, coffeelab, coffeecup, coffeeden, coffeebox, coffeecraft, brewbar, brewlab
    // "food delivery" -> fooddash, fooddrop, foodswift, foodbite, mealdash, mealdrop, eatsdash
    subjectRoots.forEach(root => {
      modifiers.forEach(mod => {
        if (root !== mod && !root.includes(mod) && !mod.includes(root)) {
          // Direct Compound: [root][mod]
          addCandidate(`${root}${mod}`, 6, 'compound-direct', root);
          // Inverted Compound: [mod][root]
          if (mod.length <= 6) {
            addCandidate(`${mod}${root}`, 5, 'compound-inverted', root);
          }
        }
      });
    });

    // Cross-combine direct user keywords if multiple provided (e.g. pokemonstore, awscost, fooddelivery)
    for (let i = 0; i < keywords.length; i++) {
      for (let j = 0; j < keywords.length; j++) {
        if (i !== j) {
          addCandidate(`${keywords[i]}${keywords[j]}`, 6, 'keyword-pair', keywords[i]);
        }
      }
    }

    // TIER 2: Action & Brand Prefixes + Subject Roots
    // Examples: getpoke, trypoke, gopoke, saveaws, cutcloud, dailybrew, purebrew, getmeal, trydash, getcrypto, gofit
    subjectRoots.forEach(root => {
      BRAND_PREFIXES.forEach(prefix => {
        if (prefix !== root && !root.startsWith(prefix)) {
          addCandidate(`${prefix}${root}`, 5, 'prefix', root);
        }
      });
    });

    // TIER 3: Subject Roots + High-Converting Startup Suffixes
    // Examples: pokely, pokeify, pokehq, pokebox, pokedrop, awsly, cloudly, spendly, coffeely, brewbase, foodly, dashly, cryptoly
    subjectRoots.forEach(root => {
      BRAND_SUFFIXES.forEach(suffix => {
        if (suffix !== root && !root.endsWith(suffix)) {
          addCandidate(`${root}${suffix}`, 5, 'suffix', root);
        }
      });
    });

    // TIER 4: Portmanteau / Syllable Overlap Blends (e.g. poke + market -> pokemart, cloud + optimize -> cloudopt)
    subjectRoots.forEach(r1 => {
      modifiers.forEach(r2 => {
        if (r1 !== r2) {
          for (let len = 3; len >= 1; len--) {
            if (r1.length > len && r2.length > len) {
              const r1End = r1.slice(-len);
              const r2Start = r2.slice(0, len);
              if (r1End === r2Start) {
                const blended = r1 + r2.slice(len);
                addCandidate(blended, 6, 'portmanteau', r1);
              }
            }
          }
        }
      });
    });

    // TIER 5: Fallback modifier combinations if candidate pool is small
    if (candidatesWithMeta.length < count * 2) {
      modifiers.forEach(mod => {
        BRAND_PREFIXES.slice(0, 6).forEach(p => addCandidate(`${p}${mod}`, 3, 'fallback-prefix', mod));
        BRAND_SUFFIXES.slice(0, 6).forEach(s => addCandidate(`${mod}${s}`, 3, 'fallback-suffix', mod));
      });
    }

    // Sort by calculated score descending
    candidatesWithMeta.sort((a, b) => b.score - a.score);

    // Multi-dimensional diversification: balance across root anchors and generation types
    const selected = [];
    const rootCounts = {};
    const typeCounts = {};
    const maxPerRoot = Math.max(3, Math.ceil(count / Math.max(2, subjectRoots.length)));
    const maxPerType = Math.max(3, Math.ceil(count / 3));

    // First pass: select top candidates honoring root & type caps
    for (const item of candidatesWithMeta) {
      if (selected.length >= count) break;

      const rKey = item.primaryRoot;
      const tKey = item.type;
      rootCounts[rKey] = (rootCounts[rKey] || 0);
      typeCounts[tKey] = (typeCounts[tKey] || 0);

      if (rootCounts[rKey] < maxPerRoot && typeCounts[tKey] < maxPerType) {
        selected.push(item.name);
        rootCounts[rKey]++;
        typeCounts[tKey]++;
      }
    }

    // Second pass: fill remaining slots by relaxed criteria
    if (selected.length < count) {
      for (const item of candidatesWithMeta) {
        if (!selected.includes(item.name)) {
          selected.push(item.name);
          if (selected.length >= count) break;
        }
      }
    }

    return selected.slice(0, count);
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
    'openrouter': 'OpenRouter',
    'openai': 'OpenAI (GPT-4o mini)',
    'gemini': 'Google Gemini',
    'groq': 'Groq (Llama 3)',
    'smart_brain': 'Smart Brain (Offline)'
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
