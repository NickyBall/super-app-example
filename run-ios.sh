#!/bin/bash

# Script to build and run iOS app from command line
# This bypasses Xcode GUI issues

set -e

echo "🍎 Building and Running iOS SuperApp..."
echo ""

cd "$(dirname "$0")/ios/SuperApp"

# Clean and build
echo "📦 Building project..."
xcodebuild -project SuperApp.xcodeproj \
  -scheme SuperApp \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  clean build \
  | grep -E "(BUILD|error:)" || true

echo ""
echo "✅ Build complete!"
echo ""

# Get simulator ID
SIMULATOR_ID=$(xcrun simctl list devices | grep "iPhone 17 Pro" | head -1 | grep -o '[A-F0-9-]\{36\}')

if [ -z "$SIMULATOR_ID" ]; then
    echo "❌ iPhone 17 Pro simulator not found"
    echo "Available simulators:"
    xcrun simctl list devices | grep iPhone
    exit 1
fi

echo "📱 Using simulator: iPhone 17 Pro ($SIMULATOR_ID)"

# Boot simulator if not running
echo "🚀 Booting simulator..."
xcrun simctl boot "$SIMULATOR_ID" 2>/dev/null || echo "Simulator already running"

# Open Simulator app
open -a Simulator

# Install app
echo "📲 Installing app..."
APP_PATH="/Users/nickyball/Library/Developer/Xcode/DerivedData/SuperApp-bbulfjwkkpjgwrcllinkxvmzmluc/Build/Products/Debug-iphonesimulator/SuperApp.app"
xcrun simctl install "$SIMULATOR_ID" "$APP_PATH"

# Launch app
echo "🎯 Launching app..."
xcrun simctl launch "$SIMULATOR_ID" com.example.SuperApp

echo ""
echo "✅ App launched successfully!"
echo ""
echo "⚠️  Make sure HTTP server is running:"
echo "    ./serve-mini-apps.sh"
echo ""
