'use client';

import React from 'react';
import OrdenacaoFiltro from './OrdenacaoFiltro';
import SearchCard from '@/components/common/SearchCard';
import FiltroTipoCard from './FiltroTipoCard';
import { useGalleryContext } from '@/contexts/GalleryContext';

const ProjectHeader: React.FC = () => {
  const {
    sortOrder,
    setSortOrder, // ou handleSort, se quiser renomear
    showSearchForm,
    setShowSearchForm,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter
  } = useGalleryContext();

  return (
    <div className="flex items-center justify-between gap-4">
      <FiltroTipoCard
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <div className='flex gap-4'>
        <OrdenacaoFiltro
          sortOrder={sortOrder}
          handleSort={setSortOrder} // ou handleSort, se mantiver esse nome no contexto
        />
        <SearchCard
          showSearchForm={showSearchForm}
          setShowSearchForm={setShowSearchForm}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </div>
  );
};

export default ProjectHeader;
