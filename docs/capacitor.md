# Capacitor Setup — ParkSmart

## Architecture

ParkSmart uses Next.js API routes that require a server (LTA API key, caching). It cannot be
deployed as a fully-static app. Capacitor is configured to always load content from a remote
server URL rather than bundled assets.

```
Android/iOS app (Capacitor)
        │
        └──▶ server.url (configured in capacitor.config.json)
                ├── DEV:  http://10.0.2.2:3000  (host machine's Next.js dev server)
                └── PROD: https://parksmart.vercel.app (or your deployed URL)
```

`cap-shell/index.html` is a minimal fallback page bundled into the native app.
It is only shown if the server URL is unreachable.

---

## Dev Workflow (Android Emulator)

### Prerequisites
- Android Studio installed with an Android Virtual Device (AVD) set up
- Java 17+ in PATH (`java --version`)
- `ANDROID_HOME` / `ANDROID_SDK_ROOT` env var pointing to the SDK

### Run on emulator

**Terminal 1** — Next.js dev server:
```bash
npm run dev
```

**Terminal 2** — Open Android Studio (first time) or sync and run:
```bash
# First time: open in Android Studio and press Run
npm run open:android

# Subsequent times: sync plugins and run directly
npm run cap:sync
npx cap run android
```

> `10.0.2.2` is the Android emulator's alias for the host machine's localhost.
> The Capacitor app hits `http://10.0.2.2:3000` which maps to `http://localhost:3000`
> on your Mac. API routes work exactly as they do in the browser.

---

## Production Workflow

1. Deploy Next.js to Vercel (or Railway):
   ```bash
   vercel --prod
   ```

2. Update `capacitor.config.json` — replace the `server` block:
   ```json
   "server": {
     "url": "https://your-app.vercel.app"
   }
   ```
   Remove `"cleartext": true` (not needed for HTTPS).

3. Sync and build the native app:
   ```bash
   npm run cap:sync
   npm run open:android
   # In Android Studio: Build → Generate Signed APK / AAB
   ```

---

## npm Scripts

| Script | What it does |
|---|---|
| `npm run cap:sync` | `npx cap sync` — copies cap-shell/ to native and updates plugins |
| `npm run cap:copy` | `npx cap copy` — copies cap-shell/ to native (no plugin update) |
| `npm run open:android` | Opens the `android/` project in Android Studio |
| `npm run open:ios` | Opens the `ios/` project in Xcode |

---

## Adding iOS

```bash
npx cap add ios
npm run open:ios
# In Xcode: set signing team, then Product → Run
```

---

## Key Files

| File | Purpose |
|---|---|
| `capacitor.config.json` | Capacitor configuration (appId, webDir, server.url) |
| `cap-shell/index.html` | Minimal fallback page bundled into the native app |
| `android/` | Android Studio project (generated, partially gitignored) |
| `ios/` | Xcode project (generated, partially gitignored) |
