import React from "react";
import { Clock, CheckCircle, AlertCircle, Play, Target, TrendingUp } from "lucide-react";

const ProjectStatusStats = ({ projects = [] }) => {
  // Durum istatistiklerini hesapla
  const statusStats = projects.reduce((acc, project) => {
    const status = project.durum || 'belirtilmemiş';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Durum konfigürasyonu
  const statusConfig = {
    'beklemede': {
      label: 'Beklemede',
      icon: AlertCircle,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      description: 'Başlamayı bekleyen projeler'
    },
    'devam-ediyor': {
      label: 'Devam Ediyor',
      icon: Play,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      description: 'Aktif olarak çalışılan projeler'
    },
    'tamamlandi': {
      label: 'Tamamlandı',
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      description: 'Başarıyla tamamlanan projeler'
    },
    'belirtilmemiş': {
      label: 'Durum Belirsiz',
      icon: AlertCircle,
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600',
      description: 'Durumu tanımlanmamış projeler'
    }
  };

  // Toplam proje sayısı
  const totalProjects = projects.length;

  // Durum sıralaması
  const orderedStatuses = ['devam-ediyor', 'beklemede', 'tamamlandi', 'belirtilmemiş'];

  // Yüzde hesaplama
  const getPercentage = (count) => {
    return totalProjects > 0 ? ((count / totalProjects) * 100).toFixed(1) : 0;
  };

  // Tamamlanma oranı
  const completionRate = getPercentage(statusStats['tamamlandi'] || 0);

  // Son tamamlanan projeler (varsayım: bitisTarihi olan projeler)
  const recentlyCompleted = projects
    .filter(p => p.durum === 'tamamlandi' && p.bitisTarihi)
    .sort((a, b) => new Date(b.bitisTarihi) - new Date(a.bitisTarihi))
    .slice(0, 3);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Proje Durum Analizi</h3>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {orderedStatuses.map((status) => {
          const count = statusStats[status] || 0;
          const config = statusConfig[status];
          const Icon = config.icon;
          
          return (
            <div 
              key={status}
              className={`${config.bgColor} rounded-lg p-4 border ${config.borderColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
                <span className={`text-2xl font-bold ${config.textColor}`}>
                  {count}
                </span>
              </div>
              <h4 className={`font-semibold ${config.textColor} mb-1`}>
                {config.label}
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {config.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${config.textColor} opacity-75`}>
                  {getPercentage(count)}%
                </span>
                <span className="text-xs text-gray-500">
                  {count === 1 ? 'proje' : 'proje'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Durum Dağılım Grafiği */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Durum Dağılımı</h4>
        <div className="space-y-3">
          {orderedStatuses.map((status) => {
            const count = statusStats[status] || 0;
            const config = statusConfig[status];
            const percentage = getPercentage(count);
            
            return (
              <div key={status} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700">
                  {config.label}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full bg-${config.color}-500 transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  >
                    {percentage > 10 && (
                      <span className="text-xs font-medium text-white">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-20 text-sm text-gray-600 text-right">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Genel Performans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Tamamlanma Oranı */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h5 className="font-semibold text-green-800">Tamamlanma Oranı</h5>
          </div>
          <p className="text-3xl font-bold text-green-800 mb-2">
            {completionRate}%
          </p>
          <p className="text-sm text-green-700">
            {statusStats['tamamlandi'] || 0} / {totalProjects} proje tamamlandı
          </p>
        </div>

        {/* Aktif Proje Durumu */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <h5 className="font-semibold text-blue-800">Aktif Projeler</h5>
          </div>
          <p className="text-3xl font-bold text-blue-800 mb-2">
            {statusStats['devam-ediyor'] || 0}
          </p>
          <p className="text-sm text-blue-700">
            Şu anda üzerinde çalışılan proje sayısı
          </p>
        </div>
      </div>

      {/* Son Tamamlanan Projeler */}
      {recentlyCompleted.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Son Tamamlanan Projeler
          </h4>
          <div className="space-y-3">
            {recentlyCompleted.map((project) => (
              <div 
                key={project.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div>
                  <p className="font-medium text-gray-800">{project.ad}</p>
                  <p className="text-sm text-gray-600">Müşteri: {project.musteri}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-medium">
                    {new Date(project.bitisTarihi).toLocaleDateString('tr-TR')}
                  </p>
                  {project.butce && (
                    <p className="text-xs text-gray-500">
                      {Number(project.butce).toLocaleString('tr-TR')} ₺
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uyarılar ve Öneriler */}
      <div className="space-y-4">
        {/* Bekleyen Proje Uyarısı */}
        {statusStats['beklemede'] > statusStats['devam-ediyor'] && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h5 className="font-medium text-yellow-800">Bekleyen Proje Uyarısı</h5>
            </div>
            <p className="text-sm text-yellow-700">
              Bekleyen proje sayısı ({statusStats['beklemede']}) aktif projelerden ({statusStats['devam-ediyor'] || 0}) fazla. 
              Projeleri başlatmayı düşünün.
            </p>
          </div>
        )}

        {/* Durum Belirsizliği Uyarısı */}
        {statusStats['belirtilmemiş'] > 0 && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h5 className="font-medium text-red-800">Durum Belirsizliği</h5>
            </div>
            <p className="text-sm text-red-700">
              {statusStats['belirtilmemiş']} proje için durum bilgisi eksik. 
              Bu projelerin durumlarını güncelleyin.
            </p>
          </div>
        )}
      </div>

      {/* Boş Durum */}
      {totalProjects === 0 && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Henüz proje bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectStatusStats;