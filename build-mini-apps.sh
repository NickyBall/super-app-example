#!/bin/bash

# Build script for all mini-apps
# This script builds all React mini-apps and places them in the correct locations

set -e  # Exit on error

echo "🚀 Building Mini Apps..."

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Build demo-app1
echo ""
echo "📦 Building demo-app1 (Shopping App)..."
cd "$SCRIPT_DIR/mini-apps/demo-app1"
npm install
npm run build
cd "$SCRIPT_DIR"

# Build demo-app2
echo ""
echo "📦 Building demo-app2 (Payment App)..."
cd "$SCRIPT_DIR/mini-apps/demo-app2"
npm install
npm run build
cd "$SCRIPT_DIR"

# Copy to iOS if the directory exists
if [ -d "ios/SuperApp/SuperApp" ]; then
    echo ""
    echo "📱 Copying mini-apps to iOS..."
    mkdir -p ios/SuperApp/SuperApp/Resources
    cp -r android/app/src/main/assets/mini-apps/app1 ios/SuperApp/SuperApp/Resources/
    cp -r android/app/src/main/assets/mini-apps/app2 ios/SuperApp/SuperApp/Resources/
    echo "✅ Mini-apps copied to iOS Resources folder"
    echo "⚠️  Remember to add Resources/app1 and Resources/app2 to Xcode project if not already added!"
fi

echo ""
echo "✅ All mini-apps built successfully!"
echo ""
echo "Built files:"
echo "  - Android: android/app/src/main/assets/mini-apps/"
echo "  - iOS: ios/SuperApp/SuperApp/Resources/"
echo ""
echo "Next steps:"
echo "  - Android: Open android/ folder in Android Studio and run"
echo "  - iOS: Open ios/SuperApp/SuperApp.xcodeproj in Xcode and run"
