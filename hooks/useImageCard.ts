import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { getImageUrl } from '@/utils/getImageUrl';
import { useImages } from '@/contexts/ImagesContext';
import { deleteCard } from '@/utils/deleteCard';
import ImageProps from '@/types/ImageProps';
import { useEffect } from 'react';

export const useImageCard = (image: ImageProps, onDelete: (id: string) => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [title, setTitle] = useState('');
  const router = useRouter();
  const imageUrl = getImageUrl(image.image_url);
  const { refreshImages } = useImages();

  useEffect(() => {
    const fetchDocumentTitle = async () => {
      const { data, error } = await createSupabaseClient
        .from('documents')
        .select('title')
        .eq('id', image.document_id)
        .single();

      if (error) {
        console.error('Error fetching document title:', error);
        setDocumentTitle('Sem título');
        setTitle('Sem título');
      }

      if (data) {
        setDocumentTitle(data.title || 'Sem título');
        setTitle(data.title || 'Sem título');
      }
    };

    fetchDocumentTitle();
  }, [image.document_id]);

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
    if (!title) {
      setTitle('Sem título');
    }
    try {/*
      const { error } = await createSupabaseClient
        .from('pages')
        .update({ imageTitle: title })
        .eq('id', image.page_id);
*/
      const { error } = await createSupabaseClient
        .from('documents')
        .update({ title: title })
        .eq('id', image.document_id);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
    }
  };

  const handleDelete = async (imageId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteCard(imageId, image.image_url);

      if (result.success) {
        onDelete(image.id);
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
    setIsEditing,
  };
};
