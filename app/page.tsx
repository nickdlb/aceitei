'use client'
import { useState } from 'react';
import Sidebar from '../components/markupv2/sidebar/Sidebar';
import TopBar from '../components/markupv2/dashboard/TopBar';
import ImageGallery from '../components/markupv2/dashboard/ImageFeed';

const App = () => {
  const [IsLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('date');

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
        <TopBar onSort={handleSort} />
        <main className="p-6">
          <ImageGallery 
            StatusValue={StatusValue} 
            IsLoading={IsLoading} 
            sortOrder={sortOrder}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
