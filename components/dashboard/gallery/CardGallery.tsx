'use client';

import React, { useState, useEffect } from 'react';
import Card from './Card';
import { ImageProps } from '@/types';
import { useGalleryContext } from '@/contexts/GalleryContext';

const CardGallery: React.FC = () => {
  const {
    filteredImages,
    handleCardDelete,
    isLoading,
  } = useGalleryContext();

  const [localImages, setLocalImages] = useState<ImageProps[]>(filteredImages);

  useEffect(() => {
    setLocalImages(filteredImages);
  }, [filteredImages]);

  const handleLocalCardDelete = async (id: string, imageUrl?: string) => {
    await handleCardDelete(id, imageUrl);
    setLocalImages((prevImages) =>
      prevImages.filter((image) => image.id !== id)
    );
  };

  if (isLoading) {
    return <p>Carregando Cards...</p>;
  }

  if (!localImages || localImages.length === 0) {
    return <p>Crie o seu primeiro card!</p>;
  }

  return (
    <div className='space-y-4'>
      <div className="grid grid-cols-5 gap-4">
        {localImages.map((image) => (
          <Card key={image.id} image={image} onDelete={handleLocalCardDelete} />
        ))}
      </div>
    </div>
  );
};

export default CardGallery;
