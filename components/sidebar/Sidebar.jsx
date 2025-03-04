import React from 'react';
    import SidebarLogo from './SidebarLogo';
    import SidebarNav from './SidebarNav';
    
    const Sidebar = () => {
      return (
        <div className="w-64 h-screen bg-white border-r flex flex-col">
            <SidebarLogo />
            <SidebarNav />
        </div>
      );
    };

    export default Sidebar;
