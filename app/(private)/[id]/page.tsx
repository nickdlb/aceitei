'use client'

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePins } from '@/hooks/usePins';
import { usePageData } from '@/hooks/usePageData';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useRealtimeComments } from '@/hooks/useRealtimeComments';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { getImageUrl } from '@/utils/getImageUrl';
import { handleImageClick as handleImageClickUtil } from '@/utils/handleImageClick';
import { CommentStatusChangeUtil, CommentEditUtil, CommentSaveUtil, CommentDeleteUtil } from '@/utils/commentUtils';
import { anonymousCommentAuth } from '@/utils/anonymousCommentAuth';
import { updatePageLastAccessed } from '@/utils/updatePageLastAccessed';
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

    useEffect(() => {
        const updateLastAccessed = async () => {
            if (pageData && session) {
                await updatePageLastAccessed(pageId, session);
            }
        };

        updateLastAccessed();
    }, [pageId, pageData, session]);

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

    useRealtimeComments(pageId, loadComments);

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

    const CommentDeletePin = async (pinId: string) => {
        await CommentDeleteUtil(
            pinId,
            pins,
            setPins,
            setComments,
            setEditingPinId,
            setRefreshKey
        );
    };

    useEscapeKey(editingPinId, setEditingPinId, pins, CommentDeletePin);

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
    const CommentChangePin = (pinId: string, value: string) => {
        CommentEditUtil(pinId, value, setComments);
    };

    const CommentSavePin = async (pinId: string) => {
        await CommentSaveUtil(
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

    const CommentStatusChangePin = async (pinId: string) => {
        await CommentStatusChangeUtil(
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
                const { error } = await createSupabaseClient
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
        CommentChange: CommentChangePin,
        CommentSave: CommentSavePin,
        CommentDelete: CommentDeletePin,
        CommentStatusChange: CommentStatusChangePin,
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
        await anonymousCommentAuth(name, email, pageId, pins, setPins, setComments, setEditingPinId, statusFilter, setStatusFilter, pendingClick, setShowAuthPopup, handleImageClickUtil);
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
