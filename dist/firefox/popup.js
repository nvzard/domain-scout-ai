/**
 * Popup Controller for Domain Availability Checker
 * Cross-browser compatible (Google Chrome, Firefox, Edge, Brave, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let preferredTlds = ['com', 'io', 'ai'];
  let currentResults = [];
  let currentFilter = 'available'; // 'available' | 'all' | 'aftermarket' | 'starred'
  let searchTerm = '';
  let isChecking = false;
  let starredDomains = new Set();

  // DOM Elements
  const domainInput = document.getElementById('domainInput');
  const tldChipsContainer = document.getElementById('tldChipsContainer');
  const newTldInput = document.getElementById('newTldInput');
  const btnAddTld = document.getElementById('btnAddTld');
  const btnResetTlds = document.getElementById('btnResetTlds');
  const quickTldButtons = document.querySelectorAll('.tld-quick-pill');

  const btnVariations = document.getElementById('btnVariations');
  const btnSample = document.getElementById('btnSample');
  const btnClearInput = document.getElementById('btnClearInput');
  const btnCheck = document.getElementById('btnCheck');
  const btnCheckText = document.getElementById('btnCheckText');
  const keyboardHint = document.getElementById('keyboardHint');

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
  const tabCountStarred = document.getElementById('tabCountStarred');

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

  // Aftermarket marketplace URL generator
  function getAftermarketUrl(domain, marketName) {
    const market = (marketName || '').toLowerCase();
    const enc = encodeURIComponent(domain);
    if (market.includes('sedo')) {
      return `https://sedo.com/search/?keyword=${enc}`;
    }
    if (market.includes('dan')) {
      return `https://dan.com/buy-domain/${enc}`;
    }
    if (market.includes('godaddy')) {
      return `https://www.godaddy.com/domainsearch/find?domainToCheck=${enc}`;
    }
    return `https://www.afternic.com/AddToCart.do?selectedDomains=${enc}`;
  }

  // Inspection URLs
  function getWhoisUrl(domain) {
    return `https://lookup.icann.org/en/lookup?name=${encodeURIComponent(domain)}`;
  }

  function getWaybackUrl(domain) {
    return `https://web.archive.org/web/*/${encodeURIComponent(domain)}`;
  }

  // Smart Variations Generator
  const VARIATION_PREFIXES = ['get', 'try', 'use', 'go', 'join', 'my', 'the', 'hey', 'we', 'all', 'open', 'pure', 'true', 'smart'];
  const VARIATION_SUFFIXES = ['app', 'hq', 'base', 'hub', 'flow', 'ly', 'ify', 'lab', 'space', 'stack', 'pro', 'box', 'studio', 'craft'];

  function generateVariations(text) {
    const rawTokens = text
      .split(/[\r\n,;]+/)
      .map(s => DomainChecker.cleanDomainInput(s))
      .filter(Boolean);

    let seeds = rawTokens;
    if (seeds.length === 0) {
      seeds = ['launch', 'scout'];
    }

    const generated = new Set();
    seeds.forEach(seed => {
      const base = seed.split('.')[0].toLowerCase();
      if (!base) return;
      generated.add(base);
      VARIATION_PREFIXES.slice(0, 6).forEach(p => generated.add(`${p}${base}`));
      VARIATION_SUFFIXES.slice(0, 7).forEach(s => generated.add(`${base}${s}`));
    });

    return Array.from(generated);
  }

  function toggleStar(domain) {
    if (starredDomains.has(domain)) {
      starredDomains.delete(domain);
      showToast(`Removed ${domain} from starred`);
    } else {
      starredDomains.add(domain);
      showToast(`★ Starred ${domain}!`);
    }
    persistState();
    renderResults();
  }

  // Sample data showcasing ChatGPT output formats
  const sampleDomains = [
    "1. **LaunchScout** (.com, .io, .ai) — Curated discovery platform",
    "2. **Noviqo** (com / co) — Modern AI assistant",
    "3. *Brevio* [Short & brandable]",
    "4. **Novli** (A creative tool for founders)",
    "5. `LaunchBase` -> Developer portal",
    "6. 🚀 **StartupShelf** : Community platform",
    "7. [CloudForge](https://cloudforge.dev)",
    "8. \"BrandSprint\" = Fast launch framework",
    "9. Idea #9: AlphaStream // Real-time data",
    "10. DataPulse"
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
      const data = await getStoredData(['domainInput', 'preferredTlds', 'lastResults', 'currentFilter', 'starredDomains']);
      if (data.preferredTlds && Array.isArray(data.preferredTlds) && data.preferredTlds.length > 0) {
        preferredTlds = data.preferredTlds;
      }
      if (data.domainInput) {
        domainInput.value = data.domainInput;
      }
      if (data.starredDomains && Array.isArray(data.starredDomains)) {
        starredDomains = new Set(data.starredDomains);
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
        currentFilter,
        starredDomains: Array.from(starredDomains)
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

  // Safe SVG DOM Helper
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function createSvgEl(tagName, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tagName);
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
    return el;
  }

  function createStarBtn(domain, isStarred) {
    const btn = document.createElement('button');
    btn.className = `btn-star ${isStarred ? 'is-starred' : ''}`;
    btn.setAttribute('data-domain', domain);
    btn.title = isStarred ? 'Remove from starred' : 'Add to starred';

    const svg = createSvgEl('svg', {
      width: '13',
      height: '13',
      viewBox: '0 0 24 24',
      fill: isStarred ? '#facc15' : 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });
    const polygon = createSvgEl('polygon', {
      points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
    });
    svg.appendChild(polygon);
    btn.appendChild(svg);
    return btn;
  }

  function createContinueBtn(domain) {
    const btn = document.createElement('button');
    btn.className = 'btn-continue';
    btn.setAttribute('data-domain', domain);
    btn.title = `Register ${domain}`;

    const span = document.createElement('span');
    span.textContent = 'Continue';
    btn.appendChild(span);

    const svg = createSvgEl('svg', {
      class: 'chevron-icon',
      width: '10',
      height: '10',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });
    const polyline = createSvgEl('polyline', { points: '6 9 12 15 18 9' });
    svg.appendChild(polyline);
    btn.appendChild(svg);
    return btn;
  }

  function createAftermarketBtn(domain, market) {
    const btn = document.createElement('button');
    btn.className = 'btn-aftermarket-action';
    btn.setAttribute('data-domain', domain);
    btn.setAttribute('data-market', market);
    btn.title = `View listing on ${market}`;

    const span = document.createElement('span');
    span.textContent = 'Buy / Offer';
    btn.appendChild(span);

    const svg = createSvgEl('svg', {
      class: 'action-arrow',
      width: '11',
      height: '11',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    });
    const path1 = createSvgEl('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' });
    const polyline = createSvgEl('polyline', { points: '15 3 21 3 21 9' });
    const line = createSvgEl('line', { x1: '10', y1: '14', x2: '21', y2: '3' });
    svg.appendChild(path1);
    svg.appendChild(polyline);
    svg.appendChild(line);
    btn.appendChild(svg);
    return btn;
  }

  function createWhoisBtn(domain) {
    const btn = document.createElement('button');
    btn.className = 'btn-item-action btn-whois';
    btn.setAttribute('data-domain', domain);
    btn.title = `WHOIS lookup for ${domain}`;

    const svg = createSvgEl('svg', {
      width: '12',
      height: '12',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    });
    const circle = createSvgEl('circle', { cx: '11', cy: '11', r: '8' });
    const line = createSvgEl('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' });
    svg.appendChild(circle);
    svg.appendChild(line);
    btn.appendChild(svg);
    return btn;
  }

  function createWaybackBtn(domain) {
    const btn = document.createElement('button');
    btn.className = 'btn-item-action btn-wayback';
    btn.setAttribute('data-domain', domain);
    btn.title = `Wayback Machine archive for ${domain}`;

    const svg = createSvgEl('svg', {
      width: '12',
      height: '12',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    });
    const circle = createSvgEl('circle', { cx: '12', cy: '12', r: '10' });
    const polyline = createSvgEl('polyline', { points: '12 6 12 12 16 14' });
    svg.appendChild(circle);
    svg.appendChild(polyline);
    btn.appendChild(svg);
    return btn;
  }

  function createCopyBtn(domain) {
    const btn = document.createElement('button');
    btn.className = 'btn-item-action btn-copy-single';
    btn.setAttribute('data-domain', domain);
    btn.title = `Copy ${domain}`;

    const svg = createSvgEl('svg', {
      width: '12',
      height: '12',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2'
    });
    const rect = createSvgEl('rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' });
    const path = createSvgEl('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' });
    svg.appendChild(rect);
    svg.appendChild(path);
    btn.appendChild(svg);
    return btn;
  }

  // Render TLD Chips
  function renderTldChips() {
    tldChipsContainer.textContent = '';
    preferredTlds.forEach((tld, idx) => {
      const chip = document.createElement('div');
      chip.className = 'tld-chip';

      const tldText = document.createElement('span');
      tldText.textContent = `.${tld}`;

      const removeBtn = document.createElement('span');
      removeBtn.className = 'tld-remove';
      removeBtn.setAttribute('data-index', String(idx));
      removeBtn.title = `Remove .${tld}`;
      removeBtn.textContent = '×';

      chip.appendChild(tldText);
      chip.appendChild(removeBtn);
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

  // Dynamic OS-adaptive shortcut hint (⌘+Enter on Mac, Ctrl+Enter on Windows/Linux)
  // Uses standard navigator APIs - zero extra permissions required
  function initKeyboardShortcutHint() {
    if (!keyboardHint) return;
    let isMac = false;
    if (typeof navigator !== 'undefined') {
      if (navigator.userAgentData && typeof navigator.userAgentData.platform === 'string') {
        isMac = /mac/i.test(navigator.userAgentData.platform);
      } else {
        const platform = navigator.platform || '';
        const userAgent = navigator.userAgent || '';
        isMac = /Mac|iPhone|iPod|iPad/i.test(platform) || /Macintosh|Mac OS X/i.test(userAgent);
      }
    }
    keyboardHint.textContent = isMac ? '⌘+Enter' : 'Ctrl+Enter';
  }

  // Keyboard shortcut Cmd/Ctrl + Enter to trigger check
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (!isChecking) {
        startCheck();
      }
    }
  });

  initKeyboardShortcutHint();

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
    const starredItems = currentResults.filter(r => starredDomains.has(r.domain));

    // Update Counts
    countAvailable.textContent = availableItems.length;
    countTaken.textContent = takenItems.length;
    countAftermarket.textContent = aftermarketItems.length;
    countTotal.textContent = totalCount;

    tabCountAvail.textContent = availableItems.length;
    tabCountAll.textContent = totalCount;
    tabCountMarket.textContent = aftermarketItems.length;
    if (tabCountStarred) {
      tabCountStarred.textContent = starredItems.length;
    }

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
    } else if (currentFilter === 'starred') {
      filtered = starredItems;
    }

    // Apply Search Term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => item.domain.toLowerCase().includes(term));
    }

    // Render List Items
    closeRegistrarDropdown();
    resultsList.textContent = '';

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
      let badgeClass = 'badge-taken';
      let badgeText = 'Taken';

      if (item.isAvailable) {
        statusClass = 'is-available';
        badgeClass = 'badge-available';
        badgeText = 'Available';
      } else if (item.isAftermarket) {
        statusClass = 'is-aftermarket';
        badgeClass = 'badge-aftermarket';
        badgeText = item.marketPrice ? `$${item.marketPrice.toLocaleString()}` : 'For Sale';
      }

      row.className = `domain-item ${statusClass}`;
      
      const baseName = item.name;
      const tld = item.tld;

      // 1. Left container (domain name + status badge)
      const domainLeft = document.createElement('div');
      domainLeft.className = 'domain-left';

      const domainName = document.createElement('span');
      domainName.className = 'domain-name';
      domainName.textContent = baseName;

      const tldPart = document.createElement('span');
      tldPart.className = 'tld-part';
      tldPart.textContent = `.${tld}`;
      domainName.appendChild(tldPart);

      const statusBadge = document.createElement('span');
      statusBadge.className = `domain-status-badge ${badgeClass}`;
      statusBadge.textContent = badgeText;

      domainLeft.appendChild(domainName);
      domainLeft.appendChild(statusBadge);

      // 2. Right container (action buttons)
      const domainRight = document.createElement('div');
      domainRight.className = 'domain-right';

      if (item.isAvailable) {
        domainRight.appendChild(createContinueBtn(item.domain));
      } else if (item.isAftermarket) {
        const market = item.marketName || 'Market';
        domainRight.appendChild(createAftermarketBtn(item.domain, market));
      } else {
        domainRight.appendChild(createWhoisBtn(item.domain));
        domainRight.appendChild(createWaybackBtn(item.domain));
      }

      domainRight.appendChild(createCopyBtn(item.domain));
      domainRight.appendChild(createStarBtn(item.domain, starredDomains.has(item.domain)));

      row.appendChild(domainLeft);
      row.appendChild(domainRight);
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

  // Variations Button
  if (btnVariations) {
    btnVariations.addEventListener('click', () => {
      const currentVal = domainInput.value.trim();
      const variations = generateVariations(currentVal);
      domainInput.value = variations.join('\n');
      persistState();
      showToast(`⚡ Generated ${variations.length} variations! Click Check.`);
    });
  }

  // Search Filter Input
  searchFilterInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    renderResults();
  });

  // Results List Actions
  resultsList.addEventListener('click', (e) => {
    // 1. Star / Favorite toggle
    const starBtn = e.target.closest('.btn-star');
    if (starBtn) {
      e.stopPropagation();
      const domain = starBtn.getAttribute('data-domain');
      if (domain) toggleStar(domain);
      return;
    }

    // 2. Continue dropdown trigger
    const continueBtn = e.target.closest('.btn-continue');
    if (continueBtn) {
      e.stopPropagation();
      const domain = continueBtn.getAttribute('data-domain');
      if (domain) {
        openRegistrarDropdown(continueBtn, domain);
      }
      return;
    }

    // 3. Aftermarket action
    const aftermarketBtn = e.target.closest('.btn-aftermarket-action');
    if (aftermarketBtn) {
      e.stopPropagation();
      const domain = aftermarketBtn.getAttribute('data-domain');
      const market = aftermarketBtn.getAttribute('data-market');
      if (domain) {
        openExternalUrl(getAftermarketUrl(domain, market));
      }
      return;
    }

    // 4. WHOIS lookup
    const whoisBtn = e.target.closest('.btn-whois');
    if (whoisBtn) {
      e.stopPropagation();
      const domain = whoisBtn.getAttribute('data-domain');
      if (domain) {
        openExternalUrl(getWhoisUrl(domain));
      }
      return;
    }

    // 5. Wayback Machine archive
    const waybackBtn = e.target.closest('.btn-wayback');
    if (waybackBtn) {
      e.stopPropagation();
      const domain = waybackBtn.getAttribute('data-domain');
      if (domain) {
        openExternalUrl(getWaybackUrl(domain));
      }
      return;
    }

    // 6. Single Domain Copy
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

  // Copy Available / Starred List
  btnCopyAvailable.addEventListener('click', () => {
    let targets = [];
    if (currentFilter === 'starred') {
      targets = currentResults.filter(r => starredDomains.has(r.domain)).map(r => r.domain);
      if (targets.length === 0) {
        showToast('No starred domains to copy');
        return;
      }
      copyToClipboard(targets.join('\n'));
      showToast(`Copied ${targets.length} starred domain${targets.length > 1 ? 's' : ''}!`);
      return;
    }

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
    const starred = currentResults.filter(r => starredDomains.has(r.domain));

    const content = [
      '# Domain Availability Report',
      `# Generated: ${new Date().toISOString()}`,
      `# Total Checked: ${currentResults.length} | Available: ${available.length} | Starred: ${starred.length}`,
      '',
      '## STARRED / SHORTLISTED DOMAINS:',
      ...(starred.map(r => r.domain)),
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
