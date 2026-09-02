# 🚀 Domain Scout AI — Store Listing & Publishing Kit

This document contains ready-to-copy-paste metadata, descriptions, screenshots guide, and privacy disclosures required for publishing to the **Google Chrome Web Store** and **Mozilla Firefox Add-ons (AMO)**.

---

## 📦 Ready-to-Upload Packages

Built packages are located in the `packages/` directory:
- **Chrome Web Store package:** `packages/domain-scout-chrome-v1.1.0.zip`
- **Firefox Add-on package:** `packages/domain-scout-firefox-v1.1.0.zip`

---

## 📝 Store Listing Information

### Extension Title
```
Domain Scout AI - Fast Domain Search
```

### Short Description (max 132 chars)
```
Instant AI & bulk domain availability checker for .com, .io, .ai. Hunt 10 available startup names with AI, compare registrars & favorites.
```

### Detailed Description (Markdown / Text)
```markdown
⚡ Domain Scout AI — Fast Bulk Domain Search & AI Availability Ideator

Find and register your next startup, project, or brand name in seconds. Domain Scout is a high-performance browser extension that checks real-time domain availability and marketplace pricing across top TLDs (.com, .io, .ai, .co, .dev, .app, and more).

✨ KEY FEATURES:

🔍 Real-Time Bulk Search
Check dozens of domain names simultaneously. Paste lists formatted with newlines, commas, or brainstorming notes.

🎯 Customizable TLD Preferences
Select your preferred extensions (.com, .io, .ai, .co, .dev, etc.) and quick-add popular modern TLDs with one click.

⚡ Smart Name Variations Generator
Stuck on a brand name? Click "⚡ Variations" to automatically generate high-converting startup prefixes (get, try, use, go, join) and suffixes (app, hq, base, hub, flow, ly, lab).

🛒 Instant Registrar Links & Comparison
Found an available domain? Click "Continue" to jump directly into search/registration on GoDaddy, Hostinger, Spaceship, Domain.com, or Namecheap.

🏷️ Aftermarket & "For Sale" Direct Links
See marketplace listings and pricing ($) for registered domains with direct "Buy / Offer" links on Afternic, Sedo, Dan.com, and GoDaddy.

🌟 Starred Shortlist
Bookmark favorite available names to a dedicated "Starred" tab so you never lose your best ideas.

🔍 WHOIS & Archive History
Quick 1-click ICANN WHOIS lookup and Wayback Machine archive history for registered domains.

📋 1-Click Copy & Text Export
Copy all available or starred domains to your clipboard in one click or export clean .txt reports for your team.

🔒 Privacy First: Zero Tracking
Domain Scout does not collect personal data, track browsing history, or require an account. Everything runs locally in your browser.
```

---

## 🛡️ Privacy Practices & Disclosures (Chrome Web Store Tab)

### Single Purpose Description
```
Search and check domain name availability, TLD options, and aftermarket status in real time.
```

### Host Permissions Justification (`https://cloud.instantdomainsearch.com/*`, `https://chatgpt.com/*`)
```
Required to query real-time domain availability and marketplace pricing via the InstantDomainSearch API, and to communicate with ChatGPT for generating domain suggestions in AI Scout mode.
```

### Storage Permission Justification (`storage`)
```
Used strictly on the client side to remember user input, selected TLD preferences, and starred domain bookmarks across browser sessions.
```

### Cookies Permission Justification (`cookies`)
```
Used strictly client-side to verify active session authentication on chatgpt.com so users can generate domain name ideas in AI Scout mode without needing external API keys. Cookies are never collected, logged, or transferred.
```

### User Data Collection
- **Does this extension collect user data?** `No` (Select "I do not collect or use user data").
- **Account required?** `No`.

---

## 🎨 Store Asset Inventory

All promo assets and screenshots have been generated in [`store-assets/`](file:///Users/nitanshu/workspace/browser-extentions/domain-scout/store-assets):

| Asset | Dimensions | File Formats | Purpose |
| :--- | :--- | :--- | :--- |
| **Marquee Promo Tile** | 1400 x 560 px | `promo-marquee-1400x560.png`, `.jpg` | Chrome Web Store Marquee Promo |
| **Small Promo Tile** | 440 x 280 px | `promo-small-440x280.png`, `.jpg` | Chrome Web Store Small Promo Tile |
| **Screenshot 1** | 1280 x 800 px | `screenshot-1-search-input.jpg` | Brainstorm Domain Names Fast with AI |
| **Screenshot 2** | 1280 x 800 px | `screenshot-2-results-overview.jpg` | 10 Available Found — Autonomous Multi-Round Hunt |
| **Screenshot 3** | 1280 x 800 px | `screenshot-3-registrars-continue.jpg` | Manual Bulk Search — ChatGPT Lists & Variations |
| **Screenshot 4** | 1280 x 800 px | `screenshot-4-aftermarket-pricing.jpg` | 1-Click Registrar Comparison & Purchase |
| **Screenshot 5** | 1280 x 800 px | `screenshot-5-favorites-export.jpg` | Starred Shortlists, Aftermarket Pricing & Reports |
| **Extension Icon** | 128 x 128 px | `src/icons/icon-128.png` | Store Listing App Icon |

---

## 🌐 Publishing Portals

1. **Google Chrome Web Store Dashboard:**
   👉 https://chrome.google.com/webstore/devconsole/
   - Upload package: `packages/domain-scout-chrome-v1.1.0.zip`
   - Upload screenshots: `store-assets/screenshot-1-search-input.jpg` through `screenshot-5-favorites-export.jpg`
   - Upload promo tiles: `store-assets/promo-small-440x280.png` & `store-assets/promo-marquee-1400x560.png`

2. **Mozilla Firefox Add-on Developer Hub (AMO):**
   👉 https://addons.mozilla.org/developers/
   - Upload package: `packages/domain-scout-firefox-v1.1.0.zip`
   - Paste the Summary/Description above -> Submit for review.
