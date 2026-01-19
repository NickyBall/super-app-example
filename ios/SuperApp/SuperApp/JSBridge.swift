//
//  JSBridge.swift
//  SuperApp
//
//  Created by Jakkrit Junrat on 17/1/2569 BE.
//

import Foundation
import WebKit

/**
 * JavaScript Bridge for communication between WKWebView and Native iOS
 *
 * This class handles messages from JavaScript and provides methods to send
 * messages back to the WebView
 */
class JSBridge: NSObject, WKScriptMessageHandler {

    weak var webView: WKWebView?
    var onAlert: ((String) -> Void)?

    init(webView: WKWebView) {
        self.webView = webView
        super.init()
    }

    // MARK: - WKScriptMessageHandler

    /**
     * Called when JavaScript sends a message using:
     * window.webkit.messageHandlers.nativeApp.postMessage(...)
     */
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard let dict = message.body as? [String: Any],
              let type = dict["type"] as? String else {
            print("Invalid message format")
            return
        }

        let data = dict["data"] as? [String: Any]

        // Handle different message types
        switch type {
        case "getUserInfo":
            handleGetUserInfo()

        case "showToast":
            if let msg = data?["message"] as? String {
                showAlert(message: msg)
            }

        case "navigate":
            if let screen = data?["screen"] as? String {
                handleNavigation(screen: screen)
            }

        case "log":
            if let logMessage = data?["message"] as? String {
                print("MiniApp Log: \(logMessage)")
            }

        default:
            print("Unknown message type: \(type)")
        }
    }

    // MARK: - Message Handlers

    /**
     * Send user info back to JavaScript
     */
    private func handleGetUserInfo() {
        let userInfo: [String: Any] = [
            "userId": "12345",
            "name": "John Doe",
            "email": "john@example.com"
        ]
        sendToJS(type: "userInfo", data: userInfo)
    }

    /**
     * Show a native alert
     */
    private func showAlert(message: String) {
        print("Alert: \(message)")
        DispatchQueue.main.async { [weak self] in
            self?.onAlert?(message)
        }
    }

    /**
     * Handle navigation requests
     */
    private func handleNavigation(screen: String) {
        print("Navigate to: \(screen)")
        showAlert(message: "Navigate to: \(screen)")
    }

    // MARK: - Send to JavaScript

    /**
     * Send data from native to JavaScript
     *
     * This will call window.receiveFromNative() in the WebView
     */
    func sendToJS(type: String, data: Any) {
        let message: [String: Any] = [
            "type": type,
            "data": data
        ]

        guard let jsonData = try? JSONSerialization.data(withJSONObject: message),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            print("Failed to serialize message")
            return
        }

        let script = "window.receiveFromNative && window.receiveFromNative(\(jsonString))"

        DispatchQueue.main.async { [weak self] in
            self?.webView?.evaluateJavaScript(script) { result, error in
                if let error = error {
                    print("Error sending to JS: \(error)")
                }
            }
        }
    }
}
