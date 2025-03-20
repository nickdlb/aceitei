import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Image } from '@/types/Image';

interface CardGalleryProps {
  images: Image[];
  handleCardDelete: (id: string, imageUrl?: string) => Promise<void>;
  isLoading: boolean;
}

const CardGallery: React.FC<CardGalleryProps> = ({ images, handleCardDelete, isLoading }) => {
  const [localImages, setLocalImages] = useState<Image[]>(images);

  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const handleLocalCardDelete = async (id: string) => {
    const imageToDelete = localImages.find(image => image.id === id);
    if (imageToDelete) {
      await handleCardDelete(id, imageToDelete.image_url);
      setLocalImages((prevImages) => prevImages.filter((image) => image.id !== id));
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!localImages || localImages.length === 0) {
    return <p>No images found.</p>;
  }

  return (
    <div className="flex  flex-wrap gap-4">
      {localImages.map((image) => (
        <Card key={image.id} image={image} onDelete={handleLocalCardDelete} />
      ))}
    </div>
  );
};

export default CardGallery;
