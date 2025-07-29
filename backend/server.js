const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS Ayarı
app.use(cors({
  origin: 'http://localhost:5174',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Veri dosyası yolları
const dataDir = path.join(__dirname, 'data');
const projelerFile = path.join(dataDir, 'projeler.json');
const revizyonlarFile = path.join(dataDir, 'revizyonlar.json');

// Data klasörünü oluştur
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Veri yükleme fonksiyonu
const loadData = (file, defaultData) => {
  try {
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`✅ ${path.basename(file)} yüklendi: ${data.length} kayıt`);
      return data;
    }
  } catch (error) {
    console.error(`❌ ${path.basename(file)} yükleme hatası:`, error);
  }
  
  console.log(`📝 ${path.basename(file)} için varsayılan veri kullanılıyor`);
  return defaultData;
};

// Veri kaydetme fonksiyonu
const saveData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`💾 ${path.basename(file)} kaydedildi: ${data.length} kayıt`);
    return true;
  } catch (error) {
    console.error(`❌ ${path.basename(file)} kaydetme hatası:`, error);
    return false;
  }
};

// Bütçe değerini güvenli şekilde number'a çevir
const safeBudget = (budget) => {
  if (budget === null || budget === undefined || budget === '') {
    return null;
  }
  const num = Number(budget);
  return isNaN(num) ? null : num;
};

// Başlangıç verileri
const defaultProjects = [
  {
    id: 1,
    ad: 'E-ticaret Web Sitesi',
    musteri: 'ABC Şirketi',
    durum: 'devam-ediyor',
    aciklama: 'Modern e-ticaret platformu',
    butce: 50000,
    baslangicTarihi: '2024-01-15',
    bitisTarihi: '2024-06-30',
    oncelik: 'yuksek',
    sorumlu: 'Ahmet Yılmaz',
    created_at: '2024-01-15T09:00:00Z'
  },
  {
    id: 2,
    ad: 'Kurumsal Web Sitesi',
    musteri: 'XYZ Ltd.',
    durum: 'tamamlandi',
    aciklama: 'Şirket tanıtım sitesi',
    butce: 25000,
    baslangicTarihi: '2023-12-01',
    bitisTarihi: '2024-02-15',
    oncelik: 'orta',
    sorumlu: 'Ayşe Kaya',
    created_at: '2023-12-01T10:00:00Z'
  }
];

const defaultRevisions = [
  {
    id: 1,
    baslik: 'Ana Sayfa Renk Değişikliği',
    durum: 'beklemede',
    proje_id: 1,
    aciklama: 'Kullanıcı geri bildirimlerine göre ana sayfa renkleri değiştirilecek',
    created_at: '2024-07-20T14:30:00Z'
  },
  {
    id: 2,
    baslik: 'Ürün Kartları Düzenleme',
    durum: 'devam-ediyor',
    proje_id: 1,
    aciklama: 'Ürün kartlarının responsive tasarımı iyileştirilecek',
    created_at: '2024-07-25T11:15:00Z'
  }
];

// Veriyi yükle ve bütçe değerlerini düzelt
let projeler = loadData(projelerFile, defaultProjects).map(project => ({
  ...project,
  butce: safeBudget(project.butce) // String'leri number'a çevir
}));

let revizyonlar = loadData(revizyonlarFile, defaultRevisions);

// İlk kez çalıştırılıyorsa dosyaları oluştur
if (!fs.existsSync(projelerFile)) {
  saveData(projelerFile, projeler);
}
if (!fs.existsSync(revizyonlarFile)) {
  saveData(revizyonlarFile, revizyonlar);
}

// --- PROJE ENDPOINT'LERİ ---

// [GET] Proje Listesi
app.get('/api/projeler', (req, res) => {
  // Bütçe değerlerinin number olduğundan emin ol
  const safeProjects = projeler.map(project => ({
    ...project,
    butce: safeBudget(project.butce)
  }));
  res.json(safeProjects);
});

