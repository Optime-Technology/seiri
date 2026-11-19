> Güncel durum (1.16.0): Windows kişisel alanı eşitleme istemcisi eklendi. Gerçek cihaz kabul adımları ve kapsam için SENKRONIZASYON_1.16.md dosyasını izleyin. Aşağıdaki plan tarihsel hazırlık kaydıdır; ekip/Android/web istemcisi ve hesap silme ayrıca tamamlanacaktır.

# Seiri — Supabase ile eşitleme planı

Durum: önerilen sonraki geliştirme; bu 1.14.1 yamasında Supabase bağlantısı veya çalışan eşitleme eklenmedi. Mevcut Windows uygulaması Electron + HTML/CSS/JavaScript kullanıyor. Yerel veriler localStorage ve IndexedDB'de. Eski web /api bağlantıları masaüstü Supabase backend'i değildir.

## Önerilen sıra

1. Supabase Free projesi + Google girişini kur. Sistem tarayıcısında PKCE oturumu ve uygulamaya kontrollü dönüş kullan; Google Client Secret yalnızca sağlayıcı ayarında, Supabase secret/service_role yalnızca sunucuda kalır. Dağıtılan masaüstü programında sadece publishable/anon anahtar kullanılabilir. İlk sürümde Google ile giriş; genel e-posta/şifre kaydı için ayrıca uygun SMTP kurulmadan yayın yapılmaz.
2. Kişisel workspace ve RLS ile hesap ayrımını kur. Altyapı shared workspace üyeliğine uygun olsun; önce aynı hesabın iki cihazda eşitlemesini doğrula, sonra ekip davet/rol arayüzlerini etkinleştir. RLS ve açık GRANT'ler, tablo kadar özel Storage bucket'ına da uygulanmalı.
3. Cihazdaki kayıtları hesap bazında ayır. Yerel değişiklik ile gönderim kuyruğu aynı IndexedDB işlemiyle kalıcılaştırılmalı. Çıkış ve hesap değişiminde A'nın notları B'ye gösterilmemeli/yüklenmemeli. Misafir notları yalnızca açık taşıma seçimi ve yedek sonrası ilk hesaba kopyalanmalı; kararlı kimlikler yinelenen aktarımı önlemeli.
4. Kayıt bazında artımlı eşitleme yap. Notes, agenda/events, tasks, courses, categories, checklistler/maddeleri, sessions, özel templates ve profil için kalıcı kimlik ve sunucu revizyonu kullan. Her tuşta bütün veriyi veya tam yedeği gönderme. Yazma sonrasında kısa gecikmeyle yalnızca değişen kayıtlar gönderilir; yeniden bağlantıda kalıcı kuyruk tekrar güvenli işlenir.
5. Sunucuda beklenen revizyon kontrolü yap. Diğer cihaz değiştirmişse sessizce üstüne yazma: iki metni çatışma kopyası olarak koru, kullanıcıya seçtir. Cihaz saati tek karar kaynağı olmasın. Silme deleted_at/tombstone ile taşınmalı; eski cihaz silinen kaydı diriltmemeli. Realtime yalnızca değişikliği haber verir; kaçan değişiklikler sunucu imleciyle yeniden alınır.
6. Görseller, kapaklar ve dosyalar Storage'da özel bucket'a yüklenir; veritabanında base64 yerine dosya kimliği/yol/hash/boyut/MIME tutulur. Yerel küçültme sürer. Yükleme yarıda kalırsa bağlantı tekrar denenir, not ve dosya durumu ayrı görünür. Kişi başına kota ve toplam kullanım takibi gerekir; limitte veri yerelde korunur, başarılı eşitleme gösterilmez.
7. Arayüzde Eşitlendi / Gönderilecek değişiklik var / Çevrimdışı / Çakışma / Kota-hata ve son eşitleme zamanı göster. İnternet veya ücretsiz proje erişimi kesilince yerel not yazma sürer. Windows başlangıç/bildirim izni gibi cihaza özgü ayarlar her cihaza zorla taşınmaz.
8. Hassas etkinlikler anahtar aktarımı çözülene kadar yalnızca yerelde kalır. Sunucuya düz metin gönderilmez. Çok cihazlı şifreli içerik için parola/kurtarma anahtarıyla anahtar sarmalama ve yeni cihaz yetkilendirme ayrı kabul şartıdır. Normal notlarda yalnızca RLS kullanılması uçtan uca şifreleme anlamına gelmez.

