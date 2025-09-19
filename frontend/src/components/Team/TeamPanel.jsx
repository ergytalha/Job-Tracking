
import React from "react";
import TeamMemberCard from "./TeamMemberCard";

const TeamPanel = ({ team = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default TeamPanel;