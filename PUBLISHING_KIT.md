# 🚀 Domain Scout AI — Store Listing & Publishing Kit

This document contains ready-to-copy-paste metadata, descriptions, screenshots guide, and privacy disclosures required for publishing to the **Google Chrome Web Store** and **Mozilla Firefox Add-ons (AMO)**.

---

## 📦 Ready-to-Upload Packages

Built packages are located in the `packages/` directory:
- **Chrome Web Store package:** `packages/domain-scout-chrome-v1.2.0.zip`
- **Firefox Add-on package:** `packages/domain-scout-firefox-v1.2.0.zip`

---

## 📝 Store Listing Information

### Extension Title
```
Domain Scout AI - Fast Domain Search
```

### Short Description (max 132 chars)
```
AI & bulk domain availability checker for .com, .io, .ai. Hunt 10 available startup names with AI, compare registrars & favorites.
```

### Detailed Description (Markdown / Text)
```markdown
⚡ Domain Scout AI — Fast Bulk Domain Search & AI Availability Ideator

Find and register your next startup, project, or brand name in seconds. Domain Scout is a high-performance browser extension that checks real-time domain availability, generates AI names, and compares marketplace pricing across top TLDs (.com, .io, .ai, .co, .dev, .app, and more).

✨ KEY FEATURES:

🤖 AI Scout Mode (Concept-to-Domain Ideator)
Describe any startup, product, or tool idea. AI brainstorms brandable names and autonomously hunts across iterative rounds until 10 available domains are found!

🧠 Multi-Provider AI Engine (Cloud & Offline)
- OpenRouter: Access free models (Llama 3.3, DeepSeek, Gemini Flash, etc.) with automatic live model fetching.
- OpenAI: GPT-4o mini for premium domain brainstorming.
- Google Gemini: Fast and creative ideation via Gemini API.
- Groq: Ultra-low latency Llama 3 inference.
- Smart Brain (Offline / Instant): 100% client-side, zero-config naming engine powered by 19+ industry lexicons (FinTech, AI, DevTools, SaaS, E-Commerce, etc.).

🔍 Real-Time Bulk Search & Multi-Format Parsing
Check dozens of domain names simultaneously. Paste lists from ChatGPT, markdown tables, JSON arrays, commas, or brainstorming notes with automatic parenthetical TLD extraction.

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

### Host Permissions Justification (`https://cloud.instantdomainsearch.com/*`, `https://instantdomainsearch.com/*`, `https://openrouter.ai/*`, `https://*.openai.com/*`, `https://generativelanguage.googleapis.com/*`, `https://api.groq.com/*`)
```
Required to query real-time domain availability and aftermarket status via the InstantDomainSearch API, and to send user-configured naming prompts to AI providers (OpenRouter, OpenAI, Google Gemini, Groq) directly from the client.
```

### Declarative Net Request Permission Justification (`declarativeNetRequest`)
```
Required to modify network request headers for InstantDomainSearch API queries so that fetch requests preserve same-origin metadata required by the registry lookup endpoint.
```

### Storage Permission Justification (`storage`)
```
Used strictly on the client side to remember user preferences (selected TLDs, AI provider choice, API keys) and starred domain bookmarks across browser sessions.
```

### Privacy Policy URL Field (Required by Chrome Web Store)
Add the following publicly accessible link into the **"Privacy policy"** field in the **Privacy** tab of the Chrome Web Store Developer Dashboard:
```
https://github.com/nvzard/domain-scout-ai/blob/main/PRIVACY_POLICY.md
```
*(Alternative raw URL if needed: `https://raw.githubusercontent.com/nvzard/domain-scout-ai/main/PRIVACY_POLICY.md`)*

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
| **Screenshot 4** | 1280 x 800 px | `screenshot-4-aftermarket-pricing.jpg` | Compare Available, Taken & Marketplace Domains |
| **Screenshot 5** | 1280 x 800 px | `screenshot-5-favorites-export.jpg` | Starred Shortlists, Aftermarket Pricing & Reports |
| **Extension Icon** | 128 x 128 px | `src/icons/icon-128.png` | Store Listing App Icon |

---

## 🌐 Publishing Portals

1. **Google Chrome Web Store Dashboard:**
   👉 https://chrome.google.com/webstore/devconsole/
   - Upload package: `packages/domain-scout-chrome-v1.2.0.zip`
   - Upload screenshots: `store-assets/screenshot-1-search-input.jpg` through `screenshot-5-favorites-export.jpg`
   - Upload promo tiles: `store-assets/promo-small-440x280.png` & `store-assets/promo-marquee-1400x560.png`

2. **Mozilla Firefox Add-on Developer Hub (AMO):**
   👉 https://addons.mozilla.org/developers/
   - Upload package: `packages/domain-scout-firefox-v1.2.0.zip`
   - Paste the Summary/Description above -> Submit for review.

