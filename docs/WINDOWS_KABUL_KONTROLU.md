# Windows sürüm kabul kontrolü

Bu liste her sürümde gerçek Windows 10/11 x64 üzerinde doldurulur. Bu paket için aşağıdaki fiziksel kontroller henüz yapılmamıştır. Otomatik test başarısı bu listenin yerine geçmez.

- [ ] Önce JSON yedeği al; eski uygulamayı sistem tepsisinden kapat.
- [ ] Yeni ZIP'i ayrı klasöre çıkar; Kur.cmd dosyasını çalıştır.
- [ ] Pencere, dosya özellikleri ve uygulama içindeki sürüm 1.14.0; simge pembe roket.
- [ ] Planım, Notlarım, Odak geçişleri ve roket menüsü doğru alanı açar.
- [ ] Planım → Günüm'de etkinlik ekle/düzenle, görev tamamla; Takvim → gün/hafta/ay/yıl geçişleri.
- [ ] Planım → Görevler/Listeler oluşturma ve tamamlama; Notlarım'a geri dönüş.
- [ ] Yeni notta yalnızca başlık gir; tam sayfa yazı alanına geç.
- [ ] Uzun not, vurgu aç/kapat, yazı tipi, kapak, satır içi fotoğraf ve PDF eki.
- [ ] Kaydediliyor/Kaydedildi etiketleri ve Ctrl+S.
- [ ] Test notunda ana kayıttan önce işlemi Görev Yöneticisi ile sonlandır; yeniden açıp taslağı kurtar. Asıl notlarla deneme.
- [ ] Ayrı test profilinde dolu disk/kota; hata görünür ve sayfadan ayrılma koruması çalışır.
- [ ] Ayarlar → Yedekler → Şimdi yerel yedek al; kopyayı dışa aktar.
- [ ] Not, görsel, PDF, checklist, profil ve oturum içeren JSON'u ayrı temiz test profilinde içe aktar.
- [ ] Sekizden fazla yerel kopyada son yedi tam kopya tutulur; başarısız kopya eski kopyaları silmez.
- [ ] Seiri/Lo-Fi/Akademik ve açık/koyu görünümde yazı, alanlar ve hata mesajları okunur.
- [ ] Dar pencere ve Windows %100/%125/%150 ölçeklerinde taşma yok; yazı sayfası tam ekran.
- [ ] Pomodoro, arka plan sesi, oturum geçmişi, bildirim ve sistem tepsisi.
- [ ] Windows Hello/DPAPI hassas etkinlik açma/kilitleme; ayrıntılar bildirim/arama/ICS'ye sızmaz.
- [ ] Kurulumdan sonra eski içerik korunur. Güncelleme kopyalama hatasında önceki kurulum çalışır.

Yayımlamadan önce test tarihi, Windows sürümü ve başarısız maddeler sürüm notuna kaydedilmelidir. İmzasız beta paket Windows güvenlik uyarısı gösterebilir; doğrulama raporu kod imzası değildir.


1.14 ek kontroller: ilk açılış öğreticisini baştan sona ilerlet, atla ve Ayarlar’dan yeniden aç; görseli köşeden boyutlandır ve metinde sürükle, kaydedip yeniden aç; hazır düzeni önizleyip onayla, bağlı not/görev/tekrarları kontrol et. Windows-Kontrol.cmd yalnızca EXE özeti, gerekli dosyalar ve geçici yazmayı denetler; görsel, ses, bildirim veya Hello kabulünü tamamlamaz.
