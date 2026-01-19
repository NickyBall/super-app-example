# Super App - Learning Project

A playground project demonstrating **Super App architecture** with native Android (Kotlin) and iOS (Swift) host applications that load React-based mini-apps via WebView.

## What is a Super App?

A super app is a single mobile application that hosts multiple mini-applications (mini-apps). Think of apps like WeChat, Grab, or Gojek - they contain many smaller apps for different services (messaging, payments, shopping, food delivery, etc.) all within one host application.

## Project Structure

```
hello-host-app/
├── android/                    # Android host (Kotlin)
│   └── app/
│       ├── src/main/
│       │   ├── java/com/example/superapp/
│       │   │   ├── MainActivity.kt        # Main launcher activity
│       │   │   ├── MiniAppWebView.kt      # Custom WebView for mini-apps
│       │   │   └── JSBridge.kt            # Bridge for JS ↔ Native communication
│       │   └── assets/mini-apps/          # Built mini-apps go here
│       │       ├── app1/
│       │       └── app2/
│       └── build.gradle.kts
│
├── ios/                        # iOS host (Swift)
│   └── SuperApp/
│       ├── App/
│       │   ├── AppDelegate.swift
│       │   ├── SceneDelegate.swift
│       │   └── ViewController.swift       # Main launcher controller
│       └── MiniApp/
│           ├── MiniAppWebView.swift       # Custom WKWebView for mini-apps
│           └── JSBridge.swift             # Bridge for JS ↔ Native communication
│
├── mini-apps/                  # React mini-applications
│   ├── demo-app1/             # Shopping app demo
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── useBridge.ts   # React hook for native bridge
│   │   │   └── index.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── demo-app2/             # Payment app demo
│       └── (same structure)
│
├── shared/                     # Shared documentation and types
│   ├── bridge-types.ts        # TypeScript types for bridge communication
│   └── BRIDGE_COMMUNICATION.md # Bridge documentation
│
└── README.md
```

## Features Demonstrated

### 🏗️ Architecture
- ✅ Native host containers (Android & iOS)
- ✅ WebView-based mini-app loading
- ✅ Multiple mini-apps with different UIs
- ✅ Switching between mini-apps

### 🌉 Bridge Communication
- ✅ JavaScript → Native messaging
- ✅ Native → JavaScript messaging
- ✅ Type-safe bridge with TypeScript
- ✅ Custom React hook (`useBridge`)

### 🎨 Mini-Apps Included
1. **Shopping App** - Product catalog with cart
2. **Payment App** - Payment method selection

## Getting Started

### Prerequisites

**For Android:**
- Android Studio Arctic Fox or later
- JDK 17
- Android SDK (API 24+)

**For iOS:**
- Xcode 14 or later
- macOS (required for iOS development)
- CocoaPods (optional)

**For Mini-Apps:**
- Node.js 18+ and npm

### Setup Steps

#### 1. Build the Mini-Apps

First, build the React mini-apps:

```bash
# Navigate to demo-app1
cd mini-apps/demo-app1

# Install dependencies
npm install

# Build for production (outputs to android/app/src/main/assets/mini-apps/app1)
npm run build

# Repeat for demo-app2
cd ../demo-app2
npm install
npm run build
```

#### 2. Copy Mini-Apps to iOS (if needed)

For iOS, you need to add the built mini-apps to the Xcode project:

```bash
# Create iOS mini-apps directory if it doesn't exist
mkdir -p ios/SuperApp/Resources

# Copy built apps
cp -r android/app/src/main/assets/mini-apps/app1 ios/SuperApp/Resources/
cp -r android/app/src/main/assets/mini-apps/app2 ios/SuperApp/Resources/
```

Then in Xcode:
1. Right-click on `SuperApp` → Add Files to "SuperApp"
2. Select `ios/SuperApp/Resources/app1` and `app2`
3. Check "Create folder references" (blue folders, not yellow)
4. Add to SuperApp target

#### 3. Run Android App

```bash
cd android

# Using Android Studio:
# - Open the android/ folder
# - Wait for Gradle sync
# - Click Run

# Or using command line:
./gradlew installDebug
```

#### 4. Run iOS App

```bash
cd ios

# Open the project in Xcode
open SuperApp.xcodeproj

# Or use xcodebuild:
xcodebuild -project SuperApp.xcodeproj -scheme SuperApp -destination 'platform=iOS Simulator,name=iPhone 15'
```

## Development Workflow

### Developing Mini-Apps

For faster development, run mini-apps in the browser:

```bash
cd mini-apps/demo-app1
npm run dev
# Opens at http://localhost:5173
```

