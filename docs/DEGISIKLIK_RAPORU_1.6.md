# FocusFlow 1.6.0 · Kaisen Technology

Windows güncellemesi · 12 Kasım 2026

## 1. Vurgulama düzeltmesi

Vurgu düğmesi artık aç/kapat anahtarıdır. Açık durumu ARIA ve araç rengiyle gösterilir. Tekrar basıldığında sonraki yazı vurgusuz devam eder. İmleç eski vurgulu span'ın sonunda kaldığında yeni yazının rengi miras almasını önlemek için metin sınırı ayrılır. Mevcut kalın, italik, yazı tipi ve renk biçimleri korunur. Geçici imleç işareti kalıcı nota aktarılmaz. Seçim zaten doğru yerdeyse yeniden seçilmez; bu, ardışık biçimlendirme komutlarının birbirini sıfırlamasını önler.

Tarayıcı doğrulaması: vurgulu yaz → kapat → düz yaz; kalın + vurgulu yaz → vurguyu kapat → kalın düz yaz. HTML'de ilk bölüm arka plan rengi taşıdı, yeni bölüm taşımadı; kalın biçim korundu. Kaydedilen HTML yeniden okundu. Geri alma önceki metni korudu. Otomatik test, boyalı span sonundaki imleci ve imleç taşınınca geçici durumun terk edilmesini doğrular.

## 2. Daha hafif not görünümü

Kalın kartlar yerine ince ayırıcılar; daha hafif serif başlıklar, sakin düğmeler, küçük meta bilgiler ve yatay ajanda alt gezinmesi. Ajanda içindeki ikinci kolon kaldırıldı. Mevcut notlar korunur; yeni notlar Source Serif 4 tercihiyle başlar. Tam sayfa editör pencerenin tamamını kaplar; A4 kutusu, belge kenarı, gölge veya genişlik sınırlaması eklenmedi. Açık/koyu tema renkleri düzenlendi.

Tarayıcı doğrulaması: yeni not özellikleri → onay → tam sayfa; mevcut notu yeniden aç; uzun metni yaz/kaydet; açık ve koyu tema. Sayfa kendi içinde kaydırılır; küçük bir yazı kutusuna dönmez.

## 3. Sol altta roket menüsü

Eski dar sol araç çubuğu 72 px dairesel roket düğmesine taşındı. Büyük Takvim/Ajandam gezinmesi kalır. Düğmeye basılınca roket 280 ms'de kalkar, iniş alanındaki H görünür ve yuvarlatılmış araç penceresi açılır. Tekrar basılınca roket 640 ms'de döner. Süre farkı kullanıcının hızlı kalkış/yavaş iniş talebi içindir. Hızlı tekrar tıklama eski uçuşu iptal eder. Ayarlar, profil, yeni kayıt ve hızlı gezinme korunur.

Dışarı tıklama/Escape kapatır; yukarı/aşağı/Home/End tuşlarıyla araçlar arasında gezinilir. Hareket azaltma veya uygulama animasyon tercihi kapalıysa roket yer değiştirmez, panel kısa solmayla açılır. Menü yazarken görünmez.

Tarayıcı doğrulaması: art arda aç/kapat; Ayarlar ve profil erişimi; hareket tercihi kapalıyken transform:none; Escape sonrasında aria-expanded=false.

## 4. Yüklenen arka planı silme

Ajandam → Koleksiyon veya Ayarlar → Temalar ve arka plan → Görseli sil. Onaydan sonra IndexedDB'deki görsel silinir, nesne URL'si bırakılır, CSS arka plan kaydı temizlenir ve kullanım tercihi kapanır. Tercih kaydı başarısızsa silme başlamaz; görsel silme başarısızsa önceki tercih geri alınır. İşlem yalnızca bu cihazdaki arka planı kapsar; dışarı aktarılmış eski JSON yedekleri değiştirilmez.

Tarayıcı doğrulaması: test PNG yükle; silmeden vazgeç → görsel korunur; silmeyi onayla → düğme ve görsel kaybolur; yeniden yükle → görsel geri gelmez. Otomatik test: iptal, tercih yazma hatası, disk hatası ve başarılı silme/URL temizliği.

## 5. Açılış introsu

Kaisen Technology / FocusFlow markası, altın roket ve iniş alanıyla kısa launcher görünümü. Gerçek yükleme tamamlanınca uçuş başlar. Sahte yüzde sayacı yoktur. Uçuş 1 sn; minimum sahne 1,2 sn; 3,5 sn güvenli çıkış sınırı vardır. Atla düğmesi erişimi hemen açar. Hareket azaltmada uçuş kaldırılır. Intro kapanınca önceden kilitli alanların inert durumu korunur; uygulama arkasında kilitli kalmaz.

Tarayıcı doğrulaması: uygulamayı yeniden yükle, sahnenin otomatik kapanmasını ve tekrar açılışı gözle. Otomatik test: Atla'nın kilidi kaldırması, önceden kilitli alanın korunması, güvenli çıkış ve SVG kimliklerinin çakışmaması.

## Değişen dosyalar

- web/ui/app.js: seçim, vurgulama, geçici imleç temizliği.
- web/ui/study.js: arka plan silme, not yazı tipi başlangıcı.
- web/ui/modern.js: dairesel araç menüsünün oluşturulması; sürüm bilgisi.
- web/ui/rocket.js: SVG roket, uçuş/iniş, açılış yaşam döngüsü ve klavye erişimi.
- web/ui/refinement.css: hafif not görünümü, menü ve intro yüzeyleri.
- web/ui/motion.js: merkezî roket/intro süreleri.
- web/ui/index.html: intro ve yeni varlık bağlantıları.
- web/ui/planner.js, desktop/main.cjs, package.json: 1.6.0 sürümü.
- scripts/package_web.py, scripts/package_windows.py: varlık ve test paketleme.
- scripts/test_motion.mjs, scripts/test_refinement.mjs: regresyon kontrolleri.
- app/ karşılıkları kaynaklardan yeniden üretilir.

## Test ve sınırlar

npm test ve Windows paketleme kontrolleri çalıştırılır. Önceki profil, hatırlatma, zamanlayıcı, ses, güvenlik kasası, planlama ve veri yolu testleri korunur. Arayüz Chrome'da yerel Windows önizlemesiyle kontrol edildi. Bu ortamda fiziksel Windows/Electron çalıştırma, DPAPI/Windows Hello veya 60/120 Hz donanım performansı ölçülmedi. Gerçek Windows'ta klavye, ekran ölçeği ve açılış geçişini ayrıca deneyin.

Bu teslim Windows içindir; yayımlanmış web sitesi ve Android APK değiştirilmedi. Not/kasa veri dizini ve yerel kayıt anahtarları değişmedi. Ekran görüntülerindeki deneme notları dağıtım paketine konulmaz.

## Geri alma

Önce JSON yedeği alın. Önceki 1.5.0 paketini ayrı klasörde tutun. Geri dönmek için FocusFlow'u tepsi menüsünden Çıkış ile kapatıp 1.5.0 paketini açın. %APPDATA%\Zaman klasörünü silmeyin. Bu güncellemede veri şeması göçü yoktur. Silinen arka plan, özgün görsel yeniden seçilerek veya eski JSON yedeğinden geri getirilebilir; içe aktarma diğer yedek verilerini de birleştirir.
