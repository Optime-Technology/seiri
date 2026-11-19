# Seiri 1.11.0 — uygulama tasarımının yenilenmesi

## Kapsam

Yalnızca not ekranı değil; uygulama kabuğu, takvim, gün paneli, ajanda, görevler, checklistler, odak stüdyosu, istatistik ve geçmiş, şablonlar, görünüm/arka plan, bildirimler, özel günler, profil, ayarlar, yedekler ve bilgi pencereleri yeniden düzenlendi.

Üstte Seiri logosu ve yatay ana gezinme bulunur. Sabit sol menü geri getirilmedi; roket hızlı menüsü korunur. Takvim sayfaya yerleşir, gün ayrıntıları geniş ekranda sağa, dar ekranda alta geçer. Ajanda başlığı ve yatay alt gezinme, kütüphane araçları ve not kartları yeni düzene taşınır. Yazı sayfası 100vw/100dvh tam ekran kalır; dış kart, kenarlık ve genişlik sınırı yoktur.

## Görünüm paketleri

Tek kaynak appearance-model.js; seçenekler sadece Seiri, Lo-Fi ve Akademik. Eski Klasik/Eğlenceli seçimleri Seiri'ye döner. Eski Keten, Gece mürekkebi, Sakura, Orman koleksiyonları seçimden kaldırıldı; eski premiumTheme alanı geriye uyum için yalnızca none olarak normalize edilir. Bu alanın normalizasyonu not, görev, geçmiş, ses, profil ve arka plan verilerini silmez.

Lo-Fi gece manzarası ve piksel kediyi korur. Akademik tüm ekranlarda Times New Roman ve sade resmî palet kullanır. Seiri sıcak kâğıt, mürdüm, lavanta ve açık yeşil ayrıntılar kullanır. Açık/koyu görünüm bir renk tercihidir, ayrı bir görünüm paketi değildir. Kişisel arka plan seçme ve silme korunur.

Üç seçim yüzeyi aynı kartları ve radyo grubu davranışını kullanır. Ok tuşları, Home/End ve yeniden çizim sonrası odak dönüşü test edilir. Kaldırılan paketlere ait CSS ve balon/araba efekt kodu temizlendi.

## Doğrulama

Mevcut testler ve test_appearance111.mjs çalıştırılır. Yeni test gerçek tema seçim modülünü yürütür: eski tercih taşıma, üç seçenek, klavye ve odak, Lo-Fi gece kilidi, hareket azaltma ve eski yedekte görev/arka plan korunumu. ZIP bütünlüğü, sürüm ve üretilen arayüz dosyaları kontrol edilir.

Canlı arayüzün görsel kabul testi ve fiziksel Windows testi bu ortamda tamamlanmadı. Bu nedenle yayımlamadan önce Windows cihazında aşağıdaki kontrol listesini uygulayın.

## Windows kabul kontrolü

- Yeni ZIP'i ayrı klasöre çıkarıp açın; eski uygulamayı sistem tepsisinden kapatın.
- Üst gezinmeden Takvim, Ajandam ve Özel günler arasında geçiş yapın.
- Takvimde yıl/ay/hafta/gün, ileri/geri, Bugün ve gün panelini deneyin.
- Ajandada not, checklist, görev, odak, istatistik, şablon ve Görünüm sekmelerini açın.
- Ayarlar ve Ajandam → Görünüm'de yalnızca Seiri, Lo-Fi, Akademik olduğunu doğrulayın.
- Her görünümü seçin, kapatıp açın; seçimin ve verilerin korunduğunu kontrol edin.
- Açık/koyu görünüm, dar pencere, %125/%150 Windows ölçeğinde taşma kontrolü yapın.
- Not oluşturun; yazma ekranının tam sayfa olduğunu, vurgu aç/kapat ve fotoğraf hizalamayı kontrol edin.
- Kişisel arka planı seçip silin; profil fotoğrafını ve JSON yedeğini kontrol edin.

## Geri alma

JSON yedeği alın ve uygulamayı tepsiden kapatın. Önceki 1.10/1.9 Windows paketini yeniden kurun; %APPDATA%\Zaman klasörünü silmeyin. Kullanıcı içeriği için veri şeması değiştirilmedi.

## Değişen ana dosyalar

- web/ui/appearance-model.js: üç görünüm ve eski kimlik normalizasyonu.
- web/ui/themes.js: ortak kartlar, seçim davranışı, Lo-Fi hareketleri.
- web/ui/seiri-shell.js: yeni üst gezinme ve ayarlar erişimi.
- web/ui/seiri-design.css: tüm ekranlarda yeni yerleşim, yüzey, tipografi ve duyarlı kurallar.
- web/ui/modern.js: ayarlar görünüm seçimi ve rota bağlantısı.
- web/ui/study.js: ajanda gezinmesi, birleşik görünüm alanı ve arka plan.
- web/ui/study-model.js: eski koleksiyon tercihlerinin güvenli normalizasyonu.
- web/ui/style.css, modern.css, study.css: kaldırılmış paketlere ait kullanılmayan kuralların temizliği.
- web/ui/index.html ve scripts/package_web.py: yeni bileşenlerin yüklenmesi ve üretilen app/ çıktıları.
- scripts/test_appearance111.mjs: görünüm seçimi ve veri taşıma testleri.
- scripts/package_windows.py, package.json, README.md, README_TR.md: paketleme, sürüm ve kullanım bilgileri.
