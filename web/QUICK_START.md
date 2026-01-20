# Quick Start Guide - Web SuperApp

## Prerequisites

Make sure mini-apps are built and dev servers can run:
```bash
cd mini-apps/demo-app1 && npm install
cd mini-apps/demo-app2 && npm install
```

## Running the Web SuperApp

### Step 1: Start Mini-App Dev Servers

Open 3 terminal windows:

**Terminal 1:**
```bash
cd /Users/nickyball/works/playground/hello-host-app/mini-apps/demo-app1
npm run dev
```
✅ Demo App 1 running on http://localhost:5173

**Terminal 2:**
```bash
cd /Users/nickyball/works/playground/hello-host-app/mini-apps/demo-app2
npm run dev -- --port 5174
```
✅ Demo App 2 running on http://localhost:5174

**Terminal 3:**
```bash
cd /Users/nickyball/works/playground/hello-host-app/web
npm run dev
```
✅ Web SuperApp running on http://localhost:3000

### Step 2: Open in Browser

Navigate to: **http://localhost:3000**

You should see:
- 🌐 Web SuperApp header
- Two buttons: "Shopping App" and "Payment App"
- Mini-app loaded in an iframe below

### Step 3: Test JSBridge

In the mini-app (loaded in iframe), click:
- **"Get User Info"** - Should show user data
- **"Show Toast"** - Should show a toast notification from the host
- **"Send Log to Native"** - Check browser console

### Verify Bridge Communication

Open browser DevTools console (F12), you should see:
```
[JSBridge] Received from mini-app: { type: "getUserInfo" }
[JSBridge] Sending to mini-app: { type: "userInfo", data: {...} }
[Bridge] Message from web host: { type: "userInfo", data: {...} }
```

## Architecture

```
┌─────────────────────────────────────────┐
│  Web SuperApp (Next.js)                 │
│  http://localhost:3000                  │
│                                          │
│  ┌────────────────────────────────┐     │
│  │  iframe (Shopping App)          │     │
│  │  http://localhost:5173          │     │
│  │                                 │     │
│  │  postMessage ↕ postMessage      │     │
│  └────────────────────────────────┘     │
│                                          │
│  ┌────────────────────────────────┐     │
│  │  iframe (Payment App)           │     │
│  │  http://localhost:5174          │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

## Platform Comparison

| Platform | Container | Bridge Method |
|----------|-----------|---------------|
| **Android** | WebView | `window.AndroidBridge.postMessage()` |
| **iOS** | WKWebView | `window.webkit.messageHandlers.nativeApp.postMessage()` |
| **Web** | iframe | `window.parent.postMessage()` |

All three platforms use the same `useBridge()` hook! 🎉
