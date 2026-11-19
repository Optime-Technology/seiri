> 1.16.0 güncellemesi: mevcut migration tekrar çalıştırılmaz. Windows kişisel alan/kayıt/dosya eşitlemesi eklendi. Kullanım ve sınırlar: docs/SENKRONIZASYON_1.16.md. Google Client Secret veya service_role paylaşmayın.

# Seiri Supabase kurulumu — 1. adım

> Güncel 1.15.0 durumu: kullanıcı SQL kurulumunu tamamladı; Google sağlayıcısı açık. Windows Google girişi eklendi. Dönüş adresi ve test için docs/GOOGLE_GIRIS_1.15.md dosyasını izleyin. Aşağıdaki ilk aşama açıklamaları tarihsel kurulum kaydıdır; migration'ı yeniden çalıştırmayın. Not/dosya eşitlemesi henüz etkin değildir.

Proje adresi: https://sgytbatqphacuygmcdxg.supabase.co

16 Kasım 2026'da verilen publishable anahtarla Auth settings uç noktası HTTP 200 döndürdü. Google sağlayıcısı kapalı, e-posta sağlayıcısı açık göründü. Yönetim ayarı veya canlı kullanıcı verisi değiştirilmedi. Anahtar bu kaynak dosyalarına gömülmedi. Publishable anahtar tablo kurmaya veya Google sağlayıcısını yapılandırmaya yetmez; yönetim parolası paylaşmak yerine SQL Editor kullanılacak.

Bu aşama yalnızca veritabanı temelidir. Windows sürümünde Google giriş ekranı, kuyruk ve çalışan Supabase eşitlemesi henüz eklenmedi. Mevcut Windows sürümü 1.14.1 olarak kalır; bu adım için uygulamayı yeniden kurmak gerekmez.

## Şimdi yapacağın tek işlem

1. Supabase Dashboard'da **sgytbatqphacuygmcdxg** projesini aç.
2. Sol menüde **SQL Editor → New query** seç.
3. **migrations/202611160001_seiri.sql** dosyasını bir metin düzenleyicide aç; tüm içeriği kopyalayıp sorguya yapıştır.
4. Sorgunun tamamını **Run** ile bir kez çalıştır. Dosya tek transaction içerir. Hata olursa hiçbir kısmını atlayarak sürdürme veya mevcut tabloları silme; hata metnini paylaş. Daha önce aynı dosya başarıyla çalıştıysa tekrar çalıştırma.
5. **Table Editor → public** altında profiles, workspaces, memberships, notes, agenda_items, invites, courses, categories, checklists, focus_sessions, note_templates, preferences ve file_assets tablolarını kontrol et.
6. **Storage** altında **seiri-files** bucket'ı oluşmalı; **Public kapalı** kalmalı.

Başarılı sonuç genellikle **Success. No rows returned** şeklindedir. Bu sonucu bildirdiğinde Google sağlayıcısı ve uygulama PKCE dönüşüyle devam edilecek. Veritabanı parolası, service_role, secret veya Google Client Secret gönderme.

## Oluşturulan yetkiler

