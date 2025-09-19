import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle
} from "lucide-react";
import { saveAs } from "file-saver";

const ReportsPanel = ({ projects = [], revisions = [] }) => {
  const [generating, setGenerating] = useState(false);

  // Genel istatistikler
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.durum === 'devam-ediyor').length,
    completedProjects: projects.filter(p => p.durum === 'tamamlandi').length,
    pendingProjects: projects.filter(p => p.durum === 'beklemede').length,
    totalRevisions: revisions.length,
    pendingRevisions: revisions.filter(r => r.durum === 'beklemede').length,
    completedRevisions: revisions.filter(r => r.durum === 'tamamlandi').length,
    totalBudget: projects.reduce((sum, p) => sum + (Number(p.butce) || 0), 0),
    avgBudget: projects.length > 0 
      ? projects.reduce((sum, p) => sum + (Number(p.butce) || 0), 0) / projects.length 
      : 0
  };

  // Rapor türleri
  const reportTypes = [
    {
      id: 'summary',
      name: 'Genel Özet Raporu',
      description: 'Tüm projelerin ve revizyonların genel durumu',
      icon: BarChart3,
      color: 'blue',
      data: stats
    },
    {
      id: 'projects',
      name: 'Proje Detay Raporu',
      description: 'Tüm projelerin detaylı listesi',
      icon: Target,
      color: 'green',
      data: projects
    },
    {
      id: 'budget',
      name: 'Bütçe Analiz Raporu',
      description: 'Proje bütçeleri ve maliyet analizi',
      icon: DollarSign,
      color: 'purple',
      data: projects.filter(p => Number(p.butce) > 0)
    },
    {
      id: 'revisions',
      name: 'Revizyon Raporu',
      description: 'Tüm revizyonların durum analizi',
      icon: FileText,
      color: 'orange',
      data: revisions
    },
    {
      id: 'performance',
      name: 'Performans Raporu',
      description: 'Tamamlanma oranları ve performans metrikleri',
      icon: TrendingUp,
      color: 'red',
      data: {
        completionRate: stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects * 100).toFixed(1) : 0,
        ...stats
      }
    }
  ];

  // Rapor oluşturma fonksiyonları
  const generateSummaryReport = () => {
    const reportContent = `
GENEL ÖZET RAPORU
==================
Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}
Oluşturulma Saati: ${new Date().toLocaleTimeString('tr-TR')}

PROJE İSTATİSTİKLERİ
====================
• Toplam Proje: ${stats.totalProjects}
• Aktif Proje: ${stats.activeProjects}
• Tamamlanan Proje: ${stats.completedProjects}
• Bekleyen Proje: ${stats.pendingProjects}

REVİZYON İSTATİSTİKLERİ
========================
• Toplam Revizyon: ${stats.totalRevisions}
• Bekleyen Revizyon: ${stats.pendingRevisions}
• Tamamlanan Revizyon: ${stats.completedRevisions}

BÜTÇE BİLGİLERİ
===============
• Toplam Bütçe: ${stats.totalBudget.toLocaleString('tr-TR')} ₺
• Ortalama Proje Bütçesi: ${stats.avgBudget.toLocaleString('tr-TR')} ₺

PERFORMANS METRİKLERİ
=====================
• Proje Tamamlanma Oranı: ${stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects * 100).toFixed(1) : 0}%
• Revizyon Tamamlanma Oranı: ${stats.totalRevisions > 0 ? (stats.completedRevisions / stats.totalRevisions * 100).toFixed(1) : 0}%
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `genel-ozet-${new Date().toISOString().split('T')[0]}.txt`);
  };

  const generateProjectReport = () => {
    const headers = ['ID', 'Proje Adı', 'Müşteri', 'Sorumlu', 'Durum', 'Öncelik', 'Bütçe', 'Başlangıç', 'Bitiş'];
    const rows = projects.map(p => [
      p.id,
      p.ad,
      p.musteri,
      p.sorumlu || 'Belirtilmemiş',
      p.durum,
      p.oncelik || 'Belirtilmemiş',
      (Number(p.butce) || 0).toLocaleString('tr-TR'),
      p.baslangicTarihi || 'Belirtilmemiş',
      p.bitisTarihi || 'Belirtilmemiş'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `projeler-detay-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateBudgetReport = () => {
    const budgetProjects = projects.filter(p => Number(p.butce) > 0);
    
    const reportContent = `
BÜTÇE ANALİZ RAPORU
====================
Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}

BÜTÇE ÖZETİ
============
• Toplam Bütçe: ${stats.totalBudget.toLocaleString('tr-TR')} ₺
• Ortalama Bütçe: ${stats.avgBudget.toLocaleString('tr-TR')} ₺
• Bütçeli Proje Sayısı: ${budgetProjects.length}
• Bütçesiz Proje Sayısı: ${projects.length - budgetProjects.length}

BÜTÇE DAĞILIMI
===============
${budgetProjects.map(p => `
• ${p.ad}
  Müşteri: ${p.musteri}
  Bütçe: ${Number(p.butce).toLocaleString('tr-TR')} ₺
  Durum: ${p.durum}
`).join('')}

BÜTÇE İSTATİSTİKLERİ
====================
• En Yüksek Bütçe: ${budgetProjects.length > 0 ? Math.max(...budgetProjects.map(p => Number(p.butce))).toLocaleString('tr-TR') : 0} ₺
• En Düşük Bütçe: ${budgetProjects.length > 0 ? Math.min(...budgetProjects.map(p => Number(p.butce))).toLocaleString('tr-TR') : 0} ₺
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `butce-analiz-${new Date().toISOString().split('T')[0]}.txt`);
  };

  const generateRevisionReport = () => {
    const headers = ['ID', 'Başlık', 'Proje', 'Durum', 'Açıklama', 'Oluşturulma'];
    const rows = revisions.map(r => {
      const project = projects.find(p => p.id === r.proje_id);
      return [
        r.id,
        r.baslik,
        project?.ad || 'Bilinmiyor',
        r.durum,
        r.aciklama || '',
        r.created_at ? new Date(r.created_at).toLocaleDateString('tr-TR') : ''
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `revizyonlar-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generatePerformanceReport = () => {
    const completionRate = stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects * 100).toFixed(1) : 0;
    const revisionCompletionRate = stats.totalRevisions > 0 ? (stats.completedRevisions / stats.totalRevisions * 100).toFixed(1) : 0;

    const reportContent = `
PERFORMANS RAPORU
==================
Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}

GENEL PERFORMANS
=================
• Proje Tamamlanma Oranı: ${completionRate}%
• Revizyon Tamamlanma Oranı: ${revisionCompletionRate}%
• Aktif Proje Oranı: ${stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects * 100).toFixed(1) : 0}%

PROJE DURUMLARI
================
• Tamamlanan: ${stats.completedProjects} (${completionRate}%)
• Devam Eden: ${stats.activeProjects} (${stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects * 100).toFixed(1) : 0}%)
• Bekleyen: ${stats.pendingProjects} (${stats.totalProjects > 0 ? (stats.pendingProjects / stats.totalProjects * 100).toFixed(1) : 0}%)

REVİZYON DURUMLARI
===================
• Tamamlanan: ${stats.completedRevisions}
• Bekleyen: ${stats.pendingRevisions}

ÖNERİLER
=========
${stats.pendingProjects > stats.activeProjects ? '• Bekleyen proje sayısı aktif projelerden fazla. Projeleri başlatmayı düşünün.' : ''}
${stats.pendingRevisions > stats.totalRevisions * 0.5 ? '• Bekleyen revizyon oranı yüksek. Revizyonları hızlandırmayı düşünün.' : ''}
${completionRate < 50 ? '• Proje tamamlanma oranı düşük. Süreçleri gözden geçirin.' : ''}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `performans-${new Date().toISOString().split('T')[0]}.txt`);
  };

  const handleDownload = async (reportType) => {
    setGenerating(true);
    
    try {
      switch (reportType.id) {
        case 'summary':
          generateSummaryReport();
          break;
        case 'projects':
          generateProjectReport();
          break;
        case 'budget':
          generateBudgetReport();
          break;
        case 'revisions':
          generateRevisionReport();
          break;
        case 'performance':
          generatePerformanceReport();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Rapor oluşturma hatası:', error);
      alert('Rapor oluşturulurken hata oluştu!');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Raporlar</h2>
      </div>

      {/* Hızlı İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <Target className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-sm text-blue-600 font-medium">Toplam Proje</p>
          <p className="text-2xl font-bold text-blue-800">{stats.totalProjects}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
          <p className="text-sm text-green-600 font-medium">Tamamlanan</p>
          <p className="text-2xl font-bold text-green-800">{stats.completedProjects}</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <Activity className="w-6 h-6 text-purple-600 mb-2" />
          <p className="text-sm text-purple-600 font-medium">Toplam Revizyon</p>
          <p className="text-2xl font-bold text-purple-800">{stats.totalRevisions}</p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <DollarSign className="w-6 h-6 text-yellow-600 mb-2" />
          <p className="text-sm text-yellow-600 font-medium">Toplam Bütçe</p>
          <p className="text-lg font-bold text-yellow-800">{stats.totalBudget.toLocaleString('tr-TR')} ₺</p>
        </div>
      </div>

      {/* Rapor Türleri */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((reportType) => {
          const Icon = reportType.icon;
          return (
            <div
              key={reportType.id}
              className={`bg-${reportType.color}-50 rounded-lg p-4 border border-${reportType.color}-200 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-6 h-6 text-${reportType.color}-600`} />
                <h3 className={`font-semibold text-${reportType.color}-800`}>
                  {reportType.name}
                </h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {reportType.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {Array.isArray(reportType.data) 
                    ? `${reportType.data.length} kayıt` 
                    : 'Analiz mevcut'
                  }
                </span>
                
                <button
                  onClick={() => handleDownload(reportType)}
                  disabled={generating}
                  className={`flex items-center gap-2 px-3 py-2 bg-${reportType.color}-600 text-white rounded-lg hover:bg-${reportType.color}-700 transition-colors disabled:opacity-50 text-sm`}
                >
                  <Download className="w-4 h-4" />
                  {generating ? 'Oluşturuluyor...' : 'İndir'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Boş Durum */}
      {projects.length === 0 && revisions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Henüz veri bulunmuyor</h3>
          <p className="text-gray-500">Rapor oluşturmak için önce projeler ve revizyonlar ekleyin.</p>
        </div>
      )}
    </div>
  );
};

export default ReportsPanel;