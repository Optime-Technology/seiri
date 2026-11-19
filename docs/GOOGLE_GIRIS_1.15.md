# Seiri 1.15.0 · Google girişi

## SENİN YAPACAKLARIN

1. Supabase projen → Authentication → URL Configuration → Redirect URLs → Add URL. Şu adresi ekle ve kaydet:

   `http://127.0.0.1:43189/auth/callback/*`

   Yıldız, her giriş için rastgele üretilen dönüş yolunu kabul eder. Site URL'yi yerel adrese çevirmene gerek yok.
2. Google Cloud içindeki Web application istemcisinin Authorized redirect URIs alanındaki Supabase callback adresi aynı kalmalı:

   `https://sgytbatqphacuygmcdxg.supabase.co/auth/v1/callback`

   Yukarıdaki localhost adresi Google Cloud'a eklenmez; Supabase izin listesine eklenir. Google Auth Platform → Audience kısmı Testing ise giriş denenecek Google adresini Test users listesine ekle. Client secret yalnızca Supabase Google sağlayıcısı ayarında bulunur.
3. Eski Seiri'de JSON yedeği al, tepsi simgesinden Çıkış yap. Yeni ZIP'i tamamen çıkarıp Kur.cmd veya klasördeki Seiri.exe ile aç. %APPDATA%\Zaman klasörünü silme.
4. Ayarlar → Hesap ve bağlantı → Google ile giriş yap. Sistem tarayıcısında hesap seç; Seiri geri geldiğinde Google hesabı ve kişisel çalışma alanı doğrulandı mesajını kontrol et.

## Bu adımın kapsamı

Gerçek Google PKCE girişi, signup trigger'ının oluşturduğu kişisel çalışma alanını RLS altında doğrulama, işletim sistemi korumalı kalıcı oturum ve çıkış vardır. Not/dosya senkronizasyonu, yerelden buluta taşıma, hesap bazlı yerel kayıt ayrımı ve ekip eşitlemesi henüz yoktur. Mevcut içerik sunucuya gönderilmez. Google ad/e-posta kimliği ayrı hesap panelinde görünür; yerel profil değiştirilmez.

SDK oturumu ve PKCE doğrulayıcısı ana süreçte saklanır. Windows'ta Electron safeStorage işletim sistemi şifrelemesini kullanır. Diskteki oturum dosyası %APPDATA%\Zaman\Seiri Cloud\auth-session.json konumundadır. Bu dosya not yedeği değildir; başka Windows hesabına taşınarak kurtarılamayabilir. Güvenli depolama kullanılamazsa düz metne düşülmez ve giriş başlatılmaz. Başka uygulama 43189 portunu kullanırsa anlaşılır hata gösterilir. Dönüş dinleyicisi yalnızca 127.0.0.1 üzerinde, rastgele 256 bit yol ve PKCE ile, en fazla üç dakika açılır.

Bozuk/okunamayan oturumda panelde Kayıtlı oturumu temizle kullanılır. Notlara dokunulmaz. Çevrimdışı çıkış cihazdaki tokenları temizler; sunucu iptali doğrulanamadı mesajı varsa önceki erişim tokenının sunucuda süresi bitene kadar geçerli olabileceği dikkate alınmalıdır. Çıkış Google hesabının tarayıcıdaki oturumunu kapatmaz.

## Test kontrol listesi

- [ ] Google girişini iptal et: uygulamada oturum açılmamalı; yeniden giriş yapılabilmeli.
- [ ] Başarılı girişte doğru e-posta ve Kişisel alan gösterilmeli. Supabase → Authentication → Users içinde kullanıcı; Table Editor içinde profiles/workspaces/memberships satırları görünmeli.
- [ ] Tepsiden tamamen çık ve yeniden aç: internet varken kayıtlı oturum yeniden doğrulanmalı.
- [ ] İnterneti kes ve yeniden kontrol et: bağlantı hatası anlaşılır olmalı; yerel notlar kullanılabilmeli; doğrulanmamış oturum başarılı gibi gösterilmemeli.
- [ ] Çıkış: panelde e-posta kaybolmalı, yeniden açılışta hesap bağlı görünmemeli. Yerel notlar aynı kalmalı.
- [ ] İki Google hesabı için ayrı Windows kullanıcı profilleriyle dene. A'nın kimliğiyle B'nin workspace ID'sine authenticated istemciden sorgu gönderildiğinde satır dönmemeli; insert/update yetkisiz olmalı. SQL Editor varsayılan postgres rolü RLS'yi atlar: bu test admin sorgusuyla ölçülmez. Ayrıntılar supabase/tests/rls_smoke.sql içindedir.
- [ ] auth-session.json dosyasında e-posta/access_token/refresh_token düz metin görünmemeli; JSON yedek ve tanılama çıktısında token bulunmamalı. Tokenları ekran görüntüsünde paylaşma.
- [ ] Not düzenleyici, görseller, öğretici, Pomodoro ve yedekten dönüş çalışmaya devam etmeli.

## Derleme ve geri alma

Node/npm ve Python gereklidir. `npm ci --ignore-scripts`, `npm run build:web`, `npm test`, `npm run test:dom` çalıştırılır. Yerelde Electron açmak için Electron'un resmi çalışma zamanı ayrıca kurulmalıdır (`npm rebuild electron`). Paketleme betiği resmi Windows runtime'ı indirip SHA-256 doğrular, SDK'nın yalnızca üretim bağımlılıklarını ayrı önbellekte kurar ve pakete ekler.

SEIRI_SUPABASE_URL ve SEIRI_SUPABASE_PUBLISHABLE_KEY ortam değişkenlerinden `npm run configure:cloud` ile desktop/cloud-config.json üretilir. Bu dosya git/kaynak ZIP dışında kalır. Windows paketindeki publishable anahtarı herkese açıktır; veri erişimi RLS ve kullanıcı tokenıyla korunur. Kaynak koduna secret/service_role/Google secret eklenmez.

Değişen ana dosyalar: desktop/auth-store.cjs, desktop/cloud-auth.cjs, desktop/main.cjs, desktop/preload.cjs, web/ui/cloud-auth-ui.js, web/ui/modern.js, web/ui/index.html, scripts/configure_cloud.py, scripts/package_web.py, scripts/package_windows.py, scripts/test_cloud115.mjs, scripts/test_dom115.mjs, package.json ve package-lock.json. app/ ve marka dosyaları yeniden üretilir.

Geri almak için bu sürümde çıkış yap, tepsiden uygulamayı kapat ve önceki 1.14.1 paketini aç. Yerel not veri biçimi ve origin değiştirilmedi; %APPDATA%\Zaman silinmez. Yerel yedek almak yine önerilir.

Otomatik testler şifreleme sağlayıcısını ve Google SDK yanıtlarını taklit eder; gerçek kurulu SDK ile PKCE challenge üretimi ayrıca sınanır. Gerçek Google hesabıyla uçtan uca giriş, Windows DPAPI ve fiziksel Windows açılışı bu ortamda denenmedi. DOGRULAMA.json bu sınırı açıkça belirtir.

Resmi başvuru: https://supabase.com/docs/guides/auth/social-login/auth-google ve https://supabase.com/docs/guides/auth/sessions/pkce-flow. Konsol menüleri değişirse güncel resmi belgeleri izleyin.
