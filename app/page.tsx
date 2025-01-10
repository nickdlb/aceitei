'use client'
import { useState, useCallback, useEffect, useRef } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ImageGallery from '../components/dashboard/ImageFeed';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import RightSidebar from '@/components/sidebar/RightSidebar';
import { PlusIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { loadImages } from '@/utils/loadImages';
import { Image } from '@/types/Image'; // Import the Image interface

const App = () => {
    const [IsLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [initialWidthSet, setInitialWidthSet] = useState(false);
    const [images, setImages] = useState<Image[]>([]);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [draggedOverSidebar, setDraggedOverSidebar] = useState(false);

    useEffect(() => {
        const sidebarState = localStorage.getItem('isRightSidebarOpen');
        const shouldBeOpen = sidebarState === 'true';
        setIsRightSidebarOpen(shouldBeOpen);
        setInitialWidthSet(true);
    }, []);

    useEffect(() => {
        const fetchInitialImages = async () => {
            setIsLoading(true); // Set loading state to true before fetching
            try {
                const initialImages = await loadImages();
                setImages(initialImages);
            } catch (error) {
                console.error("Error fetching images:", error);
                // Handle error appropriately, e.g., display an error message
            } finally {
                setIsLoading(false); // Set loading state to false after fetching (success or failure)
            }
        };
        fetchInitialImages();
    }, []);

    const handleSort = (sortBy: string) => {
        setSortOrder(sortBy);
    };

    const StatusValue = (isLoading: boolean) => { // Renamed for clarity
        setIsLoading(isLoading);
    };

    const handleUploadComplete = useCallback((data: Image) => { // Added type
        setImages(prevImages => [data, ...prevImages]);
    }, []);

    const handleMouseEnter = () => {
        setIsButtonHovered(true);
    };

    const handleMouseLeave = () => {
        setIsButtonHovered(false);
    };

    const toggleRightSidebar = () => {
        const newSidebarState = !isRightSidebarOpen;
        setIsRightSidebarOpen(newSidebarState);
        localStorage.setItem('isRightSidebarOpen', newSidebarState.toString());
        setIsButtonHovered(false);
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
                        images={images}
                    />
                </main>
            </div>
            <div
                ref={sidebarRef}
                className={`transition-all duration-300 relative ${
                    isRightSidebarOpen ? 'w-[356px]' : 'w-12'
                } bg-white border-l flex flex-col items-center justify-center ${!initialWidthSet ? 'transition-none w-12' : ''}`}
            >
                {isRightSidebarOpen && (
                    <RightSidebar onUploadComplete={handleUploadComplete} />
                )}
                <button
                    onClick={toggleRightSidebar}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={`absolute top-1/2 -translate-y-1/2  z-10 bg-gray-200 hover:bg-blue-500 p-3 rounded-l-full transition-all duration-300`}
                    style={{
                        right: isRightSidebarOpen ? '0' : '0',
                        transform: isRightSidebarOpen ? 'translateY(-50%)' : 'translate(-1px, -50%)',
                    }}
                >
                    <div className="flex items-center hover:text-white">
                        {isRightSidebarOpen ? (
                            <ChevronRightIcon className="h-6 w-6 mr-2" />
                        ) : (
                            <PlusIcon className="h-6 w-6 mr-2" />
                        )}
                        {isRightSidebarOpen ? null : isButtonHovered && <span className="text-sm">Adicionar</span>}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default App;
