# Android SuperApp - Development Guide

This Android app loads mini-apps from **Vite dev servers** for hot-reload development.

## Architecture

- **Host App**: Native Android (Kotlin) with WebView containers
- **Mini Apps**: React/TypeScript apps served by Vite dev servers
- **Communication**: JavaScript Bridge (`window.AndroidBridge`)

## Setup & Running

### 1. Start the Mini-App Dev Servers

You need to run both mini-apps on different ports:

```bash
# Terminal 1 - Demo App 1 (Shopping App)
cd /Users/nickyball/works/playground/hello-host-app/mini-apps/demo-app1
npm run dev
# Should run on http://localhost:5173
```

```bash
# Terminal 2 - Demo App 2 (Payment App)
cd /Users/nickyball/works/playground/hello-host-app/mini-apps/demo-app2
npm run dev -- --port 5174
# Should run on http://localhost:5174
```

### 2. Run the Android App

**Option A: Android Studio**
```bash
# Open the project
open -a "Android Studio" /Users/nickyball/works/playground/hello-host-app/android/SuperApp

# Then click Run (▶️) in Android Studio
```

**Option B: Command Line**
```bash
cd /Users/nickyball/works/playground/hello-host-app/android/SuperApp

# Install on emulator/device
./gradlew installDebug

# Or build APK only
./gradlew assembleDebug
```

## How It Works

### URL Mapping (MainActivity.kt:136-140)
```kotlin
val url = when (appName) {
    "demo-app1" -> "http://10.0.2.2:5173"  // Shopping App
    "demo-app2" -> "http://10.0.2.2:5174"  // Payment App
    else -> "http://10.0.2.2:5173"
}
```

**Note**: `10.0.2.2` is how Android emulator accesses `localhost` on your Mac.

### JavaScript Bridge

**From React (useBridge.ts) → Native:**
```typescript
window.AndroidBridge.postMessage(JSON.stringify({ type, data }))
```

**From Native → React:**
```typescript
window.receiveFromNative({ type, data })
```

## Testing on Physical Device

If testing on a real Android device (not emulator):

1. Connect device and Mac to the same WiFi network
2. Find your Mac's IP address:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
3. Update MainActivity.kt to use your Mac's IP instead of `10.0.2.2`:
   ```kotlin
   "demo-app1" -> "http://192.168.x.x:5173"  // Replace with your IP
   ```

## Troubleshooting

### Mini-app won't load
- ✅ Check Vite dev servers are running
- ✅ Check correct ports (5173, 5174)
- ✅ For emulator, use `10.0.2.2` not `localhost`
- ✅ For device, use Mac's WiFi IP address

### Bridge not working
- ✅ Check WebView JavaScript is enabled (MiniAppWebView.kt:23)
- ✅ Check bridge is injected (MiniAppWebView.kt:29-32)
- ✅ Check AndroidManifest has INTERNET permission

### Can't connect from device
- ✅ Same WiFi network
- ✅ Mac firewall allows connections on ports 5173, 5174
- ✅ Using Mac's IP address, not `localhost` or `10.0.2.2`

## Key Files

- `MainActivity.kt` - Main activity with mini-app switching
- `MiniAppWebView.kt` - Custom WebView with bridge injection
- `JavaScriptBridge.kt` - Native ↔️ JS communication handler
- `AndroidManifest.xml` - Internet permission + cleartext traffic
