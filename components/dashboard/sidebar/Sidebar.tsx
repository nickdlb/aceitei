import React from 'react';
import SidebarNav from './SidebarNav';
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext';

const Sidebar = () => {
  const { theme } = useTheme()

  return (
    <div className="w-80 h-screen bg-acbgbranco flex flex-col">
      <div className="py-2 px-6 h-20 flex items-center justify-between">
      <Link title="dashboard" href="/dashboard"><img src={theme === 'dark' ? '/logo-feedybacky-white.png' : '/logo-feedybacky-dark.png'} alt="Feedybacky" className="h-8" />
      </Link>
    </div>
      <div className="flex-1 flex flex-col">
        <SidebarNav />
      </div>
    </div>
  );
};

export default Sidebar;
