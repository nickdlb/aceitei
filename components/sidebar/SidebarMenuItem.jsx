import React from 'react';
    import Link from 'next/link';
    import { usePathname } from 'next/navigation';

    const SidebarMenuItem = ({ icon, label, href, badge }) => {
      const pathname = usePathname();
      const isActive = pathname === href;

      return (
        <li className={`flex items-center gap-3 p-2 rounded cursor-pointer ${isActive ? 'bg-blue-100' : 'hover:bg-blue-100'}`}>
          <Link href={href} className="flex items-center gap-3 w-full">
            {icon}
            <span>{label}</span>
            {badge && (
              <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                {badge}
              </span>
            )}
          </Link>
        </li>
      );
    };

    export default SidebarMenuItem;
