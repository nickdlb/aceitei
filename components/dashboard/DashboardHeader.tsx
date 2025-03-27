import { Search } from 'lucide-react';
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
      <div className='flex items-center'>
        <span className="text-sm text-gray-600">Ordenar por:</span>
        <Select onValueChange={handleSort} value={sortOrder}>
          <SelectTrigger className="px-2 !h-7 text-sm ml-2">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Data</SelectItem>
            <SelectItem value="title">Título</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Header;
