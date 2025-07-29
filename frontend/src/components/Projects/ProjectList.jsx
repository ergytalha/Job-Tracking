import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ projects = [], onEdit = () => {}, onDelete = () => {} }) => {
  if (!projects.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
        Herhangi bir proje bulunamadı.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProjectList;
