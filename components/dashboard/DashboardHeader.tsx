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
}) => {
  return (
    <div className="bg-white px-4 py-2 w-full flex items-center justify-between border-b border-[#E5E7EB] h-12">
      <div className="flex items-center">
        <Button
          onClick={() => setShowSearchForm(!showSearchForm)}
          variant="ghost"
          size="icon"
          className="p-2 rounded-md  focus:outline-none"
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
        <span className="text-sm text-gray-600 pr-4">Ordenar por:</span>
        <Select onValueChange={handleSort} value={sortOrder}>
          <SelectTrigger className="px-2 !h-7 text-sm ml-2">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Data</SelectItem>
            <SelectItem value="title">Título</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-3 relative w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full">
          <Bell className="w-4 h-4 text-gray-700" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">1</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
