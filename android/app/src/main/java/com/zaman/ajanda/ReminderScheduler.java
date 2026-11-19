package com.zaman.ajanda;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import org.json.JSONArray;
import org.json.JSONObject;

/** Hatırlatmaları sunucu olmadan Android'in alarm sistemine teslim eder. */
public final class ReminderScheduler {
    static final String PREFS = "zaman_native";
    static final String CHANNEL = "zaman_reminders";
    private ReminderScheduler() {}
    public static String scope(Context context){String v=context.getSharedPreferences("seiri-cloud-ui",0).getString("scope","device");return CloudPolicy.uuid(v)?v:"device";}
    static SharedPreferences prefs(Context context) { String current=scope(context);return context.getSharedPreferences("device".equals(current)?PREFS:PREFS+"-"+current,Context.MODE_PRIVATE); }
    public static void createChannel(Context context) {
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationChannel channel = new NotificationChannel(CHANNEL, "Etkinlik hatırlatmaları", NotificationManager.IMPORTANCE_HIGH);
        channel.setDescription("Takvimindeki etkinliklerin yaklaşma bildirimleri");
        manager.createNotificationChannel(channel);
    }
    public static boolean hasPermission(Context context) {
        return Build.VERSION.SDK_INT < 33 || context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
    }
    public static boolean isExactAllowed(Context context) {
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        return Build.VERSION.SDK_INT < 31 || manager.canScheduleExactAlarms();
    }
    private static PendingIntent pending(Context context, JSONObject item) {
        Intent intent = new Intent(context, ReminderReceiver.class);
        intent.setAction("com.zaman.ajanda.REMIND");
        intent.setData(Uri.parse("zaman://reminder/" + Uri.encode(item.optString("id"))));
        intent.putExtra("reminder", item.toString());
        intent.putExtra("space",scope(context));
        return PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
    public static synchronized int replace(Context context, JSONArray requested) throws Exception {
        AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        JSONArray previous = new JSONArray(prefs(context).getString("reminders", "[]"));
        for (int i = 0; i < previous.length(); i++) manager.cancel(pending(context, previous.getJSONObject(i)));
        JSONArray stored = new JSONArray();
        long now = System.currentTimeMillis();
        for (int i = 0; i < requested.length() && stored.length() < 200; i++) {
            JSONObject item = requested.getJSONObject(i);
            if (item.optLong("at") <= now || item.optString("id").length() > 180 || item.optString("title").length() > 200) continue;
            stored.put(item);
            if (!hasPermission(context)) continue;
            PendingIntent operation = pending(context, item);
            try {
                if (isExactAllowed(context)) manager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, item.getLong("at"), operation);
                else manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, item.getLong("at"), operation);
            } catch (SecurityException error) {
                manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, item.getLong("at"), operation);
            }
        }
        prefs(context).edit().putString("reminders", stored.toString()).apply();
        return stored.length();
    }
    public static void restore(Context context) {
        try { createChannel(context); replace(context, new JSONArray(prefs(context).getString("reminders", "[]"))); }
        catch (Exception ignored) { /* Bozuk alarm listesi uygulamadaki kayıtlardan yeniden üretilebilir. */ }
    }
    public static JSONObject info(Context context) throws Exception {
        return new JSONObject().put("permission", hasPermission(context)).put("exact", isExactAllowed(context))
            .put("pending", new JSONArray(prefs(context).getString("reminders", "[]")))
            .put("delivered", new JSONArray(prefs(context).getString("delivered", "[]")));
    }
}
