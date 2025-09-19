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
import Login from "../pages/Login";
import Unauthorized from "../pages/Unauthorized";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import Layout from "../components/Layout/Layout";

const AppRoutes = (props) => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage {...props} />
              </PrivateRoute>
            }
          />

          <Route
            path="/projeler"
            element={
              <PrivateRoute>
                <ProjectsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/revisions"
            element={
              <PrivateRoute>
                <RevisionsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/revizyonlar"
            element={<Navigate to="/revisions" replace />}
          />

          <Route
            path="/reports"
            element={
              <RoleRoute roles={['admin', 'editor']}>
                <ReportsPage {...props} />
              </RoleRoute>
            }
          />

          <Route
            path="/team"
            element={
              <RoleRoute roles={['admin']}>
                <TeamPage {...props} />
              </RoleRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <RoleRoute roles={['admin']}>
                <SettingsPage {...props} />
              </RoleRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
