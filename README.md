# İş Takip Sistemi (Job Tracking System)

Modern, kullanıcı dostu bir proje ve görev takip sistemi. React.js ve Node.js ile geliştirilmiştir.

## 🚀 Özellikler

### 📊 Proje Yönetimi
- Proje oluşturma, düzenleme ve silme
- Proje durumu takibi (devam ediyor, tamamlandı, beklemede, iptal)
- Proje bütçesi yönetimi (admin yetkisi gerekli)
- Proje filtreleme ve arama
- CSV dışa aktarma

### 🔄 Revizyon Takibi
- Proje revizyonları oluşturma ve yönetme
- Revizyon durumu takibi
- Revizyon geçmişi
- Revizyon istatistikleri

### 👥 Ekip Yönetimi
- Ekip üyeleri görüntüleme
- Performans istatistikleri
- Rol bazlı erişim kontrolü
- Ekip üyesi filtreleme ve arama

### 📈 Raporlama
- Genel proje istatistikleri
- Bütçe analizi (admin yetkisi gerekli)
- **Gelir takibi ve ödeme yönetimi** (admin yetkisi gerekli)
- Öncelik bazlı analiz
- Revizyon istatistikleri
- CSV dışa aktarma

### 💰 Ödeme Yönetimi (Yeni!)
- Müşteri bazında ödeme takibi
- Gerçek zamanlı bakiye hesaplama
- Ödeme geçmişi
- Ödeme yöntemi takibi
- Otomatik bakiye güncelleme

### 🎨 Kullanıcı Arayüzü
- Modern ve responsive tasarım
- Koyu/açık tema desteği
- Bildirim sistemi
- Kullanıcı dostu navigasyon
- Mobil uyumlu

### 🔐 Güvenlik
- Rol bazlı erişim kontrolü (Admin, Editor, User)
- Kullanıcı kimlik doğrulama
- Güvenli API endpoints
- Veri doğrulama

## 🛠️ Teknolojiler

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Router** - Navigation
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin requests
- **File System** - Data persistence

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd is-takip
```

2. **Backend'i kurun ve çalıştırın:**
```bash
cd Job-Tracking/backend
npm install
node server.js
```

3. **Frontend'i kurun ve çalıştırın:**
```bash
cd Job-Tracking/frontend
npm install
npm run dev
```

4. **Uygulamayı açın:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

## 👤 Kullanıcı Rolleri

### Admin
- Tüm özelliklere erişim
- Bütçe bilgilerini görüntüleme
- Gelir takibi ve ödeme yönetimi
- Ekip üyesi ekleme

### Editor
- Proje ve revizyon yönetimi
- Rapor görüntüleme (bütçe hariç)
- Ekip bilgilerini görüntüleme

### User
- Proje görüntüleme
- Revizyon oluşturma
- Temel raporları görüntüleme

## 🔑 Varsayılan Kullanıcılar

| Kullanıcı Adı | Şifre | Rol |
|---------------|-------|-----|
| admin | admin123 | Admin |
| editor | editor123 | Editor |
| user | user123 | User |
| ahmet | ahmet123 | User |
| aliklc | aliklc123 | User |

## 📁 Proje Yapısı

```
is-takip/
├── Job-Tracking/
│   ├── backend/
│   │   ├── server.js          # Ana server dosyası
│   │   ├── package.json       # Backend bağımlılıkları
│   │   └── data/              # Veri dosyaları
│   │       ├── .gitkeep
│   │       ├── users.json     # Kullanıcı verileri
│   │       ├── projeler.json  # Proje verileri
│   │       ├── revizyonlar.json # Revizyon verileri
│   │       └── odemeler.json  # Ödeme verileri
│   └── frontend/
│       ├── src/
│       │   ├── components/    # React bileşenleri
│       │   ├── pages/         # Sayfa bileşenleri
│       │   ├── context/       # Context providers
│       │   ├── services/      # API servisleri
│       │   └── utils/         # Yardımcı fonksiyonlar
│       ├── public/            # Statik dosyalar
│       └── package.json       # Frontend bağımlılıkları
└── README.md
```

## 🚀 API Endpoints

### Kimlik Doğrulama
- `POST /api/login` - Kullanıcı girişi

### Projeler
- `GET /api/projeler` - Projeleri listele
- `POST /api/projeler` - Yeni proje oluştur
- `PUT /api/projeler/:id` - Proje güncelle
- `DELETE /api/projeler/:id` - Proje sil

### Revizyonlar
- `GET /api/revizyonlar` - Revizyonları listele
- `POST /api/revizyonlar` - Yeni revizyon oluştur
- `PUT /api/revizyonlar/:id` - Revizyon güncelle
- `DELETE /api/revizyonlar/:id` - Revizyon sil

### Ekip
- `GET /api/team` - Ekip üyelerini listele

### Ödemeler
- `GET /api/odemeler` - Ödemeleri listele
- `POST /api/odemeler` - Yeni ödeme ekle
- `DELETE /api/odemeler/:id` - Ödeme sil

### Raporlar
- `GET /api/gelir-takibi` - Temel gelir takibi
- `GET /api/gelir-takibi-detayli` - Detaylı gelir takibi (ödeme bilgileri ile)

## 🎯 Özellik Detayları

### Gelir Takibi ve Ödeme Yönetimi
- **Müşteri bazında** gelir analizi
- **Gerçek zamanlı bakiye** hesaplama
- **Ödeme geçmişi** takibi
- **Otomatik bakiye** güncelleme
- **CSV dışa aktarma** özelliği

### Bildirim Sistemi
- **Sesli bildirimler**
- **Masaüstü bildirimleri**
- **Bildirim geçmişi**
- **Otomatik temizlik** (30 gün)

### Tema Desteği
- **Açık tema**
- **Koyu tema**
- **Otomatik tema** (sistem tercihine göre)
- **Smooth geçişler**

## 🔧 Geliştirme

### Backend Geliştirme
```bash
cd Job-Tracking/backend
npm install
node server.js
```

### Frontend Geliştirme
```bash
cd Job-Tracking/frontend
npm install
npm run dev
```

### Veri Yedekleme
Veri dosyaları `Job-Tracking/backend/data/` klasöründe saklanır. Düzenli yedekleme önerilir.

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.

---

**Not:** Bu sistem geliştirme aşamasındadır. Production kullanımı için ek güvenlik önlemleri alınması önerilir.
