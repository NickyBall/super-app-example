# Web SuperApp

Web-based super app that loads mini-apps remotely using iframes and JSBridge communication.

## Architecture

- **Host App**: Next.js web app with iframe containers
- **Mini Apps**: React/TypeScript apps served by Vite dev servers
- **Communication**: postMessage API for iframe communication

## How It Works

### URL Mapping
```typescript
demo-app1 → http://localhost:5173 (Shopping App)
demo-app2 → http://localhost:5174 (Payment App)
```

### JSBridge Communication

**From Mini-App → Host:**
```typescript
// Mini-app sends via window.parent.postMessage()
window.parent.postMessage({ type, data }, '*')
```

**From Host → Mini-App:**
```typescript
// Host sends via iframe.contentWindow.postMessage()
iframe.contentWindow.postMessage({ type, data }, '*')
```

## Setup & Running

### 1. Install Dependencies
```bash
cd /Users/nickyball/works/playground/hello-host-app/web
npm install
```

### 2. Start Mini-App Dev Servers

**Terminal 1 - Demo App 1:**
```bash
cd /Users/nickyball/works/playground/hello-host-app/mini-apps/demo-app1
npm run dev
# Runs on http://localhost:5173
```

**Terminal 2 - Demo App 2:**
```bash
cd /Users/nickyball/works/playground/hello-host-app/mini-apps/demo-app2
npm run dev -- --port 5174
# Runs on http://localhost:5174
```

### 3. Start Web SuperApp

**Terminal 3:**
```bash
cd /Users/nickyball/works/playground/hello-host-app/web
npm run dev
# Open http://localhost:3000
```

## Bridge API

The web version uses the same `useBridge` hook as Android/iOS:

```typescript
const { getUserInfo, showToast, log } = useBridge()

// Get user info
getUserInfo()

// Show toast
showToast('Hello from mini-app!')

// Log message
log('Debug message')
```

## Platform Detection

The `useBridge` hook automatically detects the platform:

```typescript
if (window.AndroidBridge) {
  // Android
} else if (window.webkit?.messageHandlers?.nativeApp) {
  // iOS
} else if (window.parent !== window) {
  // Web (iframe)
} else {
  // Standalone web
}
```

## Key Files

- `app/page.tsx` - Main page with mini-app switcher
- `components/MiniAppContainer.tsx` - Iframe container component
- `lib/jsBridge.ts` - JSBridge implementation for web
- `mini-apps/*/src/useBridge.ts` - Updated with web platform support

## Troubleshooting

### Mini-app won't load
- ✅ Check Vite dev servers are running (5173, 5174)
- ✅ Check browser console for CORS errors
- ✅ Verify iframe sandbox attributes

### Bridge not working
- ✅ Check postMessage is being sent/received in console
- ✅ Verify origin matching (use '*' for development)
- ✅ Check both mini-app and host console logs

### CORS issues
- ✅ Vite dev server allows all origins by default
- ✅ For production, configure proper CORS headers
