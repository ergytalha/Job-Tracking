import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";
import RevisionsPage from "../pages/RevisionsPage";
import ReportsPage from "../pages/ReportsPage";
import TeamPage from "../pages/TeamPage";
import SettingsPage from "../pages/SettingsPage";

const AppRoutes = (props) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage {...props} />} />
        <Route path="/projeler" element={<ProjectsPage />} />
        <Route path="/revisions" element={<RevisionsPage />} />
        <Route
          path="/revizyonlar"
          element={<Navigate to="/revisions" replace />}
        />
        <Route path="/reports" element={<ReportsPage {...props} />} />
        <Route path="/team" element={<TeamPage {...props} />} />
        <Route path="/settings" element={<SettingsPage {...props} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
