'use client';

import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { useImageCard } from '@/hooks/useImageCard';
import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';
import { CardProvider } from '@/contexts/CardContext';
import { ImageCardProps } from '@/types';
import { ImageProps } from '@/types';

export default function ImageCard({ image, onDelete }: ImageCardProps) {
  const [firstPageId, setFirstPageId] = useState<string | null>(null);

  const {
    isDeleting,
    imageError,
    showShareLink,
    isEditing,
    title,
    imageUrl,
    handleShare,
    handleTitleEdit,
    handleDelete,
    setTitle,
    setIsEditing,
  } = useImageCard(image, onDelete); // ✅ onDelete agora com a assinatura correta

  useEffect(() => {
    const fetchFirstPageId = async () => {
      const { data } = await createSupabaseClient
        .from('pages')
        .select('id')
        .eq('document_id', image.document_id)
        .order('page_number', { ascending: true })
        .limit(1)
        .single();

      if (data) {
        setFirstPageId(data.id);
      }
    };

    fetchFirstPageId();
  }, [image.document_id]);

  return (
    <CardProvider
      value={{
        pageData: {
          id: image.page_id,
          image_url: image.image_url,
          imageTitle: image.imageTitle,
          document_id: image.document_id,
          active_comments: image.active_comments,
          resolved_comments: image.resolved_comments,
          notifications: image.notifications,
        },
        documentData: {
          id: image.document_id,
          title: image.title,
          created_at: image.created_at,
          user_id: image.user_id,
          type: image.type,
        },
        onDelete,
      }}
    >
      <div className="bg-acbgbranco rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full relative">
        <CardHeader
          imageUrl={imageUrl}
          isDeleting={isDeleting}
          handleShare={handleShare}
          handleDelete={handleDelete}
        />
        <CardContent
          title={title}
          isEditing={isEditing}
          setTitle={setTitle}
          handleTitleEdit={handleTitleEdit}
          setIsEditing={setIsEditing}
        />
        {showShareLink && (
          <div className="absolute bottom-0 left-0 right-0 bg-acbgbranco p-2 text-xs text-center">
            Link copiado!
          </div>
        )}
      </div>
    </CardProvider>
  );
}
