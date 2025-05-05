import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDashboardContext } from '@/contexts/DashboardContext';

const SearchCard: React.FC = () => {
  const { showSearchForm, setShowSearchForm, searchTerm, setSearchTerm } = useDashboardContext()
  return (
    <div className="flex items-center px-4 py-2 bg-acbgbranco rounded-xl">
      <Button onClick={() => setShowSearchForm(!showSearchForm)} variant="ghost" size="icon" className="text-acpreto p-2 rounded-md  focus:outline-none">
        <Search className="h-6 w-6" />
      </Button>
      {showSearchForm && (
        <Input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 ml-2 !ring-0 border-none leading-8" />
      )}
    </div>
  );
};

export default SearchCard;
