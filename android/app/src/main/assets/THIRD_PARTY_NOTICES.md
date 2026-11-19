# Üçüncü taraf bileşenler

- Android System WebView: cihazın sağladığı çalışma zamanı; uygulama içine kopyalanmamıştır.
- Gradle Wrapper 8.13: Gradle projesinin resmî dağıtımı, Apache License 2.0. Başlatıcı dosyalarının lisans bildirimleri korunmuştur.
- Nunito, Space Mono, VT323, DM Sans ve Manrope: Fontsource üzerinden alınan SIL Open Font License kapsamındaki fontlar. Her fontun lisansı `web/fonts/<font>/LICENSE` ve paketlenmiş varlıklar altında korunur; sürümler `web/fonts/versions.json` içindedir.
- Tema görselleri: Zaman projesi için üretilmiş görseller; mevcut projenin tema varlıklarıdır.

Android SDK araçları ve android.jar yalnızca derlemede kullanılmıştır; kaynak paketine eklenmemiştir.

1.2.0 ile eklenen açık kaynak font aileleri kendi LICENSE dosyalarıyla web/fonts altında bulunur. Sürüm bilgisi versions.json dosyasındadır. Sesler Web Audio ile üretilir; üçüncü taraf ses kaydı kullanılmaz.


## Android bulut paketi

@supabase/supabase-js 2.119.1 ve buffer 6.0.3, MIT lisanslıdır. Bu kitaplıkların ve alt bağımlılıklarının lisansları kaynak projede licenses/ altında bulunur; paketlenmiş kod assets/assets/android-cloud.js içinde yer alır. Esbuild yalnızca derleme aracıdır.
