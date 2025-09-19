import React from "react";
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp, BarChart3, Users, Calendar } from "lucide-react";

const RevisionStats = ({ revisions = [], projects = [] }) => {
  // Revizyon istatistiklerini hesapla
  const revisionStats = {
    total: revisions.length,
    pending: revisions.filter(r => r.durum === 'beklemede').length,
    inProgress: revisions.filter(r => r.durum === 'devam-ediyor').length,
    completed: revisions.filter(r => r.durum === 'tamamlandi').length,
    average: projects.length > 0 ? (revisions.length / projects.length).toFixed(1) : 0
  };

  // Durum konfigürasyonu
  const statusConfig = {
    'beklemede': {
      label: 'Beklemede',
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    'devam-ediyor': {
      label: 'Devam Ediyor',
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    'tamamlandi': {
      label: 'Tamamlandı',
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    }
  };

  // Proje başına revizyon dağılımı
  const projectRevisionCounts = projects.map(project => {
    const projectRevisions = revisions.filter(r => r.proje_id === project.id);
    return {
      project,
      count: projectRevisions.length,
      pending: projectRevisions.filter(r => r.durum === 'beklemede').length,
      completed: projectRevisions.filter(r => r.durum === 'tamamlandi').length
    };
  }).sort((a, b) => b.count - a.count);

  // En fazla revizyonu olan proje
  const mostRevisedProject = projectRevisionCounts.length > 0 ? projectRevisionCounts[0] : null;

  // Son revizyonlar (en son oluşturulanlar)
  const recentRevisions = revisions
    .filter(r => r.created_at)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Tamamlanma oranı
  const completionRate = revisions.length > 0 ? ((revisionStats.completed / revisions.length) * 100).toFixed(1) : 0;

  // Yüzde hesaplama
  const getPercentage = (count) => {
    return revisions.length > 0 ? ((count / revisions.length) * 100).toFixed(1) : 0;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">Revizyon İstatistikleri</h3>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <span className="text-2xl font-bold text-purple-800">
              {revisionStats.total}
            </span>
          </div>
          <h4 className="font-semibold text-purple-800 mb-1">Toplam Revizyon</h4>
          <p className="text-sm text-purple-600">Tüm projeler genelinde</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold text-blue-800">
              {revisionStats.average}
            </span>
          </div>
          <h4 className="font-semibold text-blue-800 mb-1">Proje Başına Ortalama</h4>
          <p className="text-sm text-blue-600">Revizyon sayısı</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-2xl font-bold text-green-800">
              {completionRate}%
            </span>
          </div>
          <h4 className="font-semibold text-green-800 mb-1">Tamamlanma Oranı</h4>
          <p className="text-sm text-green-600">{revisionStats.completed} / {revisionStats.total}</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-800">
              {revisionStats.pending}
            </span>
          </div>
          <h4 className="font-semibold text-yellow-800 mb-1">Bekleyen Revizyon</h4>
          <p className="text-sm text-yellow-600">Acil eylem gerekli</p>
        </div>
      </div>

      {/* Durum Dağılımı */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Durum Dağılımı</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = revisionStats[status === 'beklemede' ? 'pending' : status === 'devam-ediyor' ? 'inProgress' : 'completed'];
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
                <h5 className={`font-semibold ${config.textColor} mb-1`}>
                  {config.label}
                </h5>
                <p className="text-sm text-gray-600 mb-2">
                  {getPercentage(count)}% of total
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-${config.color}-500 transition-all duration-500`}
                    style={{ width: `${getPercentage(count)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proje Bazında Revizyon Analizi */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Proje Bazında Revizyon Dağılımı
          </h4>
          <div className="space-y-3">
            {projectRevisionCounts.slice(0, 8).map((item, index) => (
              <div 
                key={item.project.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      index === 0 ? 'bg-gold-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      #{index + 1}
                    </span>
                    <h6 className="font-medium text-gray-800">{item.project.ad}</h6>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Müşteri: {item.project.musteri}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">{item.count} revizyon</p>
                  <p className="text-sm text-gray-600">
                    {item.completed} tamamlandı, {item.pending} beklemede
                  </p>
                </div>
              </div>
            ))}
            {projectRevisionCounts.length > 8 && (
              <p className="text-sm text-gray-500 text-center">
                ve {projectRevisionCounts.length - 8} proje daha...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Son Revizyonlar */}
      {recentRevisions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Son Revizyonlar
          </h4>
          <div className="space-y-3">
            {recentRevisions.map((revision) => {
              const project = projects.find(p => p.id === revision.proje_id);
              const config = statusConfig[revision.durum] || statusConfig['beklemede'];
              
              return (
                <div 
                  key={revision.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex-1">
                    <h6 className="font-medium text-gray-800 mb-1">{revision.baslik}</h6>
                    <p className="text-sm text-gray-600">
                      Proje: {project?.ad || 'Bilinmiyor'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(revision.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* En Çok Revize Edilen Proje */}
      {mostRevisedProject && mostRevisedProject.count > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">En Çok Revize Edilen Proje</h4>
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-orange-800 mb-1">{mostRevisedProject.project.ad}</h5>
                <p className="text-sm text-orange-700 mb-2">Müşteri: {mostRevisedProject.project.musteri}</p>
                <p className="text-sm text-orange-600">
                  {mostRevisedProject.completed} tamamlandı, {mostRevisedProject.pending} beklemede
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-800">{mostRevisedProject.count}</p>
                <p className="text-sm text-orange-600">revizyon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uyarılar ve Öneriler */}
      <div className="space-y-4">
        {/* Yüksek Bekleyen Revizyon Uyarısı */}
        {revisionStats.pending > revisionStats.total * 0.5 && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h5 className="font-medium text-red-800">Yüksek Bekleyen Revizyon Uyarısı</h5>
            </div>
            <p className="text-sm text-red-700">
              Revizyonların %{getPercentage(revisionStats.pending)}i beklemede. 
              Revizyonları hızlandırmayı düşünün.
            </p>
          </div>
        )}

        {/* Düşük Tamamlanma Oranı Uyarısı */}
        {completionRate < 30 && revisions.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h5 className="font-medium text-yellow-800">Düşük Tamamlanma Oranı</h5>
            </div>
            <p className="text-sm text-yellow-700">
              Revizyon tamamlanma oranı %{completionRate}. Süreçleri gözden geçirmeyi düşünün.
            </p>
          </div>
        )}
      </div>

      {/* Boş Durum */}
      {revisions.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Henüz revizyon bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default RevisionStats;