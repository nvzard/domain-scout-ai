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

### Host Permissions Justification (`https://cloud.instantdomainsearch.com/*`)
```
Required to query real-time domain availability, registration status, and aftermarket marketplace pricing via the InstantDomainSearch bulk check API.
```

### Storage Permission Justification (`storage`)
```
Used strictly on the client side to remember user input, selected TLD preferences, and starred domain bookmarks across browser sessions.
```

### User Data Collection
- **Does this extension collect user data?** `No` (Select "I do not collect or use user data").
- **Account required?** `No`.

---

## 🎨 Asset Requirements

| Platform | Asset | Size | Source in Project |
| :--- | :--- | :--- | :--- |
| **All** | Extension Icon | 128 x 128 px | `src/icons/icon-128.png` |
| **Chrome** | Small Promo Tile (optional) | 440 x 280 px | PNG / JPEG |
| **Chrome** | Screenshot 1 (Search Results) | 1280 x 800 px (or 640 x 400) | PNG |
| **Firefox** | Add-on Icon | 64 x 64 px | `src/icons/icon-48.png` or `icon-128.png` |

---

## 🌐 Publishing Portals

1. **Google Chrome Web Store Dashboard:**
   👉 https://chrome.google.com/webstore/devconsole/
   - Click **"New Item"** -> Upload `packages/domain-scout-chrome-v1.0.1.zip`
   - Paste the Store Listing details above -> Submit for review.

2. **Mozilla Firefox Add-on Developer Hub (AMO):**
   👉 https://addons.mozilla.org/developers/
   - Click **"Submit a New Add-on"** -> Upload `packages/domain-scout-firefox-v1.0.1.zip`
   - Paste the Summary/Description above -> Submit for review.
