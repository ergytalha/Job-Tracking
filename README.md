# İş Takip Sistemi - Yetki Sistemi

Bu sistemde kullanıcılar farklı rollerle giriş yapabilir ve yetkilerine göre farklı sayfalara erişebilir.

## Kullanıcı Rolleri

### 1. Admin (Yönetici)
- **Kullanıcı Adı:** `admin`
- **Şifre:** `123456`
- **Erişebileceği Sayfalar:**
  - Ana Sayfa (Dashboard)
  - Projeler
  - Revizyonlar
  - Raporlar
  - Ekip
  - Ayarlar

### 2. User (Kullanıcı)
- **Kullanıcı Adı:** `user`
- **Şifre:** `123456`
- **Erişebileceği Sayfalar:**
  - Ana Sayfa (Dashboard)
  - Projeler
  - Revizyonlar

### 3. Editor (Editör)
- **Kullanıcı Adı:** `editor`
- **Şifre:** `123456`
- **Erişebileceği Sayfalar:**
  - Ana Sayfa (Dashboard)
  - Projeler
  - Revizyonlar
  - Raporlar

## Yetki Sistemi Özellikleri

### Navigation Menüsü
- Kullanıcı rolüne göre dinamik olarak menü öğeleri gösterilir
- Sadece erişim yetkisi olan sayfalar menüde görünür
- Kullanıcı bilgisi ve rolü sağ üst köşede gösterilir

### Dashboard Sayfası
- Hızlı eylem kartları kullanıcı rolüne göre değişir
- Admin: Tüm kartlar görünür
- User: Sadece proje ve revizyon kartları
- Editor: Proje, revizyon ve rapor kartları

### Sayfa Erişimi
- RoleRoute bileşeni ile sayfa seviyesinde yetki kontrolü
- Yetkisiz erişim denemelerinde "Unauthorized" sayfasına yönlendirme

## Teknik Detaylar

### Backend
- `backend/data/users.json` dosyasında kullanıcı bilgileri
- Login endpoint'i kullanıcı doğrulaması yapar
- Kullanıcı rolü token ile birlikte döndürülür

### Frontend
- `AuthContext` ile kullanıcı durumu yönetimi
- `Navigation` bileşeni ile dinamik menü
- `RoleRoute` ile sayfa seviyesi yetki kontrolü

## Test Etme

1. Backend'i başlatın: `cd backend && npm start`
2. Frontend'i başlatın: `cd frontend && npm run dev`
3. Farklı kullanıcılarla giriş yaparak yetki sistemini test edin

## Kurulum

Detaylı kurulum talimatları için `SETUP.md` dosyasını inceleyin.

## Yeni Kullanıcı Ekleme

`backend/data/users.json` dosyasına yeni kullanıcı ekleyebilirsiniz:

```json
{
  "id": 4,
  "username": "yeni_kullanici",
  "password": "sifre123",
  "role": "user"
}
```

## 🔒 Güvenlik Notları

- Bu proje geliştirme amaçlıdır
- Production kullanımı için şifre hash'leme ve veritabanı kullanımı önerilir
- Hassas veriler `.gitignore` ile korunmaktadır 