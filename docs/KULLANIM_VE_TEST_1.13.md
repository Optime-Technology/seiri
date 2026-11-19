# Seiri 1.13 — kullanım ve kabul kontrolü

## Özellikler nerede?

| İşlem | Yol |
| --- | --- |
| Ders ve dönem oluştur | Notlarım → Dersler → Yeni ders |
| Dersi düzenle/arşivle | Notlarım → Dersler → ilgili kart |
| Nota ders/etiket ekle | Yeni not veya açık notun Not özellikleri → Diğer özellikler |
| Filtre ve sıralama | Notlarım → Notlarım; ders, dönem ve sıralama alanları |
| Etiket arama | Arama alanında #sınav; birden fazla sözcük birlikte aranır |
| Bağlı görev | Açık not → ••• → Bu nottan görev oluştur |
| Bağlı odak | Açık not → ••• → Bu nota odaklan |
| Görev ayrıntıları | Planım → Görevler → Yeni görev / Düzenle |
| Odak bağları | Odak → Zamanlayıcı → Ders / Görev / Not |
| Oturumdan nota dön | Odak → İstatistik ve geçmiş → İlgili not |
| Önceki sürüme dön | Açık not → ••• → Sürüm geçmişi → Bu sürüme dön |
| Silineni kurtar | Notlarım → Çöp kutusu → Geri yükle |
| Güncelleme sorgula | Roket menüsü → Ayarlar → Sürüm ve güncelleme |
| Tanılama JSON'u | Ayarlar → Gizlilik ve uygulama → Tanılama raporunu dışa aktar |

## Windows'ta elle deneyin

- [ ] Uygulama kapalıyken eski JSON yedeğini ve %APPDATA%\\Zaman kopyasını ayırın; yeni paketi kurun.
- [ ] Mevcut not, kapak, yazı içi görsel, ek dosya, checklist ve kategoriler korunuyor.
- [ ] 2026 Güz döneminde bir ders oluşturun. Yalnızca başlıkla not açılabilsin; yazı alanı tam ekran ve kenarlıksız kalsın.
- [ ] Aynı nota ders, konu ve #sınav etiketi ekleyin; ders/dönem/etiket araması sonucu göstersin. PDF dosya adı aransın; PDF içeriğinin aranması beklenmez.
- [ ] Çok not varsa 48'lik sayfalar arasında geçin; arama/filtre değişince ilk sayfaya dönsün.
- [ ] Nottan 45 dakikalık yüksek öncelikli, çalışma/son tarihli görev oluşturun. Düzenleme sonrası bu alanlar korunsun.
- [ ] Görevden odak başlatın; bağlar doğru olsun. Aktif oturumun bağı değişmesin. Kısa deneme oturumunu bitirip geçmişten nota dönün.
- [ ] Metni değiştirin, özellikleri kaydedin, yeniden yazın. Geçmişten önceki hâle dönün; dönmeden önceki hâl de geçmişte kalsın.
- [ ] Notu silin: takvim/arama/kütüphanede görünmesin, çöp kutusundan kapak/dosyalarıyla geri gelsin.
- [ ] Tam yedeği alın, ayrı Windows test kullanıcısında içe aktarın. Dersler, bağlar, geçmişteki görseller ve çöp kutusu korunsun.
- [ ] Dolu disk/engellenen yazma koşulunda kaydedildi denmesin; başarısız geçmiş yazımı ana notu kaybettirmesin.
- [ ] İnternetsizken güncelleme kontrolü anlaşılır hata versin; uygulama kullanılabilsin. Kontrol düğmesi dışında ağ sorgusu yapılmasın.
- [ ] Açık/koyu ve üç tema, %100/%125/%150 ölçek, 1366×768 ve geniş ekranda kontroller taşmasın. Klavye/Tab/Escape ve hareketi azalt tercihleri denensin.
- [ ] Windows Hello/DPAPI, hassas etkinlik gizleme ve bildirimler ayrı kabul listesindeki gibi gerçek cihazda doğrulansın.

Bu liste henüz fiziksel olarak tamamlanmış değildir. CI akışı GitHub → Actions → Seiri Windows checks → Run workflow yolundan elle başlatılır; ilk çalıştırmadan önce hesap kullanım/kota ayarlarını inceleyin.

## Kullanılabilirlik doğrulaması

İlk turda 5 öğrenciyle aynı kısa görevleri deneyin: ders oluşturma, ders notu yazma, nottan görev açma, odak oturumunu bitirme, yanlış silinen notu geri getirme. Gerçek kişisel ders notlarını toplamayın. İzinle yalnızca görev başarı durumu, yaklaşık süre ve takıldıkları noktaları kaydedin. Başarı eşiği: 5 kişinin en az 4'ü yardım almadan temel akışı bitirebilsin, veri kaybı olmasın. Bu bir ürün hedefidir; test yapılmış değildir.

DOGRULAMA.json otomatik kanıt ile fiziksel kabulü ayırır. LEARNING_BENCHMARK.json yalnızca 2000 notluk örnek sorgunun mevcut makinedeki süresidir; FPS veya gerçek cihaz hızı değildir.

