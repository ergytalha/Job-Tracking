import React from "react";
import { FolderOpen, Activity, Clock, DollarSign, TrendingUp, CheckCircle } from "lucide-react";

const StatCards = ({ stats }) => {
  // String değerleri number'a çevir
  const safeStats = {
    toplamProje: Number(stats?.toplamProje) || 0,
    aktifProje: Number(stats?.aktifProje) || 0,
    tamamlananProje: Number(stats?.tamamlananProje) || 0,
    bekleyenRevizyon: Number(stats?.bekleyenRevizyon) || 0,
    toplamButce: Number(stats?.toplamButce) || 0,
    gecikenProje: Number(stats?.gecikenProje) || 0,
    ortalamaTamamlanmaSuresi: Number(stats?.ortalamaTamamlanmaSuresi) || 0
  };

  const cards = [
    {
      label: "Toplam Proje",
      value: safeStats.toplamProje,
      icon: FolderOpen,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: "Sistemdeki toplam proje sayısı"
    },
    {
      label: "Aktif Proje", 
      value: safeStats.aktifProje,
      icon: Activity,
      color: "green",
      bgColor: "bg-green-100", 
      textColor: "text-green-600",
      description: "Şu anda devam eden projeler"
    },
    {
      label: "Tamamlanan Proje",
      value: safeStats.tamamlananProje,
      icon: CheckCircle,
      color: "emerald",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600", 
      description: "Başarıyla tamamlanan projeler"
    },
    {
      label: "Bekleyen Revizyon",
      value: safeStats.bekleyenRevizyon,
      icon: Clock,
      color: "yellow",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600",
      description: "İşlem bekleyen revizyon sayısı"
    },
    {
      label: "Toplam Bütçe",
      value: `${safeStats.toplamButce.toLocaleString('tr-TR')} ₺`,
      icon: DollarSign,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Tüm projelerin toplam bütçesi"
    },
  ];

  // Tamamlanma oranı hesapla
  const completionRate = safeStats.toplamProje > 0 
    ? ((safeStats.tamamlananProje / safeStats.toplamProje) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Ana İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                  {card.label}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 leading-none">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Özet Performans Kartı */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Performans Özeti</h3>
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tamamlanma Oranı */}
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={`${completionRate}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">{completionRate}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">Tamamlanma Oranı</p>
            <p className="text-xs text-gray-500">
              {safeStats.tamamlananProje} / {safeStats.toplamProje} proje
            </p>
          </div>

          {/* Aktif Proje Durumu */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Aktif Proje Oranı</p>
            <p className="text-lg font-bold text-green-600">
              {safeStats.toplamProje > 0 
                ? ((safeStats.aktifProje / safeStats.toplamProje) * 100).toFixed(1)
                : 0}%
            </p>
            <p className="text-xs text-gray-500">
              {safeStats.aktifProje} aktif proje
            </p>
          </div>

          {/* Revizyon Durumu */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Bekleyen Revizyon</p>
            <p className="text-lg font-bold text-yellow-600">
              {safeStats.bekleyenRevizyon}
            </p>
            <p className="text-xs text-gray-500">
              İşlem bekliyor
            </p>
          </div>
        </div>
      </div>

      {/* Uyarılar */}
      {(safeStats.bekleyenRevizyon > 10 || completionRate < 50) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h4 className="font-medium text-amber-800">Dikkat Gereken Durumlar</h4>
          </div>
          <ul className="text-sm text-amber-700 space-y-1">
            {safeStats.bekleyenRevizyon > 10 && (
              <li>• {safeStats.bekleyenRevizyon} bekleyen revizyon var - Hızlı aksiyon gerekli</li>
            )}
            {completionRate < 50 && (
              <li>• Proje tamamlanma oranı %{completionRate} - Süreçleri gözden geçirin</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatCards;