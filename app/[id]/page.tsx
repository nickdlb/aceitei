'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from 'react';
import CommentBar from '@/components/comment/CommentBar';
import ImageArea from '@/components/comment/ImageArea';
import { useAuth } from '@/components/AuthProvider';
import { usePins } from '@/hooks/usePins';
import { supabase } from '@/utils/supabaseClient';
import { type Page as DocumentPage } from '@/types/Document';
import { getImageUrl } from '@/utils/imageUrl';
import ImageSidebar from '@/components/comment/ImageSidebar';
import AuthPopup from '@/components/auth/AuthPopup';

export default function Page() {
    const params = useParams();
    const pageId = typeof params?.id === 'string' ? params.id : '';
    const { session } = useAuth();
    const imageRef = useRef<HTMLImageElement>(null);
    const [isPagesOpen, setIsPagesOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState<DocumentPage | null>(null);
    const [pages, setPages] = useState<Array<{
        id: string;
        image_url: string;
        page_number: number;
    }>>([]);
    const router = useRouter();

    useEffect(() => {
        const loadPage = async () => {
            if (!pageId) return;

            try {
                // 1. Primeiro tentar buscar como documento
                const { data: document, error: documentError } = await supabase
                    .from('documents')
                    .select('id')
                    .eq('id', pageId)
                    .single();

                let targetPageId = pageId;

                // Se for um documento, buscar sua primeira página
                if (document) {
                    const { data: firstPage } = await supabase
                        .from('pages')
                        .select('id')
                        .eq('document_id', document.id)
                        .eq('page_number', 1)
                        .single();

                    if (firstPage) {
                        targetPageId = firstPage.id;
                    }
                }

                // 2. Buscar a página com seus dados do documento
                const { data: page, error: pageError } = await supabase
                    .from('pages')
                    .select(`
                        *,
                        documents!pages_document_id_fkey (
                            id,
                            title,
                            created_at,
                            user_id
                        )
                    `)
                    .eq('id', targetPageId)
                    .single();

                if (pageError) {
                    console.error('Error loading page:', pageError);
                    return;
                }

                if (!page) {
                    console.error('Page not found');
                    return;
                }

                // 3. Buscar todas as páginas do mesmo documento
                const { data: allPages, error: allPagesError } = await supabase
                    .from('pages')
                    .select('id, image_url, page_number')
                    .eq('document_id', page.document_id)
                    .order('page_number');

                if (allPagesError) {
                    console.error('Error loading all pages:', allPagesError);
                    return;
                }

                // 4. Se o ID original era de um documento, atualizar a URL para a página
                if (document && targetPageId !== pageId) {
                    router.replace(`/${targetPageId}`, { scroll: false });
                }

                setPages(allPages || []);
                setPageData({
                    ...page,
                    documents: page.documents
                });
                setLoading(false);
            } catch (error) {
                console.error('Error in loadPage:', error);
                setLoading(false);
            }
        };

        loadPage();
    }, [pageId, router]);

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
        handleImageClick,
        handleStatusChange,
        handleCommentChange,
        handleCommentSave,
        handleDeletePin,
        updatePinPosition,
        showAuthPopup,
        setShowAuthPopup,
        handleAuth
    } = usePins(pageId, session);

    const handlePageChange = async (newPageId: string) => {
        router.push(`/${newPageId}`, { scroll: false });
    };

    const handleTitleUpdate = async (newTitle: string) => {
        if (pageData) {
            setPageData({ ...pageData, imageTitle: newTitle });
        }
    };

    if (loading || !pageData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const imageUrl = getImageUrl(pageData.image_url);

    if (!imageUrl) {
        return <div className="flex h-screen items-center justify-center">Imagem não encontrada</div>;
    }

    const filteredPins = pins.filter(pin => pin.status === statusFilter);

    const commentBarProps = {
        pins: filteredPins,
        statusFilter: statusFilter,
        setStatusFilter: setStatusFilter,
        editingPinId: editingPinId,
        comments: comments,
        handleCommentChange: handleCommentChange,
        handleCommentSave: handleCommentSave,
        handleDeletePin: handleDeletePin,
        handleStatusChange: handleStatusChange,
        setEditingPinId: setEditingPinId,
        userNames: userNames,
        session: session
    };

    const imageAreaProps = {
        exibirImagem: imageUrl,
        imageTitle: pageData.imageTitle || 'Sem título',
        imageId: pageId,
        pins: filteredPins,
        handleImageClick: handleImageClick,
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

    return (
        <div className="w-full h-screen flex">
            <CommentBar {...commentBarProps} />
            <ImageArea {...imageAreaProps} />
            {pages.length > 1 && isPagesOpen && (
                <ImageSidebar
                    pages={pages}
                    currentPage={pageId}
                    onPageChange={handlePageChange}
                />
            )}
            <AuthPopup
                isOpen={showAuthPopup}
                onClose={() => setShowAuthPopup(false)}
                onSubmit={handleAuth}
            />
        </div>
    );
}
