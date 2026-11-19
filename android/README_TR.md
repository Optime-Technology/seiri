> Güncel eşitleme davranışı: [1.18 not eşitlemesi](docs/SENKRONIZASYON_1.18.md). Bu bölüm eski sürüm notlarının yerine geçer. İki cihazı da 1.18.0 sürümüne güncelleyin.

# Seiri Android 1.18.0 Beta · Optime Technology

Ders notu, günlük plan, checklist ve odak oturumları. Windows 1.18.0 kişisel alanıyla aynı Supabase kayıt protokolünü kullanır. Bu paket test amaçlı APK'dır; Play Store üretim paketi değildir.

## SENİN YAPACAKLARIN

1. Supabase projesi → Authentication → URL Configuration → Redirect URLs → Add URL. Mevcut Windows adresine ek olarak `com.zaman.ajanda://auth/callback/*` adresini ekleyip kaydet. Google Cloud içindeki Web OAuth callback adresi `https://sgytbatqphacuygmcdxg.supabase.co/auth/v1/callback` olarak kalır; telefon dönüşü Supabase izin listesine yazılır.
2. Eski Android uygulamasından JSON yedeği al. APK'yı indir ve güncelleme olarak yükle. Bu paketin uygulama kimliği `com.zaman.ajanda`, versionCode değeri 1170'tir. Bu çalışmada eski 1.2.0 test APK'sıyla imza sertifikası eşitliği doğrulandı. Telefonunda farklı imzalı bir paket varsa güncellemeyi zorlamak için uygulamayı/verilerini silme; hatayı paylaş.
3. Seiri → Ayarlar → Hesap ve bağlantı → Google ile giriş yap. Sistem tarayıcısında Windows'ta kullandığın Google hesabını seç; Android'e geri döner.
4. **Hesabımın kişisel alanını aç**: Windows'tan gelen kayıtları açar. Windows'taki notları tekrar içe aktarma. İkinci cihaz eski verileri ayrıca taşımadıkça aynı notlar çoğalmaz.
5. Telefonda eski yerel notlar varsa **Bu telefondaki verileri hesabıma aktar**, ardından **Hazırlanan aktarımı tamamla** kullanılır. Kaynak yerel veri korunur. Güvenli ilk taşıma boş hedef alan için sunulur; dolu hedefe sessizce üzerine yazılmaz. Mevcut JSON içe aktarma aynı kimlikli kayıtta yedekteki sürümü tercih eder; dolu hedefte kullanmadan önce iki alanın da yedeğini al.

Gerçek telefon–Windows denemesi kullanıcının isteğiyle sona bırakıldı. Yeni SQL migration, Google client secret veya service_role istemci anahtarı gerekmiyor.

## Eşitlemenin kapsamı

Normal notlar, hızlı gün notları, etkinlik/görev/tekrar kayıtları, kategoriler, dersler, checklistler, odak oturumları ve özel şablonlar; bunlara bağlı JPEG/PNG/PDF dosyaları, kapak ve not içi görseller. Aynı Google hesabının kişisel çalışma alanı kullanılır. Ekip eşitlemesi bu sürümde etkin değildir.

Windows'un hassas etkinlikleri buluta/telefona gönderilmez. Android beta içinde yeni hassas etkinlik oluşturma da kapalıdır; normal kayıtlar için uçtan uca şifreleme iddiası yoktur. Supabase tarafında RLS, hesaplar arasında erişimi sınırlar. Oturum/PKCE bilgileri Android Keystore anahtarıyla AES-256-GCM şifreli dosyada saklanır. Anahtar dışa aktarılmaz; donanım korumasının seviyesi cihaza bağlıdır. Oturum arayüz DOM'una, localStorage'a veya not yedeğine konmaz; SDK'nın geçici belleğinde işlenir.

Her hesabın WebView kökeni ayrıdır: eski yerel veri `https://appassets.androidplatform.net` üzerinde kalır; hesap verisi `https://u-<UUID>.appassets.androidplatform.net` üzerinde açılır. Yerel dosyalar ve geçmiş IndexedDB/localStorage alanları bu kökenlerle ayrılır. Anahtar kasası ve oturum depoları not yedeğine girmez. Normal yerel kayıtlar/yedekler ayrıca şifrelenmiş değildir.

