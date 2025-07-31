const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Güvenli CORS tanımı (localhost + Vercel)
const allowedOrigins = [
  'http://localhost:5174',
  'https://job-tracking-blue.vercel.app',
  'https://job-tracking-git-main-talha-erguneys-projects.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS hatası: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Veri yolları
const dataDir = path.join(__dirname, 'data');
const projelerFile = path.join(dataDir, 'projeler.json');
const revizyonlarFile = path.join(dataDir, 'revizyonlar.json');

// 🔧 Data klasörü yoksa oluştur
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// ✅ Yardımcı Fonksiyonlar
const loadData = (file, defaultData) => {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (error) {
    console.error(`Yükleme hatası [${file}]:`, error);
  }
  return defaultData;
};

const saveData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Kaydetme hatası [${file}]:`, error);
    return false;
  }
};

const safeBudget = (budget) => {
  if (budget === null || budget === undefined || budget === '') return null;
  const num = Number(budget);
  return isNaN(num) ? null : num;
};

// ✅ Başlangıç verileri
let projeler = loadData(projelerFile, []).map(p => ({ ...p, butce: safeBudget(p.butce) }));
let revizyonlar = loadData(revizyonlarFile, []);

// İlk veri kaydı
if (!fs.existsSync(projelerFile)) saveData(projelerFile, projeler);
if (!fs.existsSync(revizyonlarFile)) saveData(revizyonlarFile, revizyonlar);

// === [ PROJELER ] ===
app.get('/api/projeler', (req, res) => {
  res.json(projeler.map(p => ({ ...p, butce: safeBudget(p.butce) })));
});

app.post('/api/projeler', (req, res) => {
  const { ad, musteri, durum, aciklama, butce, baslangicTarihi, bitisTarihi, oncelik, sorumlu } = req.body;
  if (!ad || !musteri) return res.status(400).json({ error: 'Ad ve müşteri zorunludur.' });

  const yeniProje = {
    id: Math.max(...projeler.map(p => p.id), 0) + 1,
    ad,
    musteri,
    durum: durum || 'beklemede',
    aciklama: aciklama || '',
    butce: safeBudget(butce),
    baslangicTarihi: baslangicTarihi || null,
    bitisTarihi: bitisTarihi || null,
    oncelik: oncelik || 'orta',
    sorumlu: sorumlu || null,
    created_at: new Date().toISOString()
  };

  projeler.push(yeniProje);
  return saveData(projelerFile, projeler)
    ? res.status(201).json(yeniProje)
    : res.status(500).json({ error: 'Kaydedilemedi.' });
});

app.put('/api/projeler/:id', (req, res) => {
  const index = projeler.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Proje bulunamadı.' });

  const updated = { ...req.body };
  if (updated.butce !== undefined) updated.butce = safeBudget(updated.butce);

  projeler[index] = { ...projeler[index], ...updated };
  return saveData(projelerFile, projeler)
    ? res.json(projeler[index])
    : res.status(500).json({ error: 'Güncellenemedi.' });
});

app.delete('/api/projeler/:id', (req, res) => {
  const id = parseInt(req.params.id);
  projeler = projeler.filter(p => p.id !== id);
  revizyonlar = revizyonlar.filter(r => r.proje_id !== id);
  saveData(projelerFile, projeler);
  saveData(revizyonlarFile, revizyonlar);
  res.json({ success: true });
});

// === [ REVİZYONLAR ] ===
app.get('/api/revizyonlar', (req, res) => res.json(revizyonlar));

app.post('/api/revizyonlar', (req, res) => {
  const { proje_id, baslik, durum, aciklama } = req.body;
  if (!proje_id || !baslik) return res.status(400).json({ error: 'Proje ID ve başlık zorunlu.' });

  const yeniRevizyon = {
    id: Math.max(...revizyonlar.map(r => r.id), 0) + 1,
    proje_id: parseInt(proje_id),
    baslik,
    durum: durum || 'beklemede',
    aciklama: aciklama || '',
    created_at: new Date().toISOString()
  };

  revizyonlar.push(yeniRevizyon);
  return saveData(revizyonlarFile, revizyonlar)
    ? res.status(201).json(yeniRevizyon)
    : res.status(500).json({ error: 'Kaydedilemedi.' });
});

app.put('/api/revizyonlar/:id', (req, res) => {
  const index = revizyonlar.findIndex(r => r.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Revizyon bulunamadı.' });

  revizyonlar[index] = { ...revizyonlar[index], ...req.body };
  return saveData(revizyonlarFile, revizyonlar)
    ? res.json(revizyonlar[index])
    : res.status(500).json({ error: 'Güncellenemedi.' });
});

app.delete('/api/revizyonlar/:id', (req, res) => {
  revizyonlar = revizyonlar.filter(r => r.id != req.params.id);
  return saveData(revizyonlarFile, revizyonlar)
    ? res.json({ success: true })
    : res.status(500).json({ error: 'Silinemedi.' });
});

app.patch('/api/revizyonlar/:id', (req, res) => {
  const index = revizyonlar.findIndex(r => r.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Revizyon bulunamadı.' });
  revizyonlar[index].durum = req.body.durum;
  return saveData(revizyonlarFile, revizyonlar)
    ? res.json(revizyonlar[index])
    : res.status(500).json({ error: 'Durum güncellenemedi.' });
});

// === [ İSTATİSTİKLER ] ===
app.get('/api/istatistikler', (req, res) => {
  const toplamProje = projeler.length;
  const aktifProje = projeler.filter(p => p.durum === 'devam-ediyor').length;
  const tamamlananProje = projeler.filter(p => p.durum === 'tamamlandi').length;
  const bekleyenRevizyon = revizyonlar.filter(r => r.durum === 'beklemede').length;
  const toplamButce = projeler.reduce((sum, p) => sum + (safeBudget(p.butce) || 0), 0);

  res.json({
    toplamProje,
    aktifProje,
    tamamlananProje,
    bekleyenRevizyon,
    toplamButce,
    gecikenProje: 0,
    ortalamaTamamlanmaSuresi: 120
  });
});

// === [ SAĞLIK KONTROLÜ ] ===
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ Backend çalışıyor!',
    endpoints: {
      projeler: '/api/projeler',
      revizyonlar: '/api/revizyonlar',
      istatistikler: '/api/istatistikler'
    },
    toplamKayit: {
      projeler: projeler.length,
      revizyonlar: revizyonlar.length
    }
  });
});

// === [ SUNUCU BAŞLAT ] ===
app.listen(PORT, () => {
  console.log(`🚀 Backend ${PORT} portunda çalışıyor`);
});
