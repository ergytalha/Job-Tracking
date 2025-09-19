import React from "react";

const RevisionModal = ({
  isOpen = false,
  onClose = () => {},
  onSave = () => {},
  formData = {
    proje_id: "",
    baslik: "",
    durum: "beklemede",
    aciklama: "",
  },
  setFormData = () => {},
  isEditing = false,
  loading = false,
  projectOptions = [],
}) => {
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            {isEditing ? "Revizyonu Düzenle" : "Yeni Revizyon Ekle"}
          </h2>

          <div className="space-y-4">
            {/* Proje Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proje *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3"
                value={String(formData.proje_id || "")}
                onChange={(e) =>
                  handleChange("proje_id", Number(e.target.value) || "")
                }
                disabled={isEditing}
              >
                <option value="">Bir proje seçin</option>
                {projectOptions?.length > 0 ? (
                  projectOptions.map((project) => (
                    <option key={project.id} value={String(project.id)}>
                      {project.ad} - {project.musteri}
                    </option>
                  ))
                ) : (
                  <option disabled>Proje bulunamadı</option>
                )}
              </select>
            </div>

            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                value={formData.baslik || ""}
                onChange={(e) => handleChange("baslik", e.target.value)}
              />
            </div>

            {/* Durum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3"
                value={formData.durum || "beklemede"}
                onChange={(e) => handleChange("durum", e.target.value)}
              >
                <option value="beklemede">Beklemede</option>
                <option value="devam-ediyor">Devam Ediyor</option>
                <option value="tamamlandi">Tamamlandı</option>
              </select>
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 resize-none"
                rows="4"
                value={formData.aciklama || ""}
                onChange={(e) => handleChange("aciklama", e.target.value)}
              />
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={onSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevisionModal;
