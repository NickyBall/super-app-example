# Remote Loading - Super App Setup

## Overview

The project has been **switched to remote loading**. Mini-apps are now loaded from an HTTP server instead of being bundled in the native apps.

### Benefits:
- ✅ **No Xcode build conflicts** (no folder reference issues)
- ✅ **Hot reload** - Update mini-apps without rebuilding native apps
- ✅ **Real-world architecture** - Simulates production super apps
- ✅ **Easier development** - Run Vite dev server for instant updates

---

## Quick Start

### 1. Build Mini-Apps (One Time)

```bash
cd /Users/nickyball/works/playground/hello-host-app
./build-mini-apps.sh
```

This builds the mini-apps to: `android/app/src/main/assets/mini-apps/`

### 2. Start HTTP Server

```bash
./serve-mini-apps.sh
```

You should see:
```
🌐 Starting Mini-Apps HTTP Server...

Server will run on:
  - Local:     http://localhost:8080/mini-apps
  - iOS:       http://localhost:8080/mini-apps
  - Android:   http://10.0.2.2:8080/mini-apps (emulator)
```

**Keep this terminal running!**

### 3. Run Native Apps

#### **Android:**
1. Open `android/` folder in Android Studio
2. Run on emulator or device
3. Mini-apps will load from `http://10.0.2.2:8080/mini-apps/`

#### **iOS:**
1. Open `ios/SuperApp/SuperApp.xcodeproj` in Xcode
2. Delete references to `SuperAppApp.swift` and `ContentView.swift` if they exist
3. Make sure all 5 `.swift` files are added to target:
   - `AppDelegate.swift`
   - `SceneDelegate.swift`
   - `ViewController.swift`
   - `JSBridge.swift`
   - `MiniAppWebView.swift`
4. Run on simulator
5. Mini-apps will load from `http://localhost:8080/mini-apps/`

---

## How It Works

### Architecture

```
┌──────────────────────┐
│  HTTP Server (8080)  │
│  └─ mini-apps/       │
│     ├─ app1/         │
│     └─ app2/         │
└──────────────────────┘
          ▲
          │ HTTP Request
          │
┌─────────┴────────────┐
│   Native Host App    │
│  ┌────────────────┐  │
│  │    WebView     │  │
│  │  (loads URL)   │  │
│  └────────────────┘  │
└──────────────────────┘
```

### URL Configuration

**Android** (`MiniAppWebView.kt`):
```kotlin
val baseUrl = "http://10.0.2.2:8080/mini-apps"  // Emulator
// For real device: "http://YOUR_COMPUTER_IP:8080/mini-apps"
```

**iOS** (`MiniAppWebView.swift`):
```swift
let baseURL = "http://localhost:8080/mini-apps"  // Simulator
// For real device: "http://YOUR_COMPUTER_IP:8080/mini-apps"
```

---

## Development Workflow

### Option 1: Vite Dev Server (Recommended)

For instant hot reload during development:

```bash
# Terminal 1: Start Vite dev server for app1
cd mini-apps/demo-app1
npm run dev
# Runs on http://localhost:5173
```

Then **temporarily change** the base URL in native code:
```kotlin
// Android
val baseUrl = "http://10.0.2.2:5173"  // Points to Vite

// iOS
let baseURL = "http://localhost:5173"  // Points to Vite
```

Now changes to React code will instantly appear in the native app!

### Option 2: Build + Serve (Production-like)

```bash
# Terminal 1: Rebuild when you make changes
cd mini-apps/demo-app1
npm run build

# Terminal 2: Serve built files
cd /Users/nickyball/works/playground/hello-host-app
./serve-mini-apps.sh
```

---

## Troubleshooting

### Mini-App Not Loading

**Check server is running:**
```bash
curl http://localhost:8080/mini-apps/app1/index.html
```

Should return HTML content.

**Android Emulator:**
- ✅ Use `http://10.0.2.2:8080` (NOT `localhost`)
- ✅ Check `android:usesCleartextTraffic="true"` in AndroidManifest.xml

**iOS Simulator:**
- ✅ Use `http://localhost:8080`
- ✅ Check `NSAppTransportSecurity` in Info.plist allows local networking

**Real Devices:**
- 📱 Find your computer's IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
- 📱 Use `http://YOUR_IP:8080/mini-apps`
- 📱 Make sure device is on same WiFi network

### "No such module 'UIKit'" in Xcode

This means Xcode project is misconfigured. The simplest fix:

1. **Close Xcode**
2. **Delete the project:**
   ```bash
   rm -rf ios/SuperApp/SuperApp.xcodeproj
   ```
3. **Create NEW project in Xcode:**
   - File → New → Project
   - iOS → App
   - Interface: **UIKit App Delegate** (NOT SwiftUI!)
   - Save to `ios/`
4. **Delete auto-generated files** (ViewController.swift, etc.)
5. **Add our 5 Swift files** to the project
6. **Build and run**

### Blank Screen / Not Loading

**Check browser console** (for debugging):
- iOS: Safari → Develop → Simulator → SuperApp → index.html
- Android: Chrome → `chrome://inspect` → Select WebView

**Common issues:**
- Server not running
- Wrong URL (check logs in Xcode console / logcat)
- CORS issues (shouldn't happen with Python server)

---

## Configuration

### Change Server Port

Edit `serve-mini-apps.sh`:
```bash
PORT=3000  # Change this
```

Then update native code to match:
```kotlin
val baseUrl = "http://10.0.2.2:3000/mini-apps"  // Android
```

```swift
let baseURL = "http://localhost:3000/mini-apps"  // iOS
```

### Production Deployment

For production, deploy mini-apps to a CDN and update:

```kotlin
// Android
val baseUrl = "https://your-cdn.com/mini-apps"
```

```swift
// iOS
let baseURL = "https://your-cdn.com/mini-apps"
```

Remove or restrict `NSAllowsArbitraryLoads` to only allow your CDN domain.

---

## Comparison: Bundled vs Remote

| Feature | Bundled | Remote (Current) |
|---------|---------|------------------|
| **Offline** | ✅ Works | ❌ Needs internet |
| **Load Speed** | ✅ Fast | ⚠️ Depends on network |
| **Updates** | ❌ Needs app release | ✅ Instant |
| **App Size** | ❌ Larger | ✅ Smaller |
| **Development** | ❌ Rebuild each time | ✅ Hot reload |
| **Xcode Issues** | ❌ Folder conflicts | ✅ No bundled resources |

---

## Next Steps

1. ✅ Run `./serve-mini-apps.sh`
2. ✅ Fix iOS Xcode project (delete and recreate if needed)
3. ✅ Run both native apps
4. ✅ See mini-apps load from HTTP server
5. 🚀 Try editing mini-app code and rebuilding to see updates!

---

**The remote approach is now set up!** This solves the Xcode build issue and gives you a more realistic super app architecture.
