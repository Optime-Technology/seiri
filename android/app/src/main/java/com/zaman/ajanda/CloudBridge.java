package com.zaman.ajanda;

import android.content.Intent;
import android.net.Uri;
import android.webkit.JavascriptInterface;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.File;
import java.io.FileInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.net.ssl.HttpsURLConnection;

/** Yalnızca paketlenmiş arayüzün eriştiği, kapsamı sınırlı cihaz işlemleri. */
public final class CloudBridge {
    private final MainActivity activity;
    private final CloudStore store;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final JSONObject config;
    private volatile String scope = "device", workspace = "", label = "Bu telefon";
    private volatile long generation = 0;
    private volatile String documentToken=UUID.randomUUID().toString();
    private String callback;
    public CloudBridge(MainActivity activity) throws Exception {
        this.activity=activity;this.store=new CloudStore(activity);
        try(java.io.InputStream in=activity.getAssets().open("cloud-config.json")){config=new JSONObject(new String(readAll(in,8192),StandardCharsets.UTF_8));}
        if(!config.getString("url").matches("https://[a-z0-9]{20}\\.supabase\\.co")||!config.getString("publishableKey").matches("sb_publishable_[A-Za-z0-9_-]{20,200}"))throw new Exception("Bağlantı ayarı geçersiz.");
        try{String cached=userId();String selected=activity.getSharedPreferences("seiri-cloud-ui",0).getString("scope","device");if(cached.equals(selected)&&CloudPolicy.uuid(cached)){JSONObject b=new JSONObject(store.read(cached,"binding"));if(cached.equals(b.optString("userId"))&&CloudPolicy.uuid(b.optString("workspaceId"))){scope=cached;workspace=b.getString("workspaceId");label=b.optString("label","Google hesabı");}}}catch(Exception ignored){}
        activity.getSharedPreferences("seiri-cloud-ui",0).edit().putString("scope",scope).apply();
    }
    private static byte[] readAll(java.io.InputStream in,int max)throws Exception{ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] chunk=new byte[8192];int n;while((n=in.read(chunk))!=-1){out.write(chunk,0,n);if(out.size()>max)throw new Exception("Boyut sınırı aşıldı.");}return out.toByteArray();}
    private String userId()throws Exception{String s=store.readAuth().optString("seiri-supabase-auth","");return s.isEmpty()?"":new JSONObject(s).getJSONObject("user").optString("id","");}
    private String token()throws Exception{return new JSONObject(store.readAuth().getString("seiri-supabase-auth")).getString("access_token");}
    public String host(){return "device".equals(scope)?"appassets.androidplatform.net":"u-"+scope+".appassets.androidplatform.net";}
    public boolean cloudHost(String host){try{return Uri.parse(config.getString("url")).getHost().equals(host);}catch(Exception e){return false;}}
    public String origin(){return config.optString("url");}
    @JavascriptInterface public synchronized String bootstrap(){try{return new JSONObject().put("space",info()).put("context",documentToken).put("config",config).toString();}catch(Exception e){return "{}";}}
    private JSONObject info()throws Exception{return new JSONObject().put("kind","device".equals(scope)?"device":"account").put("userId","device".equals(scope)?JSONObject.NULL:scope).put("workspaceId",workspace.isEmpty()?JSONObject.NULL:workspace).put("label",label).put("platform","Android");}
    private String response(Object value,Exception error){try{return new JSONObject().put("ok",error==null).put("value",value==null?JSONObject.NULL:value).put("message",error==null?"":"Cihaz işlemi tamamlanamadı. Yerel veriler korundu.").toString();}catch(Exception e){return "{\"ok\":false}";}}
    @JavascriptInterface public synchronized String authGet(String key,String context){try{checkContext(context);checkAuthKey(key);JSONObject v=store.readAuth();return response(v.has(key)?v.getString(key):null,null);}catch(Exception e){return response(null,e);}}
    @JavascriptInterface public synchronized String authSet(String key,String value,String context){try{checkContext(context);checkAuthKey(key);JSONObject v=store.readAuth();v.put(key,value);store.writeAuth(v);return response(true,null);}catch(Exception e){return response(null,e);}}
    @JavascriptInterface public synchronized String authRemove(String key,String context){try{checkContext(context);checkAuthKey(key);JSONObject v=store.readAuth();v.remove(key);store.writeAuth(v);return response(true,null);}catch(Exception e){return response(null,e);}}
    private void checkContext(String context)throws Exception{if(!documentToken.equals(context))throw new Exception("Eski sayfanın işlemi reddedildi.");}
    private void checkAuthKey(String key)throws Exception{if(key==null||key.length()>1000||!key.startsWith("seiri-supabase-auth"))throw new Exception("Oturum anahtarı geçersiz.");}
    @JavascriptInterface public synchronized String readData(String name,String context){try{checkContext(context);checkName(name);return response(store.read(scope,name),null);}catch(Exception e){return response(null,e);}}
    @JavascriptInterface public synchronized String writeData(String name,String value,String context){try{checkContext(context);checkName(name);new JSONObject(value);store.put(scope,name,value);return response(true,null);}catch(Exception e){return response(null,e);}}
    private void checkName(String name)throws Exception{if(!Arrays.asList("sync-journal","cloud-files").contains(name)||"device".equals(scope))throw new Exception("Hesap alanı gerekli.");}
    @JavascriptInterface public String hash(String base64){try{if(base64.length()>40*1024*1024)throw new Exception();byte[] hash=MessageDigest.getInstance("SHA-256").digest(android.util.Base64.decode(base64,android.util.Base64.DEFAULT));return hex(hash);}catch(Exception e){return "";}}
    private static String hex(byte[] b){StringBuilder out=new StringBuilder();for(byte v:b)out.append(String.format(java.util.Locale.ROOT,"%02x",v&255));return out.toString();}
    @JavascriptInterface public void request(String id,String method,String encoded,String context){final long at=generation;final String area=scope;executor.execute(()->{try{checkContext(context);if(at!=generation)return;JSONArray args=new JSONArray(encoded);Object value=handle(method,args,area,at);if(at==generation)reply(id,value,null);}catch(Exception e){if(at==generation)reply(id,null,e);}});}
    private void reply(String id,Object value,Exception error){activity.cloudEvaluate("window.SeiriAndroidAuth&&window.SeiriAndroidAuth.onResult("+JSONObject.quote(id)+","+response(value,error)+")");}
    private JSONObject flow()throws Exception{return store.readAuth().optJSONObject("mobile-flow");}
    public synchronized void acceptCallback(String address){try{JSONObject f=flow();if(f==null)return;CloudPolicy.callback(address,f.getString("nonce"),System.currentTimeMillis(),f.getLong("expires"));callback=address;deliverCallback();}catch(Exception e){activity.cloudMessage("Giriş bağlantısı geçersiz veya süresi dolmuş. Seiri'den yeniden dene.");}}
    public synchronized void deliverCallback(){if(callback!=null&&activity.cloudPageReady()){String v=callback;callback=null;activity.cloudEvaluate("window.SeiriAndroidAuth&&window.SeiriAndroidAuth.onCallback("+JSONObject.quote(v)+")");}}
    private void clearFlow()throws Exception{JSONObject v=store.readAuth();v.remove("mobile-flow");store.writeAuth(v);}
    private synchronized void switchTo(String target,String ws,String name){try{ReminderScheduler.replace(activity,new JSONArray());}catch(Exception ignored){}documentToken=UUID.randomUUID().toString();scope=target;workspace=ws;label=name;generation++;activity.getSharedPreferences("seiri-cloud-ui",0).edit().putString("scope",scope).commit();activity.cloudLoad(host());}
    private JSONObject checkedAccount()throws Exception{
        String access=token();JSONObject user=new JSONObject(get("/auth/v1/user",access));String id=user.getString("id");if(!CloudPolicy.uuid(id))throw new Exception();
        JSONArray spaces=new JSONArray(get("/rest/v1/workspaces?select=id,name,is_personal,owner_id&is_personal=eq.true&owner_id=eq."+id+"&limit=1",access));if(spaces.length()!=1)throw new Exception();JSONObject ws=spaces.getJSONObject(0);
        return new JSONObject().put("userId",id).put("workspaceId",ws.getString("id")).put("label",user.optString("email","Google hesabı"));
    }
    private String get(String path,String access)throws Exception{HttpsURLConnection c=(HttpsURLConnection)new java.net.URL(origin()+path).openConnection();try{c.setConnectTimeout(15000);c.setReadTimeout(15000);c.setInstanceFollowRedirects(false);c.setRequestProperty("apikey",config.getString("publishableKey"));c.setRequestProperty("Authorization","Bearer "+access);if(c.getResponseCode()!=200)throw new Exception("Hesap doğrulanamadı.");try(java.io.InputStream in=c.getInputStream()){return new String(readAll(in,1024*1024),StandardCharsets.UTF_8);}}finally{c.disconnect();}}
    private File backupFolder(String area)throws Exception{File f=new File(store.folder(area),"backups");f.mkdirs();return f;}
    private JSONObject backup(String text,String area)throws Exception{
        if(text.getBytes(StandardCharsets.UTF_8).length>128*1024*1024)throw new Exception();JSONObject v=new JSONObject(text);if(!v.has("entries")||!v.has("categories")||!v.has("files"))throw new Exception();String id="seiri-"+System.currentTimeMillis()+"-"+UUID.randomUUID().toString().replace("-","").substring(0,16)+".json";
        android.util.AtomicFile f=new android.util.AtomicFile(new File(backupFolder(area),id));FileOutputStreamHolder.write(f,text);
        File[] old=backupFolder(area).listFiles((d,n)->n.matches("seiri-[0-9]{13}-[a-f0-9]{16}\\.json"));if(old!=null){Arrays.sort(old,(a,b)->Long.compare(b.lastModified(),a.lastModified()));for(int i=7;i<old.length;i++)old[i].delete();}
        return new JSONObject().put("id",id).put("warnings",new JSONArray());
    }
    private String readBackup(String id,String area)throws Exception{if(!id.matches("seiri-[0-9]{13}-[a-f0-9]{16}\\.json"))throw new Exception();try(FileInputStream in=new FileInputStream(new File(backupFolder(area),id))){return new String(readAll(in,128*1024*1024),StandardCharsets.UTF_8);}}
    private Object handle(String method,JSONArray args,String area,long startedGeneration)throws Exception{
        if("spaceInfo".equals(method))return info();
        if("newFlow".equals(method)){synchronized(this){if(startedGeneration!=generation)throw new Exception("Eski giriş işlemi.");byte[] random=new byte[32];new SecureRandom().nextBytes(random);JSONObject f=new JSONObject().put("nonce",hex(random)).put("expires",System.currentTimeMillis()+180000);JSONObject v=store.readAuth();v.put("mobile-flow",f);store.writeAuth(v);return f.put("redirect",CloudPolicy.redirect(f.getString("nonce")));}}
        if("flowInfo".equals(method)){JSONObject f=flow();if(f==null||System.currentTimeMillis()>f.getLong("expires"))return JSONObject.NULL;return f;}
        if("openLogin".equals(method)){synchronized(this){if(startedGeneration!=generation)throw new Exception("Eski giriş işlemi.");JSONObject f=flow();if(f==null)throw new Exception();CloudPolicy.authorize(args.getString(0),origin(),f.getString("nonce"));f.put("flowId",args.optString(1,""));JSONObject v=store.readAuth();v.put("mobile-flow",f);store.writeAuth(v);activity.cloudOpen(args.getString(0));return true;}}
        if("clearFlow".equals(method)){synchronized(this){if(startedGeneration!=generation)throw new Exception("Eski giriş işlemi.");clearFlow();return true;}}
        if("clearAuth".equals(method)){synchronized(this){if(startedGeneration!=generation)throw new Exception("Eski giriş işlemi.");store.clearAuth();return true;}}
        if("spaceAccount".equals(method)){JSONObject b;try{b=checkedAccount();store.put(b.getString("userId"),"binding",b.toString());}catch(Exception e){String id=userId();if(!CloudPolicy.uuid(id))throw e;b=new JSONObject(store.read(id,"binding"));if(!id.equals(b.optString("userId")))throw e;}
            final JSONObject target=b;activity.cloudDelayed(()->{if(startedGeneration==generation)switchTo(target.optString("userId"),target.optString("workspaceId"),target.optString("label"));});return new JSONObject().put("ok",true).put("reloading",true);}
        if("spaceDevice".equals(method)){activity.cloudDelayed(()->{if(startedGeneration==generation)switchTo("device","","Bu telefon");});return new JSONObject().put("ok",true).put("reloading",true);}
        if("backupCreate".equals(method))return backup(args.getString(0),area);
        if("backupRead".equals(method))return readBackup(args.getString(0),area);
        if("backupList".equals(method)){JSONArray list=new JSONArray();File[] files=backupFolder(area).listFiles((d,n)->n.matches("seiri-[0-9]{13}-[a-f0-9]{16}\\.json"));if(files!=null){Arrays.sort(files,(a,b)->Long.compare(b.lastModified(),a.lastModified()));for(File f:files)list.put(new JSONObject().put("id",f.getName()).put("size",f.length()).put("createdAt",Long.parseLong(f.getName().split("-")[1])));}return new JSONObject().put("items",list).put("keep",7).put("maxBytes",128*1024*1024);}
        if("prepareTransfer".equals(method)){if(!"device".equals(area))throw new Exception();JSONObject target=checkedAccount();String text=args.getString(0);JSONObject source=new JSONObject(text);String hash=hex(MessageDigest.getInstance("SHA-256").digest(text.getBytes(StandardCharsets.UTF_8)));String receipt=store.read(target.getString("userId"),"transfer");if(!"null".equals(receipt)){JSONObject old=new JSONObject(receipt);if(old.optBoolean("done")&&!old.optBoolean("cancelled"))return new JSONObject().put("alreadyDone",true);}
            backup(text,area);File pinned=new File(store.folder("device"),"transfer-"+hash+".json");FileOutputStreamHolder.write(new android.util.AtomicFile(pinned),text);store.put(target.getString("userId"),"binding",target.toString());store.put(target.getString("userId"),"transfer",new JSONObject().put("hash",hash).put("userId",target.getString("userId")).put("done",false).put("counts",args.getJSONObject(1)).toString());return new JSONObject().put("ok",true).put("target",target.getString("label"));}
        if("transferInfo".equals(method)){if("device".equals(area))return JSONObject.NULL;String raw=store.read(area,"transfer");if("null".equals(raw))return JSONObject.NULL;JSONObject v=new JSONObject(raw);return v.optBoolean("done")?JSONObject.NULL:v;}
        if("transferRead".equals(method)){JSONObject v=new JSONObject(store.read(area,"transfer"));if(v.optBoolean("done")||!area.equals(v.getString("userId"))||!v.getString("hash").matches("[a-f0-9]{64}"))throw new Exception();try(FileInputStream in=new FileInputStream(new File(store.folder("device"),"transfer-"+v.getString("hash")+".json"))){return new JSONObject().put("hash",v.getString("hash")).put("backup",new JSONObject(new String(readAll(in,128*1024*1024),StandardCharsets.UTF_8)));}}
        if("transferDone".equals(method)||"transferCancel".equals(method)){JSONObject v=new JSONObject(store.read(area,"transfer"));if(!args.getString(0).equals(v.getString("hash"))||!area.equals(v.getString("userId")))throw new Exception();v.put("done",true).put("cancelled","transferCancel".equals(method));store.put(area,"transfer",v.toString());return true;}
        throw new Exception("İşlem desteklenmiyor.");
    }
    private static final class FileOutputStreamHolder {static void write(android.util.AtomicFile f,String text)throws Exception{File parent=f.getBaseFile().getParentFile();parent.mkdirs();java.io.FileOutputStream out=null;try{out=f.startWrite();out.write(text.getBytes(StandardCharsets.UTF_8));f.finishWrite(out);}catch(Exception e){if(out!=null)f.failWrite(out);throw e;}}}
    public void close(){executor.shutdownNow();}
}
