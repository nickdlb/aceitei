export interface HeaderProps {
    showSearchForm: boolean;
    setShowSearchForm: (show: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortOrder: string;
    handleSort: (sortBy: string) => void;
}

export interface ImageCardProps {
    id: string;
    title: string;
    imageUrl: string;
    marksNum: number;
    createdAt: string;
}

export interface ImageFeedProps {
    images: ImageCardProps[];
    searchTerm: string;
    sortOrder: string;
} 