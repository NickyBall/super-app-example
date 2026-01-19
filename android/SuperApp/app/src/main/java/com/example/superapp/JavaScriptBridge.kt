package com.example.superapp

import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.Toast
import org.json.JSONObject

/**
 * JavaScript Bridge for Mini App Communication
 *
 * This class is exposed to JavaScript via @JavascriptInterface
 * It handles messages from the mini app and can send messages back
 */
class JavaScriptBridge(
    private val context: Context,
    private val webView: WebView
) {
    /**
     * Main entry point for JavaScript to send messages to native
     * Called from JS: window.AndroidBridge.postMessage(jsonString)
     */
    @JavascriptInterface
    fun postMessage(jsonMessage: String) {
        try {
            val message = JSONObject(jsonMessage)
            val type = message.getString("type")
            val data = message.optJSONObject("data")

            // Handle different message types
            when (type) {
                "log" -> handleLog(data)
                "getUserInfo" -> handleGetUserInfo()
                "showToast" -> handleShowToast(data)
                "navigate" -> handleNavigate(data)
                else -> {
                    android.util.Log.w("JavaScriptBridge", "Unknown message type: $type")
                }
            }
        } catch (e: Exception) {
            android.util.Log.e("JavaScriptBridge", "Error handling message: ${e.message}", e)
        }
    }

    /**
     * Handle log messages from JavaScript
     */
    private fun handleLog(data: JSONObject?) {
        val message = data?.getString("message") ?: "No message"
        android.util.Log.d("MiniApp", message)
    }

    /**
     * Handle getUserInfo request - sends user data back to JavaScript
     */
    private fun handleGetUserInfo() {
        val userInfo = JSONObject().apply {
            put("userId", "12345")
            put("name", "John Doe")
            put("email", "john@example.com")
        }

        val response = JSONObject().apply {
            put("type", "userInfo")
            put("data", userInfo)
        }

        sendToJavaScript(response)
    }

    /**
     * Handle showToast request - displays a native toast
     */
    private fun handleShowToast(data: JSONObject?) {
        val message = data?.getString("message") ?: "No message"
        (context as? android.app.Activity)?.runOnUiThread {
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Handle navigation request
     */
    private fun handleNavigate(data: JSONObject?) {
        val screen = data?.getString("screen") ?: "unknown"
        android.util.Log.d("JavaScriptBridge", "Navigate to: $screen")
        // TODO: Implement navigation logic
    }

    /**
     * Send message to JavaScript
     * Calls window.receiveFromNative(message) on the JavaScript side
     */
    private fun sendToJavaScript(message: JSONObject) {
        (context as? android.app.Activity)?.runOnUiThread {
            val script = "javascript:window.receiveFromNative && window.receiveFromNative(${message})"
            webView.evaluateJavascript(script, null)
        }
    }
}
