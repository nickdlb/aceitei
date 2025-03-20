export default interface HeaderProps {
    showSearchForm: boolean;
    setShowSearchForm: (show: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortOrder: string;
    handleSort: (sortBy: string) => void;
}