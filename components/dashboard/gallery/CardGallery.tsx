'use client';

import React from 'react';
import Card from './Card';
import { useDashboardContext } from '@/contexts/DashboardContext';

const CardGallery: React.FC = () => {
  const {
    filteredImages,
    isLoading,
  } = useDashboardContext();

  if (isLoading) {
    return <p className='pl-6 bg-acbg'>Carregando Cards...</p>;
  }

  if (!filteredImages || filteredImages.length === 0) {
    return <p className='bg-acbg pl-6'>Crie o seu primeiro card!</p>;
  }

  return (
    <div className={`bg-acbg py-2 px-4 space-y-4`}>
      <div className="grid grid-cols-5 gap-4">
        {filteredImages.map((image) => (
          <Card key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
};

export default CardGallery;