import React from "react";
import { Edit2, Trash2 } from "lucide-react";

// Duruma göre etiket sınıfları
const getStatusStyle = (status) => {
  switch (status) {
    case "devam-ediyor":
      return "bg-blue-100 text-blue-800";
    case "tamamlandi":
      return "bg-green-100 text-green-800";
    case "beklemede":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const RevisionCard = ({
  revision = {},
  projectName = "Unknown",
  onEdit = () => {},
  onDelete = () => {},
  onStatusChange = () => {}
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex-1 break-words">
          {revision.baslik || "Untitled"}
        </h3>

        <div className="flex gap-2 ml-2">
          <button
            onClick={() => onEdit(revision)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(revision.id)}
            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-3">
        Proje: <span className="font-medium">{projectName}</span>
      </p>

      {revision.aciklama && (
        <p className="text-gray-600 text-sm mb-3 break-words">
          {revision.aciklama}
        </p>
      )}

      <div className="flex justify-between items-center">
        <select
          value={revision.durum}
          onChange={(e) => onStatusChange(revision.id, e.target.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusStyle(revision.durum)}`}
        >
          <option value="beklemede">Beklemede</option>
          <option value="devam-ediyor">Devam Ediyor</option>
          <option value="tamamlandi">Tamamlandı</option>
        </select>

        <span className="text-xs text-gray-400">
          {revision.created_at
            ? new Date(revision.created_at).toLocaleDateString("tr-TR")
            : "Tarih yok"}
        </span>
      </div>
    </div>
  );
};

export default RevisionCard;