// [POST] Yeni Proje Ekle
app.post('/api/projeler', (req, res) => {
  const { ad, musteri, durum, aciklama, butce, baslangicTarihi, bitisTarihi, oncelik, sorumlu } = req.body;

  console.log('📝 Yeni proje ekleniyor:', { ad, musteri, butce });

  if (!ad || !musteri) {
    return res.status(400).json({ error: 'Proje adı ve müşteri zorunludur.' });
  }

  const yeniProje = {
    id: Math.max(...projeler.map(p => p.id), 0) + 1,
    ad,
    musteri,
    durum: durum || 'beklemede',
    aciklama: aciklama || '',
    butce: safeBudget(butce), // ✅ String'i güvenli şekilde number'a çevir
    baslangicTarihi: baslangicTarihi || null,
    bitisTarihi: bitisTarihi || null,
    oncelik: oncelik || 'orta',
    sorumlu: sorumlu || null,
    created_at: new Date().toISOString()
  };

  console.log('✅ İşlenmiş proje verisi:', yeniProje);

  projeler.push(yeniProje);
  
  if (saveData(projelerFile, projeler)) {
    res.status(201).json(yeniProje);
  } else {
    res.status(500).json({ error: 'Proje kaydedilemedi.' });
  }
});

// [PUT] Proje Güncelle
app.put('/api/projeler/:id', (req, res) => {
  const { id } = req.params;
  const projeIndex = projeler.findIndex(p => p.id == id);
  
  console.log('🔄 Proje güncelleniyor:', { id, data: req.body });
  
  if (projeIndex === -1) {
    return res.status(404).json({ error: 'Proje bulunamadı.' });
  }

  // ✅ Bütçe değerini güvenli şekilde number'a çevir
  const updatedData = { ...req.body };
  if (updatedData.butce !== undefined) {
    updatedData.butce = safeBudget(updatedData.butce);
    console.log('💰 Bütçe güncellendi:', updatedData.butce);
  }

  projeler[projeIndex] = { ...projeler[projeIndex], ...updatedData };
  
  console.log('✅ Güncellenmiş proje:', projeler[projeIndex]);
  
  if (saveData(projelerFile, projeler)) {
    res.json(projeler[projeIndex]);
  } else {
    res.status(500).json({ error: 'Proje güncellenemedi.' });
  }
});

// [DELETE] Proje Sil
app.delete('/api/projeler/:id', (req, res) => {
  const { id } = req.params;
  const projeIndex = projeler.findIndex(p => p.id == id);
  
  if (projeIndex === -1) {
    return res.status(404).json({ error: 'Proje bulunamadı.' });
  }

  // İlgili revizyonları da sil
  revizyonlar = revizyonlar.filter(r => r.proje_id != id);
  projeler = projeler.filter(p => p.id != id);
  
  // Dosyaları güncelle
  saveData(projelerFile, projeler);
  saveData(revizyonlarFile, revizyonlar);
  
  res.json({ success: true, message: 'Proje ve ilgili revizyonlar silindi.' });
});

// --- REVİZYON ENDPOINT'LERİ ---

// [GET] Revizyon Listesi
app.get('/api/revizyonlar', (req, res) => {
  res.json(revizyonlar);
});

// [POST] Yeni Revizyon Ekle
app.post('/api/revizyonlar', (req, res) => {
  const { proje_id, baslik, durum, aciklama } = req.body;

  console.log('📝 Yeni revizyon ekleniyor:', { proje_id, baslik, durum, aciklama });

  if (!proje_id || !baslik) {
    return res.status(400).json({ error: 'Proje ID ve başlık zorunludur.' });
  }

  // Proje var mı kontrol et
  const proje = projeler.find(p => p.id == proje_id);
  if (!proje) {
    return res.status(404).json({ error: 'Belirtilen proje bulunamadı.' });
  }

  const yeniRevizyon = {
    id: Math.max(...revizyonlar.map(r => r.id), 0) + 1,
    proje_id: parseInt(proje_id),
    baslik,
    durum: durum || 'beklemede',
    aciklama: aciklama || '',
    created_at: new Date().toISOString()
  };

  revizyonlar.push(yeniRevizyon);
  
  if (saveData(revizyonlarFile, revizyonlar)) {
    console.log('✅ Revizyon başarıyla eklendi:', yeniRevizyon);
    res.status(201).json(yeniRevizyon);
  } else {
    res.status(500).json({ error: 'Revizyon kaydedilemedi.' });
  }
});

// [PUT] Revizyon Güncelle
app.put('/api/revizyonlar/:id', (req, res) => {
  const { id } = req.params;
  const revizyonIndex = revizyonlar.findIndex(r => r.id == id);
  
  if (revizyonIndex === -1) {
    return res.status(404).json({ error: 'Revizyon bulunamadı.' });
  }

  revizyonlar[revizyonIndex] = { ...revizyonlar[revizyonIndex], ...req.body };
  
  if (saveData(revizyonlarFile, revizyonlar)) {
    res.json(revizyonlar[revizyonIndex]);
  } else {
    res.status(500).json({ error: 'Revizyon güncellenemedi.' });
  }
});

