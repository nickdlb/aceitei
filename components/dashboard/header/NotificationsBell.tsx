import React from 'react';
import { Bell } from 'lucide-react';
import { useDashboardContext } from '@/contexts/DashboardContext';

const NotificationsBell: React.FC = () => {
  const { totalNotifications } = useDashboardContext();
  return (
    <div className="ml-3 relative w-8 h-8 flex items-center justify-center hover:bg-acbg rounded-full">
      <Bell className="w-4 h-4 text-actextocinza" />
      {totalNotifications > 0 && (
        <div className="animate-[pulse_1s_ease-in-out_3] absolute top-0 right-0 w-4 h-4 bg-acazul rounded-full text-acbrancohover text-xs flex items-center justify-center">{totalNotifications}</div>
      )}
    </div>
  );
};

export default NotificationsBell;
