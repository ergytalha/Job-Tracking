# İş Takip Sistemi - Kurulum Talimatları

## 🚀 Hızlı Başlangıç

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd is-takip-sistemi
```

### 2. Bağımlılıkları Yükleyin
```bash
# Backend bağımlılıkları
cd backend
npm install

# Frontend bağımlılıkları
cd ../frontend
npm install
```

### 3. Veri Dosyalarını Oluşturun
```bash
# Backend klasörüne gidin
cd ../backend

# Örnek dosyaları gerçek dosyalara kopyalayın
cp data/users.example.json data/users.json
cp data/projeler.example.json data/projeler.json
cp data/revizyonlar.example.json data/revizyonlar.json
```

### 4. Sunucuları Başlatın
```bash
# Backend'i başlatın (yeni terminal)
cd backend
npm start

# Frontend'i başlatın (yeni terminal)
cd frontend
npm run dev
```

### 5. Sisteme Giriş Yapın
Tarayıcıda `http://localhost:5173` adresine gidin ve şu kullanıcılarla giriş yapın:

- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`
- **Editor**: `editor` / `editor123`

## 🔧 Özelleştirme

### Kullanıcı Ekleme
`backend/data/users.json` dosyasını düzenleyerek yeni kullanıcılar ekleyebilirsiniz:

```json
{
  "id": 4,
  "username": "yeni_kullanici",
  "password": "güvenli_şifre",
  "role": "user"
}
```

### Roller
- `admin`: Tüm sayfalara erişim
- `editor`: Projeler, revizyonlar ve raporlar
- `user`: Sadece projeler ve revizyonlar

## 📁 Dosya Yapısı

```
is-takip-sistemi/
├── backend/
│   ├── data/
│   │   ├── users.json          # Kullanıcı verileri
│   │   ├── projeler.json       # Proje verileri
│   │   └── revizyonlar.json    # Revizyon verileri
│   └── server.js               # Backend sunucusu
├── frontend/
│   └── src/                    # React uygulaması
└── README.md                   # Ana dokümantasyon
```

## 🔒 Güvenlik Notları

- Gerçek kullanımda şifreleri hash'leyin
- Production'da environment variables kullanın
- Veritabanı kullanmayı düşünün (SQLite, PostgreSQL, vb.)
- HTTPS kullanın

## 🐛 Sorun Giderme

### Port Çakışması
Eğer portlar kullanımdaysa:
- Backend: `PORT=3001 npm start`
- Frontend: `npm run dev -- --port 5174`

### Veri Dosyaları Bulunamıyor
```bash
# Backend klasöründe data klasörünü oluşturun
mkdir -p backend/data
```

## 📞 Destek

Sorun yaşarsanız:
1. Console hatalarını kontrol edin
2. Backend ve frontend loglarını inceleyin
3. Port çakışmalarını kontrol edin 