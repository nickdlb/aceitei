'use client'
    import { useState, useCallback } from 'react';
    import Sidebar from '../components/sidebar/Sidebar';
    import ImageGallery from '../components/dashboard/ImageFeed';
    import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
    import RightSidebar from '@/components/sidebar/RightSidebar';

    const App = () => {
      const [IsLoading, setIsLoading] = useState(false);
      const [sortOrder, setSortOrder] = useState('date');
      const [searchTerm, setSearchTerm] = useState('');
      const [showSearchForm, setShowSearchForm] = useState(false);
      const [refreshKey, setRefreshKey] = useState(0);

      const handleSort = (sortBy: string) => {
        setSortOrder(sortBy);
      };

      const StatusValue = (StatusValue: boolean) => {
        setIsLoading(StatusValue);
      };

      const handleUploadComplete = useCallback(() => {
        setRefreshKey(prevKey => prevKey + 1);
      }, []);

      return (
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col">
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
            <main className="p-6 flex-1 overflow-y-auto h-[calc(100vh - 65px)] pb-30">
              <ImageGallery
                StatusValue={StatusValue}
                IsLoading={IsLoading}
                sortOrder={sortOrder}
                searchTerm={searchTerm}
                key={refreshKey}
              />
            </main>
          </div>
          <RightSidebar onUploadComplete={handleUploadComplete} />
        </div>
      );
    };

    export default App;
