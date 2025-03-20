import { useImageCard } from '@/hooks/useImageCard';
import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';
import { supabase } from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import ImageCardProps from '@/types/CardProps';

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
    } = useImageCard(image, onDelete);

    useEffect(() => {
        const fetchFirstPageId = async () => {
            const { data, error } = await supabase
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
            <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-500">Imagem não disponível</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-80">
            <CardHeader
                imageUrl={imageUrl}
                imageTitle={image.imageTitle}
                pageId={firstPageId || image.document_id}
                handleShare={handleShare}
                handleDelete={handleDelete}
                isDeleting={isDeleting}
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
            />

            {showShareLink && (
                <div className="absolute bottom-0 left-0 right-0 bg-white p-2 text-xs text-center">
                    Link copiado!
                </div>
            )}
        </div>
    );
}
