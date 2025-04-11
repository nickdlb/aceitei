import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

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
    <li className={` group text-sm text-actextocinza flex justify-between items-center gap-3 p-2 rounded-xl cursor-pointer hover:text-acpreto hover:bg-acbg ${isActive ? 'bg-acbg !text-acpreto' : 'hover:bg-acbg hover:text-acpreto'}`} onClick={handleClick}>
      <div className='flex gap-3'>
        {href ? (
          <Link href={href} className="flex items-center gap-3 w-full">
            <Icon className={`w-5 h-5 group-hover:text-acazul ${isActive ? 'text-acazul' : 'hover:bg-acbg'}`} />
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
      </div>
      <ChevronRight className={`size-4 text-acbg ${isActive ? '!text-acpreto' : 'hover:text-acpreto'}`} />
    </li>
  );
};

export default SidebarMenuItem;
