# FocusFlow 1.7.0

## Değişiklikler

- Sabit sol menü görünümden ve erişilebilirlik ağacından kaldırıldı. Eski bağlayıcıların kimlikleri görünmez altyapıda korunur. Yönlendirme roket menüsündedir.
- Kategori yönetimi Ajandam başlığına taşındı. Silme öncesi hedef seçilir; not/etkinlik/dosya ekleri korunur, şifreli içerik açılmaz. Kategorisiz sanal seçenektir; bütün gerçek kategoriler silinebilir. Başarısız depolama işlemi bellekte geri alınır. Windows sürümünün desteklemediği ekip kategorisi değişikliği reddedilir.
- Takvimde notlar, Ajandam'da mini takvim: üst çubuktan açılan/kapanan yardımcı panel. Kullanıcının sabit sol menüyü kaldırma isteği nedeniyle yardımcı alan da sabit sütun değildir.
- Ajandam genişliği, boşlukları ve yuvarlatılmış yüzeyleri güncellendi; yazı sayfası tam ekrandır.
- Üç ek özellik: not sabitleme, kaydedilmemiş değişiklik uyarısı, TXT/Markdown dışa aktarma.
- Dışa aktarma o anki yazıyı alır; kaydetme hatasında da taslak indirilebilir. Markdown başlık/kalın/italik/listeleri destekler; renk/font/dosya ekleri dahil değildir. Windows dosya adları temizlenir. Ağ servisi kullanılmaz.
- Yenileme/tepsiden çıkış, kaydedilmemiş değişiklik varsa varsayılan olarak iptal edilir. Kullanıcı açıkça Kaydetmeden çık seçebilir. X ile kapama önceki gibi tepsiye indirir.

## Değişen dosyalar

- web/ui/workspace-model.js (yeni): kategori taşıma ve sabit not sıralaması.
- web/ui/workspace-ui.js (yeni): kategori yönetimi, yardımcı panel, not sabitleme.
- web/ui/note-export.js (yeni): TXT/Markdown indirme.
- web/ui/spacious.css (yeni): tam genişlik, panel ve kategori yüzeyleri.
- web/ui/app.js: sıfır kategoriyle geçerli veri; kategori seçenekleri ve kayıt hata koruması.
- web/ui/study.js: sabitleme/dışa aktarma menüsü, kayıt hatası diyaloğu, kategori uyumu.
- web/ui/modern.js: Kategorisiz zaman çizelgesi rengi ve sürüm.
- web/ui/planner.js: sürüm etiketi.
- web/ui/index.html, scripts/package_web.py: yeni yerel kaynaklar.
- desktop/unload-guard.cjs (yeni), desktop/main.cjs: kaydedilmemiş yazı için çıkış uyarısı.
- scripts/test_workspace.mjs (yeni), scripts/package_windows.py, package.json: test ve 1.7.0 paketlemesi.
- README_TR.md, DOGRULAMA.json ve üretilen app/ kaynakları.

## Testler

Otomatik: mevcut güvenlik/hatırlatma/yeniden planlama/göç/ses/animasyon/vurgu/arka plan testleri; kategori silme (son dahil), hedef geçerliliği, orijinal veri değişmezliği, not/dosya/şifreli alan korunumu, sıfır kategoriyle açılış, sabit not sırası, çıkış uyarısında güvenli varsayılan, Markdown paragraf/kalın metin, dosya adları, kayıt hatasında sayfanın korunması.

Tarayıcı: yeni kategori ve o kategoriye not oluşturma; kategoriyi Kategorisiz'e taşıyarak silme; içeriğin korunması; sabitleme ve yeniden yükleme; TXT/Markdown indirme; Takvim/Notlar ve Ajandam/Mini takvim; açık/koyu görünüm; tam sayfa not alanı. Önizleme köprüsü dağıtım paketine girmez.

Windows cihazında kullanıcı kontrolü: gerçek Kur.cmd kurulumu, eski notların gelmesi, notun ••• menüsünden dışa aktarma dosya diyaloğu; kaydedilmemiş not varken tepsi Çıkış/Yenile işlemi; Windows Hello/PIN ve bildirimler. Fiziksel Windows testi ve FPS ölçümü yapılmadı.

## Geri alma

Önce JSON yedeği alın. Eski sürüm paketini ayrı klasörden çalıştırabilirsiniz; %APPDATA%\\Zaman dizinini silmeyin. Kategori silme kaydı kalıcıdır: eski kategori düzenini geri almak için silme öncesi yedek gerekir. Sabitlemeler notların ek alanıdır; önceki sürümler bunları göstermeyebilir. Eski yedeği içe aktarmak kayıtları birleştirir; birebir geri dönüş için uygulama kapalıyken veri klasörünün kopyasını koruyun. Şifreli veri/anahtar yedeği prosedürü önceki güvenlik belgelerindeki gibidir.
