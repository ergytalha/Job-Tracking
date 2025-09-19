import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProjectContext = createContext();
export const useProjectContext = () => useContext(ProjectContext);

const API_URL = import.meta.env.VITE_API_URL;
console.log("📡 API_URL (Context):", API_URL);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    defaultStatus: "beklemede",
    itemsPerPage: 10,
    emailNotifications: true,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Projeler fetch ediliyor...");
        const response = await axios.get(`${API_URL}/api/projeler`);
        console.log("API Response status:", response.status);
        console.log("API Response data:", response.data);

        if (Array.isArray(response.data)) {
          const projectsWithNumericIds = response.data.map(project => ({
            ...project,
            id: Number(project.id),
          }));
          setProjects(projectsWithNumericIds);
        } else {
          console.error("API response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Projeler alınamadı:", error);
        console.error("Error message:", error.message);
      }
    };

    const fetchRevisions = async () => {
      try {
        console.log("Revizyonlar fetch ediliyor...");
        const response = await axios.get(`${API_URL}/api/revizyonlar`);
        if (Array.isArray(response.data)) {
          const revisionsWithNumericIds = response.data.map(revision => ({
            ...revision,
            id: Number(revision.id),
            proje_id: Number(revision.proje_id),
          }));
          setRevisions(revisionsWithNumericIds);
        } else {
          console.error("Revisions API response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Revizyonlar alınamadı:", error);
      }
    };

    fetchProjects();
    fetchRevisions();
  }, []);

  const refreshData = async () => {
    console.log("Veriler manuel olarak yenileniyor...");
    try {
      const [projectsResponse, revisionsResponse] = await Promise.all([
        axios.get(`${API_URL}/api/projeler`),
        axios.get(`${API_URL}/api/revizyonlar`),
      ]);

      if (Array.isArray(projectsResponse.data)) {
        const projectsWithNumericIds = projectsResponse.data.map(project => ({
          ...project,
          id: Number(project.id),
        }));
        setProjects(projectsWithNumericIds);
      }

      if (Array.isArray(revisionsResponse.data)) {
        const revisionsWithNumericIds = revisionsResponse.data.map(revision => ({
          ...revision,
          id: Number(revision.id),
          proje_id: Number(revision.proje_id),
        }));
        setRevisions(revisionsWithNumericIds);
      }

      console.log("✅ Veriler başarıyla yenilendi");
    } catch (error) {
      console.error("❌ Veri yenileme hatası:", error);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        revisions,
        setRevisions,
        notifications,
        setNotifications,
        settings,
        setSettings,
        refreshData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext };
