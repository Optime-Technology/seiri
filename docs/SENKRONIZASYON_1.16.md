# Seiri 1.16.0 · Windows kişisel alan eşitlemesi

## SENİN YAPACAKLARIN

Supabase SQL kurulumu ve Google girişi daha önce çalıştıysa yeni SQL çalıştırma veya anahtar gönderme gerekmez. Önce eski Seiri'de JSON yedeği al, tepsi menüsünden Çıkış yap ve yeni ZIP'i tamamen çıkarıp Kur.cmd/Seiri.exe ile aç. %APPDATA%\Zaman klasörünü silme.

1. Ayarlar → Hesap ve bağlantı → Google hesabının doğru olduğunu kontrol et.
2. Eski notların durduğu Bu bilgisayar alanından **Bu bilgisayardaki verileri hesabıma aktar** seç. Güvenlik yedeği alınır; kaynak kayıtlar değişmez. Hesap alanına geçilir.
3. Aynı menüde normal not/etkinlik/dosya sayısı ve kaç hassas kaydın hariç tutulduğu görünür. **Hazırlanan aktarımı tamamla** ile kopyayı içe al. Aktarım tamamlandıktan sonra eşitleme başlar. Aktarımı iptal et, kayıtları silmeden beklemeyi kaldırır.
4. Hesap alanında **Şimdi eşitle**, bekleyen sayı, son kontrol ve hata durumu görünür. Normal kayıtlar kullanıcı değişikliklerinden sonra ve 30 saniyelik kontrolle gönderilir/çekilir. Private Realtime sinyali ek kontrol tetikler; teslim gelmese de periyodik kontrol sürer.
5. İkinci Windows bilgisayarında aynı 1.16.0 veya sonraki uyumlu sürümü aç. Aynı Google hesabına girip **Hesabımın kişisel alanını aç** seç. Bu cihazdan eski verileri tekrar taşıma.

Hesap alanını boş açıp sonradan aktarım yapmak da mümkündür. Güvenli otomatik taşıma yalnızca boş hedef alana uygulanır; hedefte kayıt varsa sessizce üzerine yazılmaz. Mevcut JSON içe aktarma aynı kimlikte yedekteki sürümü tercih eder; dolu hedefte bunu ancak birleştirme davranışını bilerek kullan. Aktarım işleminden önce hem kaynak hem hedefin JSON yedeğini sakla.

## Kapsam ve sınırlar

Eşitlenenler: normal notlar ve hızlı gün notları, etkinlikler, görev/tekrar kayıtları, kategoriler, dersler, checklistler, odak oturumları, özel şablonlar; bu normal içeriklere bağlı JPEG/PNG/PDF dosyaları, kapaklar ve not içi görseller.

Yerelde kalanlar: hassas etkinlikler ve bunlara bağlı görev/oturumlar; hassas anahtar kasası; taslaklar; not sürüm geçmişi; yeniden planlama geçmişi; ayrı tamamlama olay günlüğü; çalışan zamanlayıcı; profil, özel arka plan ve cihaz tercihleri. İlk geçişte normal içeriğin yerel geçmişi/ayarları kopyalanabilir; bunlar sonraki cihazlara eşitlenmez. Notun/görevin mevcut tamamlanma durumu kendi kaydıyla gider. Ekip alanı, Android ve web istemcileri bu sürümde güncellenmez.

Not içeriği JSON olarak en fazla 256 KiB, kayıt özellikleri yaklaşık 30 KB; dosya en fazla 10 MB. Mevcut SQL beta kotası kullanıcı ve alan başına 40 MB dosya rezervasyonudur. Bir kapak/not referansını kaldırmak buluttaki eski nesneyi kalıcı silmez veya rezervasyonu otomatik boşaltmaz; çöp kutusu ve yerel geçmişin dosyaları kullanabilmesi için bunlar korunur. Otomatik kalıcı dosya temizliği ve hesap silme genel yayın öncesi ayrıca tamamlanmalıdır. Kota dolarsa içerik/dosya cihazda kalır, hata görünür; yükleme başarılı gösterilmez. Uzun not sınırı aşılırsa metin kesilmez.

