# iOS Setup Instructions

Since Xcode project files are binary/complex, here's how to set up the iOS project:

## Quick Setup (5 minutes)

### Step 1: Create Xcode Project

1. Open Xcode
2. **File** → **New** → **Project**
3. Choose **iOS** → **App** → **Next**
4. Configure:
   - **Product Name:** `SuperApp`
   - **Team:** (select your team or "None")
   - **Organization Identifier:** `com.example`
   - **Bundle Identifier:** (auto-filled as `com.example.SuperApp`)
   - **Interface:** **Storyboard** ⚠️ (Important!)
   - **Language:** **Swift**
   - **Storage:** ❌ Uncheck "Use Core Data"
   - **Tests:** ❌ Uncheck "Include Tests"
5. **Save location:** Navigate to `/Users/nickyball/works/playground/hello-host-app/ios/`
6. Click **Create**

### Step 2: Remove Auto-Generated Files

Xcode created some default files we don't need. In Xcode's Project Navigator:

1. **Delete** these files (Right-click → Delete → Move to Trash):
   - `ViewController.swift` (in the root, not in App folder)
   - `SceneDelegate.swift` (in the root)
   - `AppDelegate.swift` (in the root)

### Step 3: Add Our Custom Files

Now add our pre-built files to the project:

1. In Xcode, **right-click** on `SuperApp` (the blue project icon) → **Add Files to "SuperApp"...**

2. Navigate to: `/Users/nickyball/works/playground/hello-host-app/ios/SuperApp/`

3. Select these folders:
   - ✅ `App` folder
   - ✅ `MiniApp` folder

4. **Important settings** in the dialog:
   - ✅ Check **"Copy items if needed"** - UNCHECK (we want to reference, not copy)
   - ✅ **"Create groups"** - SELECT THIS (not "folder references")
   - ✅ **"Add to targets"** - Check "SuperApp"

5. Click **Add**

### Step 4: Add Mini-App Resources

After building the mini-apps, add them to Xcode:

1. First, build the mini-apps:
   ```bash
   cd /Users/nickyball/works/playground/hello-host-app
   ./build-mini-apps.sh
   ```

2. In Xcode, **right-click** on `SuperApp` → **Add Files to "SuperApp"...**

3. Navigate to: `/Users/nickyball/works/playground/hello-host-app/ios/SuperApp/Resources/`

4. Select:
   - ✅ `app1` folder
   - ✅ `app2` folder

5. **Important settings:**
   - ✅ **"Create folder references"** - SELECT THIS (folders should be blue, not yellow)
   - ✅ **"Add to targets"** - Check "SuperApp"

6. Click **Add**

### Step 5: Configure Info.plist

The `Info.plist` we created has the right settings, but make sure it's selected:

1. Click on `SuperApp` project (blue icon at top)
2. Select **SuperApp** target
3. Go to **Info** tab
4. Verify the custom Info.plist location points to `SuperApp/App/Info.plist`

### Step 6: Remove Main Storyboard Requirement

Since we're creating UI programmatically:

1. Click on `SuperApp` project → **SuperApp** target → **Info** tab
2. Find **"Main storyboard file base name"** → Delete this entry (click minus button)
3. Under **"Application Scene Manifest"** → **"Scene Configuration"** → **"Application Session Role"** → **"Item 0"**
4. Delete **"Storyboard Name"** if it exists

### Step 7: Build and Run

1. Select a simulator (e.g., iPhone 15)
2. Click **Run** (▶️) or press `Cmd+R`
3. The app should launch with two buttons to load mini-apps!

## Troubleshooting

### "No such module" errors
- Clean build folder: **Product** → **Clean Build Folder** (`Cmd+Shift+K`)
- Rebuild: `Cmd+B`

### Mini-apps not loading
- Check that `app1` and `app2` folders are **blue** (folder references), not yellow
- Verify they're in **Build Phases** → **Copy Bundle Resources**

### White screen
- Check Xcode console for errors
- Use Safari Web Inspector: **Develop** → **Simulator** → **SuperApp** → **WebView**

## Alternative: Command Line Approach

If you prefer command line, I can create a script to generate the Xcode project automatically using `xcodegen`. Let me know!
