# 🚄 Tren Bileti Bulucu

Otomatik olarak TCDD tren biletlerinin müsaitliğini kontrol eden web uygulaması.

## 📁 Proje Yapısı

```
TrenBiletBulucu2/
├── index.html              # Ana HTML dosyası
├── assets/                 # Medya dosyaları
│   └── success.mp3        # Bilet bulunca çalan müzik
├── data/                   # Veri dosyaları
│   └── stations.json      # İstasyon listesi
└── src/                    # Kaynak kodlar
    ├── css/
    │   └── styles.css     # Stil dosyası
    └── js/
        ├── main.js        # Ana giriş noktası
        ├── config.js      # Yapılandırma sabitleri
        ├── utils.js       # Yardımcı fonksiyonlar
        ├── stations.js    # İstasyon yönetimi
        ├── api.js         # API çağrıları
        ├── ui.js          # Kullanıcı arayüzü yönetimi
        └── search.js      # Arama mantığı
```

## 🚀 Kullanım

1. Projeyi bir HTTP sunucusu ile çalıştırın:
   ```bash
   python3 -m http.server 8000
   ```

2. Tarayıcınızda açın:
   ```
   http://localhost:8000
   ```

3. Kalkış ve varış istasyonlarını seçin
4. Tarih ve saat aralığını belirleyin
5. "Aramayı Başlat" butonuna tıklayın
6. Bilet bulunduğunda otomatik olarak ses çalar ve arama durur

## ✨ Özellikler

- 🔄 Otomatik 5 saniyelik kontrol aralığı
- 🎵 Bilet bulunca müzik çalma
- 🎨 Modern ve kullanıcı dostu arayüz
- 📱 Responsive tasarım (mobil ve masaüstü)
- 🔒 Anti-bot koruması (3-8 saniye rastgele gecikme)
- 🌐 Cross-platform çalışma

## 🏗️ Mimari

Proje, modüler bir mimari kullanır:

- **Config Module**: Tüm yapılandırma sabitleri
- **Utils Module**: Tarih/saat formatlama ve yardımcı fonksiyonlar
- **Stations Module**: İstasyon verilerini yönetme
- **API Module**: TCDD API ile iletişim
- **UI Module**: DOM manipülasyonu ve kullanıcı arayüzü
- **Search Module**: Arama mantığı ve sonuç işleme
- **Main Module**: Uygulama başlatma ve olay yönetimi

## 🛠️ Teknolojiler

- Vanilla JavaScript (ES6 Modules)
- CSS3 (Gradients, Animations)
- HTML5

## 📝 Notlar

- TCDD API'si statik bir JWT token kullanır (2024'ten beri aynı)
- Ekonomi sınıfı (cabinClass.id = 2) için koltuk kontrolü yapar
- Anti-bot koruması için rastgele gecikme ekler
