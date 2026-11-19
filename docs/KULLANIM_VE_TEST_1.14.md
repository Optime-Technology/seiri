# Seiri 1.14: yollar ve test senaryoları

| Özellik | Yol |
| --- | --- |
| Öğreticiyi yeniden aç | Ayarlar → Yardım ve öğretici → Öğreticiyi başlat |
| Kullanım / yardım formu | Aynı bölüm → Kullanım rehberi ve yardım formu |
| Ders çalışma merkezi | Notlarım → Çalışma akışı; ders kartı veya açık not → ••• → Çalışma akışı |
| Hazır düzen / JSON | Notlarım → Şablonlar → Hazır çalışma düzenleri |
| Görsel düzenleme | Açık not → Fotoğraf; ardından fotoğrafa tıkla |
| Tekrar görevi | Çalışma akışı → Tekrar planla; Odak geçmişinde Tekrar planla |
| Paket ön kontrolü | Windows ZIP'ini çıkar → Windows-Kontrol.cmd |

## Elle kontrol

- [ ] İlk açılışta öğretici introdan sonra görünür; Önceki/Sonraki/Atla/Bitir ve Escape çalışır.
- [ ] Tur sırasında not veya görev eklenmez; kapandıktan sonra normal kullanım sürer. Tur daha sonra kendiliğinden tekrar açılmaz.
- [ ] Rehber araması, klavye odağı ve yardım taslağı doğru çalışır; taslak kendiliğinden gönderilmez.
- [ ] Düzenin önizlemesini iptal etmek hiçbir kayıt eklemez. Onay, seçilen tarihe bağlı not/görev/tekrarları ekler.
- [ ] Ders ve not seç → görev oluştur → odak başlat → geçmişten nota dön → tekrar konusu/tarihini seç.
- [ ] Görsel boyutunu kaydırıcı ve köşe tutamacıyla değiştir; belgenin başına/ortasına/sonuna sürükle ve paragraf düğmeleriyle taşı.
- [ ] Görselin oranı korunur, sol/sağ metin akışı ve orta hizası çalışır. Yeniden açınca boyut ve konum korunur.
- [ ] JSON yedeğini ayrı test profilinde geri yükle: görseller, dersler, görevler, tekrarlar ve geçmiş korunur.
- [ ] Dar/geniş pencere, %100/%125/%150 Windows ölçeği, üç tema, açık/koyu ve hareketi azalt tercihiyle kontrol et.
- [ ] Yazı sırasında imleç/biçimlendirme, Ctrl+S, dosya ekleri ve tam sayfa düzeni korunur.

Bu fiziksel liste henüz tamamlanmamıştır. Simüle arayüz testleri listeye otomatik tik koymaz. Genel Windows listesi WINDOWS_KABUL_KONTROLU.md içindedir.

