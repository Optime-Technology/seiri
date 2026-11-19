# Seiri 1.18.0 — not eşitlemesi

## Davranış

- Aynı notu iki cihaz düzenlediğinde yeni not kartı açılmaz. Aynı alanın son düzenlemesi kazanır; bağımsız alan değişiklikleri birleştirilir. Gövdenin düz metni ve HTML biçimi tek alan olarak ele alınır. Metnin iki ayrı paragrafını eşzamanlı düzenlemek otomatik paragraf birleştirmesi değildir; önceki metin geçmişte korunur.
- İşlem sırası, kaydetme zamanı + cihazdaki kalıcı mantıksal sayaç + cihaz/işlem kimliği ile belirlenir. Sunucuya son ulaşan istek otomatik kazanmaz. Bilinen revizyonla koşullu yazma yapılır, yarışta yeni satır okunup çözüm tekrar hesaplanır. Döngü başına en fazla dört deneme; kalan iş kalıcı kuyrukta durur.
- Çevrimdışı cihazların saatleri arasında kesin küresel zaman sırası garanti edilemez. Bilinen kayıt sırası ve geri giden yerel saat için mantıksal sayaç kullanılır; yeni kayıtta beş dakikadan fazla ileri tarih yerine cihazın güncel saati alınır. Cihaz saatlerini otomatik tutun. Belirsiz eşitlikte kimlik sırası deterministiktir, kaybeden içerik geçmiştedir.
- Silme yeni revizyon geldi diye kuyruktan atılmaz. Silinmiş notu görmemiş cihazın düzenlemesi notu diriltemez. Çöp kutusundan açıkça Geri yükle yeni işlem sayılır. Kalıcı kaldırılan aktif not eski bir düzenlemeyle geri gelmez.
- Önceki normal not sürümleri aynı kişisel workspace'in `notes` tablosunda `metadata.surface=note_version` kayıtlarıdır. Bunlar not kartı veya arama sonucu değildir. Aynı RLS ve dosya erişim kontrollerine tabidir; hassas notlar/sürümleri eşitlemeye girmez.
- Bulut geçmişi not başına en fazla 20, hesap genelinde en fazla 64 sürüm taşır. Budanan bulut sürümünün metni ve dosya bağları temizlenir, eşitleme için içeriksiz soft-delete satırı kalır. Eski dosya nesnelerinin Storage temizliği bu sürümün kapsamı dışındadır. Normal not geçmişi uçtan uca şifrelenmez.
- Gelen sürümler, görünür not değiştirilmeden önce yerel geçmişe alınır. Not → üst araç çubuğundaki ⋯ → Sürüm geçmişi → Bu sürüme dön. Yerel geçmişin mevcut 20/not, yaklaşık 4 MB/not ve yaklaşık 32 MB toplam sınırları sürer. Eski, yalnız yereldeki tüm geçmiş otomatik buluta yüklenmez. Geçmiş sınırsız/arşiv yedeği değildir.
- Açık yazı sayfasına uzaktan metin basılmaz. Hesap paneli açık notun kapatılmasını beklediğini belirtir. Sonrasında görünüm güncellenir. Android önde yaklaşık 30 saniyelik kontrolünü sürdürür; sürekli arka plan eşitlemesi eklenmedi.
- Görev, kategori ve checklist gibi not dışındaki eşzamanlı düzenlemelerin önceki çakışma koruması korunur. Önceden oluşmuş çakışma kopyaları otomatik silinmez.

## Güncelleme

1. Her cihazda Veriler ve yedekler üzerinden JSON yedeği alın; kaydedilmemiş notu kaydedip kapatın.
2. Windows'u sistem tepsisinden tamamen kapatın. Windows 1.18 ZIP'ini çıkarıp Kur.cmd veya Kur.ps1 ile mevcut kuruluma güncelleyin. Kullanıcı veri dizini/hesap partition'ları değiştirilmez.
3. Android 1.18 APK'sını mevcut uygulamanın üzerine yükleyin. Uygulama kimliği com.zaman.ajanda ve test imzası korunur, versionCode 1180'dir. Uygulamayı kaldırmayın/verisini temizlemeyin.
4. Her iki platformu da güncelleyin. 1.16/1.17 ile veri biçimi okunabilir olsa da eski istemcilerin çakışma davranışı devam eder; karışık sürüm bu kabul testinin hedefi değildir.
5. Supabase'de ek SQL/secret/OAuth ayarı gerekmez. Mevcut proje ve kişisel alan kullanılır. Yeni migration yoktur.

