import React from 'react';
import SidebarMenuItem from './SidebarMenuItem.jsx';
import { 
  HomeIcon, 
  UserGroupIcon, 
  PuzzlePieceIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const SidebarNav = () => {
  return (
    <nav className="p-4">
      <ul className="space-y-2">
        <SidebarMenuItem icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" />
        <SidebarMenuItem icon={<UserGroupIcon className="w-5 h-5" />} label="Team" />
        <SidebarMenuItem icon={<PuzzlePieceIcon className="w-5 h-5" />} label="Integrations" badge="New" />
        <SidebarMenuItem icon={<Cog6ToothIcon className="w-5 h-5" />} label="Settings" />
      </ul>
    </nav>
  );
};

export default SidebarNav;
