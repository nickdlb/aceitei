// page.tsx
'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { usePins } from '@/hooks/usePins';
import { usePageData } from '@/hooks/usePageData';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { supabase } from '@/utils/supabaseClient';
import { getImageUrl } from '@/utils/imageUrl';
import { handleImageClick as handleImageClickUtil } from '@/utils/handleImageClick';
import { handleStatusChange } from '@/utils/handleStatusChange';
import { handleCommentChange } from '@/utils/handleCommentChange';
import { handleCommentSave } from '@/utils/handleCommentSave';
import { handleDeletePin } from '@/utils/handleDeletePin';
import { handleAuth } from '@/utils/handleAuth';
import PageLoadingSpinner from '@/components/common/PageLoadingSpinner';
import PageImageNotFound from '@/components/common/PageImageNotFound';
import PageLayout from '@/components/layouts/PageLayout';

export default function Page() {
    const params = useParams();
    const pageId = params ? (params.id as string) : "";
    const { session } = useAuth();
    const imageRef = useRef<HTMLImageElement>(null);
    const [isPagesOpen, setIsPagesOpen] = useState(true);
    const { loading, pageData, pages } = usePageData(pageId);
    const router = useRouter();
    const [pendingClick, setPendingClick] = useState<{ x: number, y: number } | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

     const {
        pins,
        editingPinId,
        comments,
        statusFilter,
        draggingPin,
        isDragging,
        userNames,
        setStatusFilter,
        setEditingPinId,
        setDraggingPin,
        setIsDragging,
        updatePinPosition,
        showAuthPopup,
        setShowAuthPopup,
        loadComments,
        loadRepliesForPin
    } = usePins(pageId, session);

    // Define a local setPins function to update pins state
    const setPins = (pinsOrUpdater: any) => {
        // This is a simplified version since we don't have direct access to the setPins from usePins
        // In a real implementation, you might want to call loadComments() or another method
        // that refreshes the pins from the server
        loadComments();
    };

    // Define a local setComments function
    const setComments = (commentsOrUpdater: any) => {
        // Similar to setPins, this is a simplified version
        // In a real implementation, you might want to update the comments in usePins
        loadComments();
    };

   const handleDeletePinPin = async (pinId: string) => {
        await handleDeletePin(
            pinId,
            pins,
            setPins,
            setComments,
            setEditingPinId,
            setRefreshKey
        );
    };

    useEscapeKey(editingPinId, setEditingPinId, pins, handleDeletePinPin);

    const handleImageClickPin = async (xPercent: number, yPercent: number) => {
        await handleImageClickUtil(
            xPercent,
            yPercent,
            pageId,
            pins,
            setPins,
            setComments,
            setEditingPinId,
            statusFilter,
            setStatusFilter,
            setPendingClick,
            setShowAuthPopup,
            editingPinId
        );
    };

    // Create local implementations that call the utility functions
    const handleCommentChangePin = (pinId: string, value: string) => {
        handleCommentChange(pinId, value, setComments);
    };

    const handleCommentSavePin = async (pinId: string) => {
        await handleCommentSave(
            pinId,
            pins,
            comments,
            setPins,
            setEditingPinId,
            loadComments,
            setRefreshKey,
            session
        );
    };

    const handleStatusChangePin = async (pinId: string) => {
        await handleStatusChange(
            pinId,
            pins,
            setPins,
            session,
            loadComments
        );
    };

    const handlePageChange = async (newPageId: string) => {
        router.push(`/${newPageId}`, { scroll: false });
    };

    const handleTitleUpdate = async (newTitle: string) => {
        if (pageData) {
            try {
                const { error } = await supabase
                    .from('pages')
                    .update({ imageTitle: newTitle })
                    .eq('id', pageId);

                if (error) {
                    console.error('Erro ao atualizar o título:', error);
                    return;
                }
                // Use pageData and update it, checking for null
                if (pageData) {
                  pageData.imageTitle = newTitle;
                }

            } catch (error) {
                console.error('Erro na atualização do título:', error);
            }
        }
    };

   if (loading || !pageData) {
        return (
            <PageLoadingSpinner />
        );
    }

    const imageUrl = getImageUrl(pageData.image_url);

    if (!imageUrl) {
        return <PageImageNotFound />;
    }


    const filteredPins = pins.filter(pin => pin.status === statusFilter);

    const commentBarProps = {
        pins: filteredPins,
        statusFilter,
        setStatusFilter: (filter: 'ativo' | 'resolvido' | null) => {
            if (filter !== null) {
                setStatusFilter(filter);
            }
        },
        editingPinId,
        comments,
        handleCommentChange: handleCommentChangePin,
        handleCommentSave: handleCommentSavePin,
        handleDeletePin: handleDeletePinPin,
        handleStatusChange: handleStatusChangePin,
        setEditingPinId,
        userNames,
        session,
        loadComments,
        loadRepliesForPin,
        setShowAuthPopup
    };

    const imageAreaProps = {
        exibirImagem: imageUrl,
        imageTitle: pageData.imageTitle || 'Sem título',
        imageId: pageId,
        pins: filteredPins,
        handleImageClick: handleImageClickPin,
        draggingPin: draggingPin,
        setDraggingPin: setDraggingPin,
        isDragging: isDragging,
        setIsDragging: setIsDragging,
        updatePinPosition: updatePinPosition,
        imageRef: imageRef,
        onTitleUpdate: handleTitleUpdate,
        onTogglePages: () => setIsPagesOpen(!isPagesOpen),
        isPagesOpen: isPagesOpen
    };

    const handleAuthSubmitAnonForm = async (name: string, email: string) => {
        await handleAuth(name, email, pageId, pins, setPins, setComments, setEditingPinId, statusFilter, setStatusFilter, pendingClick, setShowAuthPopup, handleImageClickUtil);
    };

    return (
        <PageLayout
            commentBarProps={commentBarProps}
            imageAreaProps={imageAreaProps}
            pages={pages}
            pageId={pageId}
            isPagesOpen={isPagesOpen}
            showAuthPopup={showAuthPopup}
            setShowAuthPopup={setShowAuthPopup}
            handleAuthSubmitAnonForm={handleAuthSubmitAnonForm}
            handlePageChange={handlePageChange}
        />
    );
}
