# Seiri 1.14.1 — öğretici görünürlüğü düzeltmesi

Genel dialog::backdrop kuralındaki blur, öğreticinin şeffaf vurgulama penceresine de uygulanıyordu. Çerçevenin içindeki gerçek ekran da bu nedenle bulanık/karanlık kalıyordu. Öğreticinin kendi arka planındaki bulanıklık ve tüm ekranı koyulaştıran ikinci katman kaldırıldı. Yalnızca hedefin dışındaki gölge kaldı.

Hedef ölçümü pencere açıldıktan sonra yapılır; pencere boyutu, kaydırma ve görsel viewport boyutu değişince yeniden hesaplanır. Ekran dışındaki hedefler görünür alana kırpılır. Bulunamayan veya görünmeyen hedefte tüm ekranı kapatan maske gösterilmez. Atla/Bitir/Escape ve kayıt oluşturmayan öğretici davranışı korunur.

Değişen ana dosyalar: web/ui/learning114.css, web/ui/guide.js; regresyon testinde scripts/test_dom114.mjs. Sürüm/üretilen arayüz ve yardım sayfası yenilendi. docs/SENKRONIZASYON_PLANI.md sonraki Supabase adımını açıklar; bu paket çevrimiçi eşitleme eklemez.

Test: 25 adımlı simüle tur, sayfa/ayar geçişleri, hedefin yeniden boyutlanması ve ekran dışına kayması, mevcut çalışma/görsel/yedek regresyonları. Gerçek Windows görüntüsü burada doğrulanmış değildir.

Kurulumdan önce JSON yedeği alın, uygulamayı tepsiden kapatıp yeni paketi kurun. Önceki kurulum Seiri.previous ile korunur. %APPDATA%\\Zaman klasörünü silmeyin. Veri şeması bu yamada değiştirilmedi.
