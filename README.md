[README.md](https://github.com/user-attachments/files/34824193/README.md)
# Seiri

**Takvim, notlar ve odaklanma.**  
Optime Technology tarafından geliştirilen kişisel ajanda uygulaması.

[Windows sürümünü indir](https://github.com/Optime-Technology/seiri/releases/tag/v1.9.0) · [Tüm sürümler](https://github.com/Optime-Technology/seiri/releases) · [Hata bildir / öneri paylaş](https://github.com/Optime-Technology/seiri/issues)

> **Sürüm: 1.9.0 — Windows Beta**  
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

1. [Seiri 1.9.0 Windows Beta](https://github.com/Optime-Technology/seiri/releases/tag/v1.9.0) sayfasını açın.
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
| Yeni not ve tam sayfa yazma | Ajandam → Notlarım → Yeni not → Özellikleri onayla |
| Not açıklamasını düzenleme | Açık not → Not özellikleri → Kısa açıklama |
| Not kapağı ekleme veya kaldırma | Not kartında Kapak ekle / Kapak |
| Yazıya fotoğraf ekleme | Açık notun üst kısmında Fotoğraf |
| Fotoğrafı metnin yanına alma | Yazıdaki fotoğrafa tıkla → Fotoğraf düzeni |
| Not sabitleme ve metin çıktısı | Açık notta ••• menüsü |
| Checklist oluşturma | Ajandam → Checklists → Yeni checklist |
| Kategori yönetimi | Ajandam → Kategoriler |
| Pomodoro ve odak sesleri | Ajandam → Odak stüdyosu |
| Kişisel arka plan | Ajandam → Koleksiyon |

## 1.9.0 sürümündeki yenilikler

- Çerçevesiz, yumuşak köşeli dikey not kartları.
- Kartla uyumlu küçük kapak görselleri ve başlık altında kısa açıklama.
- Not içine fotoğraf ekleme ve görsel etrafında metin akışı.
- Ayrı **Checklists** sekmesi, ilerleme takibi ve silinen listeleri geri yükleme.

Ayrıntılar: [1.9 değişiklik raporu](docs/DEGISIKLIK_RAPORU_1.9.md).

## Veriler ve yedekleme

Bu Windows sürümünde notlar, görseller, checklistler, profil ve tercihler cihazda saklanır. **Bulut eşitleme, çevrimiçi hesap ve ekip çalışması backend'i henüz bağlı değildir.**

- JSON yedeği notları, checklistleri ve yedek kapsamındaki görsel/dosya verilerini taşımak için kullanılır. Yedeklerinizi güvenli bir yerde saklayın.
- TXT/Markdown çıktısı metin içindir; görselleri ve dosya eklerini içermez.
- Hassas etkinliklerin güvenlik anahtarlarını ayrıca güvenli biçimde yedekleyin. JSON içerik yedeği anahtar yedeği değildir.
- Gerçek kişisel veriler, not yedekleri, parolalar ve gizli anahtarlar bu depoya veya Issues bölümüne yüklenmemelidir.

Hassas etkinlikler ve yeniden planlama için teknik belgeler [docs](docs/) klasöründedir. Fiziksel Windows cihazında Windows Hello/DPAPI doğrulaması ve performans ölçümü bu sürümün geliştirme ortamında yapılmamıştır.

## Geliştirme

Seiri'nin Windows sürümü **Electron** ve **HTML/CSS/JavaScript** ile geliştirilmiştir. Arayüz kaynakları `web/` altında bulunur; paketleme betiği bunlardan `app/` içeriğini üretir.

### Gereksinimler

- Projedeki Electron sürümüyle uyumlu Node.js ve npm.
- Python 3. Paketleme betikleri `python3` komutunu da çağırır; bu komutun ortamınızda çalıştığını kontrol edin.
- İlk bağımlılık ve Electron çalışma zamanı indirmeleri için internet bağlantısı.

### Yerel çalıştırma

Terminalde sırasıyla çalıştırın:

```sh
git clone https://github.com/Optime-Technology/seiri.git
cd seiri
npm install
npm run build:web
npm start
```

### Testler

```sh
npm test
```

Testler; veri modelleri, hatırlatmalar, güvenlik kuralları, yeniden planlama, geçişler, not kapakları, yazı içi görseller ve checklist davranışlarını kapsar. Otomatik testlere ek olarak Windows üzerinde kurulum, bildirim, ses ve veri geri yükleme akışları elle denenmelidir.

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
