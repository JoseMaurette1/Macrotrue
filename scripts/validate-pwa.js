#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const errors = [];
const checks = [];

console.log("🔍 Validating PWA Setup...\n");

const basePath = path.join(__dirname, "..", "public");
const srcPath = path.join(__dirname, "..", "src");

function check(name, exists) {
  if (exists) {
    console.log(`✅ ${name}`);
    checks.push(true);
  } else {
    console.error(`❌ ${name} - MISSING`);
    errors.push(name);
    checks.push(false);
  }
}

const serviceWorker = fs.existsSync(path.join(basePath, "sw.js"));
check("Service Worker (sw.js)", serviceWorker);

const workbox = fs.existsSync(path.join(basePath, "workbox-*.js").replace("*", "c18c662b"));
check("Workbox Runtime", workbox);

const fallback = fs.existsSync(path.join(basePath, "fallback-*.js").replace("*", "ce627215c0e4a9af"));
check("Fallback Page Handler", fallback);

const manifest = fs.existsSync(path.join(srcPath, "app", "manifest.ts"));
check("Manifest (src/app/manifest.ts)", manifest);

const appleIcon = fs.existsSync(path.join(srcPath, "app", "apple-icon.tsx"));
check("Apple Icon Generator (src/app/apple-icon.tsx)", appleIcon);

const icon = fs.existsSync(path.join(srcPath, "app", "icon.tsx"));
check("Icon Generator (src/app/icon.tsx)", icon);

const offlinePage = fs.existsSync(path.join(srcPath, "app", "offline", "page.tsx"));
check("Offline Page (src/app/offline/page.tsx)", offlinePage);

const pwaProvider = fs.existsSync(path.join(srcPath, "components", "pwa", "PWAProvider.tsx"));
check("PWA Provider Component", pwaProvider);

const installPrompt = fs.existsSync(path.join(srcPath, "components", "pwa", "InstallPrompt.tsx"));
check("Install Prompt Component", installPrompt);

const onlineStatus = fs.existsSync(path.join(srcPath, "components", "pwa", "OnlineStatus.tsx"));
check("Online Status Component", onlineStatus);

const iconsDir = fs.existsSync(path.join(basePath, "icons"));
const iconFiles = iconsDir ? fs.readdirSync(path.join(basePath, "icons")) : [];
const hasAllIcons = iconFiles.length >= 10;
check("Icon Set (10+ SVGs in public/icons/)", hasAllIcons);

const swSize = serviceWorker ? fs.statSync(path.join(basePath, "sw.js")).size : 0;
const swSizeValid = swSize > 0 && swSize < 50000;
console.log(
  `ℹ️  Service Worker Size: ${(swSize / 1024).toFixed(2)} KB ${swSizeValid ? "(OK)" : "(TOO LARGE)"}`
);

console.log(`\n${"=".repeat(50)}`);

const passed = checks.filter((c) => c).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`\n📊 Results: ${passed}/${total} checks passed (${percentage}%)\n`);

if (errors.length > 0) {
  console.error(`❌ Failed checks:\n`);
  errors.forEach((err) => console.error(`   - ${err}`));
  process.exit(1);
}

console.log("✅ All PWA checks passed!");
console.log("\n🧪 Next Steps:");
console.log("   1. Run 'npm run start' to test locally");
console.log("   2. Use ngrok for mobile testing: ngrok http 3000");
console.log("   3. Run Lighthouse audit in Chrome DevTools");
console.log("   4. See PWA_SETUP.md for detailed instructions\n");

process.exit(0);
