import React from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import Link from 'next/link'

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-acbgbranco flex flex-col">
      <div className="py-2 px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-semibold text-acpreto hover:text-acazul">
          Aceitei
        </Link>
    </div>
      <div className="flex-1 flex flex-col">
        <SidebarNav />
      </div>
    </div>
  );
};

export default Sidebar;