Eski sayfanın gecikmiş isteği yeni hesaba yazmasın diye belgeye özel bağlama anahtarı ve istek nesli kontrolü yapılır. Çıkış Bu telefon alanına döner. Kayıtlar hesap değişiminde otomatik birleştirilmez.

## Çevrimdışı ve çakışma

Değişiklikler önce yerelde kaydedilir; aynı Windows motorunun atomik günlüğü gönderim kuyruğunu korur. Bağlantı gelince revizyon kontrolüyle tekrar denenir. Notlarda son düzenleme ve alan birleştirmesi uygulanır; önceki metin normal kart yerine sürüm geçmişinde korunur. Not dışındaki çakışma koruması devam eder. Yanıtı kaybolan başarılı ekleme, deterministik kimlikle doğrulanarak tekrar kayıt açmaz. Silme soft delete ile taşınır. Silme revizyon yarışında korunur; eski çevrimdışı düzenleme notu diriltemez.

Uygulama açıkken yaklaşık 30 saniyede bir ve ön plana/ağa dönünce kontrol yapılır. Android bu beta sürümünde arka planda sürekli senkronizasyon veya anlık push sözü vermez. Windows'un Realtime bildirimi/periodik kontrolü Android yazılarını görür. Uygulama kapalıyken telefona henüz çekilmemiş yeni etkinliğin bildirimi planlanamaz. Telefona çekilip izinleri verilmiş yerel hatırlatmalar AlarmManager ile uygulama kapalıyken de teslim edilebilir; Android pil/izin ayarları zamanı etkileyebilir.

Çalışan zamanlayıcı, ayarlar/profil/arka plan, taslaklar, eski yerel sürüm geçmişi, yeniden planlama geçmişi ve ayrı tamamlama olay günlüğü cihazda kalır. Not/görevin güncel tamamlanma durumu ve bitmiş odak oturumları eşitlenir. Açık yazı sayfasının metni uzaktan değiştirilmez; kapandıktan sonra değişiklik veya çakışma uygulanır.

Not içeriği 256 KiB, kayıt özellikleri yaklaşık 30 KB, dosya 10 MB. Sunucunun mevcut beta dosya rezervasyonu kullanıcı/kişisel alan başına 40 MB'dır. Görsel referansını kaldırmak eski Storage nesnesini otomatik kalıcı silmez veya rezervasyonu boşaltmaz. Kalıcı bulut dosya temizliği ve hesap silme genel yayın öncesi ayrıca tamamlanmalıdır. Kota veya ağ hatasında yerel kopya korunur. Yerel JSON yedeği aynı cihazdaki disk arızasına karşı harici yedeğin yerini tutmaz. Android'in mevcut dışa aktarma köprüsü tek işlemde 48 MB sınırı kullanır.

## Derleme

Android SDK Platform 36 + Build Tools 36.0.0, Java 21, Node/npm ve Python gerekir. `npm ci --ignore-scripts` ve `python scripts/package_web.py` güncel arayüz ve bulut paketini üretir. Esbuild, @supabase/supabase-js 2.119.1 ve buffer 6.0.3 kilit dosyasıyla kuruludur. Gradle/Android Studio projesi de dahildir.

Paket bağlantısı `SEIRI_SUPABASE_URL` ve `SEIRI_SUPABASE_PUBLISHABLE_KEY` ortam değişkenlerinden `python scripts/configure_cloud.py` ile üretilir. Üretilen `app/src/main/assets/cloud-config.json` kaynak ZIP ve Git dışında kalır, APK içinde bulunur. Yalnızca public publishable anahtarı kabul edilir; bu dosyada secret/service_role/Google secret yer almaz.

`python scripts/build_apk.py --sdk /ANDROID_SDK_YOLU --output /CIKTI/Seiri_Android_1.18.0_test.apk` statik kontrolleri, gerçek paket JS'i ile simülasyon testini, Java kaynak derlemesini, JVM OAuth politika testini, DEX dönüşümünü, kaynak paketlemesini, test imzasını ve zipalign/apksigner doğrulamasını çalıştırır. APK aynı test sertifikasıyla imzalanır. Üretim sürümü için bu paylaşılan test anahtarı yerine ayrı, korunan yayın anahtarı ve mağaza hesap silme/gizlilik süreçleri gerekir.

