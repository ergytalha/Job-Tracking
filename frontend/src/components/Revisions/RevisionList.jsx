import React from "react";
import RevisionCard from "./RevisionCard";

const RevisionList = ({
  revisions = [],
  projects = [],
  onEdit = () => {},
  onDelete = () => {},
  onStatusChange = () => {}
}) => {
  if (!Array.isArray(revisions) || revisions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500">Hiç revizyon bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {revisions.map((revision) => {
        const project = projects.find((p) => Number(p.id) === Number(revision.proje_id));
        return (
          <RevisionCard
            key={revision.id}
            revision={revision}
            projectName={project?.ad || "Bilinmeyen Proje"}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        );
      })}
    </div>
  );
};

export default RevisionList;
