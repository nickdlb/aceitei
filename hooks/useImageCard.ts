import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { getImageUrl } from '@/utils/getImageUrl';
import { useImages } from '@/contexts/ImagesContext';
import { deleteCard } from '@/utils/deleteCard';

export const useImageCard = (image: any, onDelete: (id: string) => void) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showShareLink, setShowShareLink] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(image.imageTitle);
    const router = useRouter();
    const imageUrl = getImageUrl(image.image_url);
    const { refreshImages } = useImages();

    const handleShare = async () => {
        const linkToShare = `${window.location.origin}/${image.document_id}`;
        try {
            await navigator.clipboard.writeText(linkToShare);
            setShowShareLink(true);
            setTimeout(() => setShowShareLink(false), 3000);
        } catch (err) {
            console.error('Erro ao copiar link:', err);
        }
    };

    const handleTitleEdit = async () => {
        try {
            const { error } = await createSupabaseClient
                .from('pages')
                .update({ imageTitle: title })
                .eq('id', image.page_id);

            if (error) throw error;
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao atualizar título:', error);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Tem certeza que deseja excluir este documento?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const result = await deleteCard(image.document_id, image.image_url);

            if (result.success) {
                // Notificar o componente pai sobre a exclusão bem-sucedida
                onDelete(image.id);

                // Atualizar a lista de imagens no contexto global
                await refreshImages();
            } else {
                alert(`Falha ao excluir: ${result.message}`);
            }
        } catch (error) {
            console.error('Erro ao deletar documento:', error);
            alert('Ocorreu um erro ao excluir o documento. Por favor, tente novamente.');
        } finally {
            setIsDeleting(false);
        }
    };

    return {
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
    };
}; 