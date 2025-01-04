import React from 'react';
    import SidebarMenuItem from './SidebarMenuItem.jsx';
    import {
      HomeIcon,
      UserGroupIcon,
      UserCircleIcon,
      CreditCardIcon,
      Cog6ToothIcon,
    } from '@heroicons/react/24/outline';

    const SidebarNav = () => {
      return (
        <nav className="p-4">
          <ul className="space-y-2">
            <SidebarMenuItem href="/" icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" />
            <SidebarMenuItem icon={<UserGroupIcon className="w-5 h-5" />} label="Equipe" href="/equipe" />
            <SidebarMenuItem href="/minha-conta" icon={<UserCircleIcon className="w-5 h-5" />} label="Minha Conta" />
            <SidebarMenuItem icon={<CreditCardIcon className="w-5 h-5" />} label="Faturamento" href="/faturamento" />
            <SidebarMenuItem icon={<Cog6ToothIcon className="w-5 h-5" />} label="Configurações" href="/configuracoes" />
          </ul>
        </nav>
      );
    };

    export default SidebarNav;
