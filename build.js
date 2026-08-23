#!/usr/bin/env node
/**
 * Zero-dependency Cross-Browser Build & Sync Script
 * Generates ready-to-load extension bundles for Chrome and Firefox.
 * 
 * Usage:
 *   node build.js           # Build both Chrome & Firefox distributions
 *   node build.js --watch   # Watch src/ and auto-rebuild on change
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const MANIFESTS_DIR = path.join(ROOT_DIR, 'manifests');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const LEGACY_FIREFOX_DIR = path.join(ROOT_DIR, '..', 'firefox-domain-checker');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursiveSync(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function buildTarget(targetName, manifestFilename) {
  const targetDir = path.join(DIST_DIR, targetName);
  
  // 1. Ensure target directory exists & clean
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 2. Copy all source files from src/
  copyRecursiveSync(SRC_DIR, targetDir);

  // 3. Copy target-specific manifest.json
  const manifestSrc = path.join(MANIFESTS_DIR, manifestFilename);
  const manifestDest = path.join(targetDir, 'manifest.json');
  fs.copyFileSync(manifestSrc, manifestDest);

  console.log(`✓ Built [${targetName.toUpperCase()}] -> ${targetDir}`);
}

function buildAll() {
  const startTime = Date.now();
  console.log('\n📦 Building Domain Scout - Fast Domain Search Extensions...');

  // Ensure icons exist in src/
  const srcIconsDir = path.join(SRC_DIR, 'icons');
  if (!fs.existsSync(srcIconsDir)) {
    fs.mkdirSync(srcIconsDir, { recursive: true });
  }

  // Copy icons from legacy/existing folder if present
  const existingIcons = path.join(LEGACY_FIREFOX_DIR, 'icons');
  if (fs.existsSync(existingIcons)) {
    copyRecursiveSync(existingIcons, srcIconsDir);
  }

  // 1. Build Chrome distribution
  buildTarget('chrome', 'manifest.chrome.json');

  // 2. Build Firefox distribution
  buildTarget('firefox', 'manifest.firefox.json');

  // 3. Sync to legacy root firefox-domain-checker for backward compatibility
  if (fs.existsSync(LEGACY_FIREFOX_DIR)) {
    copyRecursiveSync(path.join(DIST_DIR, 'firefox'), LEGACY_FIREFOX_DIR);
    console.log(`✓ Synced legacy directory -> ${LEGACY_FIREFOX_DIR}`);
  }

  // 4. Package to zip if requested
  if (process.argv.includes('--package')) {
    packageDistributions();
  }

  const elapsed = Date.now() - startTime;
  console.log(`✨ Build completed in ${elapsed}ms!\n`);
}

function packageDistributions() {
  const { execSync } = require('child_process');
  const pkgDir = path.join(ROOT_DIR, 'packages');
  if (!fs.existsSync(pkgDir)) {
    fs.mkdirSync(pkgDir, { recursive: true });
  }

  const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
  const version = pkgJson.version || '1.0.0';

  const chromeZip = path.join(pkgDir, `domain-scout-chrome-v${version}.zip`);
  const firefoxZip = path.join(pkgDir, `domain-scout-firefox-v${version}.zip`);

  if (fs.existsSync(chromeZip)) fs.unlinkSync(chromeZip);
  if (fs.existsSync(firefoxZip)) fs.unlinkSync(firefoxZip);

  execSync(`cd "${path.join(DIST_DIR, 'chrome')}" && zip -rq "${chromeZip}" ./*`);
  execSync(`cd "${path.join(DIST_DIR, 'firefox')}" && zip -rq "${firefoxZip}" ./*`);

  console.log(`🎁 Packaged Chrome -> ${chromeZip}`);
  console.log(`🎁 Packaged Firefox -> ${firefoxZip}`);
}

// Watch mode
if (process.argv.includes('--watch')) {
  buildAll();
  console.log('👀 Watching src/ and manifests/ for changes... (Press Ctrl+C to stop)');

  let debounceTimer = null;
  const triggerRebuild = (eventType, filename) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`\n🔄 File changed (${filename || eventType}). Rebuilding...`);
      buildAll();
    }, 100);
  };

  fs.watch(SRC_DIR, { recursive: true }, triggerRebuild);
  fs.watch(MANIFESTS_DIR, { recursive: true }, triggerRebuild);
} else {
  buildAll();
}
