import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ProjectProvider } from "./context/ProjectContext";
import './index.css';

const App = () => {
  return (
    <ProjectProvider>
      <main className="min-h-screen bg-gray-100 p-4">
        <AppRoutes />
      </main>
    </ProjectProvider>
  );
};

export default App;