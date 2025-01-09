'use client'
import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/dashboard/Header';
import ImageGallery from '@/components/dashboard/ImageFeed';
import RightSidebarButton from '@/components/sidebar/RightSidebarButton';
import RightSidebar from '@/components/sidebar/RightSidebar';
import { loadImages } from '@/utils/loadImages';
import { Image } from '@/types/Image';

const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [initialWidthSet, setInitialWidthSet] = useState(false);
    const [images, setImages] = useState<Image[]>([]);
    const [draggedOverSidebar, setDraggedOverSidebar] = useState(false);

    useEffect(() => {
        const sidebarState = localStorage.getItem('isRightSidebarOpen');
        const shouldBeOpen = sidebarState === 'true';
        setIsRightSidebarOpen(shouldBeOpen);
        setInitialWidthSet(true);
    }, []);

    useEffect(() => {
        const fetchInitialImages = async () => {
            setIsLoading(true);
            try {
                const initialImages = await loadImages();
                setImages(initialImages);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialImages();
    }, []);

    const handleSort = (sortBy: string) => {
        setSortOrder(sortBy);
    };

    const handleUploadComplete = useCallback((data: Image) => {
        setImages(prevImages => [data, ...prevImages]);
    }, []);

    const toggleRightSidebar = () => {
        const newSidebarState = !isRightSidebarOpen;
        setIsRightSidebarOpen(newSidebarState);
        localStorage.setItem('isRightSidebarOpen', newSidebarState.toString());
    };

    useEffect(() => {
        const handleDragOver = (event: DragEvent) => {
            event.preventDefault();
            if (!isRightSidebarOpen) {
                toggleRightSidebar();
                setDraggedOverSidebar(true);
            }
        };

        const handleDragLeave = (event: DragEvent) => {
            if (
                draggedOverSidebar &&
                (!event.relatedTarget || !document.documentElement.contains(event.relatedTarget as Node))
            ) {
                toggleRightSidebar();
                setDraggedOverSidebar(false);
            }
        };

        const handleDrop = (event: DragEvent) => {
            event.preventDefault();
        };

        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('drop', handleDrop);
        };
    }, [isRightSidebarOpen, draggedOverSidebar]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header 
                    showSearchForm={showSearchForm}
                    setShowSearchForm={setShowSearchForm}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                />
                <main className="p-6 flex-1 overflow-y-auto h-[calc(100vh - 65px)] pb-30">
                    <ImageGallery
                        IsLoading={isLoading}
                        sortOrder={sortOrder}
                        searchTerm={searchTerm}
                        images={images}
                    />
                </main>
            </div>
            <div
                className={`transition-all duration-300 relative ${
                    isRightSidebarOpen ? 'w-[356px]' : 'w-12'
                } bg-white border-l flex flex-col items-center justify-center ${!initialWidthSet ? 'transition-none w-12' : ''}`}
            >
                {isRightSidebarOpen && (
                    <RightSidebar onUploadComplete={handleUploadComplete} />
                )}
                <RightSidebarButton 
                    isRightSidebarOpen={isRightSidebarOpen}
                    toggleRightSidebar={toggleRightSidebar}
                />
            </div>
        </div>
    );
};

export default App;