Note: Bridge features won't work in the browser, but you'll see console logs showing the attempted communication.

### Making Changes

1. **Edit mini-app code** in `mini-apps/demo-app1/src/`
2. **Rebuild** with `npm run build`
3. **Reload the native app** to see changes

For iOS, if you modified files, you may need to clean build (`Cmd+Shift+K`).

## How Bridge Communication Works

### From Mini-App to Native

```typescript
// In React component
import { useBridge } from './useBridge'

function MyComponent() {
  const { showToast, getUserInfo } = useBridge()

  const handleClick = () => {
    // This calls native Android/iOS code
    showToast('Hello from mini-app!')
    getUserInfo()
  }
}
```

### From Native to Mini-App

```kotlin
// Android - JSBridge.kt
fun sendToJS(type: String, data: Any) {
  val message = mapOf("type" to type, "data" to data)
  webView.evaluateJavascript(
    "window.receiveFromNative($json)"
  )
}
```

```swift
// iOS - JSBridge.swift
func sendToJS(type: String, data: Any) {
  webView?.evaluateJavaScript(
    "window.receiveFromNative(\(json))"
  )
}
```

See [shared/BRIDGE_COMMUNICATION.md](shared/BRIDGE_COMMUNICATION.md) for detailed documentation.

## Available Bridge Methods

| Method | Description | Example |
|--------|-------------|---------|
| `getUserInfo()` | Get user info from native | `getUserInfo()` |
| `showToast(msg)` | Show native toast/alert | `showToast('Hello!')` |
| `navigate(screen)` | Navigate to native screen | `navigate('settings')` |
| `log(msg)` | Log to native console | `log('Debug info')` |

## Project Highlights for Learning

### 1. **WebView Setup**
- Android: `MiniAppWebView.kt` - Custom WebView with JavaScript enabled
- iOS: `MiniAppWebView.swift` - Custom WKWebView with message handlers

### 2. **Bridge Implementation**
- Android: `JSBridge.kt` - Uses `@JavascriptInterface` annotation
- iOS: `JSBridge.swift` - Implements `WKScriptMessageHandler` protocol

### 3. **Type-Safe Communication**
- `shared/bridge-types.ts` - Shared TypeScript types
- `useBridge.ts` - React hook with typed methods

### 4. **Mini-App Loading**
- Android: Load from `assets/mini-apps/`
- iOS: Load from app bundle resources

## Common Issues & Solutions

### Mini-App Not Loading?

**Android:**
- Check that mini-app was built: `ls android/app/src/main/assets/mini-apps/app1`
- Check logcat: `adb logcat | grep MiniApp`

**iOS:**
- Verify app folders are blue (folder references) in Xcode
- Check if files are in Copy Bundle Resources (Target → Build Phases)
- Check Xcode console for errors

### Bridge Not Working?

**Android:**
- Ensure JavaScript is enabled in WebView
- Check `@JavascriptInterface` annotation is present
- Verify bridge name: `window.AndroidBridge`

**iOS:**
- Verify message handler name matches: `nativeApp`
- Check `WKUserContentController` is properly configured
- Enable Web Inspector: Set `isInspectable = true`

### White Screen?

- Check browser console (Safari Web Inspector for iOS)
- Verify `index.html` exists in build output
- Check file permissions on Android assets

## Next Steps

### Add More Features

1. **Data Persistence**: Add `localStorage` bridge for native storage
2. **Camera Access**: Bridge to native camera
3. **Location**: Bridge to native location services
4. **Push Notifications**: Send notifications from native to mini-app
5. **Deep Linking**: Open specific mini-apps from URLs

### Improve Architecture

1. **Mini-App Registry**: Dynamic mini-app discovery
2. **Version Management**: Handle mini-app updates
3. **Permissions**: Add permission system for sensitive APIs
4. **Analytics**: Track mini-app usage
5. **Error Handling**: Better error boundaries

### Production Considerations

1. **Security**: Validate all bridge inputs, use HTTPS
2. **Performance**: Lazy load mini-apps, optimize bundle sizes
3. **Testing**: Add unit tests for bridge, E2E tests
4. **CI/CD**: Automate mini-app builds and deployments
5. **Monitoring**: Add crash reporting and performance monitoring

## Resources

- [Android WebView Documentation](https://developer.android.com/reference/android/webkit/WebView)
- [iOS WKWebView Documentation](https://developer.apple.com/documentation/webkit/wkwebview)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## License

This is a learning project - feel free to use and modify as needed!

---

**Happy Learning! 🚀**

If you have questions or find issues, this is a playground project meant for experimentation and learning about super app architecture.
