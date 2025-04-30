'use client';

import { createContext, useContext } from 'react';

interface DocumentData {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
  last_acessed_at?: string;
  status?: string;
  type: 'imagem' | 'site';
  url?: string;
}

export interface PageData {
  id: string;
  image_url: string;
  imageTitle: string;
  document_id: string;
  active_comments: number;
  resolved_comments: number;
  notifications: number;
}

interface CardContextProps {
  pageData: PageData;
  documentData: DocumentData;
  onDelete: (id: string, imageUrl?: string) => Promise<void>;
}

const CardContext = createContext<CardContextProps | undefined>(undefined);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};

export const CardProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: CardContextProps;
}) => (
  <CardContext.Provider value={value}>
    {children}
  </CardContext.Provider>
);
