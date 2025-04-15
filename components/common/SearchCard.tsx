import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';

interface SearchCardProps {
  showSearchForm: boolean;
  setShowSearchForm: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchCard: React.FC<SearchCardProps> = ({ showSearchForm, setShowSearchForm, searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center px-4 py-2 bg-acbranco rounded-xl">
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

export default SearchCard;