- Yeni kullanıcıya profil, kişisel tercihler, Kişisel workspace ve owner üyeliği otomatik açılır. Var olan Auth kullanıcıları da ilk kurulumda doldurulur.
- Yalnızca üyeler kendi alanlarını görür. Member kendi kayıtlarını, admin/owner alanın kayıtlarını düzenler. Silme deleted_at ile yapılır; istemci içerik tablolarından kalıcı DELETE yapamaz.
- Doğrudan memberships, workspaces veya invites yazımı yoktur. Ekip oluşturma, davet, rol değişimi, çıkarma ve devir RPC ile yapılır.
- Owner yöneticilik rolü verir; admin yalnızca member daveti açabilir. Owner kişisel alanını devredemez/silemez. Son kurucu çıkarılamaz.
- Her kayıtta sunucu updated_at, satır revision ve workspace sync_revision bulunur. Sonraki istemci UPDATE isteğinde beklenen revision filtresi kullanacak; eski revizyon sessizce üstüne yazmayacak.
- Dosyalar özel bucket'tadır. Önce seiri_register_file ile rezervasyon; sonra object_path adresine yükleme gerekir. Yetkiler Storage nesnelerinde de denetlenir. Aynı nesnenin üstüne yazılmaz.
- Beta sınırları: not/açıklama içeriği 256 KiB, tek dosya 10 MiB, kullanıcı başına ve workspace başına 40 MiB rezervasyon, proje için 900 MiB rezervasyon koruması. Soft delete tek başına kotayı açmaz; Storage nesnesi kaldırıldıktan sonra seiri_purge_file gerekir. Bunlar ücretsiz planın sınırsız kullanılmasını garanti etmez; kalan proje kullanımı ayrıca izlenir.
- Normal içerik sunucuda okunabilir metindir. RLS uçtan uca şifreleme değildir. Hassas etkinlikler, anahtar aktarımı ayrıca çözülmeden buluta taşınmayacak.
- Anlık değişiklik bildirimi seiri:<workspace UUID> adlı private Broadcast kanalıyla yapılır. Payload yalnızca changed=true içerir; not başlığı, üye kimliği veya içerik taşımaz. İstemci yeniden okurken RLS tekrar uygulanır. Postgres Changes DELETE olaylarının RLS sınırlaması nedeniyle içerik/üyelik tabloları o yayına eklenmez. Bildirim teslimi bir veritabanı kaydının başarılı olmasının şartı değildir; istemci ayrıca düzenli/artımlı pull yapacak.
- Tüm yeni public tablolarında RLS ve açık authenticated GRANT'leri bulunur. anon'a bu tablolar veya RPC'ler açılmaz.

## Test durumu

Yerel PGlite/PostgreSQL motorunda üç kullanıcıyla şema ve yetki testleri geçti. Auth ve Storage şemaları testte temsil edildi; Supabase'in gerçek Google OAuth, HTTPS Storage ve Realtime teslimi henüz test edilmedi. Sonuç: TEST_SONUCU.json. Canlı projede migration henüz tarafımızdan çalıştırılmadı.

İsteğe bağlı canlı RLS kontrolü için Authentication → Users altında en az iki test kullanıcısı olunca tests/rls_smoke.sql SQL Editor'de çalıştırılabilir. Yalnızca geçici örnek notlar oluşturup ROLLBACK yapar; A/B erişimini test eder. İlk aşamada iki test hesabı oluşturmadan bu dosyayı çalıştırmak gerekmez.

## Google ile giriş — sonraki adımın hazırlığı

Google Auth Platform'da Seiri için uygulama ve **Web application** OAuth istemcisi gerekir. Google istemcisinin Authorized redirect URI alanında kullanılacak Supabase callback adresi:

https://sgytbatqphacuygmcdxg.supabase.co/auth/v1/callback

Google Client ID ve Client Secret, yalnızca Supabase **Authentication → Sign In / Providers → Google** ekranına girilecek. Secret uygulamaya veya GitHub'a yazılmayacak. Supabase'den masaüstü uygulamasına dönüş adresi farklıdır; PKCE uygulaması hazırlanırken kesin adres verilecek. Bu adımda rastgele bir Site URL veya wildcard redirect ekleme.

Google test modundaysa kullanılacak Google hesaplarını Audience/Test users listesine eklemek gerekir. Genel yayından önce audience, temel openid/email/profile izinleri ve dönüş akışı gerçek cihazda doğrulanacak. Varsayılan e-posta göndericisi genel kayıt/şifre sıfırlama yayını için uygun olmadığı için ilk aşamada Google girişi seçildi.

## İstemci entegrasyonunda devam edecek işler

Kullanıcıya göre yerel veri ayrımı, güvenli token saklama, ilk girişte açık seçimle taşıma, kalıcı offline kuyruk, artımlı kayıt/dosya eşitlemesi, çatışma kopyaları ve görünür durum etiketleri. Bu SQL'i çalıştırmak tek başına mevcut uygulamayı eşitlemeye başlatmaz. Eşitleme tamamlanınca en az iki hesap/iki cihaz, kota/ağ/çakışma ve hesap değişimi testleri yapılmadan genel yayın yapılmayacak. Hesap silme ve Storage temizliği ayrıca uygulanacak.

Kaynaklar: https://supabase.com/docs/guides/database/postgres/row-level-security · https://supabase.com/docs/guides/database/functions · https://supabase.com/docs/guides/auth/social-sign-in/auth-google · https://supabase.com/docs/guides/auth/auth-smtp · https://supabase.com/docs/guides/realtime/authorization · https://supabase.com/docs/guides/realtime/postgres-changes