Ortak motor dosyaları `shared/` altındadır. `windows-protocol.json`, kaynak alınan Windows 1.18.0 dosyalarının SHA-256 özetlerini tutar. Android'e özel uyarlamalar `cloud/` içindedir. `CloudBridge.java` yerel hesap alanı, OAuth dönüşü, güvenli oturum ve yedek işlemlerini sağlar. `MainActivity.java` yalnızca paketlenmiş etkin hesap kökenini gösterir; Supabase HTTPS istekleri haricindeki arka plan ağ erişimini açmaz. JavaScript dosyaları paket içidir; HTML'de script-src unsafe-inline yoktur.

## Test kontrol listesi — en son gerçek cihazlarda

- [ ] Android'e eski APK üzerine güncelle; eski yerel not ve dosyalar durmalı.
- [ ] Google girişi sistem tarayıcısına gitmeli, izin verilince Seiri'ye dönmeli. İptal/yanlış nonce/süre dolması ayrıntı veya oturum açmamalı. Uygulama kapanıp geri açıldığında şifreli oturum okunmalı.
- [ ] Windows 1.18.0 kişisel alanında oluşturulan not/kapak/görev, Android'de aynı hesapla görünmeli. Telefon düzenlemesi Windows'a dönmeli; aynı kayıt iki kart olmamalı.
- [ ] JPEG/PNG/PDF iki yönde aktarılmalı, indirilen içerik aynı olmalı.
- [ ] İnterneti kapat, değiştir, uygulamayı kapat/aç, bağlantıyı aç: yazı ve kuyruk korunmalı.
- [ ] İki cihazda aynı notu farklı değiştir: tek not kartı olmalı; önceki metin Sürüm geçmişi içinde bulunmalı.
- [ ] Bir notu sil: diğer cihazın çöp kutusuna taşınmalı. Açık yazı sayfasının imleci/metni uzaktan sıçramamalı.
- [ ] A hesabından çıkıp B'ye gir: A'nın not, kapak, taslak ve yerel yedekleri B alanında görünmemeli. Gecikmiş istekler yeni hesaba yazmamalı.
- [ ] Sunucuda A JWT'siyle B'nin workspace/file_assets/Storage verisi okunamamalı veya değiştirilememeli. Windows kaynak projesindeki `supabase/tests/rls_smoke.sql` temel RLS kontrolünü rol değiştirip ROLLBACK ile sınar; doğrudan postgres admin rolüyle SELECT yapmak RLS testi değildir.
- [ ] Çıkış/alan değişiminde eski alanın bildirimleri temizlenmeli; yeni alanın yerel alarmları yeniden planlanmalı. Odak sayacı bitişi için izinli yerel bildirim sınanmalı.

Bu çalışmada gerçek paketlenmiş JS/SDK ile Windows motoru aynı simüle sunucuda iki yönlü not, dosya, offline ve silme testlerini geçti. Native Java kodu SDK36 ile derlendi; nonce/PKCE/host/süre kuralları JVM'de test edildi. Eski APK ile sertifika ve appId uyumluluğu kontrol edildi. Gerçek Android cihaz/emülatör, Keystore donanımı, Google dönüşü ve iki cihazda canlı Supabase testi henüz çalıştırılmadı. DOGRULAMA.json bu ayrımı korur.

## Geri alma

Önce Bu telefon ve hesap alanından ayrı JSON yedekleri al. Android düşük versionCode ile geriye kurulumu kısıtlayabilir; uygulamayı silerek geri dönmek yerel verileri ve Keystore anahtarını kaybettirir. Geri dönüş gerektiğinde verileri koruyan daha yüksek versionCode'lu düzeltme paketi tercih edilir. Windows paketi de 1.18.0 olarak güncellendi; önceki ZIP ayrı saklanmalıdır.

Resmi başvuru: https://supabase.com/docs/guides/auth/native-mobile-deep-linking ve https://developer.android.com/privacy-and-security/keystore.
