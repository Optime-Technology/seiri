# Seiri 1.14.0 — öğretici, görseller ve çalışma akışı

## Yapılanlar

1. İlk açılışta 25 adımlı öğretici. Planım/takvim/görev/checklist, not yazma yolları, dersler/akış/düzenler/kurtarma, odak/ses/geçmiş ve ayarlar anlatılır. Tur örnek kayıt oluşturmaz, mevcut kayıtları değiştirmez, atlanabilir ve Yardım ve öğretici bölümünden yeniden açılır. Yazı araçları ve hassas mod gibi kayıt gerektiren işlemler açıklanır; tur bunları denemek için sahte not veya hassas etkinlik yaratmaz. Tur, kullanıcı bir not yazarken otomatik başlamaz.
2. Ortak kaynaktan uygulama içi aranabilir rehber ve GitHub Pages için statik docs/index.html. Uygulama ve web yardım formları yalnızca GitHub destek taslağı açar; son gönderim GitHub'da kullanıcıya aittir. .github/ISSUE_TEMPLATE/kullanim-yardimi.yml ayrıca GitHub Issues formu sağlar. Yayınlama yapılmadı.
3. Yazıdaki fotoğrafta yüzde 10–100 genişlik, köşeden tutup boyutlandırma, klavye okları ve kaydırıcı. Görsel/Taşı tutamacıyla metinde konuma sürükleme, önceki/sonraki paragraf ve sol/sağ/orta/satır içi hizalama. Açıklama ve silme korunur. Görsel araçları yazı HTML'ine kaydedilmez.
4. Notlarım → Çalışma akışı: ders ve not seçimi, bağlı görev, odak ve tekrar. Ders kartı ve açık notun ••• menüsünden ulaşılır. Oturum geçmişinden veya odak bitiminden Tekrar planla, nota bağlı tarihli görev oluşturur. Öğrenme veya görev tamamlanması otomatik varsayılmaz.
5. Şablonlar → Hazır çalışma düzenleri: ders haftası, sınav hazırlığı, okuma/araştırma. Önizleme/onay, mevcut veya yeni ders, başlangıç tarihi ve görevleri dahil etme seçimi. JSON indir/içe aktar; doğrulanmış biçim/sürüm, boyut ve kayıt sınırları. Aynı ders/tarih/paket tekrar eklenmez; mevcut notlar değiştirilmez. Görev ve tekrar bağlantıları tam JSON yedeğinde korunur.
6. Windows otomatik kontrolleri genişletildi. Windows-Kontrol.cmd/ps1 yalnızca EXE özeti, gerekli dosyalar, imza durumu ve geçici yazma ön kontrolünü yapar. Fiziksel Windows kabulü tamamlanmadı.

## Sınırlar

Görseller belge akışında taşınır; metin üzerinde sabit x/y koordinatlı çizim tuvali oluşturulmadı. Genişlik yüzdesi ekran boyutuna uyum sağlar; görselin oranı korunur. PNG/JPG/WebP girdileri mevcut hazırlama hattında yerel JPEG'e küçültülür.

Çalışma düzeni JSON'u içerik şablonudur; dosya eklerini, kişisel geçmişi veya başka kullanıcının kimliklerini taşımaz. Betikler ve uzak görsel src değerleri temizlenir. Tam yedek dosyasını çalışma düzeni içe aktarma alanına koymayın.

İçe aktarma iki yerel veri alanına yazar; yazma hatasında eski kayıtlar geri alınır. İki ayrı depolama alanı arasında ani elektrik kesintisi için ortak veritabanı işlemi garantisi verilmez. Güncelleme öncesinde JSON yedeği alın.

Geniş özellik kapsamı korunmuştur. Üç görünüm paketi, tam sayfa not alanı, hassas etkinlikler, yeniden planlama, checklist ve önceki kurtarma/yedek özellikleri kaldırılmadı. Supabase, eşitleme veya çevrimiçi hesap eklenmedi.

## Doğrulama

npm test iş kuralları/güvenlik/veri kurtarma ve çalışma düzeni sınırlarını; npm run test:dom gerçek uygulama betiklerini simüle DOM/IndexedDB/masaüstü köprüsünde çalıştırır. Yeni senaryo otomatik turu 25 adım ilerletir, yeniden açıp atlar, yardım taslağını, onaylı düzen aktarımını, mükerrer/disk hatasını, bağlı tekrarı, görsel boyut/taşıma/sanitizasyonunu ve temiz depolamaya tam yedek dönüşünü dener.

Ortam Linux'tur. Gerçek Windows çalıştırma, Windows Hello/DPAPI, ses duyumu, bildirim teslimi, sürükleme işaretçisinin fiziksel davranışı, ekran ölçeği/FPS ve kullanıcı kabulü burada doğrulanmadı. DOGRULAMA.json bunu ayrı bayraklarla belirtir. GitHub Windows akışı hazırlanmıştır; bu çalışma uzaktan akışı başlatmadı.

## Değişen dosyalar ve geri alma

Yeni ana dosyalar: starter-model.js, study-flow.js, guide.js, help-content.js, learning114.css, build_help.mjs, test_starter114.mjs, test_dom114.mjs, Windows-Kontrol.ps1 ve GitHub yardım formu. study-model.js/study.js, learning-ui.js, inline-images.js, app.js, modern.js, motion.js, main.cjs, script sırası, paketleme, CI ve README güncellendi. app/ üretilen arayüzdür.

Önceki kurulum Seiri.previous altında korunur. Eski sürüme geri döneceksen önce 1.14 yedeğini ayrıca sakla; yeni alanları eski sürüm tanımayabileceği için 1.14 öncesi kullanıcı verisi/yedek kopyasıyla dönüş tercih edilir. %APPDATA%\\Zaman klasörünü silme.

