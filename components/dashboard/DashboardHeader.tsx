import { Search, Bell } from 'lucide-react';
import HeaderProps from '@/types/HeaderProps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Header: React.FC<HeaderProps> = ({
  showSearchForm,
  setShowSearchForm,
  searchTerm,
  setSearchTerm,
  sortOrder,
  handleSort,
  totalNotifications
}) => {
  return (
    <div className="bg-acbgbranco px-4 py-2 w-full flex items-center justify-between h-12">
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
            className="w-64 ml-2"
          />
        )}
      </div>
      <div className='flex items-center relative'>
        <span className="text-sm text-actextocinza pr-4">Ordenar por:</span>
        <Select onValueChange={handleSort} value={sortOrder}>
          <SelectTrigger className="px-2 !h-7 text-sm ml-2">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent className='bg-acbgbranco'>
            <SelectItem value="date">Data</SelectItem>
            <SelectItem value="title">Título</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-3 relative w-8 h-8 flex items-center justify-center hover:bg-acbg rounded-full">
          <Bell className="w-4 h-4 text-actextocinza" />
          <div className="animate-[pulse_1s_ease-in-out_3] absolute top-0 right-0 w-4 h-4 bg-acazul rounded-full text-acbranco text-xs flex items-center justify-center">{totalNotifications}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
