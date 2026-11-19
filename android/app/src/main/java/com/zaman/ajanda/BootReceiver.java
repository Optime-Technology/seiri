package com.zaman.ajanda;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Yeniden başlatma ve güncellemeden sonra yaklaşan alarmları geri yükler. */
public class BootReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (!Intent.ACTION_BOOT_COMPLETED.equals(action) && !Intent.ACTION_MY_PACKAGE_REPLACED.equals(action)
            && !"android.app.action.SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED".equals(action)) return;
        ReminderScheduler.restore(context);
    }
}
