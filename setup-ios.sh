#!/bin/bash

# Automated iOS Xcode Project Setup
set -e

echo "🍎 Setting up iOS Xcode Project..."

# Check if xcodegen is installed
if ! command -v xcodegen &> /dev/null; then
    echo ""
    echo "⚠️  xcodegen not found. Installing via Homebrew..."

    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not installed. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi

    brew install xcodegen
fi

cd ios

echo "📝 Generating Xcode project..."
xcodegen generate

echo ""
echo "✅ Xcode project created successfully!"
echo ""
echo "Next steps:"
echo "  1. Build mini-apps: cd .. && ./build-mini-apps.sh"
echo "  2. Open Xcode: open ios/SuperApp.xcodeproj"
echo "  3. Add Resources/app1 and Resources/app2 as folder references (blue folders)"
echo "  4. Run the app!"
