# Privacy Policy for Domain Scout AI

**Last Updated:** September 3, 2026

**Domain Scout AI** ("the Extension", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how Domain Scout AI handles information when you use our browser extension for Google Chrome, Mozilla Firefox, and other Chromium-based browsers.

---

## 1. Overview & Core Principle

Domain Scout AI is designed with a **Privacy-First, Client-Side Architecture**. 
- We **do not** collect, store, sell, or track your personal identifiable information (PII).
- We **do not** track your browsing history or keystrokes outside of the extension popup.
- We **do not** operate intermediate proxy servers that capture your searches, prompts, or API keys.

---

## 2. Information We Handle and How It Is Used

### A. User Preferences & Bookmarks (Stored Locally)
* **What is stored:** Selected Top-Level Domains (TLDs), chosen AI provider settings, custom API keys, and starred/favorited domain lists.
* **Where it is stored:** Exclusively on your local device via the standard `chrome.storage.local` / `browser.storage.local` API.
* **How it is used:** To preserve your settings, starred domains, and preferences across browser sessions.
* **Data Retention:** This data remains on your local device until you clear extension data or uninstall the extension.

### B. Domain Search Queries
* **What is processed:** Domain names and keywords you type or paste into the search box.
* **How it is handled:** Real-time domain availability queries are sent directly from your browser client to the domain lookup service ([InstantDomainSearch API](https://instantdomainsearch.com/)).
* **Logging:** We do not log, retain, or monitor your search queries.

### C. AI Ideation & Prompts (AI Scout Mode)
* **What is processed:** Startup or product concepts you provide when using AI Scout mode, along with your configured API key (if using cloud AI providers like OpenAI, OpenRouter, Google Gemini, or Groq).
* **How it is handled:** 
  - If using **Smart Brain (Offline)**: All processing occurs 100% locally on your machine with zero network transmission.
  - If using **Cloud AI Providers**: Your prompt and API key are sent directly from your browser to the chosen provider's official API endpoint (`api.openai.com`, `openrouter.ai`, `generativelanguage.googleapis.com`, or `api.groq.com`).
* **Third-Party AI Policies:** Direct requests to AI providers are governed by their respective privacy policies:
  - [OpenRouter Privacy Policy](https://openrouter.ai/privacy)
  - [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy)
  - [Google Privacy Policy](https://policies.google.com/privacy)
  - [Groq Privacy Policy](https://groq.com/privacy-policy/)

---

## 3. Permissions Justification

Domain Scout AI requests only minimal, strictly necessary browser permissions:
* `storage`: Required to store your settings, selected TLDs, starred domain shortlist, and API keys locally in your browser.
* `declarativeNetRequest`: Required to ensure domain lookup requests sent to InstantDomainSearch preserve valid request origin metadata without leakage of user data.
* `Host Permissions` (`https://cloud.instantdomainsearch.com/*`, `https://instantdomainsearch.com/*`, `https://openrouter.ai/*`, `https://*.openai.com/*`, `https://generativelanguage.googleapis.com/*`, `https://api.groq.com/*`): Required exclusively to make direct API requests from the extension popup to perform domain availability checks and fetch AI naming suggestions.

---

## 4. Third-Party Data Sharing & Selling

* We **never** sell, rent, monetize, or trade your data.
* We **never** transfer user data to third parties for advertising or credit scoring.
* We **never** use your searches or prompts for training AI models.

---

## 5. Security & Data Protection

* All external network communications (API requests) are strictly transmitted over encrypted HTTPS/TLS connections.
* API keys and preferences are kept inside the browser's sandboxed local extension storage.

---

## 6. Your Rights & Data Control

You have full control over your data:
* You can remove any saved API keys or starred domains at any time directly within the extension UI.
* Uninstalling the extension automatically removes all locally stored data from your browser.

---

## 7. Changes to This Privacy Policy

We may update this Privacy Policy periodically to reflect changes in extension features or applicable regulations. Any updates will be published with a revised "Last Updated" date.

---

## 8. Contact Us

If you have questions, feedback, or concerns regarding this Privacy Policy or the practices of Domain Scout AI, please open an issue or reach out via:

* **GitHub Repository:** [https://github.com/nvzard/domain-scout-ai](https://github.com/nvzard/domain-scout-ai)
* **Developer Contact:** [https://github.com/nvzard](https://github.com/nvzard)
