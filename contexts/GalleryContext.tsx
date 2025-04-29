'use client';

import { createContext, useContext } from 'react';

interface GalleryContextProps {
  sortOrder: string;
  setSortOrder: (sort: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  showSearchForm: boolean;
  setShowSearchForm: (show: boolean) => void;
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
  refreshImages: () => Promise<void>;
  filteredImages: any[];
  isLoading: boolean;
  handleCardDelete: (id: string, imageUrl?: string) => Promise<void>;
  totalNotifications: number;
}

const GalleryContext = createContext<GalleryContextProps | undefined>(undefined);

export function useGalleryContext() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
}

export function GalleryProvider({ children, value }: { children: React.ReactNode, value: GalleryContextProps }) {
  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}
