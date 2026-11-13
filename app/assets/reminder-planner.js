'use strict';
/** Etkinlik saatleri, mevcut uygulamadaki gibi İstanbul saat diliminde yorumlanır. */
function planAndroidReminders(entries, preferences, now) {
    const result = [];
    for (const entry of entries) {
        if (entry.type !== 'event' || entry.deleted_at || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date || '') || !/^([01]\d|2[0-3]):[0-5]\d$/.test(entry.time || '')) continue;
        const start = Date.parse(entry.date + 'T' + entry.time + ':00+03:00');
        if (!Number.isFinite(start) || start <= now) continue;
        for (const minutes of [30, 1440]) {
            if (minutes === 30 && (preferences.reminder30 === false || entry.reminder30 === false)) continue;
            if (minutes === 1440 && (preferences.reminderDay === false || entry.reminderDay === false)) continue;
            const at = start - minutes * 60000;
            if (at <= now) continue;
            result.push({ id: entry.id + '-' + minutes, entryId: entry.id, at,
                title: minutes === 30 ? 'Etkinliğe 30 dakika kaldı' : 'Yarın bu saatte bir etkinliğin var',
                body: String(entry.sensitive?(entry.publicName||'Meşgul'):(entry.title||'Etkinlik')).slice(0, 180) + ' · ' + entry.date.split('-').reverse().join('.') + ' ' + entry.time });
        }
    }
    return result.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id)).slice(0, 200);
}
