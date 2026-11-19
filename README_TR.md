# Seiri 1.16.0 · Optime Technology

Ders notlarını, günlük planını ve odak oturumlarını birleştiren sakin çalışma uygulaması. Windows beta sürümü. Google girişi ve kişisel alan eşitlemesi eklendi. Bu bilgisayar alanı yerel kalır; ekip eşitlemesi henüz etkin değildir.

## Kurulum ve güncelleme

1. Eski uygulamada JSON yedeğini alın; sistem tepsisinden Çıkış seçin.
2. Windows ZIP paketini tamamen çıkarın. Kur.cmd ile kurun veya klasördeki Seiri.exe ile taşınabilir kullanın.
3. Kurulum dosyaları önce ayrı klasörde hazırlanır; EXE SHA-256 değeri kontrol edilir. Önceki kurulum Seiri.previous klasöründe tutulur. Bu kontrol yayıncı imzası değildir.
4. Kullanıcı verileri %APPDATA%\Zaman konumunda kalır. Bu klasörü silmeyin. Kurulum %LOCALAPPDATA%\Programs\Seiri konumunu kullanır.

## Üç ana alan

- Planım → Günüm: seçili günün etkinlikleri ile tarihsiz/bekleyen görevler. Görevdeki daire tamamlar.
- Planım → Takvim: gün, hafta, ay ve yıl görünümleri. Görevler ve Listeler aynı bölümde.
- Notlarım: not kütüphanesi ve şablonlar. Yeni notta yalnızca başlık zorunlu; Diğer özellikler isteğe bağlıdır. Onaydan sonra tam sayfa, kenarlıksız yazı alanı açılır.
- Odak: Pomodoro, mola, zamanlayıcı, kronometre ve sesler. İstatistik ve geçmiş aynı bölümde.
- Ayarlar: yerel profil, üç görünüm, arka plan, bildirimler, özel günler ve yedekler. Yerel profil çevrimiçi hesap değildir.
- Roket menüsünde de aynı üç alan ve ayarlar vardır. Google girişi Ayarlar → Hesap ve bağlantı bölümündedir; ekip eşitlemesi henüz bağlı değildir.

## Notlar ve kurtarma

Kaydediliyor, Kaydedildi ve Kaydedilemedi durumları üstte görünür. Normal kayıt gecikmesi yaklaşık 850 ms'dir. Yazı sürerken en fazla yaklaşık 120 ms aralıklarla ayrı IndexedDB taslak günlüğü yazılır. Ana kayıt tamamlanınca yalnızca o notun ilgili revizyonu temizlenir. Uygulama yeniden açıldığında kurtarılabilir taslaklar Notlarım'da listelenir.

Ani güç kesintisinde son tuşların diske ulaşacağı garanti edilemez. Kayıt ve taslak alanları da dolarsa hata görünür; sayfayı kapatmadan TXT/Markdown dışa aktarımı kullanın. Bozuk küçük veri alanında son geçerli kopya denenir; kurtarılamayan alan otomatik olarak boş veriyle ezilmez.

Not kapakları karttaki Kapak düğmesinden eklenir/değişir/kaldırılır. Yazı içinde Fotoğraf düğmesi ve fotoğrafa tıklayarak hizalama kullanılır. JPG/PNG/WebP girdileri cihazda küçültülür. TXT/Markdown görsel ve dosya eklerini içermez; JSON yedeği bunları içerir.

## Yedekler

Ayarlar → Veriler ve yedekler: dışa JSON yedeği, içe aktarma ve otomatik yerel kopyalar.

Uygulama çalışırken değişiklik varsa 30 dakikada bir tam yerel kopya alınır. Son 7 kopya %APPDATA%\Zaman\Seiri Backups klasöründe tutulur; kopya başına 128 MB sınırı vardır. Kopyalar şifrelenmemiş JSON'dur; anahtar kasası bu dosyalara dahil değildir. Hassas etkinlik ayrıntıları mevcut şifreli biçiminde kalır. Eksik dosya veya yazma hatası varsa tamamlanmamış kopya geçerli sayılmaz; eski kopyalar korunur.

Yerel kopyadan Dışa aktar veya Geri yükle seçilebilir. Geri yükleme kayıtları birleştirir; aynı kimlikte yedekteki sürüm geçer. Yerel panelden geri yükleme öncesi mevcut verinin güvenlik kopyası alınır. Yerel kopyalar aynı disktedir; disk arızası, kayıp veya fidye yazılımına karşı harici yedeğin yerini tutmaz.

## Görünüm ve kimlik

Yalnızca Seiri, Lo-Fi ve Akademik paketleri vardır. Açık/koyu görünüm ayrı paket değildir. Pembe roketin SVG, PNG ve Windows ICO dosyaları aynı yol noktalarından üretilir. Ürün adı, şirket ve sürüm package.json kaynağından gelir. Eski kullanıcı veri dizini ve yerel origin uyumluluk için korunur.

