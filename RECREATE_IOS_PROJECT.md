# How to Recreate iOS Project Correctly

## The Problem

Your Xcode project is configured for **macOS** instead of **iOS**. That's why you're getting:
- "Cannot find type 'UIViewRepresentable'"
- "No such module 'UIKit'"

## Solution: Delete and Recreate

### 1. Delete Current Project

```bash
rm -rf /Users/nickyball/works/playground/hello-host-app/ios/SuperApp/SuperApp.xcodeproj
```

### 2. Create NEW iOS Project in Xcode

1. **Open Xcode**
2. **File → New → Project**
3. **IMPORTANT: Select "iOS" at the top** (NOT macOS!)
4. Choose **"App"** → Click **Next**
5. Configure:
   - Product Name: `SuperApp`
   - Team: (select or None)
   - Organization Identifier: `com.example`
   - **Interface: SwiftUI** ✅ (select SwiftUI this time!)
   - Language: Swift
   - Storage: ❌ Uncheck "Use Core Data"
   - Tests: ❌ Uncheck "Include Tests"
6. **Save to:** `/Users/nickyball/works/playground/hello-host-app/ios/`
7. Click **Create**

### 3. Replace Auto-Generated Files

Xcode creates default files. Delete them and add ours:

1. In Xcode, **delete** these files (Right-click → Delete → Move to Trash):
   - `ContentView.swift` (the auto-generated one)
   - `SuperAppApp.swift` (the auto-generated one)

2. **Add our files:**
   - Right-click on `SuperApp` folder → **Add Files to "SuperApp"...**
   - Navigate to: `/Users/nickyball/works/playground/hello-host-app/ios/SuperApp/SuperApp/`
   - Select ALL `.swift` files:
     - `SuperAppApp.swift`
     - `ContentView.swift`
     - `MiniAppWebViewContainer.swift`
     - `JSBridge.swift`
   - Make sure **"Add to targets: SuperApp"** is checked ✅
   - Click **Add**

### 4. Build and Run

1. Select **iPhone 17 Pro** simulator (in the top toolbar)
2. Press **Cmd+R** to build and run

Should work now!

---

## Or Use Command Line (Easier!)

Since the Xcode project is problematic, just use the command line script:

```bash
# Start HTTP server (in one terminal)
./serve-mini-apps.sh

# Run iOS app (in another terminal)
./run-ios.sh
```

This bypasses Xcode GUI completely and works perfectly!
