
package com.dayflow.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.graphics.Color;
public class MainActivity extends Activity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        webView = new WebView(this);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        webView.setWebViewClient(new WebViewClient());

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        setContentView(webView);
// White Android navigation bar
getWindow().setNavigationBarColor(Color.WHITE);

if (android.os.Build.VERSION.SDK_INT >= 29) {
    getWindow().setNavigationBarContrastEnforced(false);
}

getWindow().getDecorView().setSystemUiVisibility(
    View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
);
        webView.loadUrl(
            "https://sawtharw7-web.github.io/DayFlow/"
        );
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
