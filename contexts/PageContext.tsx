'use client';

import { createContext, useContext } from 'react';

interface PageContextProps {
  pageId: string;
  pageData: any;
  pages: any[];
  currentTitle: string;
  handleTitleUpdate: (title: string) => void;
  documentData: DocumentDataProps;
  iframeUrl: string;
  setIframeUrl: (iframeUrl: string) => void;
}

interface DocumentDataProps {
  created_at: string;
  id: string;
  last_acessed_at: string;
  status: string;
  title: string;
  type: string;
  url: string;
  user_id: string;
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