Normal içerik Supabase üzerinde okunabilir biçimde saklanır; RLS başka kullanıcıların erişimini sınırlar, uçtan uca şifreleme sağlamaz. Gizli veri girmeden önce yerel Hassas mod kullanılmalı. Hesap alanında daha önce normal kaydedilmiş etkinlik sonradan hassas moduna dönüştürülmez; Bu bilgisayar alanında yeni hassas kayıt oluşturulur. Böylece daha önce yüklenmiş dosya ve kopyaların geriye dönük şifrelenmiş olduğu izlenimi verilmez. Savunma olarak içe aktarmayla hassas hâle gelen eski kayıtların normal bulut alanları temizlenir; bu geçmiş sunucu yedeklerini temizleme garantisi değildir.

Hesap silme, web silme formu, mağaza gizlilik metni/Data Safety ve tüm platform istemcilerinin kabul testleri henüz tamamlanmadı. Bu çıktı mağaza yayınına hazır ürün iddiası taşımaz.

## Veri ayrımı ve çevrimdışı davranış

Bu bilgisayar, eski default Chromium session'ını kullanır. Hesaplar `persist:seiri-user-<UUID>` adlı ayrı Chromium partition'larına bağlanır; localStorage, IndexedDB ve dosyalar paylaşılmaz. Seçili hesap yeniden açılışta ancak işletim sistemiyle şifreli oturumdaki kullanıcıyla eşleşiyorsa açılır. Çıkışta Bu bilgisayar alanına dönülür. Çevrimdışı yerel alan yalnızca daha önce bu cihazda doğrulanmış hesap için açılabilir; bulut isteği yeniden doğrulanmış kullanıcı ve kişisel workspace ile yapılır.

Partition ayrımı uygulama içi ayrımdır; aynı Windows kullanıcısı altında çalışan başka programlara karşı tüm notları şifreleyen bir güvenlik sınırı değildir. Normal yerel notlar ve yedekler düz metindir. Hassas ayrıntıların mevcut ayrı şifrelemesi korunur.

%APPDATA%\Zaman\Seiri Accounts\<UUID> altında kasa, hatırlatmalar, yedekler, dosya bağlantıları, aktarım makbuzu ve sync-journal.json bulunur. Chromium içerikleri Electron'un %APPDATA%\Zaman\Partitions altındadır. Kaynak geçiş kopyaları %APPDATA%\Zaman\Seiri Transfers altında tutulur; dönen yedi otomatik kopyadan bağımsızdır. Bu kopyalar kendiliğinden silinmez ve kaynak normal/hassas JSON yedeğini içerir; güvenli harici yedek aldıktan sonra saklama kararını kullanıcı verir. Tokenlar bu kopyalara girmez.

Gönderim kuyruğu ve sunucu revizyonları atomik dosyada tutulur. Sunucu revizyonu koşullu UPDATE ile karşılaştırılır. Aynı temel revizyondan iki ayrı değişiklik çıkarsa özgün kaydı güncel sunucu sürümü temsil eder, yerel düzenleme ayrı Çakışma kopyası olur. Yanıtı kaybolan başarılı insert aynı deterministik kimlikle yeniden kontrol edilir; kopya açılmaz. Silme ile başka cihazın düzenlemesi çakışırsa düzenlenen kayıt korunur ve çakışma sayacı artar; kullanıcı tekrar silmeye karar verebilir. Bu, sessiz son yazan kazanır yaklaşımına göre içerik kaybını önler.

Açık notta uzaktan gelen metin uygulanmaz; yazı sayfası kapanınca bir sonraki kontrolle işlenir. Böylece imleç, seçim ve yazılmakta olan paragraf sıçramaz. Ana not ve çalışma cache'i birlikte uygulanırken yarım kalan işlem ayrı IndexedDB günlüğüyle geri alınır. Yeni dosyaya ağ yokken erişilemiyorsa dosya cihazda bekler; ona bağlı kayıt başarıyla eşitlenmiş sayılmaz. Yerel cache tek başına disk arızası yedeği değildir.

## Test kontrol listesi

