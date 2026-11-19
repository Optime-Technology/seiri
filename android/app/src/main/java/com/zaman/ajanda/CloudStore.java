package com.zaman.ajanda;

import android.content.Context;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.AtomicFile;
import org.json.JSONObject;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.util.Arrays;

/** Oturum ve PKCE bilgisi Android Keystore anahtarıyla AES-256-GCM şifrelenir. */
public final class CloudStore {
    private final File root;
    private final AtomicFile auth;
    private final String alias = "seiri-auth-v1";
    public CloudStore(Context context) { root = new File(context.getFilesDir(), "seiri-cloud"); root.mkdirs(); auth = new AtomicFile(new File(root, "auth.enc")); }
    private SecretKey key() throws Exception {
        KeyStore store = KeyStore.getInstance("AndroidKeyStore"); store.load(null);
        if (store.containsAlias(alias)) return (SecretKey)store.getKey(alias, null);
        KeyGenerator generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
        generator.init(new KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT).setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).setKeySize(256).build());
        return generator.generateKey();
    }
    public synchronized JSONObject readAuth() throws Exception {
        if (!auth.getBaseFile().exists()) return new JSONObject();
        byte[] all = auth.readFully();
        if (all.length < 32 || all.length > 1024 * 1024) throw new Exception("Kayıtlı oturum okunamadı; oturumu temizleyip yeniden giriş yap.");
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding"); cipher.init(Cipher.DECRYPT_MODE, key(), new GCMParameterSpec(128, Arrays.copyOfRange(all, 0, 12)));
        return new JSONObject(new String(cipher.doFinal(Arrays.copyOfRange(all, 12, all.length)), StandardCharsets.UTF_8));
    }
    public synchronized void writeAuth(JSONObject value) throws Exception {
        byte[] text = value.toString().getBytes(StandardCharsets.UTF_8); if (text.length > 512 * 1024) throw new Exception("Oturum boyutu geçersiz.");
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding"); cipher.init(Cipher.ENCRYPT_MODE, key());
        byte[] encrypted = cipher.doFinal(text), iv = cipher.getIV(), all = new byte[iv.length + encrypted.length]; System.arraycopy(iv,0,all,0,iv.length);System.arraycopy(encrypted,0,all,iv.length,encrypted.length);
        write(auth, all);
    }
    public synchronized void clearAuth() { auth.delete(); }
    private static void write(AtomicFile file, byte[] bytes) throws Exception {
        File parent = file.getBaseFile().getParentFile(); if (!parent.exists() && !parent.mkdirs()) throw new Exception("Veri klasörü açılamadı.");
        FileOutputStream out = null; try { out = file.startWrite(); out.write(bytes); file.finishWrite(out); } catch (Exception e) { if (out != null) file.failWrite(out); throw e; }
    }
    public synchronized String read(String scope, String name) throws Exception {
        File file = file(scope,name); if (!file.exists()) return "null";
        if (file.length() > 32L*1024*1024) throw new Exception("Yerel eşitleme dosyası sınırı aşıldı.");
        return new String(new AtomicFile(file).readFully(), StandardCharsets.UTF_8);
    }
    public synchronized void put(String scope, String name, String text) throws Exception {
        if (text.getBytes(StandardCharsets.UTF_8).length > 32L*1024*1024) throw new Exception("Yerel eşitleme dosyası sınırı aşıldı.");
        write(new AtomicFile(file(scope,name)), text.getBytes(StandardCharsets.UTF_8));
    }
    private File file(String scope,String name) throws Exception {
        if (!("device".equals(scope)||CloudPolicy.uuid(scope)) || !name.matches("[a-z0-9-]{1,100}")) throw new Exception("Veri alanı geçersiz.");
        return new File(new File(root,scope),name+".json");
    }
    public File folder(String scope) throws Exception { return file(scope,"scope").getParentFile(); }
}
