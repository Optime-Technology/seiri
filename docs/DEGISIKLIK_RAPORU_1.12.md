# Seiri 1.12.0 — sakin çalışma akışı ve veri güvenilirliği

## Uygulanan kararlar

- Üç ana alan: Planım, Notlarım, Odak. Roket menüsü aynı alanları açar.
- Günüm ekranı: günün etkinlikleri ve bekleyen/tarihsiz görevler. Çalışma tarihi başka gün olan görevler o günün listesine girmez.
- Görevler ve checklistler Planım'da; istatistik ve oturum geçmişi Odak'ta.
- Notlarım doğrudan kütüphane. Yeni notta yalnızca başlık zorunlu; diğer özellikler katlanır. Yazı ekranı tam sayfa kalır.
- Çalışmayan Windows ekip/hesap geçişleri kaldırıldı; yerel profil Ayarlar'da.
- Her not için kimlik/oturum/revizyon tabanlı taslak günlüğü. Eski kayıt işlemi yeni taslağı temizleyemez. Kurtarma listesi birden fazla notu gösterebilir.
- Kayıt hataları görünür; daha yeni yazı varsa eski kaydın tamamlanması Kaydedildi etiketi göstermez. Bozuk ana veri son geçerli kopyadan okunur; kurtarılamayan alanın üzerine otomatik boş veri yazılmaz.
- Yedi döngülü yerel JSON kopyası; değişiklik varsa uygulama çalışırken 30 dakikada bir. 128 MB/kopya. Yazma ve fsync sonrası atomik yeniden adlandırma; ancak bundan sonra eski kopyalar temizlenir.
- Yerel yedek listeleme, dışa aktarma, mevcut kayıtlarla birleştirerek geri yükleme. Ön doğrulama, eşzamanlı içe aktarma kilidi ve hata durumunda önceki küçük verileri/dosyaları geri alma.
- Pembe, zarif roket. SVG/PNG/ICO ve sürüm bilgisi ortak üretim aracından gelir. Pencere başlığındaki eski sürüm düzeltildi.
- Kurulum önce ayrı dizinde hazırlanır, EXE hash değeri kontrol edilir, önceki kurulum saklanır. Otomatik güncelleme eklenmedi.

## Değişen dosyalar

Ana arayüz: web/ui/app.js, study.js, modern.js, planner.js, seiri-shell.js, workspace-ui.js, seiri-design.css, rocket.js ve index.html.

Yeni bileşenler: web/ui/draft-journal.js, durable-storage.js, local-backups.js; desktop/backup-store.cjs. Masaüstü: main.cjs, preload.cjs, install.ps1, adapter.js.

Marka: tools/build_brand.py, desktop/brand-rocket.svg, icon.png, icon.ico, seiri-icon-master.png, üretilen web/ui/brand.js. Eski kullanılmayan altın ana simge kaldırıldı.

Paketleme/belgeler: scripts/package_web.py, scripts/package_windows.py, package.json, requirements-build.txt, README dosyaları ve üretilen app/ çıktıları.

Yeni testler: test_reliability112.mjs, test_backup_roundtrip112.mjs, test_dom112.mjs. Mevcut intro testi ortak marka kaynağını yükleyecek şekilde güncellendi.

## Yapılan doğrulamalar

Mevcut test paketi; disk/rename/kota hatası, yedek döngüsü, dizin/symlink engeli, taslak yarışları ve çoklu not; temiz veri alanında metin/görsel/PDF/listeler/oturum/profil/tema dönüşü; hata sonrası eski verinin geri alınması. Simüle DOM/masaüstü ortamında gerçek uygulama betikleriyle üç alan, yalnız başlıkla not oluşturma, pencere kapanışı sonrası IndexedDB taslağı kurtarma, yerel yedek düğmesi ve silinen notu yedekten geri yükleme.

Simüle DOM testi görsel kabul veya fiziksel Windows testi değildir. Kurulum, Windows Hello/DPAPI, ekran ölçekleri ve gerçek cihaz çökme testi bu ortamda tamamlanmadı. docs/WINDOWS_KABUL_KONTROLU.md kullanılmalı.

## Sınırlar ve geri alma

Ani güç kesintisinde en son tuşların kalıcılığı garanti edilmez. Yerel kopyalar aynı diskte ve şifrelenmemiş JSON biçimindedir; hassas etkinlikler şifreli alanlarını korur, anahtar kasası yedeğe dahil değildir. Disk arızasına karşı ayrı harici yedek gerekir. Bulut, ekip backend'i, otomatik güncelleme ve mağaza dağıtımı bu pakete eklenmedi.

Geri almak için JSON yedeğini alıp uygulamayı tepsiden kapatın. Önceki Windows paketini yeniden kurun; %APPDATA%\Zaman klasörünü silmeyin. Yeni taslak ve yedekler ek alanlardadır; not veri biçimi önceki sürümle uyumlu kalır.
