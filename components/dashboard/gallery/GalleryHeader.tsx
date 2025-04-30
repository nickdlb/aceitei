'use client';

import React from 'react';
import OrdenacaoFiltro from './OrdenacaoFiltro';
import SearchCard from '@/components/dashboard/gallery/SearchCard';
import FiltroTipoCard from './FiltroTipoCard';

const GalleryHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-4 bg-acbg p-4 rounded-tl-xl rounded-tr-xl">
      <FiltroTipoCard
      />
      <div className='flex gap-4'>
        <OrdenacaoFiltro
        />
        <SearchCard />
      </div>
    </div>
  );
};

export default GalleryHeader;
