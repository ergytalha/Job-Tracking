  import React from "react";
  import { Search } from "lucide-react";

  const ProjectFilters = ({ searchText, onSearchChange, statusFilter, onStatusChange, priorityFilter, onPriorityChange }) => {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="beklemede">Pending</option>
              <option value="devam-ediyor">Ongoing</option>
              <option value="tamamlandi">Completed</option>
              <option value="iptal">Cancelled</option>
            </select>

            <select
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="yuksek">High</option>
              <option value="orta">Medium</option>
              <option value="dusuk">Low</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  export default ProjectFilters;