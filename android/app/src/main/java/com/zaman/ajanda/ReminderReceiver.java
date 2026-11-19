package com.zaman.ajanda;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import org.json.JSONArray;
import org.json.JSONObject;

/** Uygulama kapalıyken gelen yerel alarmı kullanıcıya gösterir. */
public class ReminderReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context, Intent intent) {
        try {
            if(!(intent.hasExtra("space")?intent.getStringExtra("space"):"device").equals(ReminderScheduler.scope(context)))return;
            JSONObject item = new JSONObject(intent.getStringExtra("reminder"));
            if (System.currentTimeMillis() - item.getLong("at") > 2 * 60 * 60 * 1000L) return;
            ReminderScheduler.createChannel(context);
            JSONArray history = new JSONArray(ReminderScheduler.prefs(context).getString("delivered", "[]"));
            JSONArray updated = new JSONArray();
            updated.put(new JSONObject(item.toString()).put("shownAt", System.currentTimeMillis()));
            for (int i = 0; i < history.length() && updated.length() < 40; i++) {
                JSONObject old = history.getJSONObject(i);
                if (!old.optString("id").equals(item.optString("id"))) updated.put(old);
            }
            ReminderScheduler.prefs(context).edit().putString("delivered", updated.toString()).apply();
            if (!ReminderScheduler.hasPermission(context)) return;
            Intent open = new Intent(context, MainActivity.class);
            open.setData(Uri.parse("zaman://entry/" + Uri.encode(item.optString("entryId"))));
            open.putExtra("entryId", item.optString("entryId"));
            open.putExtra("space",ReminderScheduler.scope(context));
            open.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent action = PendingIntent.getActivity(context, 0, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            Notification notice = new Notification.Builder(context, ReminderScheduler.CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_zaman).setContentTitle(item.optString("title", "Seiri"))
                .setContentText(item.optString("body")).setStyle(new Notification.BigTextStyle().bigText(item.optString("body")))
                .setContentIntent(action).setAutoCancel(true).setCategory(Notification.CATEGORY_REMINDER)
                .setColor(0xff2e604d).setShowWhen(true).setWhen(item.getLong("at")).build();
            ((NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE)).notify(item.optString("id").hashCode(), notice);
        } catch (Exception ignored) { /* Geçersiz bir alarm, diğer hatırlatmaları etkilemez. */ }
    }
}
