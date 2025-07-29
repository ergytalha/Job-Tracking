import React, { useState, useContext, useEffect } from "react";
import { Download, Plus, FolderOpen, Clock, CheckCircle, AlertCircle, BarChart3, Home, ArrowLeft } from "lucide-react";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import RevisionList from "../components/Revisions/RevisionList";
import RevisionModal from "../components/Revisions/RevisionModal";
import { ProjectContext } from "../context/ProjectContext";

const RevisionsPage = () => {
  const navigate = useNavigate();
  const {
    projects,
    revisions,
    setRevisions,
  } = useContext(ProjectContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("all");
  const [formData, setFormData] = useState({
    proje_id: "",
    baslik: "",
    durum: "beklemede",
    aciklama: ""
  });

  // Debug kodları
  useEffect(() => {
    console.log("RevisionsPage - Projects:", projects);
    console.log("Projects length:", projects?.length);
  }, [projects]);

  const handleAddClick = () => {
    console.log("Add button clicked, projects:", projects);
    setFormData({
      proje_id: selectedProject !== "all" ? selectedProject : "",
      baslik: "",
      durum: "beklemede",
      aciklama: ""
    });
    setIsEditing(false);
    setIsOpen(true);
  };

  const handleEdit = (revision) => {
    setFormData({ ...revision });
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      proje_id: "",
      baslik: "",
      durum: "beklemede",
      aciklama: ""
    });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      if (isEditing) {
        // Güncelleme - Backend'e gönder
        const response = await fetch(`http://localhost:5001/api/revizyonlar/${formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedRevision = await response.json();
          setRevisions((prev) =>
            prev.map((r) => (r.id === formData.id ? updatedRevision : r))
          );
          console.log("Revizyon güncellendi:", updatedRevision);
        } else {
          console.error("Güncelleme hatası:", response.statusText);
          alert("Revizyon güncellenirken hata oluştu!");
        }
      } else {
        // Yeni ekleme - Backend'e gönder
        const dataToSend = {
          ...formData,
          proje_id: Number(formData.proje_id) // ID'yi number'a çevir
        };

        console.log("Backend'e gönderilen veri:", dataToSend);

        const response = await fetch('http://localhost:5001/api/revizyonlar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          const newRevision = await response.json();
          setRevisions((prev) => [...prev, newRevision]);
          console.log("Yeni revizyon eklendi:", newRevision);
        } else {
          const errorData = await response.json();
          console.error("Ekleme hatası:", errorData);
          alert(errorData.error || "Revizyon eklenirken hata oluştu!");
        }
      }
    } catch (error) {
      console.error("API Hatası:", error);
      alert("Bağlantı hatası! Backend çalışıyor mu kontrol edin.");
    }

    setLoading(false);
    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu revizyonu silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/revizyonlar/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRevisions((prev) => prev.filter((r) => r.id !== id));
          console.log("Revizyon silindi:", id);
        } else {
          console.error("Silme hatası:", response.statusText);
          alert("Revizyon silinirken hata oluştu!");
        }
      } catch (error) {
        console.error("API Hatası:", error);
        alert("Bağlantı hatası!");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/revizyonlar/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ durum: newStatus }),
      });

      if (response.ok) {
        const updatedRevision = await response.json();
        setRevisions((prev) =>
          prev.map((r) => (r.id === id ? updatedRevision : r))
        );
        console.log("Revizyon durumu güncellendi:", updatedRevision);
      } else {
        console.error("Durum güncelleme hatası:", response.statusText);
        alert("Durum güncellenirken hata oluştu!");
      }
    } catch (error) {
      console.error("API Hatası:", error);
      alert("Bağlantı hatası!");
    }
  };

  const exportCSV = () => {
    const header = ["ID", "Project", "Title", "Status", "Description", "Created At"];
    const rows = filteredRevisions.map((r) => {
      const project = projects.find((p) => p.id === r.proje_id);
      return [
        r.id,
        project?.ad || "",
        r.baslik,
        r.durum,
        r.aciklama,
        r.created_at || ""
      ];
    });

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "revisions.csv");
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

  // Durum stili
  const getStatusStyle = (status) => {
    switch (status) {
      case "tamamlandi":
        return "bg-green-100 text-green-800 border-green-200";
      case "devam-ediyor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "beklemede":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filtrelenmiş revizyonlar
  const filteredRevisions = selectedProject === "all" 
    ? revisions 
    : revisions.filter(r => r.proje_id == selectedProject);

  // Proje başına revizyon sayısı
  const getProjectRevisionCount = (projectId) => {
    return revisions.filter(r => r.proje_id == projectId).length;
  };

  // Özet istatistikler
  const stats = {
    totalRevisions: revisions.length,
    pending: revisions.filter(r => r.durum === 'beklemede').length,
    inProgress: revisions.filter(r => r.durum === 'devam-ediyor').length,
    completed: revisions.filter(r => r.durum === 'tamamlandi').length,
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center justify-between">
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

      <Header title="Proje ve Revizyon Yönetimi" />
      
      {/* Üst Kontroller */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Yeni Revizyon
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" /> CSV Aktar
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4" /> Dashboard'a Git
          </button>
        </div>

        {/* Proje Filtresi */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Proje:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm Projeler</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.ad} ({getProjectRevisionCount(project.id)} revizyon)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Proje Kartları */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Aktif Projeler ({projects.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className={`bg-white rounded-xl shadow-sm border p-4 transition-all hover:shadow-md cursor-pointer ${
                  selectedProject == project.id ? 'ring-2 ring-blue-500 border-blue-300' : ''
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-800 text-sm">{project.ad}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle(project.durum)}`}>
                    {getStatusIcon(project.durum)}
                    <span className="ml-1">
                      {project.durum === 'devam-ediyor' ? 'Devam Ediyor' : 
                       project.durum === 'tamamlandi' ? 'Tamamlandı' : 
                       project.durum === 'beklemede' ? 'Beklemede' : project.durum}
                    </span>
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">
                  <strong>Müşteri:</strong> {project.musteri}
                </p>
                
                {project.aciklama && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {project.aciklama}
                  </p>
                )}
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">
                    {getProjectRevisionCount(project.id)} revizyon
                  </span>
                  {project.butce && (
                    <span className="font-medium text-green-600">
                      {project.butce.toLocaleString('tr-TR')} ₺
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revizyonlar Başlığı */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedProject === "all" 
            ? `Tüm Revizyonlar (${revisions.length})` 
            : `${projects.find(p => p.id == selectedProject)?.ad || 'Seçili Proje'} Revizyonları (${filteredRevisions.length})`
          }
        </h3>
        {selectedProject !== "all" && (
          <button 
            onClick={() => setSelectedProject("all")}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Tümünü Göster
          </button>
        )}
      </div>

      {/* Revizyon Listesi */}
      <RevisionList
        revisions={filteredRevisions}
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {/* Modal */}
      <RevisionModal
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        loading={loading}
        projectOptions={projects}
      />
    </div>
  );
};

export default RevisionsPage;