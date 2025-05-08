'use client';

import { useState, useEffect, useCallback } from 'react';
import { ImagesProvider } from '@/contexts/ImagesContext';
import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import Header from '@/components/dashboard/header/DashboardHeader';
import GalleryHeader from '@/components/dashboard/gallery/GalleryHeader';
import { useImages } from '@/hooks/useImages';
import { useAuthChecker } from '@/utils/useAuthChecker';
import { useRouter } from 'next/navigation';
import CardGallery from '@/components/dashboard/gallery/CardGallery';
import { DashboardProvider } from '@/contexts/DashboardContext';
import MobileMenu from '@/components/dashboard/sidebar/MobileMenu';

const AppContent = () => {

    const { isLoading: authIsLoading, isAuthenticated, shouldRedirect } = useAuthChecker();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<string>('todos'); // <-- Add state here
    const [showSearchForm, setShowSearchForm] = useState(false);
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

    useEffect(() => {
        const sidebarState = localStorage.getItem('isRightSidebarOpen');
        const shouldBeOpen = sidebarState === 'true';
        setInitialWidthSet(true);
    }, []);

    const handleSort = (sortBy: string) => {
        setSortOrder(sortBy);
    };

    useEffect(() => {
        const handleDragOver = (event: DragEvent) => {
            event.preventDefault();
        };

        const handleDragLeave = (event: DragEvent) => {
            if (
                draggedOverSidebar &&
                (!event.relatedTarget || !document.documentElement.contains(event.relatedTarget as Node))
            ) {
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
    }, []);

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
        <DashboardProvider value={{
                sortOrder,
                setSortOrder,
                searchTerm,
                setSearchTerm,
                activeFilter,
                setActiveFilter,
                showSearchForm,
                setShowSearchForm,
                refreshImages: async () => {
                    await refreshImages();
                },
                filteredImages,
                isLoading: isLoading || imagesLoading,
                totalNotifications,
            }}>
            <div className="flex h-screen bg-acbg overflow-hidden">
                <Sidebar /> 
                <div className="flex-1 flex flex-col">
                    <Header />
                    <main className=" bg-acbgbranco flex flex-col overflow-y-auto">
                        <GalleryHeader />
                        <CardGallery />
                    </main>
                </div>
                <MobileMenu />
            </div>
        </DashboardProvider>
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
