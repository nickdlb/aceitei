import React from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <SidebarHeader />
      <div className="flex-1 flex flex-col">
        <SidebarNav />
      </div>
    </div>
  );
};

export default Sidebar;
