# Seiri 1.13.0 — zayıf yönlere yönelik geliştirmeler

## Kapsam ve durum

Bu sürüm Windows/Electron içindir. Ürün odağı: ders notları, günlük plan ve odak oturumlarını bir araya getiren sakin çalışma uygulaması. Önceki veriler ve %APPDATA%\\Zaman yolu korunur. Android/iOS mağaza paketleri üretilmedi.

| Zayıflık | Yapılan değişiklik | Kalan sınır |
| --- | --- | --- |
| Not, görev ve odak birbirinden kopuk | Ortak ders/dönem, not–görev–oturum bağlantıları, geçmişten nota dönüş | Görev odak oturumu bitince otomatik tamamlanmaz |
| Görev ayrıntıları erişilemiyor | Tarih, son tarih, süre, öncelik, bölünebilirlik ve derin odak alanları | Kullanıcı görev tahminini kendisi girer |
| Büyük kütüphanede düzenleme zayıf | Ders/dönem/etiket, arama ve sıralama, 48 kayıtlık sayfalar | PDF içi arama/OCR yok; gerçek cihaz performansı ölçülmedi |
| Silme ve geçmiş güvencesi eksik | Çöp kutusu, önceki sürüme dönme, geçmişi içeren tam yedek | Geçmiş sınırlı, sınırsız tuş kaydı değil |
| Teknik regresyon ve görünürlük eksik | Bağımsız öğrenme modeli, iş kuralı ve DOM testleri, kullanıcı seçimli içeriksiz tanılama | Eski global JS mimarisi bütünüyle değiştirilmedi |
| Güncelleme yolu belirsiz | Elle başlatılan GitHub sürüm kontrolü ve sürüm sayfası bağlantısı | Otomatik paket kurulumu yok |
| İmza ve Windows kabulü eksik | Opsiyonel Authenticode betiği, elle başlatılan Windows CI ve kabul listesi | Sertifika sağlanmadı; paket imzasız, Windows CI henüz çalıştırılmadı |
| Çok cihazlı eşitleme yok | Bağımlılıklar ve uygulanacak güvenlik/çatışma planı belgelendi | Supabase projesi yok; gerçek senkronizasyon uygulanmadı |

## Veri ve geçmiş

Ders kataloğu ve odak bağlantıları mevcut study verisine, not metadata alanları mevcut not kayıtlarına eklenir. Eski kayıtların ders/etiket olmaması geçerlidir. Ders arşivlemek notları silmez. Çöp kutusu deletedAt alanıyla çalışır; kalıcı silme ve otomatik temizleme eklenmedi.

Önceki normal not sürümleri ayrı seiri-note-history IndexedDB alanında tutulur. Kopyalar not başına 20 adet/yaklaşık 4 MiB, toplam yaklaşık 32 MiB metin bütçesiyle sınırlandırılır. Yaklaşık hesap JSON uzunluğunun iki katıdır; gerçek disk kotası ölçümü değildir. Düzenli yazarken önceki kayıt en fazla beş dakikada bir saklanır; metadata düzenleme, silme ve sürüme dönme ayrıca kopya alır. Taslak kurtarma günlüğü önceki sürümdeki gibi çalışır. Geçmişteki resim/dosya referansları dosya temizlemede korunur ve tam yedeğe katılır. Görsel verilerin toplam boyutu bu metin bütçesinin dışındadır.

Geçmiş yazılamazsa ana not kaydı korunur ve uyarı gösterilir. Çöp kutusu içeriği arama ve takvimden çıkarılır. Tam JSON geri yükleme ders, görev, oturum, not geçmişi ve geçmişin kullandığı dosyaları taşır. Yedek normal notlarda düz metindir; hassas veri anahtar kasasını taşımaz.

## Yeni temel dosyalar

- web/ui/learning-model.js: ders, etiket, arama, görev doğrulaması ve geçmiş sınırları.
- web/ui/learning-ui.js: ders/görev bağlama, sürümler ve çöp kutusu ekranları.
- web/ui/note-versions.js: seri, atomik IndexedDB geçmiş yazımı.
- web/ui/support-tools.js: yalnızca kullanıcı isteğiyle yerel tanılama JSON'u.
- desktop/update-check.cjs: süre/boyut sınırı ve sabit depo adresiyle güncelleme sorgusu.
- desktop/sign-windows.ps1: isteğe bağlı imzalama; sertifika olmadan çalıştırılmaz.
- .github/workflows/windows-checks.yml: elle başlatılan Windows test/paket akışı.
- scripts/test_learning113.mjs, scripts/test_dom113.mjs: iş kuralları ve simüle bütünleşme testleri.

Diğer değişiklikler study-model.js, study.js, app.js, note-covers.js, modern.js, context.js, stiller, script sırası, preload/main, paketleme ve README dosyalarındadır. app/ kaynakların üretilmiş kopyasıdır.

## Doğrulama ve geri alma

npm test; npm run test:dom; npm run package:win. Raporlar: DOGRULAMA.json ve LEARNING_BENCHMARK.json. Simüle testler gerçek Windows Hello/DPAPI, ekran görünümü, fiziksel ses, gerçek bildirim veya FPS kanıtı değildir.

Önce dışa JSON yedeği alın; uygulamayı tepsiden kapatıp yeni paketi kurun. Önceki kurulum Seiri.previous altında tutulur. Önceki sürüm yeni geçmiş/çöp kutusu semantiğini bilmeyebileceği için, geri dönüşte **1.13 öncesi JSON yedeği** ve kullanıcı verisi kopyası tercih edilir. Veri klasörünü silmeyin. 1.13 yedeğini eski sürüme içe aktarmak yeni özelliklerin korunacağını garanti etmez.

