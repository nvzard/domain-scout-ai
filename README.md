# Domain Scout AI — Fast Domain Search & AI Ideator

A unified, high-performance browser extension for **Google Chrome** and **Mozilla Firefox** that bulk-checks domain availability across top TLDs (`.com`, `.io`, `.ai`, etc.) via InstantDomainSearch and autonomously hunts available domains using AI.

![Domain Scout AI Banner](https://raw.githubusercontent.com/nvzard/domain-scout/refs/heads/main/store-assets/promo-marquee-1400x560.png)

### 📥 Install Extension

- 🌐 **Chrome Web Store**: [Install for Chrome, Brave, Edge & Arc](https://chromewebstore.google.com/detail/domain-scout-fast-domain/ojbgfajinlicmdkdagjnlncehcffapml)
- 🦊 **Firefox Add-ons**: [Install for Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/domain-scout-search/)
- 🎥 **Demo Video**: [Watch on YouTube](https://youtu.be/ZstDT9bYeqc)

---

## ✨ Key Features

### 🤖 AI Scout Mode (Concept-to-Domain Ideator)
- **Natural Language Ideation**: Describe any product, startup, or tool idea to generate brandable name ideas.
- **Autonomous Multi-Round Hunting Loop**: Automatically filters registered names and re-prompts across iterative rounds until **10 available domains** are found.
- **Multi-Provider AI Engine (Cloud & Offline)**:
  - **OpenRouter**: Access free & low-cost models (Llama 3.3, DeepSeek, Gemini Flash) with dynamic live catalog fetching.
  - **OpenAI**: GPT-4o mini for high-quality startup branding.
  - **Google Gemini**: Fast, creative ideation via Gemini API.
  - **Groq**: Ultra-low-latency Llama 3 inference.
  - **Smart Brain (Offline / Instant)**: 100% client-side, zero-config naming engine powered by 19+ industry dictionaries (FinTech, AI, DevTools, SaaS, E-Commerce, etc.).
- **Quick-Start Inspiration Chips**: 1-click prompts for SaaS, AI Assistants, DevTools, and FinTech.

### 📋 Bulk Manual Checker & Smart Parser
- **Flexible Multi-Format Input**: Paste lists separated by commas, newlines, ChatGPT markdown lists (`1. **LaunchScout** (.com, .io)`), tables, or JSON.
- **Customizable TLDs**: Choose default extensions (`.com`, `.io`, `.ai`) or toggle modern TLD chips (`.co`, `.dev`, `.app`, `.org`, `.xyz`).
- **⚡ Smart Variations Generator**: 1-click generation of startup prefixes (`get`, `try`, `use`, `go`, `join`, `hey`) and suffixes (`app`, `hq`, `base`, `hub`, `flow`, `ly`, `ify`, `lab`).

### 📊 Dashboard & Productivity Tools
- **Instant Status Tabs**: Filter domains by *Available*, *All*, *For Sale*, and *Starred*.
- **🌟 Starred Shortlist**: Bookmark your favorite domains with persistent local storage.
- **🛒 Direct Registrar Jump**: 1-click search and registration on GoDaddy, Hostinger, Spaceship, Domain.com, and Namecheap.
- **🏷️ Aftermarket Pricing**: Direct "Buy / Offer" links to secondary marketplaces (Afternic, Sedo, Dan.com, GoDaddy).
- **🔍 Domain Inspection**: 1-click ICANN WHOIS lookup and Wayback Machine history for taken domains.
- **Export & Copy**: 1-click clipboard copy (Available / Starred) and clean `.txt` summary report exports.
- **🔒 Privacy First**: 100% client-side with zero data collection or tracking.

---

## 🚀 Architecture & Development

All UI, styling, and business logic are maintained inside the `src/` directory as a single source of truth. Running the build script compiles and packages distributions for both Chrome and Firefox.

```
domain-scout/
├── src/                          # 📁 Single Source of Truth
│   ├── domain-checker.js         # Core hashing, parser, API client
│   ├── ai-generator.js           # Multi-provider AI engine & Smart Brain
│   ├── popup.html                # Popup UI markup
│   ├── popup.css                 # Dark theme design system
│   ├── popup.js                  # Cross-browser event handler & storage
│   └── icons/                    # Shared extension icon assets
├── manifests/
│   ├── manifest.chrome.json      # Chrome Manifest V3
│   └── manifest.firefox.json     # Firefox Manifest V3
├── dist/                         # 📦 Generated unpacked builds
│   ├── chrome/                   # Load into chrome://extensions
│   └── firefox/                  # Load into about:debugging
├── store-assets/                 # 🎨 Store promo tiles & screenshots
└── packages/                     # 🎁 Generated zip bundles for submission
```

### 🛠️ Build Commands

```bash
# Install dependencies (zero-dependency build)
npm install

# Build both Chrome and Firefox distributions
npm run build

# Watch mode for active development
npm run watch

# Package production zip files for store submission
npm run package
```

---

## 🌐 Loading Unpacked Extension Locally

### Google Chrome / Brave / Edge / Arc
1. Navigate to `chrome://extensions`.
2. Enable **"Developer mode"** in the top-right corner.
3. Click **"Load unpacked"** and select `dist/chrome`.

### Mozilla Firefox
1. Navigate to `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."**.
3. Select `dist/firefox/manifest.json`.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
