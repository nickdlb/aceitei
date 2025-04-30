'use client';

import React from 'react';
import Card from './Card';
import { useGalleryContext } from '@/contexts/GalleryContext';

const CardGallery: React.FC = () => {
  const {
    filteredImages,
    handleCardDelete,
    isLoading,
  } = useGalleryContext();

  if (isLoading) {
    return <p>Carregando Cards...</p>;
  }

  if (!filteredImages || filteredImages.length === 0) {
    return <p>Crie o seu primeiro card!</p>;
  }

  return (
    <div className='space-y-4'>
      <div className="grid grid-cols-5 gap-4">
        {filteredImages.map((image) => (
          <Card key={image.id} image={image} onDelete={handleCardDelete} />
        ))}
      </div>
    </div>
  );
};

export default CardGallery;