#!/bin/bash

# Simple HTTP server to serve mini-apps for remote loading
# This allows Android and iOS apps to load mini-apps over HTTP

PORT=8080
MINI_APPS_DIR="/Users/nickyball/works/playground/hello-host-app/android/app/src/main/assets"

echo "🌐 Starting Mini-Apps HTTP Server..."
echo ""
echo "Server will run on:"
echo "  - Local:     http://localhost:$PORT/mini-apps"
echo "  - iOS:       http://localhost:$PORT/mini-apps"
echo "  - Android:   http://10.0.2.2:$PORT/mini-apps (emulator)"
echo "  - Network:   http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'):$PORT/mini-apps"
echo ""
echo "Serving from: $MINI_APPS_DIR"
echo ""
echo "Mini-apps available:"
ls -1 "$MINI_APPS_DIR/mini-apps" 2>/dev/null | sed 's/^/  - /'
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd "$MINI_APPS_DIR"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m http.server $PORT
else
    echo "❌ Error: Python not found. Please install Python 3."
    exit 1
fi
