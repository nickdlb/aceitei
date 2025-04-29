'use client';

import { createContext, useContext } from 'react';
import { ImageProps } from '@/types';

interface CardContextProps {
  image: ImageProps;
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
