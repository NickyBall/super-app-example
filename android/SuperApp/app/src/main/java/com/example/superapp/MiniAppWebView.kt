package com.example.superapp

import android.annotation.SuppressLint
import android.content.Context
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient

/**
 * Custom WebView for loading Mini Apps
 *
 * This WebView is configured to:
 * 1. Enable JavaScript
 * 2. Inject the AndroidBridge interface
 * 3. Load mini apps from assets or URLs
 */
@SuppressLint("SetJavaScriptEnabled")
class MiniAppWebView(context: Context) : WebView(context) {

    init {
        // Enable JavaScript
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true

        // Set up WebView clients
        webViewClient = WebViewClient()
        webChromeClient = WebChromeClient()

        // Inject the JavaScript bridge
        addJavascriptInterface(
            JavaScriptBridge(context, this),
            "AndroidBridge"
        )
    }

    /**
     * Load a mini app from a URL
     */
    fun loadFromUrl(url: String) {
        loadUrl(url)
    }
}
