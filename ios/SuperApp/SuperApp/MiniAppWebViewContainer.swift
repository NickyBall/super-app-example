//
//  MiniAppWebViewContainer.swift
//  SuperApp
//
//  Created by Jakkrit Junrat on 17/1/2569 BE.
//

import SwiftUI
import WebKit

/**
 * SwiftUI wrapper for WKWebView
 */
struct MiniAppWebViewContainer: UIViewRepresentable {
    let appName: String
    @Binding var alertMessage: String?

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true

        // Add script message handler for bridge
        let contentController = WKUserContentController()
        configuration.userContentController = contentController

        let webView = WKWebView(frame: .zero, configuration: configuration)

        // Setup bridge
        let bridge = JSBridge(webView: webView)
        bridge.onAlert = { message in
            context.coordinator.alertMessage = message
        }
        context.coordinator.bridge = bridge
        contentController.add(bridge, name: "nativeApp")

        // Enable debugging
        #if DEBUG
        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
        #endif

        webView.scrollView.bounces = true
        webView.allowsBackForwardNavigationGestures = true

        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        loadMiniApp(webView: webView, appName: appName)
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(alertMessage: $alertMessage)
    }

    private func loadMiniApp(webView: WKWebView, appName: String) {
        // Configure URLs for each mini-app
        // You can use different ports for different apps during development
        let appURLs: [String: String] = [
            "app1": "http://localhost:5173",        // Vite dev server for app1
            "app2": "http://localhost:5174",        // Vite dev server for app2
            // Add more apps here as needed
        ]

        // Fallback to bundled apps on port 8080
        let defaultBaseURL = "http://localhost:8080/mini-apps"

        // Get the URL for this specific app
        let urlString: String
        if let customURL = appURLs[appName] {
            // Use custom URL (for dev servers, just load the root)
            urlString = customURL
        } else {
            // Use default bundled path
            urlString = "\(defaultBaseURL)/\(appName)/index.html"
        }

        guard let url = URL(string: urlString) else {
            print("Failed to create URL for mini app: \(appName)")
            return
        }

        let request = URLRequest(url: url)
        webView.load(request)

        print("Loading mini app from: \(url)")
    }

    class Coordinator {
        var bridge: JSBridge?
        @Binding var alertMessage: String?

        init(alertMessage: Binding<String?>) {
            _alertMessage = alertMessage
        }
    }
}
