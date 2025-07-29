import React from "react";

const TeamMemberCard = ({ member }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
      <img
        src={member.avatar}
        alt={member.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-gray-800">{member.name}</h4>
        <p className="text-xs text-gray-500">{member.role}</p>
      </div>
      <div className="text-sm text-gray-700 font-medium">
        {member.performance}%
      </div>
    </div>
  );
};

export default TeamMemberCard;