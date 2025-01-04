"use client";
    import Card from '@/components/dashboard/Card';
    import React from 'react';
    import { formatDate } from '@/utils/formatDate';
    import LoadingOverlay from '@/components/dashboard/LoadingOverlay';
    import useLoadImages from '@/hooks/loadImagesHook';

    const ImageGallery = ({ IsLoading, StatusValue, sortOrder, searchTerm }) => {
      const { imagens } = useLoadImages();

      const sortedImages = [...imagens].sort((a, b) => {
        if (sortOrder === 'date') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
          return a.imageTitle.localeCompare(b.imageTitle);
        }
      });

      const filteredImages = sortedImages.filter((imagem) =>
        imagem.imageTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
              />
            ))}
          </div>
        </>
      );
    };

    export default ImageGallery;
