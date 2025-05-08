'use client';

import BotaoPopupUpload from './BotaoPopupUpload';
import UserProfile from '../sidebar/UserProfile';
import { ToggleDarkModeAnimated } from '../../ui/toggleDarkmode';
import NotificationsBell from '@/components/dashboard/header/NotificationsBell';

const Header: React.FC = () => {
  return (
    <div className="bg-acbgbranco px-6 py-2 w-full flex items-center justify-between gap-4 h-20 ">
      <div className='flex items-center gap-4'>
        <span className='text-sm md:text-base font-semibold'>Dashboard</span>
      </div>
      <div className='flex items-center gap-4'>
        <NotificationsBell />
        <BotaoPopupUpload />
        <ToggleDarkModeAnimated />
        <div className="border-l-[1.5px] border-acbg">
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default Header;
