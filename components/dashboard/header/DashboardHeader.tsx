import HeaderProps from '@/types/HeaderProps';
import BotaoPopupUpload from './BotaoPopupUpload';
import UserProfile from '../sidebar/UserProfile';
import { ToggleDarkModeAnimation } from '../../common/ui/toggleDarkmode';
import { totalNotifications } from '@/utils/notificationsData';
import NotificationsBell from '@/components/common/NotificationsBell';

interface HeaderPropsWithNotifications extends HeaderProps {
  totalNotifications: number;
}

const Header: React.FC<HeaderPropsWithNotifications> = ({
  showSearchForm,
  setShowSearchForm,
  searchTerm,
  setSearchTerm,
  sortOrder,
  handleSort,
  refreshImages,
  totalNotifications
}) => {
  return (
    <div className="bg-acbgbranco px-6 py-2 w-full flex items-center justify-between gap-4 h-18">
      <div className='flex items-center gap-4'>
        <span className='font-semibold'>Projetos Recentes</span>
      </div>
      <div className='flex items-center gap-4'>
        <NotificationsBell totalNotifications={totalNotifications} />
        <BotaoPopupUpload refreshImages={refreshImages} />
        <ToggleDarkModeAnimation />
        <div className="border-l-[1.5px] border-acbg">        
          <UserProfile/>
        </div>
      </div>
    </div>
  );
};

export default Header;
