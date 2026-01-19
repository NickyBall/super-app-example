# Quick Start Guide - Remote Loading Super App

## ✅ Project Switched to Remote Loading

**Problem Solved:** No more Xcode folder reference conflicts!

**New Approach:** Mini-apps are loaded from an HTTP server instead of being bundled.

---

## 🚀 Get Started in 3 Steps

### 1. Start HTTP Server

```bash
cd /Users/nickyball/works/playground/hello-host-app
./serve-mini-apps.sh
```

**Keep this running!** You should see:
```
🌐 Starting Mini-Apps HTTP Server...
Server will run on:
  - iOS:       http://localhost:8080/mini-apps
  - Android:   http://10.0.2.2:8080/mini-apps
```

### 2. Fix iOS Xcode Project

Your Xcode project has the **"No such module 'UIKit'"** error. Follow these steps:

```bash
# Delete corrupted project
rm -rf ios/SuperApp/SuperApp.xcodeproj

# Then follow: XCODE_FIX.md
```

See **[XCODE_FIX.md](XCODE_FIX.md)** for detailed instructions to recreate the project.

### 3. Run Apps

**Android:**
```bash
# Open in Android Studio
open -a "Android Studio" android/

# Or use command line
cd android && ./gradlew installDebug
```

**iOS:**
```bash
# After fixing the project
open ios/SuperApp/SuperApp.xcodeproj
# Select simulator and press Cmd+R
```

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **[XCODE_FIX.md](XCODE_FIX.md)** | Fix "No such module UIKit" error |
| **[REMOTE_LOADING.md](REMOTE_LOADING.md)** | Remote loading setup & troubleshooting |
| **[README.md](README.md)** | Original project documentation |
| **[shared/BRIDGE_COMMUNICATION.md](shared/BRIDGE_COMMUNICATION.md)** | Bridge API reference |

---

## 🔍 What Changed

### Before (Bundled Approach)
```
❌ Mini-apps bundled in native app
❌ Xcode folder reference issues
❌ Must rebuild native app to update mini-apps
```

### Now (Remote Approach)
```
✅ Mini-apps loaded from HTTP server
✅ No Xcode build conflicts
✅ Update mini-apps without rebuilding native apps
✅ Hot reload with Vite dev server
```

---

## 🛠️ Development Tips

### Hot Reload During Development

Instead of rebuilding, use Vite dev server:

```bash
cd mini-apps/demo-app1
npm run dev
# Runs on http://localhost:5173
```

Then temporarily change the URL in native code:
```kotlin
// Android: MiniAppWebView.kt
val baseUrl = "http://10.0.2.2:5173"
```

```swift
// iOS: MiniAppWebView.swift
let baseURL = "http://localhost:5173"
```

Now React changes appear instantly!

---

## ⚠️ Current Status

- ✅ Android code updated for remote loading
- ✅ iOS code updated for remote loading
- ✅ HTTP server script created
- ✅ Mini-apps built and ready
- ⚠️ iOS Xcode project needs to be recreated (see XCODE_FIX.md)

---

## 🎯 Next Steps

1. **Start HTTP server:** `./serve-mini-apps.sh`
2. **Fix iOS project:** Follow `XCODE_FIX.md`
3. **Run Android:** Should work immediately
4. **Run iOS:** After fixing project
5. **See mini-apps load from server!**

---

**Need Help?**
- iOS build issues → See [XCODE_FIX.md](XCODE_FIX.md)
- Remote loading issues → See [REMOTE_LOADING.md](REMOTE_LOADING.md)
- Bridge API questions → See [shared/BRIDGE_COMMUNICATION.md](shared/BRIDGE_COMMUNICATION.md)
