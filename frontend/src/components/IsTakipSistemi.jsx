import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  AlertCircle,
  MessageSquare,
  BarChart3,
  FileText,
  Bell,
  Settings,
  TrendingUp,
  FolderOpen,
  Activity,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Star,
  Target,
  Users,
} from "lucide-react";
import { useApiData, API_URL } from "../services/api";
import axios from "axios";

const IsTakipSistemi = () => {
  const {
    projeler,
    revizyonlar,
    istatistikler,
    yukleniyor,
    hata,
    verileriYukle,
  } = useApiData();
  const [aktifTab, setAktifTab] = useState("dashboard");

  // Modal ve form state'leri
  const [modalAcik, setModalAcik] = useState(false);
  const [revizyonModalAcik, setRevizyonModalAcik] = useState(false);
  const [duzenlenecekProje, setDuzenlenecekProje] = useState(null);
  const [duzenlenecekRevizyon, setDuzenlenecekRevizyon] = useState(null);
  const [yeniProje, setYeniProje] = useState({
    ad: "",
    musteri: "",
    durum: "beklemede",
    aciklama: "",
    butce: "",
    baslangicTarihi: "",
    bitisTarihi: "",
    oncelik: "orta",
    sorumlu: "",
  });
  const [yeniRevizyon, setYeniRevizyon] = useState({
    proje_id: "",
    baslik: "",
    durum: "beklemede",
    aciklama: "",
  });

  // Filtreleme ve arama
  const [aramaMetni, setAramaMetni] = useState("");
  const [durumFiltresi, setDurumFiltresi] = useState("");
  const [oncelikFiltresi, setOncelikFiltresi] = useState("");

  // Bildirim sistemi
  const [bildirimPaneliAcik, setBildirimPaneliAcik] = useState(false);
  const [okunmusBildirimler, setOkunmusBildirimler] = useState(new Set());

  // Proje kaydetme fonksiyonu
  const handleProjeKaydet = async () => {
    try {
      if (!yeniProje.ad || !yeniProje.musteri) {
        alert("Lütfen proje adı ve müşteri alanlarını doldurun.");
        return;
      }

      const projeVerisi = {
        ad: yeniProje.ad,
        musteri: yeniProje.musteri,
        durum: yeniProje.durum,
        aciklama: yeniProje.aciklama,
        butce: yeniProje.butce ? parseFloat(yeniProje.butce) : null,
        baslangicTarihi: yeniProje.baslangicTarihi || null,
        bitisTarihi: yeniProje.bitisTarihi || null,
        oncelik: yeniProje.oncelik,
        sorumlu: yeniProje.sorumlu,
      };

      if (duzenlenecekProje) {
        await axios.put(
          `${API_URL}/projeler/${duzenlenecekProje.id}`,
          projeVerisi
        );
      } else {
        await axios.post(`${API_URL}/projeler`, projeVerisi);
      }

      setModalAcik(false);
      setDuzenlenecekProje(null);
      setYeniProje({
        ad: "",
        musteri: "",
        durum: "beklemede",
        aciklama: "",
        butce: "",
        baslangicTarihi: "",
        bitisTarihi: "",
        oncelik: "orta",
        sorumlu: "",
      });
      verileriYukle();
    } catch (err) {
      alert(
        "Proje kaydedilemedi: " + (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  // Proje silme fonksiyonu
  const handleProjeSil = async (projeId) => {
    try {
      if (
        window.confirm(
          "Bu projeyi silmek istediğinize emin misiniz? İlgili tüm revizyonlar da silinecektir."
        )
      ) {
        await axios.delete(`${API_URL}/projeler/${projeId}`);
        verileriYukle();
      }
    } catch (err) {
      alert(
        "Proje silinemedi: " + (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  // Revizyon kaydetme fonksiyonu
  const handleRevizyonKaydet = async () => {
    try {
      if (!yeniRevizyon.baslik || !yeniRevizyon.proje_id) {
        alert("Lütfen başlık ve proje alanlarını doldurun.");
        return;
      }

      const revizyonVerisi = {
        proje_id: parseInt(yeniRevizyon.proje_id),
        baslik: yeniRevizyon.baslik,
        durum: yeniRevizyon.durum,
        aciklama: yeniRevizyon.aciklama,
      };

      if (duzenlenecekRevizyon) {
        await axios.put(
          `${API_URL}/revizyonlar/${duzenlenecekRevizyon.id}`,
          revizyonVerisi
        );
      } else {
        await axios.post(`${API_URL}/revizyonlar`, revizyonVerisi);
      }

      setRevizyonModalAcik(false);
      setDuzenlenecekRevizyon(null);
      setYeniRevizyon({
        proje_id: "",
        baslik: "",
        durum: "beklemede",
        aciklama: "",
      });
      verileriYukle();
    } catch (err) {
      alert(
        "Revizyon kaydedilemedi: " +
          (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  // Revizyon silme fonksiyonu
  const handleRevizyonSil = async (revizyonId) => {
    try {
      if (window.confirm("Bu revizyonu silmek istediğinize emin misiniz?")) {
        await axios.delete(`${API_URL}/revizyonlar/${revizyonId}`);
        verileriYukle();
      }
    } catch (err) {
      alert(
        "Revizyon silinemedi: " + (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  // Revizyon durumu güncelleme
  const handleRevizyonDurumGuncelle = async (revizyonId, yeniDurum) => {
    try {
      await axios.patch(`${API_URL}/revizyonlar/${revizyonId}`, {
        durum: yeniDurum,
      });
      verileriYukle();
    } catch (err) {
      alert(
        "Revizyon durumu güncellenemedi: " +
          (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  // Bildirimları oluştur
  const getBildirimler = () => {
    const bildirimler = [];

    // Bekleyen revizyonlar
    const bekleyenRevizyonlar = revizyonlar.filter(
      (r) => r.durum === "beklemede"
    );
    bekleyenRevizyonlar.forEach((revizyon) => {
      const proje = projeler.find((p) => p.id === revizyon.proje_id);
      bildirimler.push({
        id: `revizyon-${revizyon.id}`,
        tip: "revizyon",
        baslik: "Bekleyen Revizyon",
        mesaj: `"${revizyon.baslik}" revizyonu beklemede`,
        proje: proje?.ad || "Bilinmeyen Proje",
        tarih: revizyon.created_at || new Date().toISOString(),
        oncelik: "orta",
        icon: Clock,
      });
    });

    // Yaklaşan deadline'lar (7 gün içinde)
    const bugun = new Date();
    const yediGunSonra = new Date();
    yediGunSonra.setDate(bugun.getDate() + 7);

    projeler.forEach((proje) => {
      if (proje.bitisTarihi && proje.durum !== "tamamlandi") {
        const bitisTarihi = new Date(proje.bitisTarihi);
        if (bitisTarihi <= yediGunSonra && bitisTarihi >= bugun) {
          const kalanGun = Math.ceil(
            (bitisTarihi - bugun) / (1000 * 60 * 60 * 24)
          );
          bildirimler.push({
            id: `deadline-${proje.id}`,
            tip: "deadline",
            baslik: "Yaklaşan Deadline",
            mesaj: `"${proje.ad}" projesi ${kalanGun} gün sonra sona eriyor`,
            proje: proje.ad,
            tarih: proje.bitisTarihi,
            oncelik: kalanGun <= 3 ? "yuksek" : "orta",
            icon: AlertCircle,
          });
        }
      }
    });

    // Geciken projeler
    projeler.forEach((proje) => {
      if (proje.bitisTarihi && proje.durum !== "tamamlandi") {
        const bitisTarihi = new Date(proje.bitisTarihi);
        if (bitisTarihi < bugun) {
          const gecikenGun = Math.ceil(
            (bugun - bitisTarihi) / (1000 * 60 * 60 * 24)
          );
          bildirimler.push({
            id: `geciken-${proje.id}`,
            tip: "geciken",
            baslik: "Geciken Proje",
            mesaj: `"${proje.ad}" projesi ${gecikenGun} gün gecikmiş`,
            proje: proje.ad,
            tarih: proje.bitisTarihi,
            oncelik: "yuksek",
            icon: XCircle,
          });
        }
      }
    });

    // Yüksek öncelikli aktif projeler
    const yuksekOncelikliProjeler = projeler.filter(
      (p) => p.oncelik === "yuksek" && p.durum === "devam-ediyor"
    );
    yuksekOncelikliProjeler.forEach((proje) => {
      bildirimler.push({
        id: `oncelik-${proje.id}`,
        tip: "oncelik",
        baslik: "Yüksek Öncelikli Proje",
        mesaj: `"${proje.ad}" projesi yüksek öncelikli ve aktif`,
        proje: proje.ad,
        tarih: proje.created_at || new Date().toISOString(),
        oncelik: "yuksek",
        icon: Star,
      });
    });

    // Tarihe göre sırala (en yeniler önce)
    return bildirimler.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
  };

  const bildirimler = getBildirimler();
  const okunmamisBildirimSayisi = bildirimler.filter(
    (b) => !okunmusBildirimler.has(b.id)
  ).length;

  // Bildirimi okundu işaretle
  const bildirimiOkunduIsaretle = (bildirimId) => {
    setOkunmusBildirimler((prev) => new Set([...prev, bildirimId]));
  };

  // Tüm bildirimleri okundu işaretle
  const tumBildirimleriOkunduIsaretle = () => {
    const tumBildirimIds = bildirimler.map((b) => b.id);
    setOkunmusBildirimler(new Set(tumBildirimIds));
  };

  // Bildirim rengi
  const getBildirimRengi = (oncelik) => {
    switch (oncelik) {
      case "yuksek":
        return "border-l-red-500 bg-red-50";
      case "orta":
        return "border-l-orange-500 bg-orange-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };
  const filtrelenmisProjeleri = projeler.filter((proje) => {
    const aramaKoşulu =
      proje.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      proje.musteri.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      (proje.sorumlu &&
        proje.sorumlu.toLowerCase().includes(aramaMetni.toLowerCase()));
    const durumKoşulu = !durumFiltresi || proje.durum === durumFiltresi;
    const oncelikKoşulu = !oncelikFiltresi || proje.oncelik === oncelikFiltresi;

    return aramaKoşulu && durumKoşulu && oncelikKoşulu;
  });

  // Durum rengini belirle
  const getDurumRengi = (durum) => {
    switch (durum) {
      case "devam-ediyor":
        return "bg-blue-100 text-blue-800";
      case "tamamlandi":
        return "bg-green-100 text-green-800";
      case "beklemede":
        return "bg-yellow-100 text-yellow-800";
      case "iptal":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Öncelik rengini belirle
  const getOncelikRengi = (oncelik) => {
    switch (oncelik) {
      case "yuksek":
        return "bg-red-100 text-red-800";
      case "orta":
        return "bg-orange-100 text-orange-800";
      case "dusuk":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Durum çevirisi
  const getDurumMetni = (durum) => {
    switch (durum) {
      case "devam-ediyor":
        return "Devam Ediyor";
      case "tamamlandi":
        return "Tamamlandı";
      case "beklemede":
        return "Beklemede";
      case "iptal":
        return "İptal Edildi";
      default:
        return durum;
    }
  };

  // Öncelik çevirisi
  const getOncelikMetni = (oncelik) => {
    switch (oncelik) {
      case "yuksek":
        return "Yüksek";
      case "orta":
        return "Orta";
      case "dusuk":
        return "Düşük";
      default:
        return oncelik;
    }
  };

  const tablar = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    {
      id: "projeler",
      label: `Projeler (${projeler.length})`,
      icon: FolderOpen,
    },
    {
      id: "revizyonlar",
      label: `Revizyonlar (${revizyonlar.length})`,
      icon: MessageSquare,
    },
    { id: "raporlar", label: "Raporlar", icon: FileText },
    { id: "takım", label: "Takım", icon: Users },
  ];

  // Loading durumu
  if (yukleniyor && projeler.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Hata durumu
  if (hata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bir Hata Oluştu
          </h2>
          <p className="text-gray-600 mb-4">{hata}</p>
          <button
            onClick={() => verileriYukle()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🚀 İş Takip Sistemi Pro
            </h1>
            <p className="text-gray-600">
              Proje ve revizyon yönetimi platformu
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="relative">
              <button
                onClick={() => setBildirimPaneliAcik(!bildirimPaneliAcik)}
                className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              >
                <Bell className="w-6 h-6" />
                {okunmamisBildirimSayisi > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {okunmamisBildirimSayisi > 99
                      ? "99+"
                      : okunmamisBildirimSayisi}
                  </span>
                )}
              </button>

              {/* Bildirim Dropdown Paneli */}
              {bildirimPaneliAcik && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setBildirimPaneliAcik(false)}
                  ></div>

                  {/* Panel */}
                  <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-lg border z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 border-b bg-gray-50 rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Bildirimler ({bildirimler.length})
                        </h3>
                        {okunmamisBildirimSayisi > 0 && (
                          <button
                            onClick={tumBildirimleriOkunduIsaretle}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Tümünü Okundu İşaretle
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bildirim Listesi */}
                    <div className="max-h-80 overflow-y-auto">
                      {bildirimler.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {bildirimler.map((bildirim) => {
                            const okunmus = okunmusBildirimler.has(bildirim.id);
                            const IconComponent = bildirim.icon;

                            return (
                              <div
                                key={bildirim.id}
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${getBildirimRengi(
                                  bildirim.oncelik
                                )} ${!okunmus ? "bg-blue-25" : ""}`}
                                onClick={() =>
                                  bildirimiOkunduIsaretle(bildirim.id)
                                }
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      bildirim.oncelik === "yuksek"
                                        ? "bg-red-100 text-red-600"
                                        : bildirim.oncelik === "orta"
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-blue-100 text-blue-600"
                                    }`}
                                  >
                                    <IconComponent className="w-4 h-4" />
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <p
                                        className={`text-sm font-medium ${
                                          !okunmus
                                            ? "text-gray-900"
                                            : "text-gray-700"
                                        }`}
                                      >
                                        {bildirim.baslik}
                                      </p>
                                      {!okunmus && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                      )}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-2">
                                      {bildirim.mesaj}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <span className="truncate">
                                        {bildirim.proje}
                                      </span>
                                      <span>
                                        {new Date(
                                          bildirim.tarih
                                        ).toLocaleDateString("tr-TR", {
                                          day: "numeric",
                                          month: "short",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 text-sm">
                            Henüz bildirim bulunmuyor
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {bildirimler.length > 0 && (
                      <div className="p-3 border-t bg-gray-50 rounded-b-xl">
                        <button
                          onClick={() => {
                            setBildirimPaneliAcik(false);
                            setAktifTab("dashboard");
                          }}
                          className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Tüm Aktiviteleri Gör
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <Settings className="w-6 h-6 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6 overflow-x-auto bg-white rounded-lg shadow-sm">
          {tablar.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAktifTab(tab.id)}
              className={`px-6 py-4 font-medium flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                aktifTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {aktifTab === "dashboard" && (
          <div className="space-y-6">
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Toplam Proje",
                  deger: istatistikler?.toplamProje ?? projeler.length,
                  icon: FolderOpen,
                  renk: "blue",
                },
                {
                  label: "Aktif Proje",
                  deger:
                    istatistikler?.aktifProje ??
                    projeler.filter((p) => p.durum === "devam-ediyor").length,
                  icon: Activity,
                  renk: "green",
                },
                {
                  label: "Bekleyen Revizyon",
                  deger:
                    istatistikler?.bekleyenRevizyon ??
                    revizyonlar.filter((r) => r.durum === "beklemede").length,
                  icon: Clock,
                  renk: "yellow",
                },
                {
                  label: "Toplam Bütçe",
                  deger: `₺${(
                    istatistikler?.toplamButce ??
                    projeler.reduce(
                      (sum, p) => sum + (parseFloat(p.butce) || 0),
                      0
                    )
                  ).toLocaleString()}`,
                  icon: DollarSign,
                  renk: "purple",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm text-gray-500 mb-2">
                        {stat.label}
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.deger}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.renk}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.renk}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Son Aktiviteler */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Son Aktiviteler
              </h2>
              {revizyonlar.length > 0 ? (
                <div className="space-y-3">
                  {revizyonlar
                    .slice(-5)
                    .reverse()
                    .map((revizyon) => {
                      const proje = projeler.find(
                        (p) => p.id === revizyon.proje_id
                      );
                      return (
                        <div
                          key={revizyon.id}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              getDurumRengi(revizyon.durum).split(" ")[0]
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="font-medium">{revizyon.baslik}</p>
                            <p className="text-sm text-gray-500">
                              Proje: {proje?.ad || "Bilinmiyor"}
                            </p>
                          </div>
                          <span className="text-sm text-gray-400">
                            {revizyon.created_at
                              ? new Date(
                                  revizyon.created_at
                                ).toLocaleDateString("tr-TR")
                              : "Tarih yok"}
                          </span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Henüz aktivite bulunmuyor.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Projeler */}
        {aktifTab === "projeler" && (
          <div className="space-y-6">
            {/* Araç Çubuğu */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Proje ara..."
                      className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                      value={aramaMetni}
                      onChange={(e) => setAramaMetni(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={durumFiltresi}
                    onChange={(e) => setDurumFiltresi(e.target.value)}
                  >
                    <option value="">Tüm Durumlar</option>
                    <option value="beklemede">Beklemede</option>
                    <option value="devam-ediyor">Devam Ediyor</option>
                    <option value="tamamlandi">Tamamlandı</option>
                    <option value="iptal">İptal Edildi</option>
                  </select>
                  <select
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={oncelikFiltresi}
                    onChange={(e) => setOncelikFiltresi(e.target.value)}
                  >
                    <option value="">Tüm Öncelikler</option>
                    <option value="yuksek">Yüksek</option>
                    <option value="orta">Orta</option>
                    <option value="dusuk">Düşük</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setDuzenlenecekProje(null);
                    setYeniProje({
                      ad: "",
                      musteri: "",
                      durum: "beklemede",
                      aciklama: "",
                      butce: "",
                      baslangicTarihi: "",
                      bitisTarihi: "",
                      oncelik: "orta",
                      sorumlu: "",
                    });
                    setModalAcik(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Yeni Proje
                </button>
              </div>
            </div>

            {/* Proje Listesi */}
            {filtrelenmisProjeleri.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtrelenmisProjeleri.map((proje) => (
                  <div
                    key={proje.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {proje.ad}
                          </h3>
                          <p className="text-gray-600 text-sm mb-1">
                            📋 {proje.musteri}
                          </p>
                          {proje.sorumlu && (
                            <p className="text-gray-500 text-xs flex items-center gap-1">
                              <User className="w-3 h-3" /> {proje.sorumlu}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setDuzenlenecekProje(proje);
                              setYeniProje({
                                ...proje,
                                butce: proje.butce?.toString() || "",
                                baslangicTarihi: proje.baslangicTarihi
                                  ? proje.baslangicTarihi.split("T")[0]
                                  : "",
                                bitisTarihi: proje.bitisTarihi
                                  ? proje.bitisTarihi.split("T")[0]
                                  : "",
                              });
                              setModalAcik(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleProjeSil(proje.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {proje.aciklama && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {proje.aciklama}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getDurumRengi(
                            proje.durum
                          )}`}
                        >
                          {getDurumMetni(proje.durum)}
                        </span>
                        {proje.oncelik && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getOncelikRengi(
                              proje.oncelik
                            )}`}
                          >
                            {getOncelikMetni(proje.oncelik)} öncelik
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-500">
                        {proje.butce && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              ₺{parseFloat(proje.butce).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {proje.baslangicTarihi && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(
                                proje.baslangicTarihi
                              ).toLocaleDateString("tr-TR")}{" "}
                              -{" "}
                              {proje.bitisTarihi
                                ? new Date(
                                    proje.bitisTarihi
                                  ).toLocaleDateString("tr-TR")
                                : "Devam ediyor"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {aramaMetni || durumFiltresi || oncelikFiltresi
                    ? "Filtreye uygun proje bulunamadı."
                    : "Henüz proje bulunmuyor."}
                </p>
                {!aramaMetni && !durumFiltresi && !oncelikFiltresi && (
                  <button
                    onClick={() => {
                      setDuzenlenecekProje(null);
                      setYeniProje({
                        ad: "",
                        musteri: "",
                        durum: "beklemede",
                        aciklama: "",
                        butce: "",
                        baslangicTarihi: "",
                        bitisTarihi: "",
                        oncelik: "orta",
                        sorumlu: "",
                      });
                      setModalAcik(true);
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    İlk Projeyi Ekle
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Revizyonlar */}
        {aktifTab === "revizyonlar" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setDuzenlenecekRevizyon(null);
                  setYeniRevizyon({
                    proje_id: "",
                    baslik: "",
                    durum: "beklemede",
                    aciklama: "",
                  });
                  setRevizyonModalAcik(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Yeni Revizyon
              </button>
            </div>

            {revizyonlar.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {revizyonlar.map((revizyon) => {
                  const proje = projeler.find(
                    (p) => p.id === revizyon.proje_id
                  );
                  return (
                    <div
                      key={revizyon.id}
                      className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-800 flex-1">
                          {revizyon.baslik}
                        </h3>
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => {
                              setDuzenlenecekRevizyon(revizyon);
                              setYeniRevizyon({ ...revizyon });
                              setRevizyonModalAcik(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRevizyonSil(revizyon.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-500 text-sm mb-3">
                        Proje: {proje ? proje.ad : "Proje bulunamadı"}
                      </p>

                      {revizyon.aciklama && (
                        <p className="text-gray-600 text-sm mb-3">
                          {revizyon.aciklama}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <select
                          value={revizyon.durum}
                          onChange={(e) =>
                            handleRevizyonDurumGuncelle(
                              revizyon.id,
                              e.target.value
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getDurumRengi(
                            revizyon.durum
                          )}`}
                        >
                          <option value="beklemede">Beklemede</option>
                          <option value="devam-ediyor">Devam Ediyor</option>
                          <option value="tamamlandi">Tamamlandı</option>
                        </select>
                        <span className="text-xs text-gray-400">
                          {revizyon.created_at
                            ? new Date(revizyon.created_at).toLocaleDateString(
                                "tr-TR"
                              )
                            : "Tarih yok"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Henüz revizyon bulunmuyor.</p>
                <button
                  onClick={() => {
                    setDuzenlenecekRevizyon(null);
                    setYeniRevizyon({
                      proje_id: "",
                      baslik: "",
                      durum: "beklemede",
                      aciklama: "",
                    });
                    setRevizyonModalAcik(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  İlk Revizyonu Ekle
                </button>
              </div>
            )}
          </div>
        )}

        {/* Raporlar */}
        {aktifTab === "raporlar" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Proje Durumu Dağılımı
                </h3>
                <div className="space-y-3">
                  {[
                    { durum: "tamamlandi", label: "Tamamlanan", renk: "green" },
                    {
                      durum: "devam-ediyor",
                      label: "Devam Eden",
                      renk: "blue",
                    },
                    { durum: "beklemede", label: "Bekleyen", renk: "yellow" },
                    { durum: "iptal", label: "İptal Edildi", renk: "red" },
                  ].map((item) => {
                    const sayi = projeler.filter(
                      (p) => p.durum === item.durum
                    ).length;
                    const yuzde =
                      projeler.length > 0
                        ? Math.round((sayi / projeler.length) * 100)
                        : 0;
                    return (
                      <div
                        key={item.durum}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full bg-${item.renk}-500`}
                          ></div>
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{sayi}</span>
                          <span className="text-xs text-gray-500">
                            ({yuzde}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Bütçe Analizi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Toplam Bütçe</span>
                    <span className="font-medium">
                      ₺
                      {projeler
                        .reduce((sum, p) => sum + (parseFloat(p.butce) || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ortalama Proje Bütçesi</span>
                    <span className="font-medium">
                      ₺
                      {projeler.length > 0
                        ? Math.round(
                            projeler.reduce(
                              (sum, p) => sum + (parseFloat(p.butce) || 0),
                              0
                            ) / projeler.length
                          ).toLocaleString()
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">En Yüksek Bütçe</span>
                    <span className="font-medium">
                      ₺
                      {projeler.length > 0
                        ? Math.max(
                            ...projeler.map((p) => parseFloat(p.butce) || 0)
                          ).toLocaleString()
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Aktif Proje Bütçesi</span>
                    <span className="font-medium">
                      ₺
                      {projeler
                        .filter((p) => p.durum === "devam-ediyor")
                        .reduce((sum, p) => sum + (parseFloat(p.butce) || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Revizyon İstatistikleri
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Toplam Revizyon</span>
                    <span className="font-medium">{revizyonlar.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bekleyen Revizyon</span>
                    <span className="font-medium">
                      {
                        revizyonlar.filter((r) => r.durum === "beklemede")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tamamlanan Revizyon</span>
                    <span className="font-medium">
                      {
                        revizyonlar.filter((r) => r.durum === "tamamlandi")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">
                      Proje Başına Ortalama Revizyon
                    </span>
                    <span className="font-medium">
                      {projeler.length > 0
                        ? (revizyonlar.length / projeler.length).toFixed(1)
                        : 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Öncelik Dağılımı</h3>
                <div className="space-y-3">
                  {[
                    { oncelik: "yuksek", label: "Yüksek Öncelik", renk: "red" },
                    { oncelik: "orta", label: "Orta Öncelik", renk: "orange" },
                    { oncelik: "dusuk", label: "Düşük Öncelik", renk: "gray" },
                  ].map((item) => {
                    const sayi = projeler.filter(
                      (p) => p.oncelik === item.oncelik
                    ).length;
                    const yuzde =
                      projeler.length > 0
                        ? Math.round((sayi / projeler.length) * 100)
                        : 0;
                    return (
                      <div
                        key={item.oncelik}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full bg-${item.renk}-500`}
                          ></div>
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{sayi}</span>
                          <span className="text-xs text-gray-500">
                            ({yuzde}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Takım */}
        {aktifTab === "takım" && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              Takım Üyeleri ve Performans
            </h2>

            {/* Benzersiz sorumluları al */}
            {(() => {
              const sorumlular = [
                ...new Set(
                  projeler.filter((p) => p.sorumlu).map((p) => p.sorumlu)
                ),
              ];
              return sorumlular.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sorumlular.map((sorumlu, index) => {
                    const kisiProjeler = projeler.filter(
                      (p) => p.sorumlu === sorumlu
                    );
                    const aktifProjeler = kisiProjeler.filter(
                      (p) => p.durum === "devam-ediyor"
                    );
                    const tamamlananProjeler = kisiProjeler.filter(
                      (p) => p.durum === "tamamlandi"
                    );
                    const toplamButce = kisiProjeler.reduce(
                      (sum, p) => sum + (parseFloat(p.butce) || 0),
                      0
                    );

                    return (
                      <div
                        key={index}
                        className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{sorumlu}</h3>
                            <p className="text-sm text-gray-500">
                              Proje Sorumlusu
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Toplam Proje
                            </span>
                            <span className="font-medium">
                              {kisiProjeler.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Aktif Proje
                            </span>
                            <span className="font-medium text-blue-600">
                              {aktifProjeler.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Tamamlanan
                            </span>
                            <span className="font-medium text-green-600">
                              {tamamlananProjeler.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Toplam Bütçe
                            </span>
                            <span className="font-medium">
                              ₺{toplamButce.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Başarı Oranı
                            </span>
                            <span className="font-medium">
                              {kisiProjeler.length > 0
                                ? Math.round(
                                    (tamamlananProjeler.length /
                                      kisiProjeler.length) *
                                      100
                                  )
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Henüz atanmış sorumlu bulunmuyor.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Projelere sorumlu atayarak takım performansını takip
                    edebilirsiniz.
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Proje Modal */}
        {modalAcik && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">
                  {duzenlenecekProje ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proje Adı *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Proje adını giriniz"
                      value={yeniProje.ad}
                      onChange={(e) =>
                        setYeniProje({ ...yeniProje, ad: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Müşteri *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Müşteri adını giriniz"
                      value={yeniProje.musteri}
                      onChange={(e) =>
                        setYeniProje({ ...yeniProje, musteri: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sorumlu
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Sorumlu kişi"
                      value={yeniProje.sorumlu}
                      onChange={(e) =>
                        setYeniProje({ ...yeniProje, sorumlu: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={yeniProje.durum}
                      onChange={(e) =>
                        setYeniProje({ ...yeniProje, durum: e.target.value })
                      }
                    >
                      <option value="beklemede">Beklemede</option>
                      <option value="devam-ediyor">Devam Ediyor</option>
                      <option value="tamamlandi">Tamamlandı</option>
                      <option value="iptal">İptal Edildi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Öncelik
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={yeniProje.oncelik}
                      onChange={(e) =>
                        setYeniProje({ ...yeniProje, oncelik: e.target.value })
                      }
                    >
                      <option value="dusuk">Düşük</option>
                      <option value="orta">Orta</option>
                      <option value="yuksek">Yüksek</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bütçe (₺)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      value={yeniProje.butce}
                      onChange={(e) =>
                        setYeniProje({ ...yeniProje, butce: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={yeniProje.baslangicTarihi}
                      onChange={(e) =>
                        setYeniProje({
                          ...yeniProje,
                          baslangicTarihi: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={yeniProje.bitisTarihi}
                      onChange={(e) =>
                        setYeniProje({
                          ...yeniProje,
                          bitisTarihi: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="3"
                      placeholder="Proje hakkında açıklama"
                      value={yeniProje.aciklama}
                      onChange={(e) =>
                        setYeniProje({ ...yeniProje, aciklama: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => setModalAcik(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={yukleniyor}
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleProjeKaydet}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    disabled={yukleniyor}
                  >
                    {yukleniyor && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {yukleniyor ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revizyon Modal */}
        {revizyonModalAcik && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">
                  {duzenlenecekRevizyon
                    ? "Revizyonu Düzenle"
                    : "Yeni Revizyon Ekle"}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proje *
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={yeniRevizyon.proje_id}
                      onChange={(e) =>
                        setYeniRevizyon({
                          ...yeniRevizyon,
                          proje_id: e.target.value,
                        })
                      }
                      disabled={duzenlenecekRevizyon}
                    >
                      <option value="">Proje seçiniz</option>
                      {projeler.map((proje) => (
                        <option key={proje.id} value={proje.id}>
                          {proje.ad} - {proje.musteri}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Revizyon başlığı"
                      value={yeniRevizyon.baslik}
                      onChange={(e) =>
                        setYeniRevizyon({
                          ...yeniRevizyon,
                          baslik: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={yeniRevizyon.durum}
                      onChange={(e) =>
                        setYeniRevizyon({
                          ...yeniRevizyon,
                          durum: e.target.value,
                        })
                      }
                    >
                      <option value="beklemede">Beklemede</option>
                      <option value="devam-ediyor">Devam Ediyor</option>
                      <option value="tamamlandi">Tamamlandı</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows="4"
                      placeholder="Revizyon detayları"
                      value={yeniRevizyon.aciklama}
                      onChange={(e) =>
                        setYeniRevizyon({
                          ...yeniRevizyon,
                          aciklama: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => {
                      setRevizyonModalAcik(false);
                      setDuzenlenecekRevizyon(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={yukleniyor}
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleRevizyonKaydet}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    disabled={yukleniyor}
                  >
                    {yukleniyor && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {yukleniyor ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IsTakipSistemi;
