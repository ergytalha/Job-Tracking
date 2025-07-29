import React from "react";
import { 
  Edit2, 
  Trash2, 
  User, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Building,
  FileText
} from "lucide-react";

const getStatusConfig = (status) => {
  switch (status) {
    case "devam-ediyor":
      return {
        style: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
        label: "Devam Ediyor"
      };
    case "tamamlandi":
      return {
        style: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Tamamlandı"
      };
    case "beklemede":
      return {
        style: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: AlertCircle,
        label: "Beklemede"
      };
    case "iptal":
      return {
        style: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "İptal"
      };
    default:
      return {
        style: "bg-gray-100 text-gray-800 border-gray-200",
        icon: AlertCircle,
        label: "Bilinmiyor"
      };
  }
};

const getPriorityConfig = (priority) => {
  switch (priority) {
    case "yuksek":
      return {
        style: "bg-red-100 text-red-800 border-red-200",
        icon: Zap,
        label: "Yüksek"
      };
    case "orta":
      return {
        style: "bg-orange-100 text-orange-800 border-orange-200",
        icon: Zap,
        label: "Orta"
      };
    case "dusuk":
      return {
        style: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Zap,
        label: "Düşük"
      };
    default:
      return {
        style: "bg-gray-100 text-gray-800 border-gray-200",
        icon: Zap,
        label: "Belirtilmemiş"
      };
  }
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const statusConfig = getStatusConfig(project.durum);
  const priorityConfig = getPriorityConfig(project.oncelik);
  const StatusIcon = statusConfig.icon;
  const PriorityIcon = priorityConfig.icon;

  // Bütçeyi güvenli şekilde number'a çevir
  const safeBudget = Number(project.butce) || 0;

  // Proje süresini hesapla
  const getProjectDuration = () => {
    if (!project.baslangicTarihi) return null;
    
    const startDate = new Date(project.baslangicTarihi);
    const endDate = project.bitisTarihi ? new Date(project.bitisTarihi) : new Date();
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const projectDuration = getProjectDuration();

  // Proje durumu rengi
  const getCardBorderColor = () => {
    switch (project.durum) {
      case "devam-ediyor":
        return "border-l-blue-500";
      case "tamamlandi":
        return "border-l-green-500";
      case "beklemede":
        return "border-l-yellow-500";
      case "iptal":
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-l-4 ${getCardBorderColor()}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
              {project.ad}
            </h3>
            
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 text-sm truncate">{project.musteri}</span>
            </div>

            {project.sorumlu && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500 text-sm">{project.sorumlu}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 ml-4 flex-shrink-0">
            <button
              onClick={() => onEdit(project)}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Düzenle"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {project.aciklama && (
          <div className="mb-4">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {project.aciklama}
              </p>
            </div>
          </div>
        )}

        {/* Status and Priority Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.style}`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </span>

          {project.oncelik && (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${priorityConfig.style}`}
            >
              <PriorityIcon className="w-3 h-3" />
              {priorityConfig.label} Öncelik
            </span>
          )}
        </div>

        {/* Project Details */}
        <div className="space-y-3">
          {/* Budget */}
          {safeBudget > 0 && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <DollarSign className="w-4 h-4" />
                <span>Bütçe:</span>
              </div>
              <span className="font-semibold text-gray-800">
                {safeBudget.toLocaleString('tr-TR')} ₺
              </span>
            </div>
          )}

          {/* Dates and Duration */}
          {project.baslangicTarihi && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Tarih:</span>
              </div>
              <div className="flex-1">
                <div className="text-gray-800">
                  {new Date(project.baslangicTarihi).toLocaleDateString("tr-TR")} - {" "}
                  {project.bitisTarihi 
                    ? new Date(project.bitisTarihi).toLocaleDateString("tr-TR")
                    : "Devam ediyor"
                  }
                </div>
                {projectDuration && (
                  <div className="text-xs text-gray-500 mt-1">
                    {projectDuration} gün {project.bitisTarihi ? "sürdü" : "süredir devam ediyor"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        {project.durum === "devam-ediyor" && project.baslangicTarihi && project.bitisTarihi && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>İlerleme</span>
              <span>
                {(() => {
                  const start = new Date(project.baslangicTarihi);
                  const end = new Date(project.bitisTarihi);
                  const now = new Date();
                  const total = end - start;
                  const elapsed = now - start;
                  const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
                  return Math.round(progress);
                })()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(() => {
                    const start = new Date(project.baslangicTarihi);
                    const end = new Date(project.bitisTarihi);
                    const now = new Date();
                    const total = end - start;
                    const elapsed = now - start;
                    const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
                    return progress;
                  })()}%`
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;