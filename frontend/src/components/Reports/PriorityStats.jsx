import React from "react";
import { Zap, AlertTriangle, Minus, TrendingDown, BarChart3 } from "lucide-react";

const PriorityStats = ({ projects = [] }) => {
  // Öncelik dağılımını hesapla
  const priorityStats = projects.reduce((acc, project) => {
    const priority = project.oncelik || 'belirtilmemiş';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  // Öncelik sıralaması ve renkler
  const priorityConfig = {
    'yuksek': {
      label: 'Yüksek Öncelik',
      icon: Zap,
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600'
    },
    'orta': {
      label: 'Orta Öncelik',
      icon: Minus,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    'dusuk': {
      label: 'Düşük Öncelik',
      icon: TrendingDown,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    'belirtilmemiş': {
      label: 'Belirtilmemiş',
      icon: AlertTriangle,
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600'
    }
  };

  // Toplam proje sayısı
  const totalProjects = projects.length;

  // Öncelik sırasına göre sırala
  const orderedPriorities = ['yuksek', 'orta', 'dusuk', 'belirtilmemiş'];

  // Yüzde hesaplama
  const getPercentage = (count) => {
    return totalProjects > 0 ? ((count / totalProjects) * 100).toFixed(1) : 0;
  };

  // En yüksek öncelikli projeler
  const highPriorityProjects = projects.filter(p => p.oncelik === 'yuksek');

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">Öncelik Dağılımı</h3>
      </div>

      {/* Özet İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {orderedPriorities.map((priority) => {
          const count = priorityStats[priority] || 0;
          const config = priorityConfig[priority];
          const Icon = config.icon;
          
          return (
            <div 
              key={priority}
              className={`${config.bgColor} rounded-lg p-4 border ${config.borderColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
                <span className={`text-xs font-medium ${config.textColor} opacity-75`}>
                  {getPercentage(count)}%
                </span>
              </div>
              <h4 className={`font-semibold ${config.textColor} text-sm mb-1`}>
                {config.label}
              </h4>
              <p className={`text-2xl font-bold ${config.textColor}`}>
                {count}
              </p>
              <p className="text-xs text-gray-500">
                {count === 1 ? 'proje' : 'proje'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress Bar Görünümü */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Öncelik Dağılım Grafiği</h4>
        <div className="space-y-3">
          {orderedPriorities.map((priority) => {
            const count = priorityStats[priority] || 0;
            const config = priorityConfig[priority];
            const percentage = getPercentage(count);
            
            return (
              <div key={priority} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {config.label}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-${config.color}-500 transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {count} ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Yüksek Öncelikli Projeler */}
      {highPriorityProjects.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Yüksek Öncelikli Projeler ({highPriorityProjects.length})
          </h4>
          <div className="space-y-2">
            {highPriorityProjects.slice(0, 5).map((project) => (
              <div 
                key={project.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div>
                  <p className="font-medium text-gray-800">{project.ad}</p>
                  <p className="text-sm text-gray-600">Müşteri: {project.musteri}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.durum === 'tamamlandi' ? 'bg-green-100 text-green-800' :
                    project.durum === 'devam-ediyor' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.durum === 'devam-ediyor' ? 'Devam Ediyor' :
                     project.durum === 'tamamlandi' ? 'Tamamlandı' :
                     'Beklemede'}
                  </span>
                </div>
              </div>
            ))}
            {highPriorityProjects.length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                ve {highPriorityProjects.length - 5} proje daha...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Öneri ve Uyarılar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Yüksek Öncelik Uyarısı */}
        {priorityStats['yuksek'] > totalProjects * 0.5 && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h5 className="font-medium text-red-800">Yüksek Öncelik Uyarısı</h5>
            </div>
            <p className="text-sm text-red-700">
              Projelerin %{getPercentage(priorityStats['yuksek'])}i yüksek öncelikli. 
              Öncelik dağılımını gözden geçirmeyi düşünün.
            </p>
          </div>
        )}

        {/* Öncelik Dağılım Önerisi */}
        {priorityStats['belirtilmemiş'] > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h5 className="font-medium text-yellow-800">Öncelik Eksikliği</h5>
            </div>
            <p className="text-sm text-yellow-700">
              {priorityStats['belirtilmemiş']} proje için öncelik belirtilmemiş. 
              Bu projelerin önceliklerini tanımlamanız önerilir.
            </p>
          </div>
        )}
      </div>

      {/* Özet Bilgi */}
      {totalProjects === 0 && (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Henüz proje bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default PriorityStats;