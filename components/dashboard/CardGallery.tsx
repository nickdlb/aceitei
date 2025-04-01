import React, { useState, useEffect } from 'react';
import Card from './Card';
import ImageProps from '@/types/ImageProps';
import CardGalleryProps from '@/types/CardGalleryProps';

const CardGallery: React.FC<CardGalleryProps> = ({ images, handleCardDelete, isLoading }) => {
  const [localImages, setLocalImages] = useState<ImageProps[]>(images);

  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const handleLocalCardDelete = async (id: string) => {
    const imageToDelete = localImages.find((image) => image.id === id);
    if (imageToDelete) {
      try {
        await handleCardDelete(id, imageToDelete.image_url);
      } finally {
        setLocalImages((prevImages) =>
          prevImages.filter((image) => image.id !== id)
        );
      }
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!localImages || localImages.length === 0) {
    return <p>Crie o seu primeiro card!</p>;
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {localImages.map((image) => (
        <Card key={image.id} image={image} onDelete={handleLocalCardDelete} />
      ))}
    </div>
  );
};

export default CardGallery;
