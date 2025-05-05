'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { getImageUrl } from '@/utils/getImageUrl';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { deleteCard } from '@/utils/deleteCard';
import { PageData } from '@/contexts/CardContext';

export const useImageCard = (pageData: PageData) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const imageUrl = pageData.image_url ? getImageUrl(pageData.image_url) : '/noite-estrelada-comentada.jpg';
  const { refreshImages } = useDashboardContext();

  const handleShare = async () => {
    const linkToShare = `${window.location.origin}/${pageData.document_id}`;
    try {
      await navigator.clipboard.writeText(linkToShare);
      setShowShareLink(true);
      setTimeout(() => setShowShareLink(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteCard(pageData.document_id, pageData.image_url);
      if (result.success) {
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
    imageUrl,
    handleShare,
    handleDelete,
  };
};

