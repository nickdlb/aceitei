'use client';

import { createContext, useContext } from 'react';

interface DashboardContextProps {
  sortOrder: string;
  setSortOrder: (sort: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  showSearchForm: boolean;
  setShowSearchForm: (show: boolean) => void;
  refreshImages: () => Promise<void>;
  filteredImages: any[];
  isLoading: boolean;
  totalNotifications: number;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
}

export function DashboardProvider({ children, value }: { children: React.ReactNode, value: DashboardContextProps }) {
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
