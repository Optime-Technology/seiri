# Veritabanı testleri

Bu klasör yalnızca geliştirme/test içindir; Windows uygulamasının çalışma zamanı bağımlılığı değildir.

1. Proje kökünde `npm install --prefix supabase/tests --ignore-scripts --no-audit --no-fund` çalıştır.
2. `npm --prefix supabase/tests test` çalıştır.

rls.mjs, PGlite 0.5.16 içinde geçici PostgreSQL açar. Auth uid fonksiyonu, Storage ve Realtime tabloları test fixture'larıdır. Migration'ın kendisi değiştirilmeden çalıştırılır. Yeni/eski kullanıcı, kişisel alan, A/B/C veri ayrımı, üyelik ve rol RPC'leri, davetler, FK zincirleri, sunucu revizyonu, soft delete, Storage politikaları, özel Realtime kanal ayrımı ve içeriksiz sinyal, dosya kotası ve anon yetkileri denenir.

Canlı proje URL'si/anahtarı testte kullanılmaz; kullanıcı verisi okunmaz ve uzaktaki projeye yazılmaz. Yerel test sonucu ../TEST_SONUCU.json içine yazılır. Motorun sürümü test sırasında sorgulanır.

rls_smoke.sql farklıdır: isteğe bağlı olarak gerçek Supabase SQL Editor'de çalıştırılır. Önce iki Auth test hesabı ve migration gerekir. Yönetici oturumu içinde test için JWT sub ayarlanır ve authenticated rolüne geçilir; gerçek JWT doğrulamasını veya giriş akışını test etmez. En sonda ROLLBACK ile örnek kayıtlar kaldırılır. Fixture şemalarını gerçek Supabase'e kopyalamayın.
