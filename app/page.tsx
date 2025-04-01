'use client';

import { useState, useCallback, useEffect } from 'react';
import { ImagesProvider } from '@/contexts/ImagesContext';
import Sidebar from '@/components/sidebar/Sidebar';
import Header from '@/components/dashboard/DashboardHeader';
import ImageGallery from '@/components/dashboard/CardGallery';
import RightSidebar from '@/components/sidebar/RightSidebar';
import { useImages } from '@/hooks/useImages';
import { deleteCard } from '@/utils/deleteCard';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { useAuthChecker } from '@/utils/useAuthChecker';
import { useRouter } from 'next/navigation';

const AppContent = () => {
    // Use the updated hook
    const { isLoading: authIsLoading, isAuthenticated, shouldRedirect } = useAuthChecker();
    const router = useRouter(); // Initialize router
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [initialWidthSet, setInitialWidthSet] = useState(false);
    const [draggedOverSidebar, setDraggedOverSidebar] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false); // State for upload dialog
    const { images, loading: imagesLoading, refreshImages, totalNotifications } = useImages(sortOrder);

    const filteredImages = images.filter(image =>
        image.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handleUploadComplete = useCallback(async (data: any) => {
        try {
            if (refreshImages) {
                await refreshImages(); // Ensure refresh completes if async
            }
            setIsUploadDialogOpen(false); // Close the dialog
        } catch (error) {
            console.error("Error updating images:", error);
            // Optionally keep the dialog open on error or show an error message
        }
    }, [refreshImages]);

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

    // Perform redirect if the hook indicates it's needed
    useEffect(() => {
        console.log(`[app/page.tsx Effect] authIsLoading: ${authIsLoading}, shouldRedirect: ${shouldRedirect}`);
        if (!authIsLoading && shouldRedirect) {
            console.log('[app/page.tsx] Triggering replace redirect to /login');
            router.replace('/login'); // Use replace instead of push
        }
        // Depend on shouldRedirect to trigger effect when redirect status changes
    }, [authIsLoading, shouldRedirect, router]);

    if (authIsLoading) {
        console.log('[app/page.tsx] Rendering Loading state');
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    // Render redirecting message if redirect is needed or not authenticated
    if (shouldRedirect || !isAuthenticated) {
        console.log(`[app/page.tsx] Rendering Redirecting state (shouldRedirect: ${shouldRedirect}, isAuthenticated: ${isAuthenticated})`);
        return <div className="flex h-screen items-center justify-center">Redirecting...</div>; // Or null
    }

    console.log('[app/page.tsx] Rendering main content');
    // Render content only if authenticated and no redirect needed
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
                    totalNotifications={totalNotifications}
                />
                <main className="p-6 flex-1 overflow-y-auto h-[calc(100vh - 65px)] pb-30">
                    <ImageGallery
                        isLoading={isLoading || imagesLoading}
                        images={filteredImages}
                        handleCardDelete={handleCardDeleteWrapper}
                    />
                </main>
            </div>
            {/* Upload Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                    <button className="absolute flex px-3 py-2 right-8 bottom-4 bg-acazul rounded-2xl text-acbrancohover hover:bg-acbrancohover hover:text-acazul">
                        <Plus className="mr-1" /> Adicionar Card
                    </button>
                </DialogTrigger>
                <DialogContent className='!bg-acbgpreto border-none'>
                    <DialogTitle className='sr-only'>Popup Upload Card</DialogTitle>
                    {/* Pass handleUploadComplete to RightSidebar */}
                    <RightSidebar onUploadComplete={handleUploadComplete} />
                </DialogContent>
            </Dialog>
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
