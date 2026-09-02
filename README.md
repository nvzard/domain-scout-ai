# Cross-Browser Domain Availability Checker

A unified, high-performance browser extension for **Google Chrome** and **Mozilla Firefox** that bulk-checks domain availability across top TLDs (`.com`, `.io`, `.ai`, etc.) via InstantDomainSearch.

![Domain Availability Checker Banner](https://raw.githubusercontent.com/nvzard/domain-scout/refs/heads/main/store-assets/promo-marquee-1400x560.png)

🎥 **Demo Video**: [Watch on YouTube (https://youtu.be/ZstDT9bYeqc)](https://youtu.be/ZstDT9bYeqc)

---

## 🚀 How It Works (Single Source of Truth)

All UI, styling, and business logic are maintained inside the `src/` directory. When you make changes in `src/`, running the build script automatically syncs and packages distributions for both Chrome and Firefox.

```
domain-checker-extension/
├── src/                          # 📁 EDIT HERE (Single Source of Truth)
│   ├── domain-checker.js         # Core hashing, parser, API client
│   ├── popup.html                # Shared popup UI markup
│   ├── popup.css                 # Modern dark theme styles
│   ├── popup.js                  # Cross-browser event handler & storage
│   └── icons/                    # Shared icon assets (16, 32, 48, 128px)
├── manifests/
│   ├── manifest.chrome.json      # Chrome Manifest V3
│   └── manifest.firefox.json     # Firefox Manifest V3
├── dist/                         # 📦 Generated builds
│   ├── chrome/                   # Load into chrome://extensions
│   └── firefox/                  # Load into about:debugging
├── build.js                      # Instant 0-dependency build & watch script
└── package.json                  # npm scripts
```

---

## 🛠️ Making Changes (Applies to Both Extensions)

1. **Edit any file inside [`src/`](src/)** (HTML, CSS, JS, or icons).
2. **Build both distributions**:
   ```bash
   node build.js
   # or with npm:
   npm run build
   ```
3. **Or run with Auto-Watch during active development**:
   ```bash
   node build.js --watch
   # or with npm:
   npm run watch
   ```
   *Any change in `src/` or `manifests/` will instantly recompile both `dist/chrome/` and `dist/firefox/` in milliseconds.*

---

## 🌐 Loading the Extension

### Google Chrome (and Brave / Edge / Arc)
1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **"Developer mode"** (toggle in the top-right corner).
3. Click **"Load unpacked"**.
4. Select the directory:
   ```
   /domain-availability-checker/dist/chrome
   ```
5. Click the extension icon in your Chrome toolbar to use it!

---

### Mozilla Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."**.
3. Select the file:
   ```
   /domain-availability-checker/dist/firefox/manifest.json
   ```
4. Click the extension icon in your Firefox toolbar!

---

## ✨ Features Supported in Both Browsers

### 🤖 AI Scout Mode (NEW)
- **Concept-to-Domain Ideator**: Simply describe your product, startup, or project idea (e.g. *"Suggest domain ideas for a Product Hunt alternative for indie hackers"*).
- **Autonomous Multi-Round Reiteration Loop**: If generated domains are registered/taken, the AI automatically re-prompts with taken exclusions, hunting across rounds until available domains matching your concept are found!
- **Multi-Provider Client-Side AI (Zero Backend Needed)**:
  - **OpenRouter (Free & Fast)**: Access free models (Auto Router, Llama 3.3, DeepSeek, Gemini, etc.) and fast cloud routing with your OpenRouter API key.
  - **OpenAI**: GPT-4o mini for high-quality domain naming via your OpenAI API key.
  - **Google Gemini**: Fast and creative domain idea generation via Google Gemini API.
  - **Groq**: Ultra-low-latency Llama 3 inference via Groq API.
  - **Smart Brain (Offline / Instant)**: 100% client-side, zero-config, instant startup brand naming engine using linguistic roots and industry vocabulary graphs.
- **Inspiration Quick Chips**: 1-click starter prompts for SaaS, AI Assistants, Dev Tools, Design Studios, and FinTech.
- **Target Available Domains**: Hunts until 10 available domains are found across iterative rounds.

### 📋 Manual Bulk Checker Mode
- **Multi-Format Input**:
  - Format 1: Newlines (`name1\nname2\nname3`)
  - Format 2: Commas (`name1, name2, name3.com`)
  - Format 3: ChatGPT lists (`1. **LaunchScout** (.com, .io) — Tool discovery`)
  - Format 4: Markdown tables and JSON arrays
- **TLD Preferences**: Default top 3 (`.com`, `.io`, `.ai`) + customizable chips (`.co`, `.dev`, `.app`, `.org`, `.xyz`, etc.).
- **⚡ Smart Variations Generator**: 1-click generation of startup-friendly prefixes (`get`, `try`, `use`, `go`, `join`, `my`, `hey`) and suffixes (`app`, `hq`, `base`, `hub`, `flow`, `ly`, `ify`, `lab`, `stack`, `pro`).

### 📊 Dashboard & Productivity
- **Instant Filtering & Dashboard**: Filter tabs for Available, All, For Sale, and Starred domains.
- **🌟 Starred / Shortlist Favorites**: Bookmark favorite domains with local persistence and export options.
- **🛒 Direct Registrar Integration**: "Continue" button with dropdown to register domains on GoDaddy, Hostinger, Spaceship, Domain.com, and Namecheap.
- **🏷️ Aftermarket "Buy / Offer"**: Direct links to secondary marketplaces (Afternic, Sedo, Dan.com, GoDaddy) for for-sale domains.
- **🔍 Domain Inspection Tools**: 1-click WHOIS lookup and Wayback Machine archive history for registered domains.
- **One-click "Copy Available" / "Copy Starred"** buttons and individual copy buttons.
- **Export to `.txt` report** with timestamp, prompt metadata, and domain status.
- **Global Keyboard Shortcut**: `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows/Linux).
- **100% Client-Side**: All checks, sessions, and storage run locally in your browser.
