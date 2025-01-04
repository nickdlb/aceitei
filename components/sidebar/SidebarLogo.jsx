import React from 'react';
    import { UserCircleIcon } from '@heroicons/react/24/outline';

    const SidebarLogo = () => {
      return (
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <UserCircleIcon className="w-8 h-8 text-gray-600" />
            <div className="flex items-center justify-between flex-1">
              <span className="font-medium">Aceitei</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Free</span>
            </div>
          </div>
        </div>
      );
    };

    export default SidebarLogo;
