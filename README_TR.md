# Seiri 1.9.0 · Optime Technology

Windows 10/11 x64 için yerel takvim, notlar ve odak uygulaması. Önceki adı FocusFlow'dur. Bu sürüm dikey not kartları, yazı içi fotoğraflar ve Checklists bölümünü içerir.

## Kurulum ve güncelleme

1. Eski sürümde Ayarlar → Veriler ve yedekler → Yedeğimi kaydet ile JSON yedeği alın.
2. Seiri / FocusFlow / Zaman açıksa sistem tepsisinden Çıkış seçin.
3. ZIP'i tamamen çıkarın. Kur.cmd ile kurun veya Seiri.exe dosyasını çalıştırın.
4. Kurulum %LOCALAPPDATA%\Programs\Seiri konumunu kullanır. Bilinen eski kurulum kısayolları ve otomatik başlatma tercihi taşınır; eski uygulama klasörleri silinmez.

Notlar, dosya ekleri, profil, tercihler ve güvenlik kasası %APPDATA%\Zaman konumunda kalır. Bu klasörü silmeyin. Eski zaman://app/index.html yerel adresi ve veri anahtarları korunur. İsim değişikliği boş bir kullanıcı alanı açmaz.

## Yeni not kartları ve açıklamalar

Notlar çerçevesiz, yumuşak köşeli dikey kartlarda listelenir. Kapak 126 piksel yüksekliğindedir. Başlığın altında Kısa açıklama görünür; boşsa metnin başlangıcı kullanılır. Açıklama: Yeni not özelliklerinde veya açık not → Not özellikleri → Kısa açıklama.

## Yazının içine fotoğraf

Tam sayfa notu açın, imleci yerleştirin ve üstte Fotoğraf düğmesine basın. JPG, PNG veya WebP cihazda küçültülür; bir notta en fazla 20 fotoğraf bulunabilir. Fotoğrafa tıklayıp Satır içinde / Solda, metin yanında / Sağda, metin yanında seçin. Aynı pencereden açıklama değiştirilebilir veya fotoğraf kaldırılabilir. Fotoğrafı panodan yapıştırma da desteklenir. Büyük görseller için kapaklarla aynı 12 MB girdi / 768 KB çıktı sınırı kullanılır.

Fotoğraflar ek listesinden ayrıdır; JSON yedeğine dahil edilir. HTML'de dosya kimliği tutulur, dış URL veya Blob URL kaydedilmez. TXT/Markdown metin çıktısı fotoğrafları içermez. Görseller ve checklistler yereldir; çevrimiçi senkron eklenmedi.

## Checklists

Ajandam → Checklists → Yeni checklist. Liste adı yazıp oluşturun; maddeleri ekleyin, metinlerini düzenleyin veya tamamlandı kutusunu işaretleyin. Üstte ilerleme sayacı vardır. Listeyi sil işlemi listeyi Silinenler'e taşır; Geri yükle ile maddeler ve işaretler geri gelir. Yeni listeler için 50 etkin liste, liste başına 200 madde sınırı vardır. Liste ve maddeler otomatik kaydedilir ve JSON yedeğine girer.

## Not kapakları

Ajandam → Notlarım → not satırındaki Kapak ekle. JPG, PNG veya WebP seçin. Kapaklı notta Kapak → Görseli değiştir / Kapağı kaldır. Açık notta ••• → Kapak görseli de kullanılabilir.

Girdi en fazla 12 MB / 60 megapiksel; çıktı en uzun kenarı 1280 piksel olan en fazla 768 KB JPEG'dir. Şeffaflık açık renge düzleştirilir; kartta görsel ortalanıp kırpılarak gösterilir. Fotoğraf yerel dosya deposunda tutulur, sunucuya gönderilmez. Kapağı kaldırmak not metnini veya dosya eklerini silmez. Kullanılmayan eski kapak dosyası temizlenir; başka kayıt/geçmiş referansı varsa korunur. Önceden dışa aktarılan yedekler değişmez.

JSON yedeği kapakları içerir. TXT/Markdown yalnızca metindir; kapak ve dosya eki içermez. Bu Windows sürümünde çevrimiçi ekip/senkron backend'i bağlı değildir.

## Kullanım

- Geçişler: sol alttaki roket menüsü. Ayarlar aynı menüdedir.
- Kategoriler: Ajandam → Kategoriler. Silmede not ve etkinlikler hedef kategoriye veya Kategorisiz'e taşınır.
- Yardımcı alan: Takvim → Notlar / Ajandam → Mini takvim üst düğmesi.
- Not yazma: Yeni not → özellikleri onayla → tam sayfa yazı alanı.
- Sabitleme: not satırındaki ◇ veya açık notta ••• → Notu sabitle.
- Dışa aktarma: açık notta ••• → Dışa aktar → TXT/Markdown.
- Odak ve sesler: Ajandam → Odak stüdyosu. Arka plan: Ajandam → Koleksiyon.
- Hassas etkinlik ve yeniden planlama belgeleri docs/ klasöründedir. Hassas kasa anahtarlarını ayrıca güvenli yedekleyin; JSON içerik yedeği anahtar yedeği değildir.

## Doğrulama

npm test ile iş kuralları, hatırlatma, güvenlik, yeniden planlama, ses, hareket, kategori ve kapak testleri çalışır. npm run build:web yerel kaynakları üretir. npm run package:win resmi Electron çalışma zamanı SHA256 kontrolü ve PE kaynak doğrulamasıyla Windows ZIP ve kaynak ZIP üretir.

Arayüz tarayıcıda doğrulanır; fiziksel Windows kurulumu, Windows Hello/DPAPI ve FPS ölçümü bu ortamda yapılmadı. Android/iOS mağaza paketleri bu güncellemenin parçası değildir. Kod ve kurulum betiği yorumları Türkçedir. Electron/üçüncü taraf lisansları pakettedir.

Ayrıntı: docs/DEGISIKLIK_RAPORU_1.9.md. Önceki sürüm raporlarındaki eski marka adları tarihsel kayıttır.
