import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

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
        const response = await axios.get("http://localhost:5001/api/projeler");
        console.log("API Response status:", response.status);
        console.log("API Response data:", response.data);
        
        if (Array.isArray(response.data)) {
          const projectsWithNumericIds = response.data.map(project => ({
            ...project,
            id: Number(project.id)
          }));
          
          console.log("Processed projects:", projectsWithNumericIds);
          setProjects(projectsWithNumericIds);
        } else {
          console.error("API response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Projeler alınamadı:", error);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        console.error("Error message:", error.message);
        
        if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
          console.error("🚨 Backend bağlantı hatası! Backend çalışıyor mu kontrol edin.");
        }
      }
    };

    const fetchRevisions = async () => {
      try {
        console.log("Revizyonlar fetch ediliyor...");
        const response = await axios.get("http://localhost:5001/api/revizyonlar");
        console.log("Revisions API Response:", response.data);
        
        if (Array.isArray(response.data)) {
          const revisionsWithNumericIds = response.data.map(revision => ({
            ...revision,
            id: Number(revision.id),
            proje_id: Number(revision.proje_id)
          }));
          
          console.log("Processed revisions:", revisionsWithNumericIds);
          setRevisions(revisionsWithNumericIds);
        } else {
          console.error("Revisions API response is not an array:", response.data);
        }
      } catch (error) {
        console.error("Revizyonlar alınamadı:", error);
        console.error("Revisions Error status:", error.response?.status);
        console.error("Revisions Error data:", error.response?.data);
        console.error("Revisions Error message:", error.message);
      }
    };

    // Her iki fonksiyonu da çağır
    fetchProjects();
    fetchRevisions();
  }, []);

  // Manuel yenileme fonksiyonu (isteğe bağlı)
  const refreshData = async () => {
    console.log("Veriler manuel olarak yenileniyor...");
    try {
      const [projectsResponse, revisionsResponse] = await Promise.all([
        axios.get("http://localhost:5001/api/projeler"),
        axios.get("http://localhost:5001/api/revizyonlar")
      ]);

      // Projeler
      if (Array.isArray(projectsResponse.data)) {
        const projectsWithNumericIds = projectsResponse.data.map(project => ({
          ...project,
          id: Number(project.id)
        }));
        setProjects(projectsWithNumericIds);
      }

      // Revizyonlar
      if (Array.isArray(revisionsResponse.data)) {
        const revisionsWithNumericIds = revisionsResponse.data.map(revision => ({
          ...revision,
          id: Number(revision.id),
          proje_id: Number(revision.proje_id)
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
        refreshData, // Manuel yenileme fonksiyonu
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext };