'use client'

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/common/auth/AuthProvider';
import { usePins } from '@/hooks/usePins';
import { getPageDataSupabase } from '@/hooks/getDataSupabaseCommentPage';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useRealtimeComments } from '@/hooks/useRealtimeComments';
import { supabase } from '@/utils/supabaseClient';
import { handleImageClick as handleImageClickUtil } from '@/utils/handleImageClick';
import { changeCommentStatus, editComment, saveComment, deleteComment } from '@/utils/commentUtils';
import { authAnonymousComment } from '@/utils/authAnonymousComment';
import PageLoadingSpinner from '@/components/common/PageLoadingSpinner';
import PageImageNotFound from '@/components/common/PageImageNotFound';
import PageLayout from '@/components/comment/documents/CommentPageLayout';
import { PageProvider } from '@/contexts/PageContext';
import type { DocumentPage } from '@/types';


export default function Page() {
    const params = useParams();
    const documentId = params ? (params.id as string) : "";
    const { session } = useAuth();
    const imageRef = useRef<HTMLImageElement>(null);
    const [isPagesOpen, setIsPagesOpen] = useState(true);
    const { loading, pageData, pages, setPageData } = getPageDataSupabase(documentId);
    const [pendingClick, setPendingClick] = useState<{ x: number, y: number } | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentTitle, setCurrentTitle] = useState(pageData?.documents?.title ?? '');
    const [currentPageData, setCurrentPageData] = useState<DocumentPage | null>(null);

    useEffect(() => {
        if (pageData?.imageTitle) {
            setCurrentTitle(pageData.imageTitle);
        }
    }, [pageData]);

    useEffect(() => {
    if (!pageData?.id) return;

    let documentId: string | null = null;

    const fetchDocumentIdAndBindEvents = async () => {
        const { data, error } = await supabase
            .from('pages')
            .select('document_id')
            .eq('id', pageData.id)
            .single();

        if (error || !data) {
            console.error('❌ Erro ao obter document_id:', error);
            return;
        }

        documentId = data.document_id;

        const sendExitBeacon = () => {
            if (!documentId) return;
            const payload = JSON.stringify({
                documentId,
                timestamp: new Date().toISOString(),
            });
            const blob = new Blob([payload], { type: 'application/json' });
            const success = navigator.sendBeacon('/api/track-exit', blob);
        };

        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') sendExitBeacon();
        });

        window.addEventListener('pagehide', sendExitBeacon); // <- NOVO

        // Remoção
        return () => {
            window.removeEventListener('visibilitychange', sendExitBeacon);
            window.removeEventListener('pagehide', sendExitBeacon);
        };
    };

    fetchDocumentIdAndBindEvents();
}, [pageData?.id]);

    useEffect(() => {
    }, [pageData?.id ?? '', pageData, pages]);


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
    } = usePins(pageData?.id ?? '', session);

    useRealtimeComments(pageData?.id ?? '', loadComments);

    const setPins = (pinsOrUpdater: any) => {
        loadComments();
    };

    const setComments = (commentsOrUpdater: any) => {
        loadComments();
    };

    const CommentDeletePin = async (pinId: string) => {
        await deleteComment(
            pinId,
            pins,
            setPins,
            setComments,
            setEditingPinId,
            setRefreshKey,
            session
        );
    };

    useEscapeKey(editingPinId, setEditingPinId, pins, CommentDeletePin);

    const handleImageClickPin = async (xPercent: number, yPercent: number) => {
        await handleImageClickUtil(
            xPercent,
            yPercent,
            pageData?.id ?? '',
            pins,
            setPins,
            setComments,
            setEditingPinId,
            statusFilter,
            setStatusFilter,
            setPendingClick,
            setShowAuthPopup,
            editingPinId,
            null
        );
    };

    const CommentChangePin = (pinId: string, value: string) => {
        editComment(pinId, value, setComments);
    };

    const CommentSavePin = async (pinId: string) => {
        await saveComment(
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
        await changeCommentStatus(
            pinId,
            pins,
            setPins,
            session,
            loadComments
        );
    };

    const handlePageChange = async (newPageId: string) => {
        try {
            const { data: newPageData, error } = await supabase
                .from('pages')
                .select(`
              *,
              documents:documents!pages_document_id_fkey (
                id,
                title,
                created_at,
                user_id,
                last_acessed_at,
                status,
                url
              )
            `)
                .eq('id', newPageId)
                .single();

            if (error) {
                console.error('Erro ao buscar nova página:', error.message);
                return;
            }

            if (!newPageData) {
                console.warn('Nenhuma página encontrada com o ID fornecido.');
                return;
            }

            setPageData(newPageData);
        } catch (error) {
            console.error('Erro inesperado ao carregar nova página:', error);
        }
    };

    const handleTitleUpdate = async (newTitle: string) => {
        try {
            const { error } = await supabase
                .from('documents')
                .update({ title: newTitle })
                .eq('id', pageData?.documents?.id ?? '');

            if (error) {
                console.error('Erro ao atualizar o título do documento:', error);
                return;
            }

            setCurrentTitle(newTitle);
            setPageData((prev: any) => ({
                ...prev,
                documents: {
                    ...prev.documents,
                    title: newTitle
                }
            }));
        } catch (err) {
            console.error('Erro inesperado ao atualizar o título:', err);
        }
    };

    if (loading || !pageData) {
        return (
            <PageLoadingSpinner />
        );
    }

    const imageUrl = pageData.image_url

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

    const SiteAreaProps = {
        exibirImagem: imageUrl,
        imageTitle: currentTitle || 'Sem título',
        imageId: pageData?.id ?? '',
        pins: filteredPins,
        draggingPin: draggingPin,
        setDraggingPin: setDraggingPin,
        isDragging: isDragging,
        setIsDragging: setIsDragging,
        updatePinPosition: updatePinPosition,
        imageRef: imageRef,
        onTitleUpdate: handleTitleUpdate,
        onTogglePages: () => setIsPagesOpen(!isPagesOpen),
        isPagesOpen: isPagesOpen,
        session: session,
        loadComments: loadComments,
        pageId: pageData?.id ?? '',
    };

    const handleAuthSubmitAnonForm = async (name: string, email: string) => {
        await authAnonymousComment(name, email, pageData?.id ?? '', pins, setPins, setComments, setEditingPinId, statusFilter, setStatusFilter, pendingClick, setShowAuthPopup, handleImageClickPin);
    };

    return (
        <PageProvider value={{
            pageId: pageData?.id ?? '', pageData, pages, currentTitle, handleTitleUpdate, documentData: {
                id: pageData?.documents?.id ?? '',
                title: pageData?.documents?.title ?? '',
                created_at: pageData?.documents?.created_at ?? '',
                user_id: pageData?.documents?.user_id ?? '',
                last_acessed_at: pageData?.documents?.last_acessed_at ?? '',
                status: pageData?.documents?.status ?? '',
                type: pageData?.documents?.type ?? '',
                url: pageData?.documents?.url ?? '',
            },
            iframeUrl: '',
            setIframeUrl: () => {},
        }}>
            <PageLayout
                commentBarProps={commentBarProps}
                imageAreaProps={SiteAreaProps}
                isPagesOpen={isPagesOpen}
                showAuthPopup={showAuthPopup}
                setShowAuthPopup={setShowAuthPopup}
                handleAuthSubmitAnonForm={handleAuthSubmitAnonForm}
                handlePageChange={handlePageChange}
            />
        </PageProvider>
    );
}
