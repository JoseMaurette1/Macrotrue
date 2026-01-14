# PWA Setup & Testing Guide

This project has been converted into a Progressive Web App (PWA) using `@ducanh2912/next-pwa`.

## 📱 Features Implemented

1. **Service Worker**: Caches assets and API responses for offline use.
2. **Web Manifest**: Defines app identity, icons, and display mode.
3. **Install Prompt**: Custom UI to prompt users to install the app.
4. **Offline Support**: Dedicated offline page when network is unavailable.
5. **Mobile Optimization**: Safe area padding, touch target sizing, and iOS-specific meta tags.
6. **Icons**: Full set of responsive icons for Android and iOS.

## 🧪 How to Test

### 1. Build and Run

PWA features work best in production mode.

```bash
npm run build
npm start
```

### 2. Verify Service Worker

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. You should see a service worker activated with source `sw.js`

### 3. Verify Manifest

1. In **Application** tab, click **Manifest**
2. You should see the App Name, Short Name, Start URL, and Icons
3. No errors should be reported

### 4. Test Offline Mode

1. In DevTools, go to **Network** tab
2. Change "No throttling" dropdown to **Offline**
3. Reload the page
4. You should see the custom offline page (if visiting a new page) or the cached page (if revisiting)

### 5. Test Installation (Desktop)

1. Look for the "Install" icon in the Chrome address bar (right side)
2. Or use the custom install prompt that appears at the bottom of the screen (if conditions are met)

### 6. Test on Mobile

To test on mobile, you need to access the app over HTTPS or localhost (with port forwarding).

**Using ngrok (Recommended):**
1. `npm install -g ngrok`
2. `ngrok http 3000`
3. Open the https URL on your mobile phone

**Android (Chrome):**
1. You should see a "Add Macrotrue to Home screen" banner
2. Or tap the menu (⋮) -> Install App

**iOS (Safari):**
1. Tap the Share button
2. Scroll down and tap "Add to Home Screen"
3. The app should launch in standalone mode (no browser UI)

## 🛠 Configuration

PWA configuration is located in:
- `next.config.ts`: Service worker and caching strategy
- `src/app/manifest.ts`: App identity and icons
- `src/app/layout.tsx`: Meta tags and PWA provider
- `src/components/pwa/`: UI components (InstallPrompt, OnlineStatus)

## 🎨 Customizing

- **Icons**:
  - **iOS/Favicon**: Dynamically generated via `src/app/apple-icon.tsx` and `src/app/icon.tsx`. Modify these files to change the logo.
  - **Android/Manifest**: SVG icons in `public/icons/`. Replace these if you have a custom logo (keep the filenames/sizes).
- **Colors**: Theme color is set in `src/app/manifest.ts` and `src/app/layout.tsx`.
- **Install Prompt**: Modify `src/components/pwa/InstallPrompt.tsx` to change the UI.
