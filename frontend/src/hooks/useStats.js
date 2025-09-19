const useStats = (projects = [], revisions = []) => {
    const total = projects.length;
    const ongoing = projects.filter((p) => p.durum === "devam").length;
    const pending = projects.filter((p) => p.durum === "beklemede").length;
    const completed = projects.filter((p) => p.durum === "tamamlandi").length;
  
    const totalRevisions = revisions.length;
    const avgRevisions = total > 0 ? (totalRevisions / total).toFixed(1) : 0;
  
    return {
      total,
      ongoing,
      pending,
      completed,
      totalRevisions,
      avgRevisions,
    };
  };
  
  export default useStats;
  