## Geliştirme ve doğrulama

Node.js/npm ve Python 3.10 veya üzeri gerekir. Önce python -m pip install -r requirements-build.txt ve npm install çalıştırın. npm run build:web arayüzü ve marka dosyalarını üretir; npm start yerelde açar. npm test iş kuralları, güvenlik, taslak yarışları ve JSON yedekten dönüş testlerini çalıştırır. npm run test:dom, jsdom ve fake-indexeddb ile uygulama açılışını ve kurtarma/geri yükleme akışını simüle eder. Bu test fiziksel Windows/görsel test değildir.

npm run package:win resmi Electron çalışma zamanını SHA-256 ile doğrular ve Windows/kaynak ZIP üretir. Fiziksel Windows, Hello/DPAPI, kurulum ve ekran ölçeği kontrolü henüz tamamlanmadı. Kabul listesi: docs/WINDOWS_KABUL_KONTROLU.md.

Ayrıntılar: docs/DEGISIKLIK_RAPORU_1.12.md. Önceki sürüm belgelerindeki eski adlar tarihsel kayıttır.


## 1.13: ders–not–görev–odak bağlantısı

Notlarım → Dersler ile ders ve dönem oluşturun. Yeni notun Diğer özellikler alanından ders ve virgülle ayrılmış etiket ekleyin. Arama başlık, metin, açıklama, konu, ders/dönem, etiket ve ek dosya adını tarar. #etiket ile etiket arayın; PDF içeriği ve OCR taranmaz. Kütüphane ders/dönem/sıralama filtreleri ve 48 notluk sayfalar kullanır.

Açık not → ••• → Bu nottan görev veya Bu nota odaklan. Görevler ekranında tarih, son tarih, süre ve öncelik düzenlenir. Odak ekranında ders/görev/not seçilir; aktif oturum sırasında bağlantı değiştirilmez. İstatistik ve geçmişten ilgili nota dönülebilir. Odak oturumunun bitmesi görevi otomatik tamamlamaz.

Silinen not Notlarım → Çöp kutusu bölümüne gider ve otomatik temizlenmez. Açık not → ••• → Sürüm geçmişi ile önceki hâllere dönülür. Yazarken en fazla beş dakikada bir önceki hâl kaydedilir; özellik değişimi, silme ve geri dönüşte ayrıca kopya alınır. Not başına en fazla 20 sürüm/yaklaşık 4 MB, tüm geçmiş için yaklaşık 32 MB sınırı vardır. Eski kopyalar budanır. Görsel/dosya verileri bu metin bütçesinden ayrıdır; geçmişin kullandığı dosya referansları korunur. Geçmiş ve bağlantılar tam JSON yedeğine dahildir. Bu, her tuşu saklayan sınırsız geçmiş değildir.

Ayarlar → Sürüm ve güncelleme yalnızca düğmeye basınca GitHub'a istek gönderir; notları göndermez, uygulamayı otomatik indirmez/çalıştırmaz. Ayarlar → Gizlilik ve uygulama bölümünden alınan tanılama JSON'u sürüm/ortam ve kayıt sayılarını içerir; içerik veya profil içermez ve kendiliğinden gönderilmez.

Ayrıntılar: docs/DEGISIKLIK_RAPORU_1.13.md, docs/KULLANIM_VE_TEST_1.13.md ve docs/DIS_BAGIMLILIKLAR_1.13.md. Supabase projesi bağlı değildir; çok cihazlı eşitleme yoktur. Bu çıktı imzasız betadır; opsiyonel imzalama betiği tek başına güvenilir yayıncı imzası sağlamaz.


## 1.14.0: öğretici ve çalışma akışı

İlk açılışta atlanabilir 25 adımlı tur görünür. Ayarlar → Yardım ve öğretici ile yeniden başlatın veya aranabilir kullanım rehberini açın. Yardım formu GitHub'da herkese açık bir taslak açar; son gönderim kullanıcıya aittir.

Notlarım → Çalışma akışı: ders seç, not yaz, görev oluştur, odaklan ve tekrar planla. Ders kartından ve açık notun ••• menüsünden de açılır. Odak geçmişi veya tamamlanan bağlı oturumdan tekrar görevi oluşturulabilir.

Notlarım → Şablonlar içinde üç hazır çalışma düzeni vardır. Önizleme, ders/tarih seçimi ve onaydan sonra bağlı not ve isteğe bağlı görevler eklenir. Düzen JSON olarak indirilebilir ve içe aktarılabilir. Mevcut tek not şablonları korunur.

