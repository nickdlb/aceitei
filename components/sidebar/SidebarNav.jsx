import React from 'react';
import SidebarMenuItem from './SidebarMenuItem.jsx';
import {
  HomeIcon,
  UserGroupIcon,
  UserCircleIcon,
  CreditCardIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const SidebarNav = () => {
  return (
    <nav className="p-4">
      <ul className="space-y-2">
        <Link href="/">
          <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <HomeIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </li>
        </Link>
        <SidebarMenuItem icon={<UserGroupIcon className="w-5 h-5" />} label="Equipe" />
        <Link href="/minha-conta">
          <li className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <UserCircleIcon className="w-5 h-5" />
            <span>Minha Conta</span>
          </li>
        </Link>
        <SidebarMenuItem icon={<CreditCardIcon className="w-5 h-5" />} label="Faturamento" />
        <SidebarMenuItem icon={<Cog6ToothIcon className="w-5 h-5" />} label="Configurações" />
      </ul>
    </nav>
  );
};

export default SidebarNav;
