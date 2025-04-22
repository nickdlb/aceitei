'use client';

import { useState, useEffect, useCallback } from 'react';
import { ImagesProvider } from '@/contexts/ImagesContext';
import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import Header from '@/components/dashboard/header/DashboardHeader';
import ProjectHeader from '@/components/dashboard/gallery/ProjectHeader';
import { useImages } from '@/hooks/useImages';
import { deleteCard } from '@/utils/deleteCard';
import { useAuthChecker } from '@/utils/useAuthChecker';
import { useRouter } from 'next/navigation';
import CardGallery from '@/components/dashboard/gallery/CardGallery';

const AppContent = () => {

    const { isLoading: authIsLoading, isAuthenticated, shouldRedirect } = useAuthChecker();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<string>('todos'); // <-- Add state here
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [initialWidthSet, setInitialWidthSet] = useState(false);
    const [draggedOverSidebar, setDraggedOverSidebar] = useState(false);

    const { images, loading: imagesLoading, totalNotifications, refreshImages } = useImages(sortOrder);

    const filteredImages = images.filter(image => {
        const matchesSearchTerm = image.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'todos' ||
                              (activeFilter === 'imagens' && image.type === 'imagem') ||
                              (activeFilter === 'sites' && image.type === 'site');
        return matchesSearchTerm && matchesFilter;
    });


    const handleCardDeleteWrapper = async (id: string, imageUrl?: string) => {
        await deleteCard(id, imageUrl);
    };

    useEffect(() => {
        const sidebarState = localStorage.getItem('isRightSidebarOpen');
        const shouldBeOpen = sidebarState === 'true';
        setIsRightSidebarOpen(shouldBeOpen);
        setInitialWidthSet(true);
    }, []);

    const handleSort = (sortBy: string) => {
        setSortOrder(sortBy);
    };

    const toggleRightSidebar = useCallback(() => {
        const newSidebarState = !isRightSidebarOpen;
        setIsRightSidebarOpen(newSidebarState);
        localStorage.setItem('isRightSidebarOpen', newSidebarState.toString());
    }, [isRightSidebarOpen]);

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

    useEffect(() => {
        console.log(`[app/page.tsx Effect] authIsLoading: ${authIsLoading}, shouldRedirect: ${shouldRedirect}`);
        if (!authIsLoading && shouldRedirect) {
            console.log('[app/page.tsx] Triggering replace redirect to /login');
            router.replace('/login');
        }

    }, [authIsLoading, shouldRedirect, router]);

    if (authIsLoading) {
        console.log('[app/page.tsx] Rendering Loading state');
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (shouldRedirect || !isAuthenticated) {
        console.log(`[app/page.tsx] Rendering Redirecting state (shouldRedirect: ${shouldRedirect}, isAuthenticated: ${isAuthenticated})`);
        return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
    }

    console.log('[app/page.tsx] Rendering main content');
    return (
        <div className="flex h-screen bg-acbg overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header
                    showSearchForm={showSearchForm}
                    setShowSearchForm={setShowSearchForm}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortOrder={sortOrder}
                    handleSort={handleSort}
                    refreshImages={refreshImages}
                    totalNotifications={totalNotifications}
                />
                <main className="flex flex-col p-6 gap-4">
                    <ProjectHeader
                        sortOrder={sortOrder}
                        handleSort={handleSort}
                        showSearchForm={showSearchForm}
                        setShowSearchForm={setShowSearchForm}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        activeFilter={activeFilter} // <-- Pass prop
                        setActiveFilter={setActiveFilter} // <-- Pass prop
                    />
                    <CardGallery
                        isLoading={isLoading || imagesLoading}
                        images={filteredImages}
                        handleCardDelete={handleCardDeleteWrapper}
                        sortOrder={sortOrder}
                        handleSort={handleSort}
                    />
                </main>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <ImagesProvider>
            <AppContent />
        </ImagesProvider>
    );
};

export default App;
