import React from 'react';

const SidebarMenuItem = ({ icon, label, badge }) => {
  return (
    <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
      {icon}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
          {badge}
        </span>
      )}
    </li>
  );
};

export default SidebarMenuItem;