- [ ] A hesabına gir, bir not/kapak/checklist oluştur ve eşitle. Çıkış yap: Bu bilgisayar alanına dönmeli. B hesabını aç: A notu, dosyası, taslağı, yerel profil ve kasa görünmemeli.
- [ ] A'ya geri gir: önceki kayıtlar görünmeli. İnterneti kesip uygulamayı yeniden aç: daha önce açılmış alan yerelden kullanılabilmeli. Çıkış sonrası eski hesaba giriş yapmadan alan açılmamalı.
- [ ] Eski verileri taşı: önce yedek ve önizleme; kaynak not sayısı değişmemeli; hassas kayıtlar hesap alanına geçmemeli. Aynı aktarımı tekrar denemek mükerrer üretmemeli.
- [ ] İkinci Windows cihazında aynı hesapla not, görev, ders, checklist, odak oturumu ve kapak/not içi fotoğraf/PDF görünmeli. İndirilen dosya baytları aynı olmalı.
- [ ] Bağlantıyı kesip not düzenle, uygulamayı kapat/aç, sonra bağlantıyı aç: yazı korunmalı ve gönderilmeli.
- [ ] İki cihazda aynı notu çevrimdışı farklı değiştir: bağlanınca iki içerik de korunmalı; birinde Çakışma kopyası oluşmalı.
- [ ] Notu sil: diğer cihazın çöp kutusunda görünmeli. Kategori/görev silme de taşınmalı. Başka cihaz düzenlemişken silme yapılırsa güncel içerik korunmalı ve çakışma sayısı artmalı.
- [ ] Bir cihazda not yazı sayfasını açık tut; diğerinden değiştir. İlk cihazın imleci/metni değişmemeli; sayfa kapanınca değişiklik veya çakışma kopyası işlenmeli.
- [ ] 256 KiB üstü not, geçersiz dosya ve 40 MB kota: açık hata; yerel içerik kaybı olmamalı.
- [ ] Realtime bağlantısını kes: 30 saniyelik kontrol yeni kaydı yine getirmeli.
- [ ] RLS: A authenticated JWT'siyle B workspace notu ve file_assets satırı okunamamalı/yazılamamalı; B Storage nesnesi indirilememeli. SQL Editor postgres rolüyle okumak bu testi yapmaz. supabase/tests/rls_smoke.sql rol değiştirip ROLLBACK ile temel ayrımı sınar.
- [ ] Hiçbir JSON yedek/tanılama/kuyruk dosyasında access_token/refresh_token bulunmamalı. Auth dosyası işletim sistemiyle şifreli olmalı; yeniden açılışta giriş korunmalı.

Otomatik testler: scripts/test_sync116.mjs, test_cloud_files116.mjs, test_dom116.mjs ve önceki regresyonlar. İki istemci, ağ/disk hatası, kayıp onay, yarış, silme, şifreli oturum adapter sözleşmesi, gerçek UI/kayıt dönüşümü ve dosya baytları simüle edilmiştir. Gerçek iki Windows bilgisayarında Supabase/Storage/Realtime ve DPAPI kabul testi bu ortamda yapılamadı. DOGRULAMA.json bunu açıkça belirtir.

## Değişen dosyalar ve geri alma

Ana süreç: desktop/account-spaces.cjs, sync-model.cjs, sync-engine.cjs, cloud-files.cjs, transfer-model.cjs; main.cjs, preload.cjs, cloud-auth.cjs ve auth-store.cjs. Arayüz: cloud-sync-ui.js, sync-cache.js, cloud-auth-ui.js, app.js, study.js, privacy.js, durable-storage.js, modern.js ve index.html. Paketleme betikleri, package.json/kilit dosyası, testler ve README'ler güncellendi; app/ ile marka sürümü yeniden üretildi.

Geri alma: hesap alanında ve Bu bilgisayar alanında ayrı JSON yedekleri al. Çıkış yap, tepsiden kapat ve önceki 1.15.0 paketini aç. Önceki sürüm hesap partition'larını okumaz; hesapta sonradan yazdığın notları orada kullanacaksan hesabın JSON yedeğini bilinçli olarak içe aktarman gerekir. %APPDATA%\Zaman dizinini ve bulut kayıtlarını silme. Bu sürüm SQL şemasını değiştirmedi.
