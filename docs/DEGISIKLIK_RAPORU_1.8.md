# Seiri 1.8.0 · Optime Technology

Uygulama adı FocusFlow → Seiri, marka Kaisen Technology → Optime Technology olarak değiştirildi. Başlık, intro, menüler, özellik penceresi, hatırlatma metinleri, yedek/dışa aktarma adları, Windows Hello istemi, EXE sürüm/simge kaynakları ve kurulum güncellendi. Roket simgesi korunur. Kullanıcı verisi, şifreli kasa, yerel origin ve veri anahtarları değiştirilmez.

Not kartına kapak ekleme/değiştirme/kaldırma eklendi. JPG/PNG/WebP cihazda decode edilip küçültülür, en fazla 768 KB JPEG Blob olarak mevcut IndexedDB dosya deposuna yazılır. Notta yalnızca küçük metadata bulunur. Kapak dosya eki sayısını tüketmez. Not metni ve mevcut ekler korunur. Kullanılmayan kapak dosyası temizlenir; geçmiş/başka kayıt referansı varsa saklanır. Büyük, hatalı veya desteklenmeyen içerik Türkçe hata verir. Disk/kayıt hatasında eski kapak korunur. JSON yedekleri görselleri içerir ve içe aktarma dosya varlığını/MIME/boyutunu doğrular.

## Değişen dosyalar

- web/ui/cover-model.js, note-covers.js, note-covers.css: yeni kapak modeli, yönetim ve görünüm.
- web/ui/study.js: not kartı ve açık not kapak menüsü.
- web/ui/app.js: kapakları dosyalı yedeğe dahil etme / içe aktarma.
- web/ui/index.html, modern.js, planner.js, privacy.js, team.js, note-export.js: görünür marka ve yeni kaynaklar.
- desktop/main.cjs, windows-hello.ps1, adapter.js: marka.
- desktop/install.ps1: yeni kurulum yolu ve bilinen eski kısayol/başlangıç tercihi geçişi.
- scripts/brand_windows.py, package_windows.py, package_web.py: yeni PE markası, paket adı ve yeni kaynaklar.
- scripts/test_covers.mjs: kapak işlemi, doğrulama, rollback ve dosya temizleme testleri.
- scripts/test_migration.mjs, test_workspace.mjs, package.json: yeni marka beklentisi/sürüm/test.
- README_TR.md, DOGRULAMA.json ve üretilen app/ kaynakları.

## Test kontrol listesi

Otomatik: önceki tüm testler; yeni kapak ekleme/değiştirme/kaldırma; şüpheli ID/MIME/boyut reddi; not/ek/sabitleme korunumu; dosya yazma ve metadata kaydetme hatasında geri alma; kapak referansının JSON turunda korunması. Yerel origin/veri yolu sürekliliği ve Windows PE ürün/şirket adı doğrulanır.

Tarayıcı: PNG yükleme, JPG ile değiştirme, kaldırma, tekrar ekleme, yeniden yüklemede korunma, JSON yedeği ve içe aktarma, tam sayfa not alanı, yeni marka yüzeyleri. Önizleme köprüsü ve test görselleri dağıtım paketine dahil edilmez.

Gerçek Windows'ta: Kur.cmd kurulumu; eski not/kasa/eklerin gelmesi; otomatik başlangıç tercihi; Windows Hello ve bildirimler; yerel görsel seçicisi. Bu donanım/işletim sistemi kontrolleri yapılmadı.

## Geri alma

Önce JSON yedeği ve uygulama kapalıyken %APPDATA%\Zaman kopyası alın. Eski paketi ayrı klasörden çalıştırabilirsiniz; eski sürüm kapak alanını göstermeyecektir. Eski sürümde değiştirilmiş kayıtları yedeksiz taşımayın. Yeni yedekler yalnızca uygulama tarafından oluşturulmuş yerel görselleri içerir; hassas anahtarlar ayrıca yedeklenir.
