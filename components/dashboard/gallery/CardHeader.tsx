'use client';

import { Eye, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/common/ui/button';
import { useState } from 'react';
import { useCardContext } from '@/contexts/CardContext';
import { useImageCard } from '@/hooks/useImageCard';

export const CardHeader = () => {
  const { pageData, onDelete } = useCardContext();
  const { documentData } = useCardContext()
  const {
    isDeleting,
    showShareLink,
    imageUrl,
    handleShare,
    handleDelete,
  } = useImageCard(pageData);

  const [isNavigating, setIsNavigating] = useState(false);

  const openCommentPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isNavigating || !pageData.document_id) return;
    setIsNavigating(true);
    if (documentData.type == 'site' ) {
      window.location.href = `/site/${pageData.document_id}`;
    }
    else {
      window.location.href = `/${pageData.document_id}`;
    }
  };

  return (
    <div className="relative h-40 cursor-pointer group" onClick={openCommentPage}>
      <Image
        src={imageUrl}
        alt={pageData.imageTitle || 'Imagem'}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized
      />
      <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center mr-2 space-y-2 transition-opacity duration-300">
        {pageData.notifications > 0 && (
          <div className="!opacity-100 flex items-center justify-center">
            <div className="z-50 size-8 rounded-full text-acbrancohover text-xs flex items-center justify-center bg-acazul">
              {pageData.notifications}
            </div>
          </div>
        )}
        <Button onClick={openCommentPage} variant="ghost" size="icon" className="p-2 bg-acbgbranco rounded-full shadow-md hover:bg-acazul hover:text-acbrancohover w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Eye className="size-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          variant="ghost"
          size="icon"
          className="p-2 bg-acbgbranco rounded-full shadow-md hover:bg-acazul hover:text-acbrancohover w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <Share2 className="size-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete()
          }}
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          className={`p-2 bg-acbgbranco rounded-full shadow-md hover:bg-acazul hover:text-acbrancohover w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};
