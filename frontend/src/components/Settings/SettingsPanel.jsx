import React from "react";

const SettingsPanel = ({ settings, onChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Project Status
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3"
            value={settings.defaultStatus}
            onChange={(e) => onChange("defaultStatus", e.target.value)}
          >
            <option value="beklemede">Pending</option>
            <option value="devam-ediyor">Ongoing</option>
            <option value="tamamlandi">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Items Per Page
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-3"
            value={settings.itemsPerPage}
            onChange={(e) => onChange("itemsPerPage", parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enable Email Notifications
          </label>
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={settings.emailNotifications}
            onChange={(e) => onChange("emailNotifications", e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
