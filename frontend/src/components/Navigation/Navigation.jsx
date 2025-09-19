import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  FolderOpen,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogOut,
  User
} from "lucide-react";

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Kullanıcı rolüne göre menü öğelerini belirle
  const getMenuItems = () => {
    const baseItems = [
      {
        id: "dashboard",
        label: "Ana Sayfa",
        icon: Home,
        path: "/dashboard",
        roles: ["admin", "user", "editor"]
      },
      {
        id: "projects",
        label: "Projeler",
        icon: FolderOpen,
        path: "/projeler",
        roles: ["admin", "user", "editor"]
      },
      {
        id: "revisions",
        label: "Revizyonlar",
        icon: FileText,
        path: "/revisions",
        roles: ["admin", "user", "editor"]
      }
    ];

    const adminItems = [
      {
        id: "reports",
        label: "Raporlar",
        icon: BarChart3,
        path: "/reports",
        roles: ["admin", "editor"]
      },
      {
        id: "team",
        label: "Ekip",
        icon: Users,
        path: "/team",
        roles: ["admin"]
      },
      {
        id: "settings",
        label: "Ayarlar",
        icon: Settings,
        path: "/settings",
        roles: ["admin"]
      }
    ];

    return [...baseItems, ...adminItems];
  };

  const menuItems = getMenuItems().filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Sol taraf - Logo ve Menü */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">İT</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">
                İş Takip Sistemi
              </span>
            </div>

            {/* Ana Menü */}
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => window.location.href = item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sağ taraf - Kullanıcı Bilgisi ve Çıkış */}
          <div className="flex items-center space-x-4">
            {/* Kullanıcı Bilgisi */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {user?.username}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </div>
              </div>
            </div>

            {/* Çıkış Butonu */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Menü */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => window.location.href = item.path}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 