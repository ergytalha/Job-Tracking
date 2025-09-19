import React from "react";
import Header from "../components/Header/Header";
import ReportsPanel from "../components/Reports/ReportsPanel";
import ProjectStatusStats from "../components/Reports/ProjectStatusStats";
import BudgetStats from "../components/Reports/BudgetStats";
import PriorityStats from "../components/Reports/PriorityStats";
import RevisionStats from "../components/Reports/RevisionStats";

const ReportsPage = () => {
  return (
    <div>
      <Header title="Reports" />
      <ReportsPanel />
      <ProjectStatusStats />
      <BudgetStats />
      <PriorityStats />
      <RevisionStats />
    </div>
  );
};

export default ReportsPage;