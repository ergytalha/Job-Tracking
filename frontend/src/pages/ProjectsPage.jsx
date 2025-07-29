import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  ArrowLeft, 
  Home, 
  BarChart3, 
  Filter, 
  Search, 
  Download, 
  RefreshCw,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  Users
} from "lucide-react";
import { saveAs } from "file-saver";
import Header from "../components/Header/Header";
import ProjectList from "../components/Projects/ProjectList";
import ProjectFilters from "../components/Projects/ProjectFilters";
import ProjectModal from "../components/Projects/ProjectModal";
import useModal from "../hooks/useModal";
import { useApiData, API_URL } from "../services/api";
import axios from "axios";

const ProjectsPage = () => {
  const { projeler, verileriYukle } = useApiData();
  const modal = useModal();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ad: "",
    musteri: "",
    sorumlu: "",
    durum: "beklemede",
    oncelik: "orta",
    butce: "",
    baslangicTarihi: "",
    bitisTarihi: "",
    aciklama: "",
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const handleOpenNewProject = () => {
    setFormData({
      ad: "",
      musteri: "",
      sorumlu: "",
      durum: "beklemede",
      oncelik: "orta",
      butce: "",
      baslangicTarihi: "",
      bitisTarihi: "",
      aciklama: "",
    });
    setIsEditing(false);
    modal.openModal();
  };

  const handleEditProject = (project) => {
    setFormData(project);
    setIsEditing(true);
    modal.openModal();
  };

  const handleSaveProject = async () => {
    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(`${API_URL}/api/projeler/${formData.id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/projeler`, formData);
      }
      await verileriYukle();
      modal.closeModal();
    } catch (error) {
      console.error("Proje kaydetme hatası:", error);
      alert("Proje kaydedilirken hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      try {
        await axios.delete(`${API_URL}/api/projeler/${id}`);
        await verileriYukle();
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Proje silinirken hata oluştu!");
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await verileriYukle();
    setRefreshing(false);
  };

  // Filtreleme ve arama
  const filteredProjects = projeler?.filter(project => {
    const matchesSearch = project.ad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.musteri?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.sorumlu?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.durum === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.oncelik === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  // İstatistikler
  const stats = {
    total: projeler?.length || 0,
    pending: projeler?.filter(p => p.durum === 'beklemede').length || 0,
    inProgress: projeler?.filter(p => p.durum === 'devam-ediyor').length || 0,
    completed: projeler?.filter(p => p.durum === 'tamamlandi').length || 0,
    totalBudget: projeler?.reduce((sum, p) => sum + (p.butce || 0), 0) || 0
  };

  // CSV Export
  const exportCSV = () => {
    const header = ["ID", "Proje Adı", "Müşteri", "Sorumlu", "Durum", "Öncelik", "Bütçe", "Başlangıç", "Bitiş", "Açıklama"];
    const rows = filteredProjects.map(p => [
      p.id,
      p.ad,
      p.musteri,
      p.sorumlu,
      p.durum,
      p.oncelik,
      p.butce || 0,
      p.baslangicTarihi || "",
      p.bitisTarihi || "",
      p.aciklama || ""
    ]);

    const csvContent = [header, ...rows]
      .map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `projeler-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Durum ikonu
  const getStatusIcon = (status) => {
    switch (status) {
      case "tamamlandi":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "devam-ediyor":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "beklemede":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

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
            <button
              onClick={() => navigate('/revizyonlar')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Revizyonlar
            </button>
          </div>
          
          {/* Hızlı İstatistikler */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-gray-600">{stats.pending} beklemede</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">{stats.inProgress} devam ediyor</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">{stats.completed} tamamlandı</span>
            </div>
          </div>
        </div>
      </div>

      <Header title="Proje Yönetimi" />
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Proje</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Projeler</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Bütçe</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalBudget.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Kontroller */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Sol Taraf - Arama ve Filtreler */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Arama */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Durum Filtresi */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="beklemede">Beklemede</option>
              <option value="devam-ediyor">Devam Ediyor</option>
              <option value="tamamlandi">Tamamlandı</option>
            </select>

            {/* Öncelik Filtresi */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Öncelikler</option>
              <option value="yuksek">Yüksek</option>
              <option value="orta">Orta</option>
              <option value="dusuk">Düşük</option>
            </select>
          </div>

          {/* Sağ Taraf - Eylem Butonları */}
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors ${
                refreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Yenile
            </button>
            
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              CSV Aktar
            </button>
            
            <button
              onClick={handleOpenNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Yeni Proje
            </button>
          </div>
        </div>
        
        {/* Filtreleme Sonuç Bilgisi */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {filteredProjects.length} / {stats.total} proje gösteriliyor
            {searchTerm && (
              <span className="ml-2">
                "<strong>{searchTerm}</strong>" için sonuçlar
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Proje Listesi */}
      <ProjectList
        projects={filteredProjects}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      {/* Modal */}
      <ProjectModal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        onSave={handleSaveProject}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        loading={loading}
      />
    </div>
  );
};

export default ProjectsPage;