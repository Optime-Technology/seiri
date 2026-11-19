# GitHub yardım sayfasını yayımlama

Bu dosyalar hazırdır; uzak GitHub deposuna yükleme ve yayınlama yapılmamıştır.

1. Kaynak ZIP içindeki SeiriWindows klasörünün **içeriğini** mevcut depo köküne yerleştirin. Deponun içine ikinci bir SeiriWindows katmanı eklemeyin. node_modules, dist ve EXE dosyalarını kaynak commit'ine katmayın.
2. Özellikle docs/index.html, docs/.nojekyll, docs/kits/*.json ve .github/ISSUE_TEMPLATE/kullanim-yardimi.yml dosyalarını ekleyip push edin.
3. GitHub → Optime-Technology/seiri → Settings → Pages → Build and deployment → Source: Deploy from a branch → main → /docs → Save.
4. Yayın tamamlandıktan sonra Pages ekranının verdiği adresi kullanın. Beklenen adres https://optime-technology.github.io/seiri/ biçimindedir; bu çalışma adresin yayında olduğunu doğrulamadı.
5. Repository Settings → General → Features → Issues açık olsun. Issues → New issue altında Kullanım yardımı formunu deneyin.
6. Sayfadaki yardım formuna örnek bir konu yazın; düğmenin GitHub'da yalnızca taslak açtığını, kendiliğinden gönderim yapmadığını kontrol edin. Örnek kaydı yayımlamak zorunda değilsiniz.

Rehberin asıl metni web/ui/help-content.js içindedir. Değişiklikten sonra npm run build:web, docs/index.html ve düzen JSON dosyalarını yeniden üretir. Uygulama içi Yardım ve öğretici aynı metin kaynağını kullanır.

Formun açtığı kayıt herkese açıktır. Kişisel not, tanılama dışı yedek, parola, anahtar ve hassas görseller eklenmemelidir. Bu statik sayfa arka uç, e-posta servisi veya ücretli form hizmeti kullanmaz.

