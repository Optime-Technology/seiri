package com.zaman.ajanda;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Base64;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Mevcut web arayüzünü güvenli bir yerel HTTPS kökeninde çalıştıran Android ekranı. */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final int PICK_FILES = 100, SAVE_FILE = 101, NOTICE_PERMISSION = 102;
    private static final int MAX_BASE64_LENGTH = 64 * 1024 * 1024;
    private WebView webView;
    private CloudBridge cloud;
    private FrameLayout root;
    private final ExecutorService io = Executors.newSingleThreadExecutor();
    private ValueCallback<Uri[]> fileCallback;
    private String saveRequestId, saveData, permissionRequestId;
    private boolean pageReady = false;
    private int systemColor = 0xfff8f9f5;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ReminderScheduler.createChannel(this);
        try { cloud = new CloudBridge(this); } catch (Exception e) { new android.app.AlertDialog.Builder(this).setTitle("Seiri bağlantısı açılamadı").setMessage("Yapılandırma okunamadı. Uygulama verilerini silmeden paketi kontrol et.").setPositiveButton("Kapat",(d,w)->finish()).show(); return; }
        root = new FrameLayout(this);
        root.setBackgroundColor(systemColor);
        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        // Sistem çubukları ve klavye, web içeriğinin üzerine binmez.
        if (Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                android.graphics.Insets keyboard = insets.getInsets(WindowInsets.Type.ime());
                view.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, keyboard.bottom));
            } else view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportMultipleWindows(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        webView.setBackgroundColor(systemColor);
        WebView.setWebContentsDebuggingEnabled((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0);
        webView.addJavascriptInterface(new AndroidBridge(), "ZamanAndroid");
        webView.addJavascriptInterface(cloud, "SeiriDevice");
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return localResponse(request.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && cloud.host().equals(uri.getHost())) return false;
                if (request.isForMainFrame() && request.hasGesture()) openExternal(uri.toString());
                return true;
            }
            @Override public void onPageFinished(WebView view, String url) {
                if (!url.startsWith("https://" + cloud.host() + "/")) return;
                pageReady = true;
                cloud.deliverCallback();
                deliverNotificationIntent();
                evaluate("window.ZamanNative && window.ZamanNative.onResume()");
            }
        });
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, params.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE);
                java.util.ArrayList<String> accepted = new java.util.ArrayList<>();
                for (String type : params.getAcceptTypes()) for (String part : type.split(",")) if (part.trim().contains("/")) accepted.add(part.trim());
                if (!accepted.isEmpty()) intent.putExtra(Intent.EXTRA_MIME_TYPES, accepted.toArray(new String[0]));
                try { startActivityForResult(intent, PICK_FILES); }
                catch (ActivityNotFoundException error) { fileCallback.onReceiveValue(null); fileCallback = null; message("Cihazda dosya seçici bulunamadı."); }
                return true;
            }
        });
        webView.setDownloadListener((url, agent, disposition, mime, size) -> {
            if (url.startsWith("blob:")) evaluate("window.ZamanNative && window.ZamanNative.downloadUrl(" + JSONObject.quote(url) + ", 'zaman-dosyasi', " + JSONObject.quote(mime == null ? "application/octet-stream" : mime) + ")");
            else openExternal(url);
        });
        webView.loadUrl("https://" + cloud.host() + "/index.html");
        if(getIntent()!=null && getIntent().getData()!=null)cloud.acceptCallback(getIntent().getData().toString());
    }
    private WebResourceResponse localResponse(Uri uri) {
        if ("https".equals(uri.getScheme()) && cloud.cloudHost(uri.getHost())) return null;
        if (!"https".equals(uri.getScheme()) || !cloud.host().equals(uri.getHost())) return response(403, "Erişim kapalı");
        String path = uri.getPath();
        if (path == null || path.equals("/")) path = "/index.html";
        path = path.startsWith("/") ? path.substring(1) : path;
        if (path.contains("..") || path.contains("\\") || path.indexOf('\0') >= 0 || path.startsWith("api/")) return response(404, "Bulunamadı");
        try {
            InputStream stream = getAssets().open(path);
            String mime = mime(path);
            Map<String, String> headers = new HashMap<>();
            headers.put("X-Content-Type-Options", "nosniff");
            headers.put("Cache-Control", "no-cache");
            if (path.endsWith(".html")) headers.put("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' blob: data: " + cloud.origin() + "; frame-src blob:; object-src 'none'; base-uri 'self'; form-action 'none'");
            return new WebResourceResponse(mime, mime.startsWith("text/") || mime.contains("javascript") ? "UTF-8" : null, 200, "OK", headers, stream);
        } catch (Exception error) { return response(404, "Bulunamadı"); }
    }
    private static String mime(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".js")) return "text/javascript";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".woff2")) return "font/woff2";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".json")) return "application/json";
        if(path.endsWith(".ogg"))return "audio/ogg";
        if(path.endsWith(".m4a"))return "audio/mp4";
        return "application/octet-stream";
    }
    private static WebResourceResponse response(int status, String text) {
        return new WebResourceResponse("text/plain", "UTF-8", status, status == 403 ? "Forbidden" : "Not Found", new HashMap<>(), new ByteArrayInputStream(text.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
    }
    private void evaluate(String script) {
        runOnUiThread(() -> { if (!isFinishing() && webView != null) webView.evaluateJavascript(script, null); });
    }
    private void result(String id, JSONObject value) {
        evaluate("window.ZamanNative && window.ZamanNative.resolve(" + JSONObject.quote(id) + ", " + value.toString() + ")");
    }
    private void ok(String id, JSONObject value) { try { result(id, new JSONObject().put("ok", true).put("value", value)); } catch (Exception ignored) {} }
    private void fail(String id, String error) { try { result(id, new JSONObject().put("ok", false).put("error", error)); } catch (Exception ignored) {} }
    private void message(String text) { runOnUiThread(() -> Toast.makeText(this, text, Toast.LENGTH_LONG).show()); }
    private static String fileName(String value) {
        String cleaned = value.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_").trim();
        return cleaned.isEmpty() ? "zaman-dosyasi" : cleaned.substring(0, Math.min(cleaned.length(), 180));
    }
    private void openExternal(String address) {
        Uri uri = Uri.parse(address);
        if (!"https".equals(uri.getScheme()) || uri.getHost() == null || uri.getHost().endsWith("androidplatform.net") || uri.getUserInfo()!=null) { message("Bu bağlantı dış tarayıcıda açılamıyor."); return; }
        runOnUiThread(() -> { try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); } catch (ActivityNotFoundException error) { message("Bağlantıyı açacak bir tarayıcı bulunamadı."); } });
    }
    private void deliverNotificationIntent() {
        if (!pageReady || getIntent() == null) return;
        if(getIntent().hasExtra("space")&&!ReminderScheduler.scope(this).equals(getIntent().getStringExtra("space")))return;
        String id = getIntent().getStringExtra("entryId");
        if (id == null) return;
        getIntent().removeExtra("entryId");
        evaluate("window.ZamanNative && window.ZamanNative.openEntry(" + JSONObject.quote(id) + ")");
    }
    @Override protected void onNewIntent(Intent intent) { super.onNewIntent(intent); setIntent(intent); if(cloud!=null&&intent.getData()!=null&&CloudPolicy.SCHEME.equals(intent.getData().getScheme()))cloud.acceptCallback(intent.getData().toString());else deliverNotificationIntent(); }
    @Override protected void onResume() { super.onResume(); if (webView != null) webView.onResume(); if (pageReady) { evaluate("window.ZamanNative && window.ZamanNative.onResume()"); evaluate("window.SeiriAndroidAuth && window.SeiriAndroidAuth.wake()"); } }
    @Override protected void onPause() { if (webView != null) webView.onPause(); super.onPause(); }
    @Override public void onBackPressed() {
        webView.evaluateJavascript("(function(){var d=document.querySelector('dialog[open]');if(d){d.close();return true}if(window.ZamanStudy&&window.ZamanStudy.isWriting()){window.ZamanStudy.closeWriter();return true}if(typeof page!=='undefined'&&page!=='calendar'){goPage('calendar');return true}return false})()", value -> { if (!"true".equals(value)) super.onBackPressed(); });
    }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_FILES && fileCallback != null) {
            Uri[] values = null;
            if (resultCode == RESULT_OK && data != null) {
                if (data.getClipData() != null) { values = new Uri[data.getClipData().getItemCount()]; for (int i = 0; i < values.length; i++) values[i] = data.getClipData().getItemAt(i).getUri(); }
                else if (data.getData() != null) values = new Uri[]{data.getData()};
            }
            fileCallback.onReceiveValue(values); fileCallback = null;
        }
        if (requestCode == SAVE_FILE && saveRequestId != null) {
            String id = saveRequestId, encoded = saveData; saveRequestId = null; saveData = null;
            if (resultCode != RESULT_OK || data == null || data.getData() == null) { try { ok(id, new JSONObject().put("canceled", true)); } catch (Exception ignored) {} return; }
            Uri destination = data.getData();
            io.execute(() -> {
                try (OutputStream out = getContentResolver().openOutputStream(destination, "w")) {
                    if (out == null) throw new java.io.IOException();
                    byte[] bytes = Base64.decode(encoded, Base64.DEFAULT); out.write(bytes);
                    ok(id, new JSONObject().put("saved", true));
                } catch (Exception error) { fail(id, "Dosya kaydedilemedi. Seçtiğin konumu ve boş alanı kontrol et."); }
            });
        }
    }
    @Override public void onRequestPermissionsResult(int code, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(code, permissions, results);
        if (code == NOTICE_PERMISSION && permissionRequestId != null) {
            String id = permissionRequestId; permissionRequestId = null;
            ReminderScheduler.restore(this);
            try { ok(id, ReminderScheduler.info(this)); } catch (Exception error) { fail(id, "Bildirim izni okunamadı."); }
        }
    }
    @Override protected void onDestroy() { if(cloud!=null)cloud.close();if (webView != null) { webView.removeJavascriptInterface("SeiriDevice");webView.removeJavascriptInterface("ZamanAndroid"); webView.destroy(); webView = null; } io.shutdown(); super.onDestroy(); }

    /** Yalnızca paketlenmiş, dış ağ erişimi kapalı yerel arayüze açık köprü. */
    public void cloudEvaluate(String script){evaluate(script);}
    public boolean cloudPageReady(){return pageReady;}
    public void cloudMessage(String text){message(text);}
    public void cloudOpen(String address){runOnUiThread(()->{try{startActivity(new Intent(Intent.ACTION_VIEW,Uri.parse(address)));}catch(Exception e){message("Tarayıcı açılamadı. Girişi iptal edip yeniden dene.");}});}
    public void cloudDelayed(Runnable action){new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(action,150);}
    public void cloudLoad(String host){runOnUiThread(()->{pageReady=false;((android.app.NotificationManager)getSystemService(NOTIFICATION_SERVICE)).cancelAll();webView.stopLoading();webView.clearHistory();webView.loadUrl("https://"+host+"/index.html");});}
    private final class AndroidBridge {
        @JavascriptInterface public void getInfo(String id) {
            try { ok(id, ReminderScheduler.info(MainActivity.this).put("version", "1.17.0").put("platform", "Android")); }
            catch (Exception error) { fail(id, "Cihaz bilgileri okunamadı."); }
        }
        @JavascriptInterface public void openExternal(String address) { MainActivity.this.openExternal(address); }
        @JavascriptInterface public void setAppearance(String color, boolean dark) {
            runOnUiThread(() -> {
                try {
                    systemColor = Color.parseColor(color); root.setBackgroundColor(systemColor); webView.setBackgroundColor(systemColor);
                    getWindow().setStatusBarColor(systemColor); getWindow().setNavigationBarColor(systemColor);
                    int flags = getWindow().getDecorView().getSystemUiVisibility() & ~(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
                    if (!dark) flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                    if (Build.VERSION.SDK_INT >= 26 && !dark) flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                    getWindow().getDecorView().setSystemUiVisibility(flags);
                } catch (Exception ignored) {}
            });
        }
        @JavascriptInterface public void requestNotifications(String id) {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 33 && !ReminderScheduler.hasPermission(MainActivity.this)) {
                    if (permissionRequestId != null) { fail(id, "Bildirim izin penceresi zaten açık."); return; }
                    permissionRequestId = id;
                    requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTICE_PERMISSION);
                } else { try { ok(id, ReminderScheduler.info(MainActivity.this)); } catch (Exception error) { fail(id, "İzin durumu okunamadı."); } }
            });
        }
        @JavascriptInterface public void openAlarmSettings() {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 31 && !ReminderScheduler.isExactAllowed(MainActivity.this)) {
                    try { startActivity(new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, Uri.parse("package:" + getPackageName()))); }
                    catch (ActivityNotFoundException error) { message("Dakik alarm ayarları bu cihazda açılamıyor."); }
                } else message("Dakik hatırlatma izni zaten açık.");
            });
        }
        @JavascriptInterface public void openNotificationSettings() {
            runOnUiThread(() -> startActivity(new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, getPackageName())));
        }
        @JavascriptInterface public void schedule(String id, String encoded) {
            final String scheduledScope=ReminderScheduler.scope(MainActivity.this);
            io.execute(() -> { try {
                if(!scheduledScope.equals(ReminderScheduler.scope(MainActivity.this)))return;
                if (encoded.length() > 300000) throw new IllegalArgumentException();
                int count = ReminderScheduler.replace(MainActivity.this, new JSONArray(encoded));
                ok(id, new JSONObject().put("scheduled", count).put("permission", ReminderScheduler.hasPermission(MainActivity.this)).put("exact", ReminderScheduler.isExactAllowed(MainActivity.this)));
            } catch (Exception error) { fail(id, "Hatırlatmalar planlanamadı."); } });
        }
        @JavascriptInterface public void saveDocument(String id, String name, String type, String encoded) {
            if (encoded.length() > MAX_BASE64_LENGTH) { fail(id, "Tek dışa aktarma işlemi en fazla 48 MB olabilir."); return; }
            runOnUiThread(() -> {
                if (saveRequestId != null) { fail(id, "Önce açık olan dosya kaydetme işlemini tamamla."); return; }
                saveRequestId = id; saveData = encoded;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType(type.matches("[a-zA-Z0-9.+-]+/[a-zA-Z0-9.+-]+") ? type : "application/octet-stream");
                intent.putExtra(Intent.EXTRA_TITLE, fileName(name));
                try { startActivityForResult(intent, SAVE_FILE); }
                catch (ActivityNotFoundException error) { saveRequestId = null; saveData = null; fail(id, "Dosya kaydetme uygulaması bulunamadı."); }
            });
        }
        @JavascriptInterface public void openDocument(String id, String type, String encoded) {
            if (encoded.length() > MAX_BASE64_LENGTH || !java.util.Arrays.asList("application/pdf", "image/png", "image/jpeg", "text/calendar").contains(type)) { fail(id, "Dosya türü veya boyutu desteklenmiyor."); return; }
            io.execute(() -> { try {
                File folder = new File(getCacheDir(), "previews"); if (!folder.exists()) folder.mkdirs();
                File[] old = folder.listFiles(); if (old != null) for (File f : old) if (f.lastModified() < System.currentTimeMillis() - 86400000L) f.delete();
                String extension = type.equals("application/pdf") ? "pdf" : type.equals("image/png") ? "png" : type.equals("text/calendar") ? "ics" : "jpg";
                File file = new File(folder, "preview-" + UUID.randomUUID() + "." + extension);
                try (FileOutputStream out = new FileOutputStream(file)) { out.write(Base64.decode(encoded, Base64.DEFAULT)); }
                Uri uri = Uri.parse("content://" + getPackageName() + ".preview/" + file.getName());
                runOnUiThread(() -> { try {
                    Intent view = new Intent(Intent.ACTION_VIEW).setDataAndType(uri, type).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(view); ok(id, new JSONObject().put("opened", true));
                } catch (Exception error) { fail(id, "Bu dosyayı açacak uygulama bulunamadı. Dosyayı indirip uygun bir uygulamada açabilirsin."); } });
            } catch (Exception error) { fail(id, "Dosya önizlemeye hazırlanamadı."); } });
        }
    }
}
