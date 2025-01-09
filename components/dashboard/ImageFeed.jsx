"use client";
    import Card from '@/components/card/Card.tsx';
    import React, { useState, useCallback, useEffect } from 'react';
    import { formatDate } from '@/utils/formatDate';
    import LoadingOverlay from '@/components/dashboard/LoadingOverlay';

    const ImageGallery = ({ IsLoading, StatusValue, sortOrder, searchTerm, images }) => {
      const [currentlyEditing, setCurrentlyEditing] = useState(null);
      const [localImages, setLocalImages] = useState([]);

      useEffect(() => {
        setLocalImages(images);
      }, [images]);

      const sortedImages = [...localImages].sort((a, b) => {
        if (sortOrder === 'date') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
          return a.imageTitle.localeCompare(b.imageTitle);
        }
      });

      const filteredImages = sortedImages.filter((imagem) =>
        imagem.imageTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const handleCardDelete = useCallback((deletedId) => {
        setLocalImages(prevImages => prevImages.filter(img => img.id !== deletedId));
      }, []);

      return (
        <>
          <LoadingOverlay IsLoading={IsLoading}/>
          <div className="flex flex-row flex-wrap gap-4 thin-scrollbar h-full overflow-y-auto justify-start content-start">
            {filteredImages.map((imagem) => (
              <Card
                StatusValue={StatusValue}
                key={imagem.id}
                imageUrl={imagem.image_url}
                imageTitle={imagem.imageTitle}
                status={imagem.status}
                updated_at={formatDate(imagem.created_at)}
                id={imagem.id}
                marks_num={imagem.marks_num || 0}
                currentlyEditing={currentlyEditing}
                setCurrentlyEditing={setCurrentlyEditing}
                onDelete={handleCardDelete}
              />
            ))}
          </div>
        </>
      );
    };

    export default ImageGallery;
