import React from "react";
import { Bell } from "lucide-react";

const NotificationPanel = ({ notifications = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Notifications
      </h2>
      {notifications.length > 0 ? (
        <ul className="space-y-3">
          {notifications.map((note, index) => (
            <li
              key={index}
              className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400"
            >
              <p className="text-sm text-gray-800">{note.message}</p>
              <span className="text-xs text-gray-400">
                {note.date ? new Date(note.date).toLocaleString("tr-TR") : "-"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-8">No notifications.</p>
      )}
    </div>
  );
};

export default NotificationPanel;