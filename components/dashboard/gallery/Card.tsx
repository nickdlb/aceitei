'use client';

import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';
import { CardProvider } from '@/contexts/CardContext';
import { useCard } from '@/hooks/useCard';

export interface CardProps {
  id: string;
  document_id: string;
  image_url: string;
  imageTitle: string;
  created_at: string;
  page_id: string;
  title: string;
  user_id: string;
  active_comments: number;
  resolved_comments: number;
  notifications: number;
  type: 'imagem' | 'site' | 'pdf';
}

export default function Card({ image }: { image: CardProps }) {
  const {
    isDeleting,
    handleDeleteCard,
  } = useCard(image);

  const pageData = {
    id: image.page_id,
    image_url: image.image_url,
    imageTitle: image.imageTitle,
    document_id: image.document_id,
    active_comments: image.active_comments,
    resolved_comments: image.resolved_comments,
    notifications: image.notifications,
  };

  const documentData = {
    id: image.document_id,
    title: image.title,
    created_at: image.created_at,
    user_id: image.user_id,
    type: image.type,
  };

  return (
    <CardProvider value={{ pageData, documentData }}>
      <div className="bg-acbgbranco rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full relative">
        <CardHeader />
        <CardContent />
      </div>
    </CardProvider>
  );
}
