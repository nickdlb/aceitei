import { Search, Bell } from 'lucide-react';
import HeaderProps from '@/types/HeaderProps';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import BotaoPopupUpload from './BotaoPopupUpload';
import UserProfileSidebar from '../sidebar/UserProfileSidebar';
import { ToggleDarkModeAnimation } from '../../common/ui/toggleDarkmode';

interface NotificationsBellProps {
  totalNotifications: number;
}

const NotificationsBell: React.FC<NotificationsBellProps> = ({ totalNotifications }) => {
  return (
    <div className="ml-3 relative w-8 h-8 flex items-center justify-center hover:bg-acbg rounded-full">
      <Bell className="w-4 h-4 text-actextocinza" />
      {totalNotifications > 0 && (
        <div className="animate-[pulse_1s_ease-in-out_3] absolute top-0 right-0 w-4 h-4 bg-acazul rounded-full text-acbrancohover text-xs flex items-center justify-center">{totalNotifications}</div>
      )}
    </div>
  );
};

interface SearchCardProps {
  showSearchForm: boolean;
  setShowSearchForm: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({ showSearchForm, setShowSearchForm, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center">
      <Button
        onClick={() => setShowSearchForm(!showSearchForm)}
        variant="ghost"
        size="icon"
        className="text-acpreto p-2 rounded-md  focus:outline-none"
      >
        <Search className="h-6 w-6" />
      </Button>
      {showSearchForm && (
        <Input
          type="text"
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 ml-2 !ring-0 border-none leading-8"
        />
      )}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  showSearchForm,
  setShowSearchForm,
  searchTerm,
  setSearchTerm,
  sortOrder,
  handleSort,
  totalNotifications,
  refreshImages
}) => {
  return (
    <div className="bg-acbgbranco px-4 py-2 w-full flex items-center justify-between gap-4 h-16">
      <div className='flex items-center gap-4'>
        <NotificationsBell totalNotifications={totalNotifications} />
        <SearchCard showSearchForm={showSearchForm}
          setShowSearchForm={setShowSearchForm}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>
      <div className='flex items-center gap-4'>
      <BotaoPopupUpload refreshImages={refreshImages} />
        <ToggleDarkModeAnimation />
        <UserProfileSidebar/>
      </div>
    </div>
  );
};

export default Header;
