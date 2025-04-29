'use client'

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/common/auth/AuthProvider';
import { usePins } from '@/hooks/usePins';
import { getPageDataSupabase } from '@/hooks/getDataSupabaseCommentPage';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useRealtimeComments } from '@/hooks/useRealtimeComments';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { getImageUrl } from '@/utils/getImageUrl';
import { handleImageClick as handleImageClickUtil } from '@/utils/handleImageClick';
import { changeCommentStatus, editComment, saveComment, deleteComment } from '@/utils/commentUtils';
import { authAnonymousComment } from '@/utils/authAnonymousComment';
import PageLoadingSpinner from '@/components/common/PageLoadingSpinner';
import PageImageNotFound from '@/components/common/PageImageNotFound';
import PageLayout from '@/components/comment/CommentPageLayout';
import { PageProvider } from '@/contexts/PageContext';
import type { DocumentPage } from '@/types';


export default function Page() { 
    const params = useParams();
    const documentId = params ? (params.id as string) : "";
    const { session } = useAuth();
    const imageRef = useRef<HTMLImageElement>(null);
    const [isPagesOpen, setIsPagesOpen] = useState(true);
    const { loading, pageData, pages, setPageData } = getPageDataSupabase(documentId);
    const router = useRouter();
    const [pendingClick, setPendingClick] = useState<{ x: number, y: number } | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentTitle, setCurrentTitle] = useState<string>('');
    const [currentPageData, setCurrentPageData] = useState<DocumentPage | null>(null);      

    useEffect(() => {
        if (pageData?.imageTitle) {
            setCurrentTitle(pageData.imageTitle);
        }
    }, [pageData]);

    useEffect(() => {
        if (!pageData?.id) return; 
        const updateDocumentLastAccessed = async () => {
            try {
                const { data: page, error: pageError } = await createSupabaseClient
                    .from('pages')
                    .select('document_id')
                    .eq('id', pageData?.id ?? '')
                    .single();

                if (pageError) {
                    console.error('Error fetching page data:', pageError);
                    return;
                }

                if (!page) {
                    console.error('Page not found');
                    return;
                }

                const documentId = page.document_id;
                const { error: documentError } = await createSupabaseClient
                    .from('documents')
                    .update({ last_acessed_at: new Date().toISOString() })
                    .eq('id', documentId);

                if (documentError) {
                    console.error('Error updating document last_accessed_at:', documentError);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        updateDocumentLastAccessed();
    }, [pageData?.id ?? '']);

    useEffect(() => {
        console.log('✅ pageData:', pageData);
        console.log('✅ pages:', pages);
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
            editingPinId
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
          const { data: newPageData, error } = await createSupabaseClient
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
        if (pageData) {
            try {
                const { error } = await createSupabaseClient
                    .from('pages')
                    .update({ imageTitle: newTitle })
                    .eq('id', pageData?.id ?? '');

                if (error) {
                    console.error('Erro ao atualizar o título:', error);

                    return;
                }

                setCurrentTitle(newTitle);

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
        imageTitle: currentTitle || 'Sem título',
        imageId: pageData?.id ?? '',
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
        await authAnonymousComment(name, email, pageData?.id ?? '', pins, setPins, setComments, setEditingPinId, statusFilter, setStatusFilter, pendingClick, setShowAuthPopup, handleImageClickUtil);
    };

    return (
        <PageProvider value={{pageId: pageData?.id ?? '',pageData,pages,currentTitle, handleTitleUpdate,  documentData: {
            id: pageData?.documents?.id ?? '',
            title: pageData?.documents?.title ?? '',
            created_at: pageData?.documents?.created_at ?? '',
            user_id: pageData?.documents?.user_id ?? '',
            last_acessed_at: pageData?.documents?.last_acessed_at ?? '',
            status: pageData?.documents?.status ?? '',
            type: pageData?.documents?.type ?? '',
            url: pageData?.documents?.url ?? '',
          }}}>
            <PageLayout
                commentBarProps={commentBarProps}
                imageAreaProps={imageAreaProps}
                isPagesOpen={isPagesOpen}
                showAuthPopup={showAuthPopup}
                setShowAuthPopup={setShowAuthPopup}
                handleAuthSubmitAnonForm={handleAuthSubmitAnonForm}
                handlePageChange={handlePageChange}
            />
        </PageProvider>
    );
}
