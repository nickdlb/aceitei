import React from 'react';
import SidebarNav from './SidebarNav';
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext';

const Sidebar = () => {
  const { theme } = useTheme()

  return (
    <div className="hidden md:flex max-w-[250px] w-[250px] h-screen bg-acbgbranco flex-col ">
      <div className="p-4 h-16 flex items-center justify-between">
      <Link title="dashboard" href="/dashboard"><img src={theme === 'dark' ? '/logo-feedybacky-white.png' : '/logo-feedybacky-dark.png'} alt="Feedybacky" className="max-w-[180px] hover:scale-110 ease-in-out" />
      </Link>
    </div>
      <div className="flex-1 flex flex-col">
        <SidebarNav />
      </div>
    </div>
  );
};

export default Sidebar;
