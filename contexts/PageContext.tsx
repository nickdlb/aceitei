// components/context/PageContext.tsx
'use client';

import { createContext, useContext } from 'react';

interface PageContextProps {
  pageId: string;
  pageData: any;
  pages: any[];
  currentTitle: string;
  handleTitleUpdate: (title: string) => void;
}

const PageContext = createContext<PageContextProps | undefined>(undefined);

export const usePageContext = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePageContext must be used within a PageProvider');
  }
  return context;
};

export const PageProvider = ({
  children,
  value
}: {
  children: React.ReactNode;
  value: PageContextProps;
}) => {
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
