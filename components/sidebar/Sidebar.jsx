    import React from 'react';
    import SidebarLogo from './SidebarLogo';
    import SidebarNav from './SidebarNav';
    
    const Sidebar = () => {
      return (
        <div className="w-64 h-screen bg-white border-r flex flex-col">
            <SidebarLogo />
            <div className="flex-1 flex flex-col">
                <SidebarNav />
            </div>
        </div>
      );
    };

    export default Sidebar;
