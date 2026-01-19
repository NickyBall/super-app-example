package com.example.superapp

import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

/**
 * Main Activity - The host container for mini apps
 *
 * This activity demonstrates:
 * 1. Loading different mini apps in a WebView
 * 2. Native-to-JS and JS-to-Native communication via JavaScriptBridge
 * 3. Switching between mini apps
 */
class MainActivity : AppCompatActivity() {

    private lateinit var miniAppContainer: LinearLayout
    private var currentWebView: MiniAppWebView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Create the UI programmatically
        val rootLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        }

        // Create button container
        val buttonContainer = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            setPadding(16, 16, 16, 16)
        }

        // App1 button
        val btnApp1 = Button(this).apply {
            text = "Shopping App"
            layoutParams = LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            ).apply {
                marginEnd = 8
            }
            setOnClickListener {
                loadMiniApp("demo-app1")
            }
        }

        // App2 button
        val btnApp2 = Button(this).apply {
            text = "Payment App"
            layoutParams = LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
            ).apply {
                marginStart = 8
            }
            setOnClickListener {
                loadMiniApp("demo-app2")
            }
        }

        buttonContainer.addView(btnApp1)
        buttonContainer.addView(btnApp2)

        // Create mini app container
        miniAppContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        }

        rootLayout.addView(buttonContainer)
        rootLayout.addView(miniAppContainer)

        setContentView(rootLayout)

        // Set up back press handler for WebView navigation
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // Handle back navigation in WebView
                currentWebView?.let {
                    if (it.canGoBack()) {
                        it.goBack()
                        return
                    }
                }
                // If WebView can't go back, finish the activity
                isEnabled = false
                onBackPressedDispatcher.onBackPressed()
            }
        })

        // Load first app by default
        loadMiniApp("demo-app1")
    }

    /**
     * Load a mini app into the container
     */
    private fun loadMiniApp(appName: String) {
        // Remove current WebView if exists
        currentWebView?.let {
            miniAppContainer.removeAllViews()
        }

        // Create new WebView for the mini app
        val webView = MiniAppWebView(this)
        currentWebView = webView

        // Add WebView to container
        miniAppContainer.addView(
            webView,
            LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT
            )
        )

        // Load the mini app from Vite dev server
        // Note: 10.0.2.2 is the Android emulator's way to access localhost on the host machine
        val url = when (appName) {
            "demo-app1" -> "http://10.0.2.2:5173"
            "demo-app2" -> "http://10.0.2.2:5174"
            else -> "http://10.0.2.2:5173"
        }

        webView.loadFromUrl(url)
    }
}