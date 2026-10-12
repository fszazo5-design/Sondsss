package com.sonds.totti

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader

class MainActivity : Activity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.rgb(247, 248, 252)
        window.navigationBarColor = android.graphics.Color.rgb(247, 248, 252)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            window.decorView.systemUiVisibility = android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        }
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()
        webView = WebView(this).apply {
            setBackgroundColor(android.graphics.Color.rgb(247, 248, 252))
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = false
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.allowFileAccessFromFileURLs = false
            settings.allowUniversalAccessFromFileURLs = false
            settings.cacheMode = WebSettings.LOAD_CACHE_ELSE_NETWORK
            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(view: WebView, request: android.webkit.WebResourceRequest) =
                    if (request.url.host == LOCAL_ASSET_HOST) assetLoader.shouldInterceptRequest(request.url) else null
                override fun shouldOverrideUrlLoading(view: WebView, request: android.webkit.WebResourceRequest): Boolean = true
            }
        }
        setContentView(webView)
        webView.loadUrl(APP_ASSET_START_URL)
        Handler(Looper.getMainLooper()).postDelayed({ requestNotificationPermission() }, 500)
    }

    @Deprecated("Deprecated in Android API; retained for broad device compatibility")
    override fun onBackPressed() {
        if (!::webView.isInitialized) { super.onBackPressed(); return }
        webView.evaluateJavascript("window.__sondsHandleBack ? window.__sondsHandleBack() : false") { handled ->
            if (handled != "true") {
                if (webView.canGoBack()) webView.goBack() else super@MainActivity.onBackPressed()
            }
        }
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 301)
        }
    }

    private companion object {
        const val LOCAL_ASSET_HOST = "appassets.androidplatform.net"
        const val APP_ASSET_START_URL = "https://appassets.androidplatform.net/assets/www/index.html"
    }
}
