'use client'
import { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import BottomBar from '../components/dashboard/BottomBar';
import ImageGallery from '../components/dashboard/ImageFeed';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const App = () => {
  const [IsLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchForm, setShowSearchForm] = useState(false);

  const handleSort = (sortBy: string) => {
    setSortOrder(sortBy);
  };

  const StatusValue = (StatusValue: boolean) => {
    setIsLoading(StatusValue);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-white px-6 py-4 shadow-md w-full flex items-center justify-between">
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
                placeholder="Pesquisar..." // Changed placeholder text
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
        <main className="p-6 flex-1">
          <ImageGallery
            StatusValue={StatusValue}
            IsLoading={IsLoading}
            sortOrder={sortOrder}
            searchTerm={searchTerm}
          />
          <div className="fixed bottom-0 left-64 w-full">
            <BottomBar />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