Yazıdaki görsele tıklayın: yüzde genişlik kaydırıcısı, köşeden boyutlandırma, belge içinde sürükleme, paragraf taşıma, hizalama ve kaldırma araçları açılır. Görsel belge akışına bağlıdır; sabit x/y koordinatlı tuval değildir.

GitHub Pages rehberi: docs/index.html. Yayın adımları docs/YARDIM_YAYINLAMA.md. Bu çalışma uzaktan yayın yapmadı. Değişiklik ve test belgeleri docs/DEGISIKLIK_RAPORU_1.14.md ve docs/KULLANIM_VE_TEST_1.14.md.

Windows-Kontrol.cmd paket özeti/dosyaları/geçici yazma ön kontrolünü yapar. Gerçek Windows, Hello, bildirim, ses ve görsel kabulü bu Linux ortamında tamamlanmadı. Paket imzasız betadır.


## 1.14.1

Öğreticide çerçeve içinin de bulanıklaşmasına neden olan genel pencere filtresi kaldırıldı. Vurgu pencere boyutu/kaydırmada yenilenir; görünmeyen hedef tüm ekranı karartmaz. Ayrıntı: docs/DEGISIKLIK_RAPORU_1.14.1.md. Supabase yol haritası docs/SENKRONIZASYON_PLANI.md; gerçek eşitleme bu yamada eklenmedi.


## Supabase hazırlığı — veritabanı adımı

Çalışan Windows uygulaması hâlâ 1.14.1 ve yereldir. Supabase şeması supabase/migrations/202611160001_seiri.sql dosyasındadır. Kurulum: supabase/KURULUM.md. Yerel PostgreSQL RLS testleri geçti; canlı projede SQL kullanıcı tarafından çalıştırılmalı. Bu kaynak güncellemesi henüz hesap arayüzü veya çalışan eşitleme eklemez.


## 1.15.0: Google hesabı

Ayarlar → Hesap ve bağlantı → Google ile giriş yap. Ayrıntılı kurulum, kapsam ve test: docs/GOOGLE_GIRIS_1.15.md.

Oturum Electron ana sürecindeki Supabase SDK ile yenilenir; Windows güvenli saklama ile şifrelenir. Tokenlar web arayüzüne, localStorage'a, yerel JSON yedeğine veya tanılama çıktısına eklenmez. Çıkış yerel Google oturumunu temizler; notları silmez. Bu sürümde Google hesabı değiştirmek bilgisayardaki notları hesaplara ayırmaz. Birden fazla kişinin aynı Windows kullanıcı profilini ortak kullanması için uygun veri ayrımı henüz yoktur.

Derleme için SEIRI_SUPABASE_URL ve SEIRI_SUPABASE_PUBLISHABLE_KEY ortam değişkenlerini tanımlayıp npm run configure:cloud çalıştırın. Yalnızca herkese açık publishable anahtarı kabul edilir. Üretilen desktop/cloud-config.json git ve kaynak ZIP dışında, Windows paketinin içinde bulunur. Google client secret veya service_role bu projeye konmaz. Yapılandırma olmadan yerel geliştirmede notlar kullanılabilir; hesap girişi kapalı görünür.


## 1.16.0: kişisel alan ve eşitleme

Ayarlar → Hesap ve bağlantı → Bu bilgisayardaki verileri hesabıma aktar. Önce güvenlik yedeği ve sabit geçiş kopyası alınır. Hesap alanı açılınca Hazırlanan aktarımı tamamla seçilir. Kaynak kayıtlar silinmez; hassas kayıtlar kopyalanmaz. Alternatif olarak Hesabımın kişisel alanını aç ile boş/var olan bulut alanını açın. Normal notlar, etkinlik/görev/tekrarlar, kategoriler, dersler, checklistler, odak oturumları, özel şablonlar ve bağlı JPG/PNG/PDF dosyaları eşitlenir.

Hesaplar ayrı Chromium partition'larında çalışır: yerel dosyalar, taslaklar, sürüm geçmişi, kasa, profil ve yedekler birbirinden ayrılır. Çıkış Bu bilgisayar alanına döner. Çevrimdışı kayıt cihazda korunur, gönderimler atomik günlüğe alınır; bağlantı gelince tekrar denenir. Not açıkken uzaktan veri yazı alanını değiştirmez; kapatınca uygulanır. Çakışan değişiklikte ayrı kopya oluşturulur; başka cihazın düzenlemesiyle çakışan silmede güncel kayıt korunur. Normal bulut içerikleri uçtan uca şifrelenmez.

Kapsam, sınırlamalar, veri yolları, manuel kabul testleri ve geri alma: docs/SENKRONIZASYON_1.16.md. Bu sürüm yalnızca Windows kişisel alan istemcisini günceller; eski Android/web paketleri kendiliğinden eşitlemeye başlamaz. Google girişi yeniden açılışta asenkron şifre çözme sonucu da doğru okunur.
