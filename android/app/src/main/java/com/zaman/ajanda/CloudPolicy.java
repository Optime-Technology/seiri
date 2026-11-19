package com.zaman.ajanda;

import java.net.URI;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

/** OAuth adresleri ve dosya anahtarları için Android'den bağımsız doğrulama. */
public final class CloudPolicy {
    public static final String SCHEME = "com.zaman.ajanda";
    public static boolean uuid(String value) { return value != null && value.matches("[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"); }
    public static Map<String,String> query(URI uri) throws Exception {
        Map<String,String> out = new HashMap<>();
        if (uri.getRawQuery() == null) return out;
        for (String part : uri.getRawQuery().split("&")) {
            String[] pair = part.split("=", 2);
            String key = URLDecoder.decode(pair[0], "UTF-8"), value = URLDecoder.decode(pair.length > 1 ? pair[1] : "", "UTF-8");
            if (out.put(key, value) != null) throw new Exception("Tekrarlanan parametre.");
        }
        return out;
    }
    public static String redirect(String nonce) throws Exception {
        if (nonce == null || !nonce.matches("[a-f0-9]{64}")) throw new Exception("Geçersiz giriş işlemi.");
        return SCHEME + "://auth/callback/" + nonce;
    }
    public static Map<String,String> callback(String address, String nonce, long now, long expires) throws Exception {
        if (address == null || address.length() > 8192 || now > expires) throw new Exception("Giriş süresi doldu.");
        URI uri = new URI(address);
        if (!SCHEME.equals(uri.getScheme()) || !"auth".equals(uri.getHost()) || uri.getUserInfo() != null || uri.getPort() != -1 || uri.getRawFragment() != null || !("/callback/" + nonce).equals(uri.getRawPath())) throw new Exception("Giriş dönüşü doğrulanamadı.");
        Map<String,String> q = query(uri);
        if (q.containsKey("error")) return q;
        String code = q.get("code");
        if (code == null || code.length() == 0 || code.length() > 4096) throw new Exception("Giriş kodu bulunamadı.");
        return q;
    }
    public static void authorize(String address, String origin, String nonce) throws Exception {
        URI uri = new URI(address);
        if (!"https".equals(uri.getScheme()) || !new URI(origin).getHost().equals(uri.getHost()) || uri.getPort() != -1 || uri.getUserInfo() != null || uri.getFragment() != null || !"/auth/v1/authorize".equals(uri.getPath())) throw new Exception("Giriş adresi geçersiz.");
        Map<String,String> q = query(uri);
        if (!"google".equals(q.get("provider")) || !redirect(nonce).equals(q.get("redirect_to")) || !"s256".equalsIgnoreCase(q.get("code_challenge_method")) || !q.getOrDefault("code_challenge", "").matches("[A-Za-z0-9_-]{43,128}")) throw new Exception("Giriş PKCE ile korunmalı.");
    }
    private CloudPolicy() {}
}
