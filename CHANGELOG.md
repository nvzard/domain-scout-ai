# Changelog

All notable changes to **Domain Scout AI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-09-02

### 🚀 Added
- **AI Scout Mode (Concept-to-Domain Ideator)**:
  - Added new dedicated AI Scout Mode alongside Manual Bulk Checker mode.
  - **Autonomous Multi-Round Reiteration Loop**: Automatically detects registered/taken domains and re-prompts the AI with taken-domain exclusions across iterative rounds until 10 available domains matching the user's concept are discovered.
  - **Multi-Engine Client-Side Support**:
    - `Auto (Recommended)`: Automatically selects the best available engine.
    - `ChatGPT Web Session`: Connects to active browser credentials on `chatgpt.com`.
    - `Chrome Browser AI`: On-device Gemini Nano via `window.ai` / Prompt API (conditionally displayed only on supported Chrome/Chromium browsers; gracefully hidden on Firefox).
    - `Smart Brain (Offline / Instant)`: 100% client-side, zero-latency linguistic root generator using curated category dictionaries (Curation, AI, DevTools, FinTech, Creative).
  - **Inspiration Quick Chips**: 1-click preset prompts for Product Hunt alternatives, AI assistants, Developer tools, Design studios, and FinTech platforms.
  - **Interactive AI Progress Stepper**: Live visual progress card showing round count (`Round 1/3`), current analysis step, and live available domain counters.
  - **AI Discovery Banner**: Summary badge highlighting the original concept prompt, total candidates evaluated, and round iterations.

### 📋 Improved Input Format Support (Manual Mode)
- **ChatGPT Conversational & Markdown List Parsing**:
  - Support for raw numbered lists with markdown formatting (e.g. `1. **LaunchScout** (.com, .io) — SaaS directory`).
  - Automatic extraction of parenthetical TLDs (e.g. `(com / co)`, `(.com, .io, .ai)`).
  - Automatic stripping of list numbers, markdown asterisks, backticks, emojis, bullet points, and explanatory dash notes.
- **Markdown Tables**:
  - Direct parsing of markdown table columns (`| # | Domain Name | TLD | Description |`).
- **JSON Arrays**:
  - Support for pasting raw JSON arrays of strings (`["launchscout.com", "noviqo.io"]`).
- **Legacy Compatibility**:
  - Maintained full backward compatibility for comma-separated and line-break lists.

### 🐛 Fixed
- **OS-Adaptive Keyboard Shortcut Hint**:
  - Fixed hardcoded shortcut label. The action buttons now dynamically detect the platform and display `⌘+Enter` on macOS and `Ctrl+Enter` on Windows/Linux.
- **Cross-Browser Compatibility**:
  - Ensured Chrome-specific built-in AI APIs do not throw or show on Mozilla Firefox.

### 🎨 Branding & UX
- Renamed extension to **Domain Scout AI**.
- Streamlined AI controls bar with fixed default target of 10 available domains for a cleaner, zero-clutter interface.

---

## [1.0.1] - 2026-09-01

### 🚀 Added
- Unified cross-browser build and sync pipeline (`build.js`) for Chrome (Manifest V3) and Firefox (Manifest V3).
- Instant registrar links for GoDaddy, Hostinger, Spaceship, Domain.com, and Namecheap.
- Aftermarket "Buy / Offer" marketplace links for Sedo, Dan.com, Afternic, and GoDaddy.
- 1-click WHOIS lookup and Wayback Machine archive inspection.
- Starred shortlist bookmarks with local storage persistence.
- Export results to `.txt` file with status reports and timestamps.

---

## [1.0.0] - 2026-08-30

### 🚀 Initial Release
- Real-time bulk domain availability checking via InstantDomainSearch.
- Customizable TLD preferences chips (.com, .io, .ai, etc.).
- Startup prefix & suffix variations generator.
- Modern dark mode UI with instant responsive filtering.