## Testler

Otomatik testler canlı hesap kullanmaz:
- Eski çevrimdışı yazı yeni yazıdan sonra gönderilse de son düzenleme kazanır.
- Üç cihazda başlık ve içerik farklı zamanlarda değişir; birleşmiş notta her alanın düzenleme sırası korunur.
- Tek normal not kartı; kaybeden yazı normal kart değil sürüm kaydıdır.
- Koşullu yazma yarışı sırasında silme korunur; eski düzenleme silineni diriltmez; açık geri yükleme çalışır.
- Offline kalıcı kuyruk, süreç yeniden açılması ve başarılı yazının onayının kaybolması mükerrer not/sürüm oluşturmaz.
- Gelen dosya baytları, IndexedDB geçmiş aktarımı, eski kayıt günlüğünü açma, hassas içeriği/sürümü dışlama ve geçmiş limitleri sınanır.
- Bir yazma yanıtı eşitleme imlecini ilerletmez; aradaki diğer kayıtlar atlanmaz.

Gerçek cihazda uygulanacak kabul listesi:
- [ ] Windows ve Android'de Ayarlar'daki sürüm 1.18.0 olmalı.
- [ ] Telefon not düzenlemesi PC'ye, PC düzenlemesi telefona gelmeli.
- [ ] İki cihazı offline yapın; PC'de 10:00, telefonda 10:01'de aynı gövdeyi değiştirin. Önce telefonu, sonra PC'yi bağlayın. Tek notta telefon metni görünmeli. PC'nin eski metni sürüm geçmişinde açılmalı.
- [ ] Aynı tabandan PC başlığı, telefon gövdeyi değiştirsin; ikisi de korunmalı.
- [ ] Telefonda notu silin, iki tarafta Şimdi eşitle yapın: PC normal listesinde görünmemeli. PC'deki eski offline düzenleme notu geri getirmemeli.
- [ ] Çöp kutusundan Geri yükle açık eylemi iki cihaza yayılmalı.
- [ ] Eşitleme sırasında açık notu düzenleyin: imleç sıçramamalı; kapatınca bekleyen görünüm uygulanmalı.
- [ ] Diğer hesaba geçince önceki hesabın notu ve sürümleri görünmemeli.

Bu değişiklikte canlı Android–Windows 1.18 testi, gerçek Google girişi, Windows çalışma zamanı ve fiziksel cihaz görsel testi çalıştırılmadı. Kullanıcı önceki sürümlerde Windows→telefon veri gelişini doğrulamıştır; bu yeni sürümün canlı kabulü yerine geçmez.

## Değişen dosyalar

Ortak motor: desktop/shared sync-engine.cjs, yeni sync-resolution.cjs; web/ui/cloud-sync-ui.js, learning-ui.js; Windows desktop/reminder-planner.js; paket sürümleri ve kilit dosyaları; Android cloud/entry.js, app/build.gradle, scripts/build_apk.py, scripts/package_web.py, shared/windows-protocol.json; Windows scripts/package_windows.py. Paket içi arayüz dosyaları yeniden üretildi. scripts/test_sync118.mjs eklendi; mevcut motor ve paket/DOM testleri yeni davranışa uyarlandı.

## Geri alma

Eski ZIP/APK'yı ayrı saklayın ve güncellemeden önce her iki alandan harici JSON yedeği alın. Veri dizinini, hesabı veya Keystore'u silmeyin. Android düşük versionCode'a kurulumu reddedebilir; kaldırarak geri dönmeyin. Gerekirse daha yüksek versionCode'lu uyumluluk paketi hazırlanır. Eski motor yeni günlükteki ek alanları görmez; bu nedenle eski sürüme dönmek eşitleme davranışını da geri alır. Buluttaki sürüm kayıtları eski arayüzde kart olarak açılmaz, fakat eski istemciyle aktif çalışmayı sürdürmek yeni çözüm politikasını garanti etmez.
