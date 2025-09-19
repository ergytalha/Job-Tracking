import React, { useState, useEffect } from "react";
import { 
  X, 
  User, 
  Building, 
  DollarSign, 
  Calendar, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  formData, 
  setFormData, 
  isEditing, 
  loading 
}) => {
  const [errors, setErrors] = useState({});

  // Modal dışına tıklandığında kapat
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC tuşu ile kapat
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Validasyon
  const validateForm = () => {
    const newErrors = {};

    if (!formData.ad?.trim()) {
      newErrors.ad = 'Proje adı gereklidir';
    }

    if (!formData.musteri?.trim()) {
      newErrors.musteri = 'Müşteri adı gereklidir';
    }

    if (formData.butce && Number(formData.butce) < 0) {
      newErrors.butce = 'Bütçe negatif olamaz';
    }

    if (formData.baslangicTarihi && formData.bitisTarihi) {
      const startDate = new Date(formData.baslangicTarihi);
      const endDate = new Date(formData.bitisTarihi);
      if (startDate > endDate) {
        newErrors.bitisTarihi = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave();
    }
  };

  // Input değişim handler'ı
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Hata varsa temizle
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Bütçe formatlaması
  const formatBudget = (value) => {
    if (!value) return '';
    const number = Number(value);
    return isNaN(number) ? value : number.toLocaleString('tr-TR');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            {isEditing ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Proje Adı */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Proje Adı *
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.ad ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Örn: E-ticaret Web Sitesi"
                value={formData.ad || ''}
                onChange={(e) => handleInputChange('ad', e.target.value)}
              />
              {errors.ad && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.ad}
                </p>
              )}
            </div>

            {/* Müşteri */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Müşteri *
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.musteri ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Örn: ABC Şirketi"
                value={formData.musteri || ''}
                onChange={(e) => handleInputChange('musteri', e.target.value)}
              />
              {errors.musteri && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.musteri}
                </p>
              )}
            </div>

            {/* Sorumlu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Proje Sorumlusu
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Örn: Ahmet Yılmaz"
                value={formData.sorumlu || ''}
                onChange={(e) => handleInputChange('sorumlu', e.target.value)}
              />
            </div>

            {/* Durum */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Proje Durumu
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.durum || 'beklemede'}
                onChange={(e) => handleInputChange('durum', e.target.value)}
              >
                <option value="beklemede">Beklemede</option>
                <option value="devam-ediyor">Devam Ediyor</option>
                <option value="tamamlandi">Tamamlandı</option>
                <option value="iptal">İptal Edildi</option>
              </select>
            </div>

            {/* Öncelik */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Öncelik Seviyesi
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.oncelik || 'orta'}
                onChange={(e) => handleInputChange('oncelik', e.target.value)}
              >
                <option value="dusuk">Düşük</option>
                <option value="orta">Orta</option>
                <option value="yuksek">Yüksek</option>
              </select>
            </div>

            {/* Bütçe */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Proje Bütçesi (₺)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.butce ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Örn: 50000"
                value={formData.butce || ''}
                onChange={(e) => handleInputChange('butce', e.target.value)}
              />
              {errors.butce && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.butce}
                </p>
              )}
              {formData.butce && !errors.butce && (
                <p className="text-green-600 text-sm mt-1">
                  Formatlanmış: {formatBudget(formData.butce)} ₺
                </p>
              )}
            </div>

            {/* Başlangıç Tarihi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.baslangicTarihi || ''}
                onChange={(e) => handleInputChange('baslangicTarihi', e.target.value)}
              />
            </div>

            {/* Bitiş Tarihi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Bitiş Tarihi
              </label>
              <input
                type="date"
                min={formData.baslangicTarihi || ''}
                className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.bitisTarihi ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                value={formData.bitisTarihi || ''}
                onChange={(e) => handleInputChange('bitisTarihi', e.target.value)}
              />
              {errors.bitisTarihi && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bitisTarihi}
                </p>
              )}
            </div>

            {/* Açıklama */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Proje Açıklaması
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="4"
                placeholder="Proje detayları, özel notlar ve açıklamalar..."
                value={formData.aciklama || ''}
                onChange={(e) => handleInputChange('aciklama', e.target.value)}
                maxLength="500"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {(formData.aciklama || '').length}/500 karakter
              </div>
            </div>
          </div>

          {/* Proje Özeti */}
          {(formData.ad || formData.musteri) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Proje Özeti</h3>
              <div className="text-sm text-blue-700 space-y-1">
                {formData.ad && <p><strong>Proje:</strong> {formData.ad}</p>}
                {formData.musteri && <p><strong>Müşteri:</strong> {formData.musteri}</p>}
                {formData.butce && <p><strong>Bütçe:</strong> {formatBudget(formData.butce)} ₺</p>}
                {formData.baslangicTarihi && formData.bitisTarihi && (
                  <p><strong>Süre:</strong> {
                    Math.ceil((new Date(formData.bitisTarihi) - new Date(formData.baslangicTarihi)) / (1000 * 60 * 60 * 24))
                  } gün</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
            disabled={loading}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
            {loading ? "Kaydediliyor..." : (isEditing ? "Güncelle" : "Proje Oluştur")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;