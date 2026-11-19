# Seiri — tamamlanması için dış hazırlık gereken işler

## Supabase ve çok cihazlı kullanım

Kullanıcı henüz Supabase projesi olmadığını belirtti. Bu sürümde kayıt/giriş veya eşitleme varmış gibi gösterilmez. JSON yedek taşımak senkronizasyon değildir.

Sonraki uygulama adımı için gerekenler: Supabase projesi ve bölgesi; uygulama bağlantısı için proje URL'si ve yalnızca herkese açık publishable/anon anahtarı; kimlik sağlayıcı/geri dönüş adresleri; test kullanıcıları. service_role istemciye, depoya veya sohbet içine konulmamalıdır. Güncel ücretsiz plan kotaları ve duraklatma koşulları proje paneli ve resmi belgelerden o adımda doğrulanmalıdır. Ücretli servis gerektiren bir kurulum bu sürümde önerilmez.

Uygulanacak tasarım: RLS ile kullanıcı/workspace ayrımı; üyelik/davet işlemleri kontrollü RPC; yerel değişiklik kuyruğu ve tekrar güvenli kimlikler; tombstone ile silme; saat farkını dikkate alan sunucu sürümü/updated_at çatışma kararı; gerçek iki hesapla yetki testleri ve çevrimdışı geri dönüş. Hassas içerik için anahtar kaybetme/cihazlar arasında aktarım tasarımı ayrıca çözülecek; şifreli blokları sunucuya koymak tek başına ikinci cihazın açmasını sağlamaz.

## Yayıncı imzası

Bu çıktı imzasızdır. desktop/sign-windows.ps1 yalnızca mevcut uygun bir PFX ve güven zinciri varsa çalışır. Betik sertifika sağlamaz; imza uyarılarının kalkacağını veya SmartScreen itibarını garanti etmez. PFX/parola kaynak koda eklenmez. GitHub → Repository Settings → Secrets and variables → Actions içinde SEIRI_SIGN_PFX_BASE64 ve SEIRI_SIGN_PASSWORD kullanılabilir. Sertifika yokken bu alanları boş bırakın; ücretli bir satın alma bu planın gereği değildir.

## Dağıtım ve mağazalar

GitHub'a paket yüklemek ve .github workflow dosyasını depoya koymak kullanıcı tarafından yapılmalıdır; bu çalışma uzaktaki depoyu değiştirmedi. Güncelleme sorgusu yayımlanan GitHub sürümlerini okur, yerel hazırlanan ZIP'i otomatik yayımlamaz.

Play Store/App Store/Microsoft Store başvuruları, geliştirici hesabı, mağaza incelemesi ve fiziksel platform kabulü bu Windows paketinden ayrıdır. Mağaza kabulü veya sıfır yayın maliyeti garanti edilmez. Bu sürümde mağaza başvurusu yapılmadı.

## Teknik borç

Yeni ders/arama/geçmiş kuralları ayrı modüllere çıkarıldı. Eski global JS ve üretim CSS katmanları tamamen yeniden yazılmadı. İleride küçük sınırlar üzerinden servis/modül ayrımı sürdürülmeli; bütün projeyi aynı anda yeniden yazmak bu veri güvenliği sürümünün kapsamı değildir.

