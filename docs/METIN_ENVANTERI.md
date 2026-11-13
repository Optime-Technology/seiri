# FocusFlow 1.5.0 — metin envanteri

Kaynak: 1.4.0 Windows projesi. Kullanıcı uygulamaya geçilmesini onayladı. Aynı metnin kaynakta birden fazla kullanımı birlikte güncellenir. app/assets dosyaları web/ui kaynaklarından yeniden üretilir.

| Dosya | Ekran | Mevcut metin | Karar / yeni değer |
|---|---|---|---|
| `web/ui/index.html` | Genel / düzenleyici |   ✳  Her güzel şey, biraz zaman ister.  Bugün bir başlangıç yap.   | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |  Küçük planlar,  büyük başlangıçlar.  ↗   | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |  HAYATININ RİTMİNİ YAKALA  | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |   FocusFlow .   Biraz plan, biraz ilham.   Senin zamanın. Senin alanın.   | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |  Bir güne tıkla, planlamaya başla  ↗   | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |  YENİ BİR YER AÇ  | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |  BİRLİKTE DAHA FAZLASI  | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |  HABERİN OLSUN  | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |  BİRLİKTE PLANLA  | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |  Notların, görsellerin ve belgelerin bir arada.  | sil: kaldır |
| `web/ui/index.html` | Genel / düzenleyici |  Fikirlerini dilediğin gibi şekillendir.  | sil: kaldır |
| `web/ui/index.html` | Genel | Günlerini planla, fikirlerine yer aç. Türkçe takvim ve kişisel ajanda. | kısalt: FocusFlow takvim ve ajanda. |
| `web/ui/index.html` | Genel | Çalışma alanın hazırlanıyor… | kısalt: Yükleniyor… |
| `web/ui/index.html` | Genel | &lt;small&gt;Kendine zaman ayır.&lt;/small&gt; | kısalt: kaldır |
| `web/ui/index.html` | Genel | Her güne bir yer aç. | kısalt: Takvim |
| `web/ui/index.html` | Genel | Planların, notların ve yeni başlangıçların. Hepsi bir arada. | kısalt: kaldır |
| `web/ui/index.html` | Genel | FİKİRLERİNE YER AÇ | kısalt: NOTLAR |
| `web/ui/index.html` | Genel | Bu güne bir plan ekle | kısalt: Ekle |
| `web/ui/index.html` | Genel | Aklından geçenlere bir yer aç… | kısalt: Not |
| `web/ui/index.html` | Genel | Ufukta neler var? | kısalt: Yaklaşanlar |
| `web/ui/index.html` | Genel | Ne planlıyorsun? | kısalt: Başlık |
| `web/ui/index.html` | Genel | Detaylara biraz yer ayır… | kısalt: Açıklama |
| `web/ui/index.html` | Genel | Birlikte neye odaklanıyorsunuz? | kısalt: Açıklama |
| `web/ui/index.html` | Genel | Yeni bir ekip kur | kısalt: Yeni ekip |
| `web/ui/app.js` | Takvim / ajanda | &#x27;Yeni bir başlangıç&#x27; | kısalt: &#x27;—&#x27; |
| `web/ui/app.js` | Takvim / ajanda | &lt;p class=&quot;muted&quot;&gt;Bu günün sayfası henüz boş. Yeni bir planla başlayabilirsin.&lt;/p&gt; | kısalt: &lt;span class=&quot;emptyIcon&quot; aria-hidden=&quot;true&quot;&gt;▦&lt;/span&gt; |
| `web/ui/app.js` | Takvim / ajanda | ＋ Etkinlik veya not ekle | kısalt: Ekle |
| `web/ui/app.js` | Takvim / ajanda | &lt;div class=&quot;emptyday&quot;&gt;&lt;span&gt;☀&lt;/span&gt;Yeni planlar için güzel bir gün.&lt;br&gt;İlk etkinliğine burada yer aç.&lt;/div&gt; | kısalt: &lt;div class=&quot;emptyday&quot;&gt;&lt;span aria-hidden=&quot;true&quot;&gt;▦&lt;/span&gt;&lt;button type=&quot;button&quot; class=&quot;outline&quot; data-empty-add=&quot;event&quot;&gt;Ekle&lt;/button&gt;&lt;/div&gt; |
| `web/ui/app.js` | Takvim / ajanda | &lt;p class=&quot;muted&quot;&gt;Yeni planlarını buradan takip et.&lt;/p&gt; | kısalt: &lt;div class=&quot;quietEmpty&quot;&gt;&lt;span aria-hidden=&quot;true&quot;&gt;▦&lt;/span&gt;&lt;button class=&quot;outline&quot; data-empty-add=&quot;event&quot;&gt;Ekle&lt;/button&gt;&lt;/div&gt; |
| `web/ui/app.js` | Takvim / ajanda | Bu notu geliştirmek için tıkla… | kısalt: kaldır |
| `web/ui/app.js` | Takvim / ajanda | &lt;h3&gt;Fikirlerine yer aç.&lt;/h3&gt;&lt;p&gt;Bu görünümde henüz bir not yok. Günlük düşüncelerini,&lt;br&gt;aylık planlarını veya yıllık hedeflerini ekle.&lt;/p&gt; | kısalt: kaldır |
| `web/ui/app.js` | Takvim / ajanda | ＋ İlk notunu yaz | kısalt: Ekle |
| `web/ui/app.js` | Takvim / ajanda | Her güne bir yer aç. | kısalt: Takvim |
| `web/ui/app.js` | Takvim / ajanda | Aklındakilere yer aç. | kısalt: Notlar |
| `web/ui/app.js` | Takvim / ajanda | Hatırlamaya değer günler. | kısalt: Özel günler |
| `web/ui/app.js` | Takvim / ajanda | Planların, notların ve yeni başlangıçların. Hepsi bir arada. | kısalt: kaldır |
| `web/ui/app.js` | Takvim / ajanda | Düşüncelerin, hedeflerin ve biriktirdiğin fikirlerin. Sana ait bir alan. | kısalt: kaldır |
| `web/ui/app.js` | Takvim / ajanda | Kutlamalar, bayramlar ve birlikte paylaştığımız anlar. | kısalt: kaldır |
| `web/ui/app.js` | Takvim / ajanda | Ne planlıyorsun? | kısalt: Başlık |
| `web/ui/app.js` | Takvim / ajanda | Aklında ne var? | kısalt: Başlık |
| `web/ui/app.js` | Takvim / ajanda | Takvimine yeni bir plan eklendi. | kısalt: Etkinlik kaydedildi. |
| `web/ui/app.js` | Takvim / ajanda | Notun ajandana eklendi. | kısalt: Not kaydedildi. |
| `web/ui/modern.js` | Karşılama | if($(&#x27;#greetingName&#x27;))$(&#x27;#greetingName&#x27;).textContent=p.name?&#x27;Merhaba, &#x27;+p.name.split(&#x27; &#x27;)[0]+&#x27;.&#x27;:&#x27;Bugün sana ait.&#x27;; | sil: kaldır |
| `web/ui/modern.js` | Yan panel |  $(&#x27;.sidequote&#x27;).innerHTML=&#x27; &#x27;+modernIcon(&#x27;spark&#x27;)+&#x27;  Planlarına yer aç. Kendine de.  Her gün yeni bir başlangıç. &#x27;;  | sil: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Boş bir saate dokun, yeni bir plan ekle. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | p.name&#124;&#124;&#x27;Profilini kişiselleştir&#x27; | kısalt: p.name&#124;&#124;&#x27;Profil&#x27; |
| `web/ui/modern.js` | Ayarlar / profil | p.occupation&#124;&#124;&#x27;Bir fotoğraf, birkaç kelime. Tam senlik.&#x27; | kısalt: p.occupation&#124;&#124;&#x27;&#x27; |
| `web/ui/modern.js` | Ayarlar / profil | SANA AİT BİR ALAN | kısalt: HESAP |
| `web/ui/modern.js` | Ayarlar / profil | Gözlerine daha sakin bir alan. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Hatırlatmalarını kendi ritmine ayarla | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | İçe aktar, dışa aktar, güvende tut | kısalt: İçe aktar / dışa aktar |
| `web/ui/modern.js` | Ayarlar / profil | Odaklan. Yaz. İlerle. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | KENDİ RİTMİNİ BUL | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Bugün hangi havadasın? | kısalt: Temalar |
| `web/ui/modern.js` | Ayarlar / profil | Aynı planlar. Sana iyi gelen bambaşka bir atmosfer. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Pasteller, ferah kartlar, sade detaylar. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Yağmurlu bir gece ve sarı piksel dostun. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Times New Roman. Yalnızca odak. | kısalt: Times New Roman |
| `web/ui/modern.js` | Ayarlar / profil | Canlı renkler ve küçük kutlamalar. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Hiçbir güzel planı kaçırma. | kısalt: Bildirimler |
| `web/ui/modern.js` | Ayarlar / profil | Başlamadan küçük bir hatırlatma. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Yarının planlarına bugünden hazırlan. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Bir kopyası hep sende olsun. | kısalt: Yedekler |
| `web/ui/modern.js` | Ayarlar / profil | Senin zamanın. Senin alanın. | kısalt: Gizlilik |
| `web/ui/modern.js` | Ayarlar / profil | Kontrol sende | kısalt: Veri saklama |
| `web/ui/modern.js` | Ayarlar / profil | Biraz daha sen. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | Sana nasıl seslenelim? | kısalt: Ad soyad |
| `web/ui/modern.js` | Ayarlar / profil | İlgi alanların, hedeflerin, küçük bir not… | kısalt: Hakkında |
| `web/ui/modern.js` | Ayarlar / profil | Kendi ritminde, kendi alanında. | kısalt: kaldır |
| `web/ui/modern.js` | Ayarlar / profil | FocusFlow yanında. | kısalt: FocusFlow test bildirimi |
| `web/ui/modern.js` | Ayarlar / profil | Yeni arayüzün, tanıdık hatırlatmaların. | kısalt: Bildirim testi. |
| `web/ui/modern.js` | Profil |    &#x27;+modernIcon(&#x27;spark&#x27;)+&#x27;  | sil: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | FİKİRLERİNE YER AÇ | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | &lt;p&gt;Bir sayfa aç.&lt;br&gt;Bir fikrin peşinden git.&lt;/p&gt; | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | workspaceHeader(&#x27;SENİN SAYFALARIN&#x27;,&#x27;Aklındakilere yer aç.&#x27;,&#x27;Ders notların, küçük fikirlerin ve uzun hikâyelerin. Hepsi aynı rafta.&#x27;) | kısalt: workspaceHeader(&#x27;&#x27;,&#x27;Notlar&#x27;,&#x27;&#x27;) |
| `web/ui/study.js` | Notlar / odak / şablonlar | workspaceHeader(&#x27;KÜÇÜK ADIMLAR&#x27;,&#x27;Bugün neleri bitirelim?&#x27;,&#x27;Görevlerini tamamladığında istatistiklere ve geçmişine eklenir.&#x27;) | kısalt: workspaceHeader(&#x27;&#x27;,&#x27;Yapılacaklar&#x27;,&#x27;&#x27;) |
| `web/ui/study.js` | Notlar / odak / şablonlar | workspaceHeader(&#x27;İLERLEMENİ GÖR&#x27;,&#x27;Küçük adımlar birikir.&#x27;,&#x27;Odak sürelerin ve tamamladıkların, kendi çalışma ritminin bir özeti.&#x27;) | kısalt: workspaceHeader(&#x27;&#x27;,&#x27;İstatistikler&#x27;,&#x27;&#x27;) |
| `web/ui/study.js` | Notlar / odak / şablonlar | workspaceHeader(&#x27;BİRAZ DA ODAK&#x27;,&#x27;Tek bir işe, biraz zaman.&#x27;,&#x27;Bir oturum başlat. Bildirimleri ve sesleri çalışma ritmine göre ayarla.&#x27;) | kısalt: workspaceHeader(&#x27;&#x27;,&#x27;Zamanlayıcı&#x27;,&#x27;&#x27;) |
| `web/ui/study.js` | Notlar / odak / şablonlar | workspaceHeader(&#x27;BAŞLAMAK İÇİN BİR İLHAM&#x27;,&#x27;Her not boş başlamasın.&#x27;,&#x27;Ders, günlük, kitap veya toplantı. Hazır bir çerçeveyle düşüncelerine yer aç.&#x27;) | kısalt: workspaceHeader(&#x27;&#x27;,&#x27;Şablonlar&#x27;,&#x27;&#x27;) |
| `web/ui/study.js` | Notlar / odak / şablonlar | workspaceHeader(&#x27;PREMIUM KOLEKSİYON&#x27;,&#x27;Çalışma alanının havasını değiştir.&#x27;,&#x27;Bu sürümde tüm koleksiyon açık ve ücretsiz. Abonelik veya ödeme yok.&#x27;) | kısalt: workspaceHeader(&#x27;&#x27;,&#x27;Temalar ve arka plan&#x27;,&#x27;&#x27;) |
| `web/ui/study.js` | Notlar / odak / şablonlar | Bu sayfa yeni bir fikir bekliyor. | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | &lt;h3&gt;Bir sayfa, bin ihtimal.&lt;/h3&gt;&lt;p&gt;İlk ders notunu yaz veya bir şablonla başla.&lt;/p&gt; | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Yeni bir sayfa aç | kısalt: Ekle |
| `web/ui/study.js` | Notlar / odak / şablonlar | &lt;div class=&quot;studyEmptySmall&quot;&gt;Bugünün ilk küçük adımını yaz.&lt;/div&gt; | kısalt: &lt;div class=&quot;quietEmpty&quot;&gt;&lt;span aria-hidden=&quot;true&quot;&gt;✓&lt;/span&gt;&lt;button type=&quot;button&quot; class=&quot;outline&quot; data-empty-task&gt;Ekle&lt;/button&gt;&lt;/div&gt; |
| `web/ui/study.js` | Notlar / odak / şablonlar | &lt;p class=&quot;studyEmptySmall&quot;&gt;İlk oturumun tamamlanınca burada görünecek.&lt;/p&gt; | kısalt: &lt;div class=&quot;quietEmpty&quot;&gt;&lt;span aria-hidden=&quot;true&quot;&gt;◷&lt;/span&gt;&lt;button type=&quot;button&quot; class=&quot;outline&quot; data-empty-focus&gt;Ekle&lt;/button&gt;&lt;/div&gt; |
| `web/ui/study.js` | Notlar / odak / şablonlar | &lt;p class=&quot;studyEmptySmall&quot;&gt;Tamamladığın görev, not ve etkinlikler burada görünür.&lt;/p&gt; | kısalt: &lt;div class=&quot;quietEmpty&quot;&gt;&lt;span aria-hidden=&quot;true&quot;&gt;✓&lt;/span&gt;&lt;button type=&quot;button&quot; class=&quot;outline&quot; data-empty-task&gt;Ekle&lt;/button&gt;&lt;/div&gt; |
| `web/ui/study.js` | Notlar / odak / şablonlar | ŞİMDİ ODAKLAN | kısalt: ÇALIŞIYOR |
| `web/ui/study.js` | Notlar / odak / şablonlar | KÜÇÜK BİR ARA | kısalt: DURAKLATILDI |
| `web/ui/study.js` | Notlar / odak / şablonlar | KENDİNE ZAMAN AYIR | kısalt: HAZIR |
| `web/ui/study.js` | Notlar / odak / şablonlar | Dinlenmek de planın bir parçası. | kısalt: Kalan süre |
| `web/ui/study.js` | Notlar / odak / şablonlar | Küçük adımlar, derin bir odak. | kısalt: Kalan süre |
| `web/ui/study.js` | Notlar / odak / şablonlar | Bu oturumda neye çalışıyorsun? | kısalt: Oturum adı |
| `web/ui/study.js` | Notlar / odak / şablonlar | Arka planda biraz sakinlik. | kısalt: Sesler |
| `web/ui/study.js` | Notlar / odak / şablonlar | PREMIUM SES KOLEKSİYONU · AÇIK | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | KENDİ ÇALIŞMA RİTMİN | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | TAMAMEN SANA AİT | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Kendi arka planını seç. | kısalt: Arka plan |
| `web/ui/study.js` | Notlar / odak / şablonlar | Bir manzara, sevdiğin bir doku veya kendi fotoğrafın. Görsel yalnızca cihazda tutulur ve yedeğine dahil edilir. | kısalt: Görsel cihazda saklanır ve yedeğe dahil edilir. |
| `web/ui/study.js` | Notlar / odak / şablonlar | &lt;span&gt;Senin manzaran.&lt;br&gt;Senin çalışma alanın.&lt;/span&gt; | kısalt: &lt;span aria-hidden=&quot;true&quot;&gt;▧&lt;/span&gt; |
| `web/ui/study.js` | Notlar / odak / şablonlar | Sesleri keşfet → | kısalt: Sesler |
| `web/ui/study.js` | Notlar / odak / şablonlar | (item?&#x27;Başlık, konu ve tarihini buradan düzenleyebilirsin.&#x27;:&#x27;Önce birkaç bilgi. Ardından yalnızca sen ve yazdıkların.&#x27;) | kısalt: &#x27;&#x27; |
| `web/ui/study.js` | Notlar / odak / şablonlar | BİR ÇERÇEVEYLE BAŞLA | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Yepyeni, boş bir sayfa. | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Yazmaya başla… | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Detaylara biraz yer ayır… | kısalt: Açıklama |
| `web/ui/study.js` | Notlar / odak / şablonlar | FocusFlow · Odak stüdyosuna dönüp geçmişini inceleyebilirsin. | kısalt: FocusFlow |
| `web/ui/study.js` | Notlar / odak / şablonlar | Kendi arka planın hazır. | kısalt: Arka plan kaydedildi. |
| `web/ui/study.js` | Notlar / odak / şablonlar | Sıfırdan başla | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Öğren, bağla, hatırla | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Bugün için küçük adımlar | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Sayfalardan kalanlar | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Konunun çerçevesini buraya yaz. | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Kavram ve açıklaması | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Aklıma takılanlar… | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Bugün öğrendiğim en önemli şey… | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Bugün neler iyi gitti? | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Buraya bir alıntı ekle. | kısalt: kaldır |
| `web/ui/study.js` | Notlar / odak / şablonlar | Kim, neyi, ne zaman yapacak? | kısalt: kaldır |
| `web/ui/themes.js` | Temalar | Çalışma alanın, senin havan. | kısalt: Temalar |
| `web/ui/themes.js` | Temalar | Aynı planlar, bambaşka bir atmosfer. Sana iyi gelen modu seç. | kısalt: kaldır |
| `web/ui/themes.js` | Temalar | BİR MOD SEÇ, KENDİ RİTMİNİ BUL | kısalt: kaldır |
| `web/ui/themes.js` | Temalar | Bugün hangi havadasın? | kısalt: Temalar |
| `web/ui/themes.js` | Temalar | Geceye eşlik eden sakinlik, derin bir odak ya da küçük bir neşe molası. | kısalt: kaldır |
| `web/ui/themes.js` | Temalar | one more&lt;br&gt;little thought | kısalt: Lo-Fi |
| `web/ui/themes.js` | Temalar | Dikkatinin&lt;br&gt;tek bir yönü olsun. | kısalt: Akademik |
| `web/ui/themes.js` | Temalar | Plan yap.&lt;br&gt;&lt;em&gt;Keyfini çıkar.&lt;/em&gt; | kısalt: Eğlenceli |
| `web/ui/themes.js` | Temalar | Bugünün küçük zaferi | kısalt: kaldır |
| `web/ui/themes.js` | Temalar | Bir şeyleri&lt;br&gt;tamamladım! | kısalt: kaldır |
| `web/ui/themes.js` | Temalar | Yağmurlu bir gece, sıcak bir ışık. Cam kenarında çalışan bir kız ve sana eşlik eden sarı piksel kedi. | kısalt: kaldır |
| `web/ui/themes.js` | Temalar | Dikkatini dağıtan ayrıntılar geride kalsın. Ciddi renkler, temiz bir sayfa ve yalnızca çalışman. | kısalt: kaldır |
| `web/ui/themes.js` | Temalar | Küçük adımlar, renkli kutlamalar. Başarılı işlemlerde patlayan balonlar ve yazı alanlarında mikro arabalar. | kısalt: kaldır |
| `web/ui/themes.js` | Temalar | Şu an bu moddasın | kısalt: Seçili |
| `web/ui/themes.js` | Temalar | Bu atmosferi seç | kısalt: Seç |
| `web/ui/themes.js` | Temalar | Odağını bul | kısalt: Seç |
| `web/ui/themes.js` | Temalar | Biraz neşe kat | kısalt: Seç |
| `web/ui/themes.js` | Tema tanıtım kartı |    ${skin===&#x27;lofi&#x27;?&#x27;Kedinin kendi ritmi var.&#x27;:skin===&#x27;playful&#x27;?&#x27;Küçük bir kutlama?&#x27;:skin===&#x27;academic&#x27;?&#x27;Derin odak için hazır.&#x27;:&#x27;Tanıdık, sade bir alan.&#x27;}  ${skin===&#x27;lofi&#x27;?&#x27;Sarı dostun ekranın kenarlarında gezer.&#x27;:skin===&#x27;playful&#x27;?&#x27;Balonları dene; bir yazı alanına odaklanıp arabayı izle.&#x27;:skin===&#x27;academic&#x27;?&#x27;Times New Roman, ciddi renkler, dekoratif animasyon yok.&#x27;:&#x27;İstediğin zaman klasik görünüme dönebilirsin.&#x27;}  ${skin===&#x27;playful&#x27;?&#x27; Efektleri dene ✦ &#x27;:&#x27; &#x27;+(skin===&#x27;lofi&#x27;?&#x27;☾&#x27;:skin===&#x27;academic&#x27;?&#x27;Aa&#x27;:&#x27;◎&#x27;)+&#x27; &#x27;}  | sil: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Hesabınla her yerde. | kısalt: Hesap |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Birlikte zaman yaratın. | kısalt: Ekipler |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Sana ait bir alan. | kısalt: Hesap |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Aynı hedefe, ortak takvimler ve paylaşılan fikirlerle. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Profilin, çalışma alanların ve bildirim tercihlerin. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Hesabınla bağlan. | kısalt: Giriş |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Çalışma arkadaşların, aynı yerde. | kısalt: Ekipler |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Bir ekibe geçerek ortak takvimini ve notlarını aç. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | İlk ekibini kurarak birlikte planlamaya başla. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Ortak fikirler ve birlikte yapılan planlar için bir alan. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Fikirleri ve planları bir araya getir. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Davetin mi var? | kısalt: Davet bağlantısı |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Ekip davet bağlantısını buraya yapıştır. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Ekibin hazır. Artık birlikte planlayabilirsiniz. | kısalt: Ekip oluşturuldu. |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Hiçbir planı kaçırma. | kısalt: Bildirimler |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Hatırlatmalarını kendine göre ayarla. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Etkinliğin yaklaşırken bir hatırlatma. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Yarının planlarına bugünden hazırlan. | kısalt: kaldır |
| `web/ui/team.js` | Ekip / hesap / bildirimler | Cihaz takviminde de yanında. | kısalt: Takvimi dışa aktar |
| `web/ui/team.js` | Ekip / hesap / bildirimler | FocusFlow yanında. | kısalt: FocusFlow test bildirimi |
| `web/ui/team.js` | Ekip / hesap / bildirimler | &lt;h3&gt;Şimdilik her şey sakin.&lt;/h3&gt;&lt;p&gt;Etkinlik hatırlatmaların ve ekip haberlerin burada görünecek.&lt;/p&gt; | kısalt: &lt;span aria-hidden=&quot;true&quot;&gt;♧&lt;/span&gt;&lt;button class=&quot;outline&quot; data-empty-add=&quot;event&quot;&gt;Ekle&lt;/button&gt; |
| `web/ui/planner.js` | Planlama | &lt;span class=&quot;eyebrow&quot;&gt;GÜNÜNE YENİ BİR AKIŞ&lt;/span&gt; | kısalt: kaldır |
| `web/ui/planner.js` | Planlama | Günü rahatça kapat | kısalt: Gün sonu |
| `web/ui/planner.js` | Planlama | Taşınacak işleri tek seferde kararlaştır. Sabit ve hassas etkinlikler bu listede yer almaz. | kısalt: Sabit ve hassas etkinlikler listelenmez. |
| `desktop/adapter.js` | Windows | FocusFlow artık masaüstünde. | kısalt: Hesap ve ekipler |
| `desktop/adapter.js` | Windows | WINDOWS · ÇEVRİMDIŞI HAZIR | kısalt: WINDOWS |
| `desktop/adapter.js` | Windows | &lt;h3&gt;Şimdilik her şey sakin.&lt;/h3&gt;&lt;p&gt;Etkinlik eklediğinde hatırlatmalar burada görünür.&lt;/p&gt; | kısalt: &lt;span aria-hidden=&quot;true&quot;&gt;♧&lt;/span&gt;&lt;button class=&quot;outline&quot; data-empty-add=&quot;event&quot;&gt;Ekle&lt;/button&gt; |
| `desktop/main.cjs` | Test bildirimi | FocusFlow yanında. | kısalt: FocusFlow test bildirimi |

| `web/ui/modern.js` | Başlangıç başlığı | Bugününe biraz yer aç. | kısalt: Takvim |
| `web/ui/modern.js` | Başlangıç alt başlığı | Planların, fikirlerin, sana kalan zaman. | sil |
| `web/ui/modern.js` | Karşılama | Bugün sana ait. | sil |

## Korunan metinler

Hata/başarı durumları, güvenlik ve anahtar kaybı uyarıları, izin ve bildirim çalışma koşulları, hassas kayıt uyarıları, yedek gizliliği, takvim kaynak/kapsam bilgileri, alan/buton etiketleri, klavye kısayolları, aria-label ve belge/iframe title alanları korunur. Görsel HTML title tooltipleri kaldırılır; erişilebilir adları aria-label üzerinden korunur. Kullanıcı notları, profil bilgileri ve kullanıcı şablonları değiştirilmez.

## Diller

Bu sürümde l10n, ARB veya İngilizce ekran seti yoktur; arayüz Türkçedir. Tam uygulama İngilizceleştirmesi bu kapsamda yapılmaz.