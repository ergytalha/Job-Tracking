import React from "react";
import { DollarSign, TrendingUp, Calculator, PieChart } from "lucide-react";

const BudgetStats = ({ projects = [] }) => {
  // Bütçe hesaplamaları - String'leri number'a çevir
  const totalBudget = projects.reduce((sum, project) => {
    const budget = Number(project.butce) || 0; // String'i number'a çevir
    return sum + budget;
  }, 0);

  const averageBudget = projects.length > 0 
    ? totalBudget / projects.length 
    : 0;

  // Bütçe dağılımı
  const budgetRanges = {
    low: projects.filter(p => (Number(p.butce) || 0) < 20000).length,
    medium: projects.filter(p => {
      const budget = Number(p.butce) || 0;
      return budget >= 20000 && budget < 50000;
    }).length,
    high: projects.filter(p => (Number(p.butce) || 0) >= 50000).length
  };

  // En yüksek ve en düşük bütçeli projeler
  const projectsWithBudget = projects.filter(p => Number(p.butce) > 0);
  const maxBudgetProject = projectsWithBudget.length > 0 
    ? projectsWithBudget.reduce((max, p) => 
        (Number(p.butce) || 0) > (Number(max.butce) || 0) ? p : max
      )
    : null;

  const minBudgetProject = projectsWithBudget.length > 0 
    ? projectsWithBudget.reduce((min, p) => 
        (Number(p.butce) || 0) < (Number(min.butce) || 0) ? p : min
      )
    : null;

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-800">Bütçe Analizi</h3>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Toplam Bütçe</p>
              <p className="text-2xl font-bold text-green-800">
                {totalBudget.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Ortalama Bütçe</p>
              <p className="text-2xl font-bold text-blue-800">
                {averageBudget.toLocaleString('tr-TR')} ₺
              </p>
            </div>
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Bütçeli Proje</p>
              <p className="text-2xl font-bold text-purple-800">
                {projectsWithBudget.length}
              </p>
            </div>
            <PieChart className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Toplam Proje</p>
              <p className="text-2xl font-bold text-orange-800">
                {projects.length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Bütçe Dağılımı */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Bütçe Dağılımı</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h5 className="font-medium text-red-800 mb-2">Düşük Bütçe</h5>
            <p className="text-sm text-red-600 mb-1">{"< 20,000 ₺"}</p>
            <p className="text-2xl font-bold text-red-800">{budgetRanges.low} proje</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h5 className="font-medium text-yellow-800 mb-2">Orta Bütçe</h5>
            <p className="text-sm text-yellow-600 mb-1">20,000 - 50,000 ₺</p>
            <p className="text-2xl font-bold text-yellow-800">{budgetRanges.medium} proje</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h5 className="font-medium text-green-800 mb-2">Yüksek Bütçe</h5>
            <p className="text-sm text-green-600 mb-1">{">= 50,000 ₺"}</p>
            <p className="text-2xl font-bold text-green-800">{budgetRanges.high} proje</p>
          </div>
        </div>
      </div>

      {/* En Yüksek/Düşük Bütçeli Projeler */}
      {(maxBudgetProject || minBudgetProject) && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Öne Çıkan Projeler</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {maxBudgetProject && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-800 mb-2">En Yüksek Bütçeli</h5>
                <p className="font-semibold text-gray-800">{maxBudgetProject.ad}</p>
                <p className="text-sm text-gray-600 mb-1">Müşteri: {maxBudgetProject.musteri}</p>
                <p className="text-xl font-bold text-green-600">
                  {Number(maxBudgetProject.butce).toLocaleString('tr-TR')} ₺
                </p>
              </div>
            )}

            {minBudgetProject && minBudgetProject.id !== maxBudgetProject?.id && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">En Düşük Bütçeli</h5>
                <p className="font-semibold text-gray-800">{minBudgetProject.ad}</p>
                <p className="text-sm text-gray-600 mb-1">Müşteri: {minBudgetProject.musteri}</p>
                <p className="text-xl font-bold text-blue-600">
                  {Number(minBudgetProject.butce).toLocaleString('tr-TR')} ₺
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bütçesiz Projeler Uyarısı */}
      {projects.length - projectsWithBudget.length > 0 && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>{projects.length - projectsWithBudget.length} proje</strong> için bütçe bilgisi bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetStats;