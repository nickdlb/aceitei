import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarMenuItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  badge?: string;
  onClick?: () => void;
}

const SidebarMenuItem = ({ icon: Icon, label, href, badge, onClick }: SidebarMenuItemProps) => {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  }

  return (
    <li className={` text-sm text-actextocinza flex items-center gap-3 p-2 rounded cursor-pointer hover:text-acbranco hover:bg-acazul ${isActive ? 'bg-acazul' : 'hover:bg-acazul'} ${isActive ? '!text-acbrancohover' : 'hover:text-acbrancohover'}`} onClick={handleClick}>
      {href ? (
        <Link href={href} className="flex items-center gap-3 w-full">
          <Icon className="w-5 h-5" />
          <span>{label}</span>
          {badge && (
            <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
              {badge}
            </span>
          )}
        </Link>
      ) : (
        <>
          <Icon className="w-5 h-5" />
          <span>{label}</span>
          {badge && (
            <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
              {badge}
            </span>
          )}
        </>
      )}
    </li>
  );
};

export default SidebarMenuItem;
