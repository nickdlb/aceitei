import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
    showSearchForm: boolean;
    setShowSearchForm: (show: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    sortOrder: string;
    handleSort: (sortBy: string) => void;
}

const Header: React.FC<HeaderProps> = ({
    showSearchForm,
    setShowSearchForm,
    searchTerm,
    setSearchTerm,
    sortOrder,
    handleSort
}) => {
    return (
        <div className="bg-white px-6 py-4 w-full flex items-center justify-between border-b border-[#E5E7EB] h-[65px]">
            <div className="flex items-center">
                <button
                    onClick={() => setShowSearchForm(!showSearchForm)}
                    className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                    <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
                {showSearchForm && (
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-1 border rounded w-64 ml-2"
                    />
                )}
            </div>
            <div>
                <span className="text-gray-600">Ordenar por:</span>
                <select
                    value={sortOrder}
                    onChange={(e) => handleSort(e.target.value)}
                    className="border rounded px-2 py-1 ml-2"
                >
                    <option value="date">Data</option>
                    <option value="title">Título</option>
                </select>
            </div>
        </div>
    );
};

export default Header;

