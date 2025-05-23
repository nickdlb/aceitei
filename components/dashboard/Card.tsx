import { useImageCard } from '@/hooks/useImageCard';
import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import ImageCardProps from '@/types/CardProps';
import ImageProps from '@/types/ImageProps';

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
        setIsEditing
    } = useImageCard(image as ImageProps, onDelete);

    useEffect(() => {
        const fetchFirstPageId = async () => {
            const { data, error } = await createSupabaseClient
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

    if (!imageUrl || imageError) {
        return (
            <div className="bg-acbg rounded-lg p-4 text-center">
                <p className="text-actextocinza">Imagem não disponível</p>
            </div>
        );
    }

    return (
        <div className="bg-acbgbranco rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full relative">
            <CardHeader
                imageUrl={imageUrl}
                imageTitle={image.imageTitle}
                pageId={firstPageId || image.document_id}
                handleShare={handleShare}
                handleDelete={handleDelete}
                isDeleting={isDeleting}
                imageId={image.id}
                notifications={image.notifications}
            />

            <CardContent
                title={title}
                created_at={image.created_at}
                active_comments={image.active_comments}
                resolved_comments={image.resolved_comments}
                isEditing={isEditing}
                setTitle={setTitle}
                handleTitleEdit={handleTitleEdit}
                setIsEditing={setIsEditing}
                notifications={image.notifications}
            />

            {showShareLink && (
                <div className="absolute bottom-0 left-0 right-0 bg-acbgbranco p-2 text-xs text-center">
                    Link copiado!
                </div>
            )}
        </div>
    );
}
