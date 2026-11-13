# Seiri 1.9.0 · Optime Technology

## Sonuç

- Yatay not satırları çerçevesiz dikey kartlara dönüştü. Küçük kapak (126 px), başlık, kısa açıklama, kategori/tarih ve mevcut sabitleme/tamamlama kontrolleri korunur. Açıklama boşsa metin önizlemesi gösterilir.
- Not özelliklerine 400 karakterlik Kısa açıklama eklendi. Eski notlar geçerlidir; içerik silinmez.
- Tam sayfa yazıda Fotoğraf düğmesi eklendi. JPG/PNG/WebP yerel olarak küçültülüp JPEG Blob'a dönüştürülür. En fazla 20 fotoğraf / not; 12 MB girdi, 768 KB çıktı / görsel. Fotoğrafa tıklayarak geniş satır / sola / sağa yerleşim, açıklama ve kaldırma seçilir. Metin yandaki görselin etrafında akar.
- Panodan görsel yapıştırma desteklenir. Fotoğraf ekler listesinden ayrıdır. Taslak/pending dosya mekanizması ve otomatik kayıt kullanılır. Eklemeye başlamadan mevcut kayıt işlemi beklenir; hazırlık sırasında kayıt/çıkış dosyanın bitmesini bekler.
- Güvenli HTML filtresi yalnızca yerel data-note-image kimliğini, sınırlandırılmış alt metnini ve üç yerleşim değerini tutar. src, dış URL, event attribute ve keyfi stiller taşınmaz. Görseller açılışta izin verilen metadata üzerinden yerel Blob olarak yüklenir. Kullanılmayan Blob URL'ler iptal edilir.
- Checklists sekmesi: liste oluşturma, başlık/madde düzenleme, madde ekleme/kaldırma/tamamlama ve ilerleme sayacı. Liste silme soft delete'tir; Silinenler'den geri yüklenebilir. 50 etkin liste, 200 madde / liste sınırı. Madde ve başlık değişimi anında kaydedilir. Yedekten dönüşte kimlikler, metinler ve işaretler korunur.
- JSON yedeği kapak, ek, yazı içi görsel dosyaları ve checklistleri içerir. Eski yedeklerde bu alanlar yoksa boş başlatılır. TXT/Markdown fotoğraf içermez.

## Değişen dosyalar

- Yeni: web/ui/checklist-model.js, checklists.js, inline-images.js, notebook-cards.css.
- web/ui/study.js: kart açıklaması, açıklama alanı, fotoğraf düğmesi/snapshot/taslak, yeni sekme, checklist yedeği.
- web/ui/study-model.js: checklist normalizasyonu ve boş başlangıç.
- web/ui/app.js: güvenli yerel IMG filtreleme, fotoğraf metadata'sı ve yedek doğrulaması.
- web/ui/cover-model.js: yazı içi fotoğraflar dahil dosya referansları.
- web/ui/index.html, scripts/package_web.py: yeni yerel kaynaklar ve sıralama.
- web/ui/modern.js, planner.js, desktop/main.cjs, package.json: 1.9.0 sürümü ve yedek bilgisi.
- scripts/test_notebook190.mjs (yeni), test_study.mjs, package_windows.py: yeni testler ve paket kontrolü.
- README_TR.md, DOGRULAMA.json ve üretilen app/ dosyaları.

## Doğrulama

Otomatik: mevcut güvenlik, kategori, kapak, saat, ses, animasyon, vurgu, göç ve planlama testleri; yeni checklist işlemleri, değişmez veri, sil/geri yükle, sınırlar, çalışma yedeğinden dönüş; fotoğraf referanslarının yedeğe dahil olması ve editörden çıkarılmış fotoğrafın snapshot'a girmemesi.

Tarayıcı: dikey kartlar/küçük kapak/açıklama, özelliklerden açıklama kaydı; fotoğraf yükleme, sola yerleşim, kaldırma/tekrar ekleme, yeniden açılışta yerleşim ve dosyanın korunması; checklist oluşturma, iki madde ekleme, işaretleme, düzenleme, silme/geri yükleme; JSON yedek indirme ve içe aktarma. Yedek dosyasında fotoğraf bytes/metadata, src içermeyen yerel HTML, sol yerleşim, açıklama ve checklist işaretleri kontrol edildi. Test görselleri/önizleme köprüsü dağıtım paketinde değildir.

Fiziksel Windows kurulumu, Windows Hello ve donanım FPS ölçümü yapılmadı. Windows EXE x64/PE, ürün markası ve resmi runtime checksum paketleme sırasında doğrulanır. Android/iOS paketleri bu güncellemede yeniden üretilmedi.

## Geri alma

Önce JSON yedeği ve uygulama kapalıyken %APPDATA%\Zaman kopyası alın. Eski paket ayrı klasörden çalıştırılabilir; eski sürüm fotoğraf HTML'ini/checklist alanını tanımadığından o sürümde düzenleme yeni alanları silebilir. Geri alma için güncelleme öncesi veri kopyasını koruyun. Önceki yedekler değiştirilmez. Şifreli kasa anahtar yedeği içerik yedeğinden ayrıdır.
