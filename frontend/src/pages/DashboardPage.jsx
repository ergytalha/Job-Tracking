import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  FolderPlus,
  FileText,
  BarChart3,
  Settings,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import Header from "../components/Header/Header";
import StatCards from "../components/Dashboard/StatCards";
import ActivityFeed from "../components/Dashboard/ActivityFeed";
import NotificationPanel from "../components/Notification/NotificationPanel";
import { useApiData, API_URL } from "../services/api";
import ProjectModal from "../components/Projects/ProjectModal";
import RevisionModal from "../components/Revisions/RevisionModal";
import useModal from "../hooks/useModal";
import axios from "axios";

const DashboardPage = () => {
  const {
    istatistikler,
    revizyonlar,
    projeler,
    yukleniyor,
    hata,
    verileriYukle,
  } = useApiData();

  const projeModal = useModal();
  const revizyonModal = useModal();
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
  const [refreshing, setRefreshing] = useState(false);

  const handleSaveProject = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/projeler`, formData);
      await verileriYukle();
      projeModal.closeModal();
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
    } catch (error) {
      console.error("Proje kaydında hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await verileriYukle();
    setRefreshing(false);
  };

  // Hızlı istatistikler
  const quickStats = {
    activeProjects:
      projeler?.filter((p) => p.durum === "devam-ediyor").length || 0,
    pendingRevisions:
      revizyonlar?.filter((r) => r.durum === "beklemede").length || 0,
    completedThisMonth:
      projeler?.filter((p) => {
        if (p.durum === "tamamlandi" && p.bitisTarihi) {
          const endDate = new Date(p.bitisTarihi);
          const now = new Date();
          return (
            endDate.getMonth() === now.getMonth() &&
            endDate.getFullYear() === now.getFullYear()
          );
        }
        return false;
      }).length || 0,
    totalBudget:
      projeler?.reduce((sum, p) => {
        const budget = Number(p.butce) || 0; // String'i number'a çevir
        return sum + budget;
      }, 0) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ${
                refreshing ? "animate-spin" : ""
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              {refreshing ? "Yenileniyor..." : "Yenile"}
            </button>
          </div>

          {/* Hızlı İstatistikler */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">
                {quickStats.activeProjects} aktif proje
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">
                {quickStats.pendingRevisions} bekleyen revizyon
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                {quickStats.completedThisMonth} bu ay tamamlandı
              </span>
            </div>
          </div>
        </div>
      </div>

      <Header title="Proje Yönetim Merkezi" />

      {/* Hızlı Eylem Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={projeModal.openModal}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <FolderPlus className="w-8 h-8" />
            <Plus className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Yeni Proje</h3>
          <p className="text-blue-100 text-sm">Yeni bir proje başlat</p>
        </div>

        <div
          onClick={() => navigate("/revizyonlar")}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-8 h-8" />
            <ExternalLink className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Revizyonlar</h3>
          <p className="text-purple-100 text-sm">
            {revizyonlar?.length || 0} revizyon mevcut
          </p>
        </div>

        <div
          onClick={() => navigate("/projeler")}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <ExternalLink className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Tüm Projeler</h3>
          <p className="text-green-100 text-sm">
            {projeler?.length || 0} proje toplam
          </p>
        </div>

        <div
          onClick={() => navigate("/settings")}
          className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white cursor-pointer hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <Settings className="w-8 h-8" />
            <ExternalLink className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Ayarlar</h3>
          <p className="text-gray-100 text-sm">Sistem ayarları</p>
        </div>
      </div>

      {/* Ana İçerik */}
      {yukleniyor ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Veriler yükleniyor...</span>
          </div>
        </div>
      ) : hata ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="text-red-500 mb-4">
            <span className="text-lg font-semibold">Hata: {hata.message}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </button>
        </div>
      ) : (
        <>
          {/* İstatistik Kartları */}
          <StatCards stats={istatistikler} />

          {/* Ana Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol Kolon - Aktivite */}
            <div className="lg:col-span-2">
              <ActivityFeed revisions={revizyonlar} projects={projeler} />
            </div>

            {/* Sağ Kolon - Bildirimler ve Özet */}
            <div className="space-y-6">
              {/* Hızlı Özet Kartı */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Hızlı Özet
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        Aktif Projeler
                      </span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {quickStats.activeProjects}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-gray-600">
                        Bekleyen Revizyonlar
                      </span>
                    </div>
                    <span className="font-semibold text-yellow-600">
                      {quickStats.pendingRevisions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Bu Ay Tamamlanan
                      </span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {quickStats.completedThisMonth}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Toplam Bütçe
                      </span>
                      <span className="font-bold text-lg text-gray-800">
                        {quickStats.totalBudget.toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bildirimler */}
              <NotificationPanel notifications={[]} />
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={projeModal.isOpen}
        onClose={projeModal.closeModal}
        onSave={handleSaveProject}
        formData={formData}
        setFormData={setFormData}
        isEditing={false}
        loading={loading}
      />

      <RevisionModal {...revizyonModal} onSave={verileriYukle} />
    </div>
  );
};

export default DashboardPage;
