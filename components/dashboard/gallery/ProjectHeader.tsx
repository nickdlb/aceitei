import React, { useState } from 'react';
import OrdenacaoFiltro from './OrdenacaoFiltro';
import SearchCard from '@/components/common/SearchCard';
import FiltroTipoCard from './FiltroTipoCard';

interface ProjectHeaderProps {
    sortOrder: string;
    handleSort: (sortBy: string) => void;
    showSearchForm: boolean;
    setShowSearchForm: (show: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ sortOrder, handleSort, showSearchForm, setShowSearchForm, searchTerm, setSearchTerm }) => {
    const [activeFilter, setActiveFilter] = useState<string>('todos');

    return (
        <div className="flex items-center justify-between gap-4">
            <FiltroTipoCard activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            <div className='flex gap-4'>
                <OrdenacaoFiltro sortOrder={sortOrder} handleSort={handleSort} />
                <SearchCard showSearchForm={showSearchForm} setShowSearchForm={setShowSearchForm} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </div>
        </div>
    );
};

export default ProjectHeader;
