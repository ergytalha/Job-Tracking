import React, { useState } from "react";
import { Activity, Clock, CheckCircle, AlertCircle, FileText, Users, Calendar } from "lucide-react";

const ActivityFeed = ({ revisions = [], projects = [] }) => {
  const [showCount, setShowCount] = useState(5);

  // Son aktiviteler
  const latestRevisions = [...revisions]
    .filter(rev => rev.created_at) 
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) 
    .slice(0, showCount);

  // Durum konfigürasyonu
  const getStatusConfig = (status) => {
    switch (status) {
      case "tamamlandi":
        return {
          color: "bg-green-400",
          icon: CheckCircle,
          text: "Tamamlandı",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case "devam-ediyor":
        return {
          color: "bg-blue-400", 
          icon: Clock,
          text: "Devam Ediyor",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200"
        };
      case "beklemede":
        return {
          color: "bg-yellow-400",
          icon: AlertCircle, 
          text: "Beklemede",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200"
        };
      default:
        return {
          color: "bg-gray-400",
          icon: AlertCircle,
          text: "Bilinmiyor",
          textColor: "text-gray-700", 
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  // Zaman farkını hesapla
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Az önce";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
    
    return date.toLocaleDateString('tr-TR');
  };

  const handleShowMore = () => {
    setShowCount(prev => Math.min(prev + 5, revisions.length));
  };

  const handleShowLess = () => {
    setShowCount(5);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          Son Aktiviteler
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{revisions.length} toplam aktivite</span>
        </div>
      </div>

      {latestRevisions.length > 0 ? (
        <div className="space-y-4">
          {latestRevisions.map((rev, index) => {
            const project = projects.find((p) => Number(p.id) === Number(rev.proje_id));
            const statusConfig = getStatusConfig(rev.durum);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={rev.id}
                className={`relative flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-sm ${statusConfig.bgColor} ${statusConfig.borderColor}`}
              >
                {/* Timeline çizgisi */}
                {index !== latestRevisions.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-6 bg-gray-200"></div>
                )}

                {/* Durum ikonu */}
                <div className="flex-shrink-0 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusConfig.color}`}>
                    <StatusIcon className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 mb-1 truncate">
                        {rev.baslik}
                      </h4>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate">
                          Proje: {project?.ad || "Bilinmeyen Proje"}
                        </span>
                      </div>

                      {rev.aciklama && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {rev.aciklama}
                        </p>
                      )}

                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.textColor} ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.text}
                        </span>
                        
                        {project?.musteri && (
                          <span className="text-xs text-gray-500">
                            Müşteri: {project.musteri}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Zaman bilgisi */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        {getTimeAgo(rev.created_at)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(rev.created_at).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Daha fazla göster/az göster butonları */}
          {revisions.length > 5 && (
            <div className="flex justify-center gap-2 pt-4 border-t border-gray-100">
              {showCount < revisions.length && (
                <button
                  onClick={handleShowMore}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Daha Fazla Göster ({revisions.length - showCount} kaldı)
                </button>
              )}
              
              {showCount > 5 && (
                <button
                  onClick={handleShowLess}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Daha Az Göster
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Henüz aktivite bulunmuyor
          </h3>
          <p className="text-gray-500 mb-4">
            Revizyon eklendiğinde burada görünecek
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <Activity className="w-4 h-4" />
            <span>Son aktiviteler burada takip edilir</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;