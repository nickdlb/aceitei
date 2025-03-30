'use client'

import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/dashboard/DashboardHeader';
import ImageGallery from '@/components/dashboard/CardGallery';
import RightSidebarButton from '@/components/sidebar/RightSidebarButton';
import RightSidebar from '@/components/sidebar/RightSidebar';
import { useAuth } from '@/components/auth/AuthProvider';
import { useImages } from '@/hooks/useImages';
import { useRouter } from 'next/navigation';
import { deleteCard } from '@/utils/deleteCard';

const App = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCardDeleteWrapper = async (id: string, imageUrl?: string) => {
        await deleteCard(id, imageUrl);
    };
    const [sortOrder, setSortOrder] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [initialWidthSet, setInitialWidthSet] = useState(false);
    const [draggedOverSidebar, setDraggedOverSidebar] = useState(false);
    const { session, loading } = useAuth();
    const { images, loading: imagesLoading, refreshImages, totalNotifications } = useImages(sortOrder);
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if not authenticated after loading is complete
        if (!loading && !session) {
            router.push('/login');
        }
    }, [session, loading, router]);

    useEffect(() => {
        const sidebarState = localStorage.getItem('isRightSidebarOpen');
        const shouldBeOpen = sidebarState === 'true';
        setIsRightSidebarOpen(shouldBeOpen);
        setInitialWidthSet(true);
    }, []);

    const handleSort = (sortBy: string) => {
        setSortOrder(sortBy);
    };

    const handleUploadComplete = useCallback(async (data: any) => {
        try {
            // Força um refresh do hook useImages
            if (refreshImages) {
                refreshImages();
            }
        } catch (error) {
            console.error("Error updating images:", error);
        }
    }, [refreshImages]);

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
    }, [isRightSidebarOpen, draggedOverSidebar, toggleRightSidebar]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    // If still loading or session exists, render the main content
    // The useEffect above handles the redirect if loading is done and there's no session.
    if (loading || !session) {
        // Render null or a loading indicator while redirecting or if session is still loading
        // This prevents rendering the main UI before the redirect logic in useEffect runs
        return null; 
    }

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
                    totalNotifications={totalNotifications}
                />
                <main className="p-6 flex-1 overflow-y-auto h-[calc(100vh - 65px)] pb-30">
                    <ImageGallery
                        isLoading={isLoading}
                        images={images}
                        handleCardDelete={handleCardDeleteWrapper}
                    />
                </main>
            </div>
            <div className={`transition-all duration-300 relative ${isRightSidebarOpen ? 'w-[356px]' : 'w-12'} bg-white border-l flex flex-col items-center justify-center ${!initialWidthSet ? 'transition-none w-12' : ''}`}>
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
