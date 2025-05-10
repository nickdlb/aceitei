'use client';

import { useState } from 'react';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { deleteCard } from '@/utils/deleteCard';
import { PageData } from '@/contexts/CardContext';

export const useCard = (pageData: PageData) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { refreshImages } = useDashboardContext();

  const handleDeleteCard = async () => {
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
    handleDeleteCard,
  };
};

