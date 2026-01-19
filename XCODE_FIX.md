# Fix: "No such module 'UIKit'" Error

## Problem
Xcode can't find UIKit, which means the project configuration is corrupted.

## Solution: Recreate Xcode Project

### Step 1: Delete Corrupted Project

```bash
rm -rf /Users/nickyball/works/playground/hello-host-app/ios/SuperApp/SuperApp.xcodeproj
```

### Step 2: Create Fresh Project in Xcode

1. **Open Xcode**
2. **File** → **New** → **Project**
3. Select **iOS** → **App** → **Next**
4. Configure:
   - **Product Name:** `SuperApp`
   - **Team:** (select your team or "None")
   - **Organization Identifier:** `com.example`
   - **Interface:** **UIKit App Delegate** ⚠️ (CRITICAL! NOT SwiftUI!)
   - **Language:** **Swift**
   - **Storage:** ❌ Uncheck "Use Core Data"
   - **Tests:** ❌ Uncheck "Include Tests"
5. **Save to:** `/Users/nickyball/works/playground/hello-host-app/ios/`
6. Click **Create**

### Step 3: Replace Auto-Generated Files

Xcode created default files. We need to use our custom ones:

1. In Xcode **Project Navigator**, **DELETE** these files (Right-click → Delete → Move to Trash):
   - `ViewController.swift` (auto-generated)
   - `SceneDelegate.swift` (auto-generated)
   - `AppDelegate.swift` (auto-generated)

2. **Add our custom files:**
   - Right-click on `SuperApp` folder (yellow) → **Add Files to "SuperApp"...**
   - Navigate to: `/Users/nickyball/works/playground/hello-host-app/ios/SuperApp/SuperApp/`
   - **Select ALL 5 Swift files:**
     - ✅ `AppDelegate.swift`
     - ✅ `SceneDelegate.swift`
     - ✅ `ViewController.swift`
     - ✅ `JSBridge.swift`
     - ✅ `MiniAppWebView.swift`
   - Make sure **"Add to targets: SuperApp"** is checked
   - Click **Add**

3. **Add Info.plist:**
   - Same process, add `Info.plist` to the project
   - OR manually configure in Xcode:
     - Click **SuperApp** project → **SuperApp** target → **Build Settings**
     - Search for **"Info.plist File"**
     - Set to: `SuperApp/Info.plist`

### Step 4: Verify & Build

1. **Clean Build Folder:** Product → Clean Build Folder (`Cmd+Shift+K`)
2. **Build:** Product → Build (`Cmd+B`)
3. If successful, you'll see "Build Succeeded"

### Step 5: Run the App

1. Select **iPhone 15** simulator (or any iOS device)
2. Click **Run** (▶️) or press `Cmd+R`

---

## Before Running: Start HTTP Server

The app now loads mini-apps remotely, so you need the server running:

```bash
cd /Users/nickyball/works/playground/hello-host-app
./serve-mini-apps.sh
```

Keep this terminal open while testing!

---

## Verification Checklist

✅ Xcode project created with **UIKit App Delegate** (not SwiftUI)
✅ All 5 Swift files added to project
✅ All files have **Target Membership: SuperApp** checked
✅ Info.plist configured
✅ Build succeeds without errors
✅ HTTP server running on port 8080
✅ App launches and shows two buttons

---

## Still Having Issues?

### Can't create UIKit project?

Make sure you select **"UIKit App Delegate"** under the Interface dropdown. If you don't see this option, you might have an old Xcode version. Try:
- **iOS** → **App** → In the interface dropdown, look for "Storyboard" option (this uses UIKit)

### Files not compiling?

Check **Target Membership:**
1. Click on any `.swift` file
2. In **File Inspector** (right panel)
3. Under **Target Membership**, check that **SuperApp** is checked

### Import errors?

Make sure you're using **Swift** (not Objective-C) and iOS deployment target is 14.0+.

---

## Quick Reference: Project Structure

```
ios/SuperApp/
├── SuperApp.xcodeproj/        ← Create this via Xcode GUI
└── SuperApp/
    ├── AppDelegate.swift      ← Add to project
    ├── SceneDelegate.swift    ← Add to project
    ├── ViewController.swift   ← Add to project
    ├── JSBridge.swift        ← Add to project
    ├── MiniAppWebView.swift  ← Add to project
    ├── Info.plist            ← Add to project
    └── Assets.xcassets/      ← Auto-created by Xcode
```

All files are ready - you just need to create the `.xcodeproj` via Xcode GUI and add the files!
