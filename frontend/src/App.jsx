import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ProjectProvider } from "./context/ProjectContext";
import './index.css';
import './App.css';

const App = () => {
  return (
    <ProjectProvider>
      <AppRoutes />
    </ProjectProvider>
  );
};

export default App;