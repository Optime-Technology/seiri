# Seiri

**Takvim, notlar ve odaklanma.**  
Optime Technology tarafından geliştirilen kişisel ajanda uygulaması.

[Windows sürümünü indir](https://github.com/Optime-Technology/seiri/releases) · [Tüm sürümler](https://github.com/Optime-Technology/seiri/releases) · [Hata bildir / öneri paylaş](https://github.com/Optime-Technology/seiri/issues)

> **Sürüm: 1.16.0 — Windows Beta**  
> Windows 10/11, 64 bit sistemler içindir. Beta indirmeleri için [sürümler sayfasını](https://github.com/Optime-Technology/seiri/releases) kullanın. Bu depodaki güncel paket Windows içindir; Android ve iOS mağaza paketleri bu sürüme dahil değildir.

## Özellikler

### Takvim ve ajanda

- Günlük, haftalık, aylık ve yıllık takvim görünümleri.
- Etkinlik oluşturma, düzenleme ve hatırlatmalar.
- Not ve etkinlikleri kategorilere ayırma; kategorileri düzenleme ve silme.
- Tamamlama geçmişi ve çalışma istatistikleri.
- Sabit etkinlikleri koruyan, kullanıcı onayıyla uygulanan yeniden planlama önerileri.

### Notlar

- Başlık, tarih, konu ve kısa açıklama ile not oluşturma.
- Uzun metinler için tam sayfa yazı alanı.
- Kalın, italik, vurgulama ve farklı yazı tipleri.
- Dikey not kartları, kapak görseli ekleme, değiştirme ve kaldırma.
- Yazı içine fotoğraf ekleme; görseli metnin soluna veya sağına yerleştirme.
- Not sabitleme, dosya ekleri ve TXT/Markdown olarak dışa aktarma.

### Checklists ve odak araçları

- Checklist oluşturma, maddeleri düzenleme ve tamamlandı olarak işaretleme.
- Silinen checklistleri geri yükleme.
- Pomodoro ve oturum geçmişi, zamanlayıcı ve kronometre.
- Odak sesleri, açık/koyu görünüm ve farklı temalar.
- Kişisel arka plan seçme ve kaldırma.
- Yerel profil bilgileri ve profil fotoğrafı düzenleme.

## Windows kurulumu

1. [Seiri Windows Beta](https://github.com/Optime-Technology/seiri/releases) sayfasını açın.
2. **Assets** bölümündeki Windows ZIP paketini indirin. GitHub'ın otomatik oluşturduğu **Source code** arşivleri uygulama kurulumu için değildir.
3. ZIP dosyasını tamamen bir klasöre çıkarın.
4. Kurulum için **Kur.cmd** dosyasını çalıştırın. Taşınabilir kullanım için çıkardığınız klasördeki **Seiri.exe** dosyasını açın.

`Seiri.exe` dosyasını paket içindeki diğer dosyalardan ayırmayın. Kurulumun varsayılan konumu `%LOCALAPPDATA%\Programs\Seiri` klasörüdür.

### Güncelleme

1. Uygulamada **Ayarlar → Veriler ve yedekler → Yedeğimi kaydet** yoluyla JSON yedeği alın.
2. Açık uygulamayı sistem tepsisindeki **Çıkış** seçeneğiyle kapatın.
3. Yeni Windows paketini çıkarıp **Kur.cmd** dosyasını çalıştırın.
4. Uygulamayı açarak notlarınızı ve etkinliklerinizi kontrol edin.

Önceki FocusFlow ve Zaman sürümleriyle veri uyumluluğu için kullanıcı verileri `%APPDATA%\Zaman` konumunda tutulur. **Bu klasörü silmeyin.**

## Özellikleri nerede bulabilirim?

| İşlem | Konum |
| --- | --- |
| Ekranlar arası geçiş ve ayarlar | Sol alttaki roket menüsü |
| Yeni not ve tam sayfa yazma | Notlarım → Yeni not → Özellikleri onayla |
| Not açıklamasını düzenleme | Açık not → Not özellikleri → Kısa açıklama |
| Not kapağı ekleme veya kaldırma | Not kartında Kapak ekle / Kapak |
| Yazıya fotoğraf ekleme | Açık notun üst kısmında Fotoğraf |
| Fotoğrafı metnin yanına alma | Yazıdaki fotoğrafa tıkla → Fotoğraf düzeni |
| Not sabitleme ve metin çıktısı | Açık notta ••• menüsü |
| Checklist oluşturma | Planım → Listeler → Yeni checklist |
| Kategori yönetimi | Notlarım → Kategoriler |
| Pomodoro ve odak sesleri | Odak |
| Kişisel arka plan | Ayarlar → Görünüm ve arka plan |

## 1.13.0 sürümündeki yenilikler

- Notlarım → Dersler: ders/dönem oluşturma, düzenleme ve arşivleme.
- Notlarda ders, dönem, konu ve etiket; metin/dosya adı araması, filtreler, sıralama ve 48 notluk sayfalar.
- Açık notun ••• menüsünden bağlı görev veya odak oturumu başlatma.
- Görevlerde çalışma tarihi, son tarih, süre, öncelik ve ilgili not/ders.
- Odak geçmişinde ders/görev bilgisi ve ilgili nota dönüş.
- Silinen notlar için çöp kutusu; önceki not sürümlerini inceleme ve geri yükleme.
- Ayarlar → Sürüm ve güncelleme: kullanıcı tarafından başlatılan GitHub kontrolü. Otomatik paket kurulumu yoktur.
- Ayarlar → Gizlilik ve uygulama: içerik içermeyen yerel tanılama raporu.

[1.13 değişiklik raporu](docs/DEGISIKLIK_RAPORU_1.13.md) · [Kullanım ve test adımları](docs/KULLANIM_VE_TEST_1.13.md) · [Dış bağımlılıklar](docs/DIS_BAGIMLILIKLAR_1.13.md)

Bu paket imzasız Windows beta paketidir. Gerçek Windows testi ve çevrimiçi eşitleme tamamlanmış kabul edilmez.

## 1.12.0 sürümündeki yenilikler

- **Planım · Notlarım · Odak** ana gezinmesi ve Günüm ekranı.
- Not başına taslak günlüğü, kurtarma listesi ve açık kayıt durumları.
- Son yedi tam kopyayı tutan otomatik yerel yedekler; dışa aktarma ve geri yükleme.
- Başlıkla hızlı not oluşturma; isteğe bağlı ayrıntılar ve tam sayfa yazma.
- Pembe roket kimliği, ortak sürüm bilgisi ve önceki kurulumu koruyan güncelleme.

Ayrıntılar: [1.12 değişiklik raporu](docs/DEGISIKLIK_RAPORU_1.12.md). Fiziksel Windows kontrolü: [kabul listesi](docs/WINDOWS_KABUL_KONTROLU.md).

## 1.11.0 sürümündeki yenilikler

- Üst gezinme, takvim ve gün paneli, ajanda, odak stüdyosu, istatistik, profil ve ayarlarda yeni yerleşim.
- Yalnızca üç görünüm: **Seiri, Lo-Fi ve Akademik**.
- Tek kaynaktan yönetilen görünüm kartları; tüm seçim ekranlarında klavye desteği.
- Eski görünüm paketlerinden Seiri'ye geçerken kullanıcı içeriği ve kişisel arka plan korunur.
- Uzun metinler için tam ekran, kenarlıksız not alanı.

Ayrıntılar: [1.11 değişiklik raporu](docs/DEGISIKLIK_RAPORU_1.11.md).

## 1.10.0 sürümündeki yenilikler

- Kırık beyaz, mürdüm ve lavanta tonlarıyla ortak tasarım dili.
- Kenarlıksız tam sayfa not düzenleyicisinde zarif başlıklar ve daha ferah yazı düzeni.
- Takvim, ajanda, checklist, odak stüdyosu, profil ve ayarlarda hafif yüzeyler.
- Açık/koyu görünüm ve mevcut tema seçenekleriyle uyum.

Ayrıntılar: [1.10 değişiklik raporu](docs/DEGISIKLIK_RAPORU_1.10.md).

## 1.9.0 sürümündeki yenilikler

- Çerçevesiz, yumuşak köşeli dikey not kartları.
- Kartla uyumlu küçük kapak görselleri ve başlık altında kısa açıklama.
- Not içine fotoğraf ekleme ve görsel etrafında metin akışı.
- Ayrı **Checklists** sekmesi, ilerleme takibi ve silinen listeleri geri yükleme.

Ayrıntılar: [1.9 değişiklik raporu](docs/DEGISIKLIK_RAPORU_1.9.md).

## Veriler ve yedekleme

Bu Windows sürümünde notlar, görseller, checklistler, profil ve tercihler cihazda saklanır. **Google ile giriş ve kişisel alan doğrulama Ayarlar → Hesap ve bağlantı bölümündedir. Windows kişisel alanında kayıt ve dosya eşitlemesi vardır; ekip eşitlemesi henüz etkin değildir.**

- JSON yedeği notları, checklistleri ve yedek kapsamındaki görsel/dosya verilerini taşımak için kullanılır. Yedeklerinizi güvenli bir yerde saklayın.
- TXT/Markdown çıktısı metin içindir; görselleri ve dosya eklerini içermez.
- Hassas etkinliklerin güvenlik anahtarlarını ayrıca güvenli biçimde yedekleyin. JSON içerik yedeği anahtar yedeği değildir.
- Gerçek kişisel veriler, not yedekleri, parolalar ve gizli anahtarlar bu depoya veya Issues bölümüne yüklenmemelidir.

Hassas etkinlikler ve yeniden planlama için teknik belgeler [docs](docs/) klasöründedir. Fiziksel Windows cihazında Windows Hello/DPAPI doğrulaması ve performans ölçümü bu sürümün geliştirme ortamında yapılmamıştır.

## Geliştirme

Seiri'nin Windows sürümü **Electron** ve **HTML/CSS/JavaScript** ile geliştirilmiştir. Arayüz kaynakları `web/` altında bulunur; paketleme betiği bunlardan `app/` içeriğini üretir.

### Gereksinimler

- Projedeki Electron sürümüyle uyumlu Node.js ve npm.
- Python 3.10 veya üzeri. Paketleme betikleri `python3` komutunu da çağırır; bu komutun ortamınızda çalıştığını kontrol edin.
- İlk bağımlılık ve Electron çalışma zamanı indirmeleri için internet bağlantısı.

### Yerel çalıştırma

Terminalde sırasıyla çalıştırın:

```sh
git clone https://github.com/Optime-Technology/seiri.git
cd seiri
npm install
python -m pip install -r requirements-build.txt
npm run build:web
npm start
```

### Testler

```sh
npm test
```

Testler; veri modelleri, hatırlatmalar, güvenlik kuralları, yeniden planlama, geçişler, not kapakları, yazı içi görseller ve checklist davranışlarını kapsar. Otomatik testlere ek olarak Windows üzerinde kurulum, bildirim, ses ve veri geri yükleme akışları elle denenmelidir.

DOM duman testi için `npm run test:dom` çalıştırılabilir. Bu test fiziksel Windows veya görsel doğrulama yerine geçmez.

### Windows paketi üretme

```sh
npm run package:win
```

Betik, resmi Electron Windows x64 çalışma zamanını indirip SHA-256 değerini doğrular; arayüzü üretir, testleri çalıştırır ve Windows paketini hazırlar. `python3` ve `node` komutlarının PATH üzerinde bulunması gerekir.

Taşınabilir uygulama klasörü `dist/Seiri_Windows_x64/` altında; Windows ve kaynak ZIP dosyaları proje klasörünün **bir üst dizininde** oluşturulur.

### Proje yapısı

| Konum | İçerik |
| --- | --- |
| `web/` | Arayüz kaynakları, temalar, fontlar ve sesler |
| `desktop/` | Electron ana süreç, masaüstü entegrasyonu ve kurulum betiği |
| `app/` | Paketleme betiğiyle üretilen uygulama arayüzü |
| `scripts/` | Paketleme ve otomatik test betikleri |
| `tools/` | Yardımcı üretim araçları |
| `docs/` | Teknik açıklamalar ve sürüm değişiklik raporları |

Arayüz değişikliklerini `web/` kaynaklarında yapıp `npm run build:web` ile üretin. Yalnızca `app/` üzerinde yapılan değişiklikler yeniden üretimde kaybolabilir.

## Hata bildirimleri ve öneriler

[Issues](https://github.com/Optime-Technology/seiri/issues) bölümünde bir kayıt açarken uygulama sürümünü, Windows sürümünü, hatayı oluşturan adımları ve beklenen davranışı belirtin. Ekran görüntüsü eklemeden önce kişisel bilgilerinizi gizleyin.

## Lisans

Bu depoda proje kaynak kodu için henüz bir lisans belirtilmemiştir. Deponun herkese açık olması, kaynak kodunun yeniden kullanımı veya dağıtımı için otomatik olarak izin verildiği anlamına gelmez.

Üçüncü taraf bileşenler kendi lisanslarına tabidir. Ayrıntılar için [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) dosyasına bakın.

---

**Seiri · Optime Technology**


## 1.14.0: öğretici ve çalışma akışı

İlk açılışta atlanabilir 25 adımlı tur görünür. Ayarlar → Yardım ve öğretici ile yeniden başlatın veya aranabilir kullanım rehberini açın. Yardım formu GitHub'da herkese açık bir taslak açar; son gönderim kullanıcıya aittir.

Notlarım → Çalışma akışı: ders seç, not yaz, görev oluştur, odaklan ve tekrar planla. Ders kartından ve açık notun ••• menüsünden de açılır. Odak geçmişi veya tamamlanan bağlı oturumdan tekrar görevi oluşturulabilir.

Notlarım → Şablonlar içinde üç hazır çalışma düzeni vardır. Önizleme, ders/tarih seçimi ve onaydan sonra bağlı not ve isteğe bağlı görevler eklenir. Düzen JSON olarak indirilebilir ve içe aktarılabilir. Mevcut tek not şablonları korunur.

Yazıdaki görsele tıklayın: yüzde genişlik kaydırıcısı, köşeden boyutlandırma, belge içinde sürükleme, paragraf taşıma, hizalama ve kaldırma araçları açılır. Görsel belge akışına bağlıdır; sabit x/y koordinatlı tuval değildir.

GitHub Pages rehberi: docs/index.html. Yayın adımları docs/YARDIM_YAYINLAMA.md. Bu çalışma uzaktan yayın yapmadı. Değişiklik ve test belgeleri docs/DEGISIKLIK_RAPORU_1.14.md ve docs/KULLANIM_VE_TEST_1.14.md.

Windows-Kontrol.cmd paket özeti/dosyaları/geçici yazma ön kontrolünü yapar. Gerçek Windows, Hello, bildirim, ses ve görsel kabulü bu Linux ortamında tamamlanmadı. Paket imzasız betadır.


## 1.14.1

Öğreticide çerçeve içinin de bulanıklaşmasına neden olan genel pencere filtresi kaldırıldı. Vurgu pencere boyutu/kaydırmada yenilenir; görünmeyen hedef tüm ekranı karartmaz. Ayrıntı: docs/DEGISIKLIK_RAPORU_1.14.1.md. Supabase yol haritası docs/SENKRONIZASYON_PLANI.md; gerçek eşitleme bu yamada eklenmedi.


## 1.15.0

Google PKCE girişi, işletim sistemiyle şifreli kalıcı oturum ve çıkış eklendi. Yerel notlar henüz eşitlenmez veya hesaplara ayrılmaz. Kurulum ve test: [Google girişi](docs/GOOGLE_GIRIS_1.15.md).


## 1.16.0

Hesap başına ayrı yerel alan, yedekli bir defalık taşıma, kişisel kayıt/dosya eşitlemesi, kalıcı offline kuyruk ve revizyon çakışma kopyaları. [Kurulum, kapsam ve test](docs/SENKRONIZASYON_1.16.md). Windows dışındaki eski istemciler güncellenmedi. Gerçek iki Windows cihazında kabul testi henüz tamamlanmadı.