// [DELETE] Revizyon Sil
app.delete('/api/revizyonlar/:id', (req, res) => {
  const { id } = req.params;
  const revizyonIndex = revizyonlar.findIndex(r => r.id == id);
  
  if (revizyonIndex === -1) {
    return res.status(404).json({ error: 'Revizyon bulunamadı.' });
  }

  revizyonlar = revizyonlar.filter(r => r.id != id);
  
  if (saveData(revizyonlarFile, revizyonlar)) {
    res.json({ success: true, message: 'Revizyon silindi.' });
  } else {
    res.status(500).json({ error: 'Revizyon silinemedi.' });
  }
});

// [PATCH] Revizyon Durumu Güncelle
app.patch('/api/revizyonlar/:id', (req, res) => {
  const { id } = req.params;
  const { durum } = req.body;
  
  const revizyonIndex = revizyonlar.findIndex(r => r.id == id);
  
  if (revizyonIndex === -1) {
    return res.status(404).json({ error: 'Revizyon bulunamadı.' });
  }

  revizyonlar[revizyonIndex].durum = durum;
  
  if (saveData(revizyonlarFile, revizyonlar)) {
    res.json(revizyonlar[revizyonIndex]);
  } else {
    res.status(500).json({ error: 'Durum güncellenemedi.' });
  }
});

// [GET] Özet İstatistikler
app.get('/api/istatistikler', (req, res) => {
  console.log('📊 İstatistikler hesaplanıyor...');
  
  const toplamProje = projeler.length;
  const aktifProje = projeler.filter(p => p.durum === 'devam-ediyor').length;
  const tamamlananProje = projeler.filter(p => p.durum === 'tamamlandi').length;
  const bekleyenRevizyon = revizyonlar.filter(r => r.durum === 'beklemede').length;
  
  // ✅ DÜZELTME: Bütçe değerlerini güvenli şekilde topla
  const toplamButce = projeler.reduce((sum, p) => {
    const budget = safeBudget(p.butce) || 0; // String'i güvenli şekilde number'a çevir
    console.log(`Proje: ${p.ad}, Bütçe: ${p.butce} -> ${budget}`);
    return sum + budget;
  }, 0);
  
  console.log('💰 Toplam bütçe hesaplandı:', toplamButce);
  
  const istatistikler = { 
    toplamProje, 
    aktifProje, 
    tamamlananProje,
    bekleyenRevizyon, 
    toplamButce,
    gecikenProje: 0,
    ortalamaTamamlanmaSuresi: 120
  };
  
  console.log('📈 İstatistikler:', istatistikler);
  res.json(istatistikler);
});

// [GET] Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Backend çalışıyor!',
    dataFiles: {
      projects: fs.existsSync(projelerFile) ? '✅' : '❌',
      revisions: fs.existsSync(revizyonlarFile) ? '✅' : '❌'
    },
    endpoints: {
      projeler: '/api/projeler',
      revizyonlar: '/api/revizyonlar',
      istatistikler: '/api/istatistikler'
    },
    currentData: {
      projects: projeler.length,
      revisions: revizyonlar.length,
      totalBudget: projeler.reduce((sum, p) => sum + (safeBudget(p.butce) || 0), 0)
    }
  });
});

// --- Debug Endpoint ---
app.get('/api/debug/budgets', (req, res) => {
  const budgetInfo = projeler.map(p => ({
    id: p.id,
    name: p.ad,
    originalBudget: p.butce,
    processedBudget: safeBudget(p.butce),
    type: typeof p.butce
  }));
  
  res.json({
    projects: budgetInfo,
    totalBudget: projeler.reduce((sum, p) => sum + (safeBudget(p.butce) || 0), 0)
  });
});

// --- Sunucu Başlat ---
app.listen(PORT, () => {
  console.log(`🚀 Backend ${PORT} portunda çalışıyor`);
  console.log(`📁 Veri klasörü: ${dataDir}`);
  console.log(`📊 Projeler: ${projeler.length} kayıt`);
  console.log(`🔄 Revizyonlar: ${revizyonlar.length} kayıt`);
  console.log(`💰 Toplam bütçe: ${projeler.reduce((sum, p) => sum + (safeBudget(p.butce) || 0), 0)} ₺`);
  console.log(`🌐 Test: http://localhost:${PORT}/api/test`);
  console.log(`🐛 Debug: http://localhost:${PORT}/api/debug/budgets`);
});