## Ücretsiz planın doğrulanan sınırları

16 Kasım 2026'da resmi sayfalardan kontrol edildi: 500 MB veritabanı, 1 GB Storage, 50.000 aylık aktif kullanıcı, 5 GB egress ve bir hafta hareketsizlikte duraklatma. Bu büyüklükler her kullanıcıya değil ilgili proje/organizasyon kotasına aittir. Otomatik veritabanı yedeği Free planda dahil değildir. Büyük görsel arşivleri için sınırsız ücretsiz bulut sözü verilmemeli. Kotalar kurulurken yeniden doğrulanır.

Supabase'in yerleşik e-posta servisi genel üretim kullanımı için değildir: yalnızca proje organizasyonundaki yetkili adreslere, şu anda saatte iki e-posta sınırıyla çalışır. E-posta doğrulamasını kapatarak bu sınır aşılmamalı. Sıfır bütçeli ilk beta için Google girişi önerilir. Daha sonra e-posta/şifre istenirse ücretsiz gönderim kotası ve gönderen doğrulaması olan SMTP seçeneği ayrıca değerlendirilmeli; ücretli servis zorunlu tutulmamalı.

Kaynaklar:
- https://supabase.com/pricing
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/auth/social-sign-in/auth-google
- https://supabase.com/docs/guides/auth/sessions/pkce-flow
- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/storage/security/access-control

## Kullanıcının hazırlayacakları

Supabase Dashboard → New project: Optime Technology organizasyonu altında Free plan ile Seiri projesi oluştur. Yakın bölgeyi seç; güçlü veritabanı parolasını kendin sakla. Hazır olduğunda proje → Connect içinden Project URL ve publishable key bulunur; tüm anahtarlar Settings → API Keys'tedir. Paylaşılması gereken uygulama bağlantı bilgileri sadece URL ve publishable/anon anahtardır. Veritabanı parolası, secret ve service_role paylaşılmaz veya GitHub'a eklenmez.

Google girişi için Google Auth Platform'da proje, uygulama bilgileri/audience ve OAuth istemcisi; Supabase Authentication → Sign In / Providers → Google ayarı gerekir. Google istemcisinin izinli redirect URI'si Supabase Google provider ekranındaki callback adresidir. Uygulamaya dönüş adresi ise ayrı olarak Supabase URL Configuration'a girilir; masaüstü PKCE dönüşü uygulanırken kesin adres belirlenmelidir. Giriş akışı yayınlanmadan izinli kullanıcılar/audience ve gerçek dönüş test edilir. Bu belge henüz OAuth istemcisi veya yönlendirme oluşturmadı.

## Yayın öncesi kabul

- A kullanıcısı B'nin notunu ve Storage nesnesini okuyamaz/değiştiremez.
- Aynı hesap iki temiz test profilinde: not/etkinlik/görev/ders/checklist/oturum ve görseller aynı kalır.
- İki cihaz çevrimdışı aynı notu değiştirir: iki metin korunur, çatışma anlaşılır biçimde görünür.
- Çevrimdışı silme, tekrar bağlanma ve eski istemci: silinen kayıt dirilmez.
- Yarım dosya yüklemesi ve kota hatası: not kaybolmaz, eşitlendi denmez.
- Misafirden ilk taşıma tekrar denense kayıt çoğalmaz; geri alma yedeği vardır.
- Çıkış/başka hesap/oturum yenileme/iptal: veriler hesaplar arasında karışmaz.
- Proje duraklatılmış veya ağ yok: kullanıcı yerelde çalışmaya devam eder.
- DB yedeği ve Storage dosya yedeği ayrı alınır ve temiz test projesine dönüş denenir. Yerel JSON yedeği korunur; senkronizasyon yedek yerine geçmez.
