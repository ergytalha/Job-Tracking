import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Home, 
  BarChart3, 
  Settings, 
  Save, 
  RotateCcw, 
  User, 
  Bell, 
  Palette, 
  Database, 
  Shield,
  Globe,
  Monitor,
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  AlertTriangle
} from "lucide-react";
import Header from "../components/Header/Header";
import SettingsPanel from "../components/Settings/SettingsPanel";
import { ProjectContext } from "../context/ProjectContext";

const SettingsPage = ({ settings, onChange }) => {
  const navigate = useNavigate();
  const { refreshData } = useContext(ProjectContext);
  const [activeTab, setActiveTab] = useState('general');
  const [localSettings, setLocalSettings] = useState(settings || {
    defaultStatus: "beklemede",
    itemsPerPage: 10,
    emailNotifications: true,
    theme: "light",
    language: "tr",
    autoSave: true,
    showCompletedProjects: true,
    dateFormat: "dd/mm/yyyy"
  });
  
  const [isSaving, setSisSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSisSaving(true);
    try {
      await onChange(localSettings);
      setHasChanges(false);
      // localStorage'a kaydet (tarayıcı desteği için)
      localStorage.setItem('appSettings', JSON.stringify(localSettings));
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
      alert('Ayarlar kaydedilirken hata oluştu!');
    } finally {
      setSisSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tüm ayarları varsayılan değerlere sıfırlamak istediğinizden emin misiniz?')) {
      const defaultSettings = {
        defaultStatus: "beklemede",
        itemsPerPage: 10,
        emailNotifications: true,
        theme: "light",
        language: "tr",
        autoSave: true,
        showCompletedProjects: true,
        dateFormat: "dd/mm/yyyy"
      };
      setLocalSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(localSettings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setLocalSettings(importedSettings);
          setHasChanges(true);
        } catch (error) {
          alert('Geçersiz ayar dosyası!');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (window.confirm('TÜM VERİLER SİLİNECEK! Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?')) {
      localStorage.clear();
      alert('Tüm veriler temizlendi. Sayfa yeniden yüklenecek.');
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'general', label: 'Genel', icon: Settings },
    { id: 'appearance', label: 'Görünüm', icon: Palette },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'data', label: 'Veri Yönetimi', icon: Database },
    { id: 'security', label: 'Güvenlik', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </button>
          </div>
          
          {/* Kaydet Butonu */}
          {hasChanges && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Kaydedilmemiş değişiklikler
              </span>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          )}
        </div>
      </div>

      <Header title="Sistem Ayarları" />

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Genel Ayarlar</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Varsayılan Proje Durumu
                  </label>
                  <select
                    value={localSettings.defaultStatus}
                    onChange={(e) => handleSettingChange('defaultStatus', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  >
                    <option value="beklemede">Beklemede</option>
                    <option value="devam-ediyor">Devam Ediyor</option>
                    <option value="tamamlandi">Tamamlandı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sayfa Başına Kayıt Sayısı
                  </label>
                  <select
                    value={localSettings.itemsPerPage}
                    onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  >
                    <option value="5">5 kayıt</option>
                    <option value="10">10 kayıt</option>
                    <option value="25">25 kayıt</option>
                    <option value="50">50 kayıt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarih Formatı
                  </label>
                  <select
                    value={localSettings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  >
                    <option value="dd/mm/yyyy">GG/AA/YYYY</option>
                    <option value="mm/dd/yyyy">AA/GG/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-AA-GG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dil
                  </label>
                  <select
                    value={localSettings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3"
                  >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Otomatik Kaydetme</label>
                    <p className="text-sm text-gray-500">Değişiklikler otomatik olarak kaydedilsin</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tamamlanan Projeleri Göster</label>
                    <p className="text-sm text-gray-500">Ana listede tamamlanan projeler görüntülensin</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.showCompletedProjects}
                    onChange={(e) => handleSettingChange('showCompletedProjects', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Görünüm Ayarları</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Tema</label>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleSettingChange('theme', 'light')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      localSettings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <Sun className="w-6 h-6 mb-2 text-yellow-500" />
                    <p className="font-medium">Açık Tema</p>
                  </div>
                  
                  <div 
                    onClick={() => handleSettingChange('theme', 'dark')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      localSettings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <Moon className="w-6 h-6 mb-2 text-blue-500" />
                    <p className="font-medium">Koyu Tema</p>
                  </div>
                  
                  <div 
                    onClick={() => handleSettingChange('theme', 'auto')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      localSettings.theme === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <Monitor className="w-6 h-6 mb-2 text-gray-500" />
                    <p className="font-medium">Otomatik</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Bildirim Ayarları</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">E-posta Bildirimleri</label>
                    <p className="text-sm text-gray-500">Önemli güncellemeler e-posta ile gönderilsin</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Veri Yönetimi</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Ayarları Yönet</h4>
                  
                  <button
                    onClick={handleExportSettings}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Ayarları Dışa Aktar
                  </button>
                  
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      className="hidden"
                      id="import-settings"
                    />
                    <label
                      htmlFor="import-settings"
                      className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Ayarları İçe Aktar
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Tehlikeli İşlemler</h4>
                  
                  <button
                    onClick={handleReset}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Ayarları Sıfırla
                  </button>
                  
                  <button
                    onClick={handleClearData}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Tüm Verileri Temizle
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Güvenlik Ayarları</h3>
              <p className="text-gray-600">Güvenlik ayarları gelecek güncellemelerde eklenecektir.</p>
            </div>
          )}
        </div>
      </div>

      {/* Klasik Settings Panel (Geriye dönük uyumluluk için) */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Eski Ayarlar Paneli</h3>
        <SettingsPanel settings={localSettings} onChange={handleSettingChange} />
      </div>
    </div>
  );
};

export default SettingsPage;