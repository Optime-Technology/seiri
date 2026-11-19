'use strict';
/** Bu katman yalnızca Android paketine eklenir; yayımlanan web uygulamasını değiştirmez. */
const nativeCallbacks = new Map();
let nativeTaskCounter = 0, lastNativeSchedule = '', nativeInfo = null, nativeDownloadActive = false;
const nativeSettingsKey = 'zaman-android-reminders';
function androidPreferences() { try { return {reminder30:true, reminderDay:true, ...JSON.parse(localStorage.getItem(nativeSettingsKey) || '{}')}; } catch { return {reminder30:true, reminderDay:true}; } }
function nativeCall(method, ...values) {
    return new Promise((resolve, reject) => {
        if (!window.ZamanAndroid || typeof window.ZamanAndroid[method] !== 'function') { reject(Error('Android cihaz bağlantısı kurulamadı.')); return; }
        const id = 'android-' + (++nativeTaskCounter) + '-' + Date.now();
        const timer = setTimeout(() => { nativeCallbacks.delete(id); reject(Error('İşlem tamamlanamadı. Yeniden deneyebilirsin.')); }, 300000);
        nativeCallbacks.set(id, {resolve, reject, timer});
        try { window.ZamanAndroid[method](id, ...values); } catch (error) { clearTimeout(timer); nativeCallbacks.delete(id); reject(Error('Android işlemi başlatılamadı.')); }
    });
}
function blobToBase64(blob) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = () => reject(Error('Dosya okunamadı.')); reader.readAsDataURL(blob); }); }
async function saveAndroidBlob(blob, name, type) {
    if (blob.size > 48 * 1024 * 1024) throw Error('Tek dosya dışa aktarma sınırı 48 MB. Büyük eklerini ayrı ayrı indirebilirsin.');
    nativeDownloadActive = true;
    try {
        const result = await nativeCall('saveDocument', name, (type || blob.type || 'application/octet-stream').split(';')[0], await blobToBase64(blob));
        nativeDownloadActive = false;
        toast(result.canceled ? 'Kaydetme iptal edildi.' : 'Dosya seçtiğin konuma kaydedildi.');
        return result;
    } finally { nativeDownloadActive = false; }
}
async function nativeDownloadUrl(url, name, mime) {
    try { const response = await fetch(url); if (!response.ok) throw Error('Dosya okunamadı.'); return await saveAndroidBlob(await response.blob(), name || 'zaman-dosyasi', mime); }
    catch (error) { nativeDownloadActive = false; toast(error.message); }
}
window.ZamanNative = {
    resolve(id, response) { const callback = nativeCallbacks.get(id); if (!callback) return; clearTimeout(callback.timer); nativeCallbacks.delete(id); response.ok ? callback.resolve(response.value) : callback.reject(Error(response.error || 'İşlem tamamlanamadı.')); },
    downloadUrl: nativeDownloadUrl,
    openEntry(id) { if(id==='__study_focus__'&&window.ZamanStudy){window.ZamanStudy.openStudio('focus');return;} if(!id){goPage('calendar');return} const entry = data.entries.find(entry => entry.id === id); if (!entry) { toast('Bu etkinlik kaldırılmış olabilir.'); return; } selected = parse(entry.date); cursor = new Date(selected); goPage(entry.type === 'note' ? 'journal' : 'calendar'); openEditor(entry.type, entry); },
    async onResume() { try { nativeInfo = await nativeCall('getInfo'); refreshNativeBadge(); syncAndroidReminders(true); if (page === 'account') renderAccount(); } catch {} }
};
const nativeBaseToast = toast;
toast = function(message) { if (nativeDownloadActive && /yedeklendi|Yedeğin indirildi|Takvim dosyan hazır/.test(message)) return; nativeBaseToast(message); };
// Blob indirmelerini Android'in "Farklı kaydet" ekranına yönlendirir.
const nativeOriginalAnchorClick = HTMLAnchorElement.prototype.click;
HTMLAnchorElement.prototype.click = function() {
    if (this.href.startsWith('blob:') && (this.hasAttribute('download') || this.download)) { nativeDownloadActive = true; nativeDownloadUrl(this.href, this.download || 'zaman-dosyasi', this.type); return; }
    if (this.href.startsWith('https:') && new URL(this.href).origin !== location.origin) { window.ZamanAndroid.openExternal(this.href); return; }
    return nativeOriginalAnchorClick.call(this);
};
document.addEventListener('click', event => {
    const link = event.target.closest?.('a'); if (!link) return;
    if (link.href.startsWith('blob:') && link.hasAttribute('download')) { event.preventDefault(); event.stopPropagation(); nativeDownloadUrl(link.href, link.download || 'zaman-dosyasi', link.type); }
    else if (link.href.startsWith('https:') && new URL(link.href).origin !== location.origin) { event.preventDefault(); window.ZamanAndroid.openExternal(link.href); }
    else if (link.href.includes('/signin-with-chatgpt') || link.href.includes('/signout-with-chatgpt')) { event.preventDefault(); toast('Hesap ve ekip işlemleri için web alanını açabilirsin.'); }
}, true);
const nativePreviewAttachment = previewAttachment;
previewAttachment = async function(attachment) {
    if (attachment.type !== 'application/pdf') return nativePreviewAttachment(attachment);
    try { const blob = await readFile(attachment.id); if (!blob) throw Error('Dosya bulunamadı.'); await nativeCall('openDocument', attachment.type, await blobToBase64(blob)); }
    catch (error) { toast(error.message); }
};
async function syncAndroidReminders(force = false) {
    const reminders = planAndroidReminders(data.entries, androidPreferences(), Date.now());
    const timer=window.ZamanStudy?.getTimer?.();if(timer?.phase==='running'&&timer.mode!=='stopwatch'){const left=ZamanStudyModel.snapshot(timer,Date.now()).remaining;if(left>0)reminders.unshift({id:'study-'+timer.id,entryId:'__study_focus__',at:Date.now()+left,title:'Seiri',body:timer.mode==='break'?'Mola tamamlandı.':'Odak oturumu tamamlandı.'});}
    const signature = JSON.stringify(reminders);
    if (!force && signature === lastNativeSchedule) return;
    try { const result = await nativeCall('schedule', signature); lastNativeSchedule = signature; return result; }
    catch (error) { toast(error.message); }
}
const nativeBaseSave = save;
save = function() { const saved = nativeBaseSave(); if (saved) syncAndroidReminders(); return saved; };
function updateSystemAppearance() {
    try { const color = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(); window.ZamanAndroid.setAppearance(color.startsWith('#') ? color : '#f8f9f5', document.documentElement.dataset.theme === 'dark'); } catch {}
}
new MutationObserver(updateSystemAppearance).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme','data-skin']});
const webWorkspaceURL = 'https://zaman-ajanda-celil.eternalchest.chatgpt.site';
function openWebWorkspace() { openModernSettings('cloud'); }
function nativeAccountCard(title, text) { return `<section class="settingsCard androidInfoCard"><span class="statIcon green">◎</span><h2>${esc(title)}</h2><p>${esc(text)}</p><div class="androidLocalBadge">● Android · Cihazda kayıt</div><p>Takvim, ajanda, dosyalar ve temalar internet olmadan kullanılabilir. Kişisel alan eşitlemesi Ayarlar → Hesap ve bağlantı bölümündedir. Ekip eşitlemesi bu sürümde kapalıdır.</p><button class="outline" id="openNativeWebWorkspace">Hesap ve bağlantı</button></section>`; }
renderTeams = function() {
    $('#teamsPage').innerHTML = nativeAccountCard('Ekip eşitlemesi', 'Bu beta kişisel alanı eşitler. Ekip eşitlemesi henüz etkin değildir.');
    $('#openNativeWebWorkspace').onclick = openWebWorkspace;
    $('#createBtn').innerHTML = 'Web alanını aç ↗'; $('#createBtn').onclick = openWebWorkspace;
};
renderAccount = function() {
    const preferences = androidPreferences(), permitted = !!nativeInfo?.permission, exact = !!nativeInfo?.exact;
    $('#accountPage').innerHTML = `<div class="accountGrid">${nativeAccountCard('Seiri · Android', 'Kişisel notların ve planların bu uygulamanın cihaz alanında saklanır.')}<section class="settingsCard"><h2>Etkinlik hatırlatmaların</h2><p class="teamHint">Hatırlatmalar cihazda planlanır; uygulama kapalıyken de Android tarafından gösterilir. Dakik alarm izni yoksa sistem bildirimi geciktirebilir.</p><form id="nativeReminderSettings"><label class="switchRow"><span><strong>30 dakika önce</strong><small>Yaklaşan etkinliklerin için.</small></span><input id="nativePref30" type="checkbox" ${preferences.reminder30?'checked':''}></label><label class="switchRow"><span><strong>1 gün önce</strong><small>Yarının planlarına hazırlan.</small></span><input id="nativePrefDay" type="checkbox" ${preferences.reminderDay?'checked':''}></label><button class="primary">Tercihleri kaydet</button></form><div class="browserNotice"><strong>${permitted?'Bildirim izni açık':'Bildirim izni kapalı veya henüz verilmedi'}</strong><p>${exact?'Dakik hatırlatma izni açık.':'Dakik hatırlatmalar için Android’in “Alarmlar ve hatırlatmalar” iznini açabilirsin.'}</p><button id="nativeEnableNotice" class="outline">Bildirimlere izin ver</button><button id="nativeTestNotice" class="outline">5 saniyelik test</button><button id="nativeExactSettings" class="outline">Dakik alarm ayarı</button><button id="nativeNoticeSettings" class="outline">Android bildirim ayarları</button></div></section></div><section class="migrationCard"><span>▤</span><div><h3>Web’deki eski notlarını getirebilirsin.</h3><p>Web uygulamasında “Verilerimi dışa aktar”, ardından bu uygulamada “Yedek içe aktar” seçeneğini kullan.</p></div></section>`;
    $('#openNativeWebWorkspace').onclick = openWebWorkspace;
    $('#nativeReminderSettings').onsubmit = event => { event.preventDefault(); localStorage.setItem(nativeSettingsKey, JSON.stringify({reminder30:$('#nativePref30').checked,reminderDay:$('#nativePrefDay').checked})); syncAndroidReminders(true); toast('Hatırlatma tercihlerin kaydedildi.'); };
    $('#nativeEnableNotice').onclick = enableBrowserNotifications;
    $('#nativeExactSettings').onclick = () => window.ZamanAndroid.openAlarmSettings();
    $('#nativeNoticeSettings').onclick = () => window.ZamanAndroid.openNotificationSettings();
    $('#nativeTestNotice').onclick = async () => { try { nativeInfo = await nativeCall('getInfo'); if (!nativeInfo.permission) { toast('Önce bildirimlere izin ver.'); return; } const all = planAndroidReminders(data.entries, androidPreferences(), Date.now()); all.unshift({id:'test-'+Date.now(),entryId:'',at:Date.now()+5000,title:'Seiri test bildirimi',body:'Android hatırlatmaları bu alanda görünecek.'}); await nativeCall('schedule', JSON.stringify(all)); lastNativeSchedule=''; toast('Test bildirimi yaklaşık 5 saniye sonra gelecek.'); } catch (error) { toast(error.message); } };
};
openCreateTeam = openWebWorkspace;
enableBrowserNotifications = async function() { try { nativeInfo = await nativeCall('requestNotifications'); await syncAndroidReminders(true); toast(nativeInfo.permission?'Android bildirimleri açıldı.':'Bildirim izni verilmedi. Android ayarlarından açabilirsin.'); if (page === 'account') renderAccount(); } catch(error) { toast(error.message); } };
notificationPermissionLabel = function() { return nativeInfo?.permission?'Android bildirimleri açık':'Android bildirim izni kapalı'; };
function refreshNativeBadge() {
    const readAt = Number(localStorage.getItem('zaman-native-read-at') || 0), unseen = (nativeInfo?.delivered || []).filter(n => n.shownAt > readAt).length;
    $('#unreadCount').hidden = !unseen; $('#unreadCount').textContent = unseen;
}
async function renderNativeNotifications() {
    nativeInfo = await nativeCall('getInfo'); refreshNativeBadge();
    const upcoming = planAndroidReminders(data.entries, androidPreferences(), Date.now()).slice(0,6), delivered = nativeInfo.delivered || [];
    const format = at => new Date(at).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    $('#notificationItems').innerHTML = (upcoming.length?'<h3 class="nativeNoticeHeading">Sıradaki hatırlatmalar</h3>'+upcoming.map(n=>`<button class="noticeItem" data-local-entry="${esc(n.entryId)}"><div><strong>${esc(n.title)}</strong><p>${esc(n.body)}</p><small>${format(n.at)}</small></div><span>↗</span></button>`).join(''):'')+(delivered.length?'<h3 class="nativeNoticeHeading">Gösterilen bildirimler</h3>'+delivered.map(n=>`<button class="noticeItem" data-local-entry="${esc(n.entryId||'')}"><div><strong>${esc(n.title)}</strong><p>${esc(n.body)}</p><small>${format(n.shownAt||n.at)}</small></div></button>`).join(''):'')||'<div class="notificationEmpty"><span>☀</span><h3>Şimdilik her şey sakin.</h3><p>Etkinlik ekleyince gelecekteki hatırlatmaların burada görünecek.</p></div>';
    $$('#notificationItems [data-local-entry]').forEach(button=>button.onclick=()=>{ if(button.dataset.localEntry) { $('#notificationDialog').close(); window.ZamanNative.openEntry(button.dataset.localEntry); } });
    $('#notificationDialog .teamHint').textContent = 'Bu bildirimler Android cihazında planlanır. Dakik alarm izni ve cihazın pil ayarları teslim zamanını etkileyebilir.';
}
$('#notificationBell').onclick = async () => { try { await renderNativeNotifications(); $('#notificationDialog').showModal(); } catch(error) { toast(error.message); } };
$('#markAllRead').onclick = () => { localStorage.setItem('zaman-native-read-at',String(Date.now())); refreshNativeBadge(); toast('Bildirimler okundu işaretlendi.'); };
$('#enableNotifications').onclick = enableBrowserNotifications;
$('#workspaceBtn').onclick = () => openModernSettings('cloud');
$('#workspaceBtn').innerHTML = '<span class="avatar">Z</span><div>Kişisel alanım<small>Android · Çevrimdışı hazır</small></div><span class="muted">◎</span>';
$('.avatar.small').textContent = 'Z';
cloudStatus(window.ZamanDesktop?.workspaceKind==='account'?'Android · Kişisel alan':'Android · Bu telefon');
$('#cloudBoot')?.remove();
updateSystemAppearance();
syncAndroidReminders(true);
window.ZamanNative.onResume();

document.addEventListener("seiri-cloud-applied",()=>syncAndroidReminders(true));
setInterval(()=>syncAndroidReminders(),30000);
