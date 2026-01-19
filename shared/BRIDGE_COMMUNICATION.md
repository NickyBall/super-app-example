# Bridge Communication Guide

This document explains how communication works between the native host apps (Android/iOS) and the React mini-apps.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Native Host App                   │
│              (Android Kotlin / iOS Swift)            │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │            JSBridge / WKWebView            │    │
│  │                                             │    │
│  │  ┌──────────────────────────────────┐     │    │
│  │  │      React Mini-App (WebView)    │     │    │
│  │  │                                   │     │    │
│  │  │  - Shopping App                  │     │    │
│  │  │  - Payment App                   │     │    │
│  │  │  - etc.                          │     │    │
│  │  └──────────────────────────────────┘     │    │
│  │                                             │    │
│  │  Communication via JavaScript Bridge       │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Communication Flow

### 1. Mini-App to Native (JavaScript → Kotlin/Swift)

#### Android
```javascript
// In React mini-app
window.AndroidBridge.postMessage(JSON.stringify({
  type: 'getUserInfo',
  data: {}
}))
```

```kotlin
// In Android JSBridge.kt
@JavascriptInterface
fun postMessage(message: String) {
  val json = gson.fromJson(message, JsonObject::class.java)
  val type = json.get("type")?.asString
  // Handle message...
}
```

#### iOS
```javascript
// In React mini-app
window.webkit.messageHandlers.nativeApp.postMessage({
  type: 'getUserInfo',
  data: {}
})
```

```swift
// In iOS JSBridge.swift
func userContentController(
  _ userContentController: WKUserContentController,
  didReceive message: WKScriptMessage
) {
  guard let dict = message.body as? [String: Any],
        let type = dict["type"] as? String else { return }
  // Handle message...
}
```

### 2. Native to Mini-App (Kotlin/Swift → JavaScript)

#### Android
```kotlin
// In Android JSBridge.kt
fun sendToJS(type: String, data: Any) {
  val message = mapOf("type" to type, "data" to data)
  val json = gson.toJson(message)

  webView.post {
    webView.evaluateJavascript(
      "window.receiveFromNative && window.receiveFromNative($json)",
      null
    )
  }
}
```

#### iOS
```swift
// In iOS JSBridge.swift
func sendToJS(type: String, data: Any) {
  let message: [String: Any] = ["type": type, "data": data]
  let jsonData = try? JSONSerialization.data(withJSONObject: message)
  let jsonString = String(data: jsonData, encoding: .utf8)

  webView?.evaluateJavaScript(
    "window.receiveFromNative && window.receiveFromNative(\(jsonString))"
  )
}
```

```javascript
// In React mini-app
window.receiveFromNative = (message) => {
  console.log('Received from native:', message)
  // Handle message based on message.type
}
```

## Supported Message Types

### From Mini-App to Native

| Type | Description | Payload |
|------|-------------|---------|
| `getUserInfo` | Request user information | `{}` |
| `showToast` | Show native toast/alert | `{ message: string }` |
| `navigate` | Navigate to native screen | `{ screen: string }` |
| `log` | Log to native console | `{ message: string }` |

### From Native to Mini-App

| Type | Description | Payload |
|------|-------------|---------|
| `userInfo` | User information response | `{ userId, name, email }` |

## Using the Bridge in React

The `useBridge` hook provides a convenient interface:

```typescript
import { useBridge } from './useBridge'

function MyComponent() {
  const {
    userInfo,      // Current user info
    getUserInfo,   // Request user info
    showToast,     // Show native toast
    navigate,      // Navigate in native
    log            // Log to native
  } = useBridge()

  return (
    <div>
      <button onClick={() => getUserInfo()}>
        Get User Info
      </button>

      <button onClick={() => showToast('Hello!')}>
        Show Toast
      </button>

      <button onClick={() => navigate('settings')}>
        Go to Settings
      </button>

      {userInfo && (
        <p>Hello, {userInfo.name}!</p>
      )}
    </div>
  )
}
```

## Adding New Bridge Methods

### 1. Add message type to shared types
```typescript
// shared/bridge-types.ts
export type NativeMessageType =
  | 'getUserInfo'
  | 'myNewMethod'  // Add here
```

### 2. Handle in Android
```kotlin
// android/.../JSBridge.kt
when (type) {
    "getUserInfo" -> handleGetUserInfo()
    "myNewMethod" -> handleMyNewMethod(data)  // Add here
    // ...
}
```

### 3. Handle in iOS
```swift
// ios/.../JSBridge.swift
switch type {
case "getUserInfo":
    handleGetUserInfo()
case "myNewMethod":
    handleMyNewMethod(data: data)  // Add here
// ...
}
```

### 4. Add to useBridge hook
```typescript
// mini-apps/*/src/useBridge.ts
export const useBridge = () => {
  // ...

  const myNewMethod = useCallback((param: string) => {
    sendToNative('myNewMethod', { param })
  }, [sendToNative])

  return {
    // ...
    myNewMethod,
  }
}
```

## Security Considerations

1. **Validate all inputs** from JavaScript in native code
2. **Sanitize data** before sending to JavaScript
3. **Use HTTPS** for remote mini-apps
4. **Implement permissions** for sensitive operations
5. **Rate limit** bridge calls to prevent abuse

## Debugging

### Android
- Use `adb logcat` to see bridge logs
- Look for tags: `JSBridge`, `MiniAppWebView`, `MiniApp-Console`

### iOS
- Use Safari Web Inspector (Develop → Device → Your App)
- Check Xcode console for bridge logs

### React Mini-Apps
- Console logs appear in native console
- Use `log()` method to send logs to native
