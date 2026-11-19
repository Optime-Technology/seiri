# Seiri 1.10.0 — tasarım güncellemesi

Tüm ana ekranlarda sıcak kâğıt yüzeyler, mürdüm metin, lavanta vurgular ve hafif kontroller kullanıldı. Takvimde renkli dış çerçeve kaldırıldı; pastel etkinlikler ve ince ızgara tercih edildi. Ajanda kartları, checklistler, odak stüdyosu, istatistik, profil, ayarlar ve roket menüsü ortak görünüme taşındı.

## Not ekranı

Yazı ekranı 100vw/100dvh tam sayfa kalır. Formun genişlik sınırı, çerçevesi ve kart gölgesi yoktur. Başlıklar yerel Lora fontunu, metin mevcut kullanıcı font tercihini kullanır. Metin içine fotoğraf, vurgu aç/kapat, otomatik kayıt ve dosya araçları korunur.

## Uyumluluk

Veri şeması, kullanıcı veri dizini, şifreleme ve hatırlatma kodu değişmedi. Koleksiyon renkleri ve koyu görünüm için ayrı renk değişkenleri tanımlandı. Sistem hareket azaltma ayarında kart yükselmesi kapatıldı. Paketleme kaynak arşivinden .git klasörü dışlandı.

## Doğrulama

Mevcut otomatik test paketi başarılı. Yeni stil dosyasının pakete aktarılması ve yerel bağlantılar doğrulanır. Canlı tarayıcı önizlemesi bu oturumda erişim engeli nedeniyle açılamadı; görsel kabul, fiziksel Windows kurulum ve ekran boyutu kontrolleri kullanıcı cihazında yapılmalıdır.

## Elle kontrol

- Takvimde gün/hafta/ay/yıl geçişleri, etkinlik açma ve oluşturma.
- Ajandamda not kartları, kapak ekleme/kaldırma, kategoriler.
- Yeni not özellikleri ardından tam ekran yazı, vurgu aç/kapat ve fotoğraf hizalama.
- Checklist ekleme, işaretleme ve silinen listeyi geri yükleme.
- Odak stüdyosu, istatistik ve koleksiyon görünümleri.
- Roket menüsü, profil ve ayarlar paneli.
- Açık/koyu tema, koleksiyon renkleri ve dar pencere.
- JSON yedeği alma ve ayrı test ortamında geri yükleme.

## Geri alma

Veri yedeğini alıp uygulamayı sistem tepsisinden kapatın. Önceki 1.9 Windows paketini yeniden kurun; kullanıcı veri klasörünü silmeyin. Kod düzeyinde seiri-design.css bağlantısını kaldırıp arayüzü yeniden üretmek görsel katmanı devre dışı bırakır.
