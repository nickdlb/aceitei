// page.tsx
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
    const pageId = params.id as string;
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
    const [showAuthPopup, setShowAuthPopup] = useState(false);

    console.log('ID da página:', pageId);

    useEffect(() => {
        const loadPage = async () => {
            if (!pageId) return;

            try {
                const { data: document } = await supabase
                    .from('documents')
                    .select('id')
                    .eq('id', pageId)
                    .single();

                let targetPageId = pageId;

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

                const { data: page } = await supabase
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

                if (!page) {
                    console.error('Page not found');
                    return;
                }

                const { data: allPages } = await supabase
                    .from('pages')
                    .select('id, image_url, page_number')
                    .eq('document_id', page.document_id)
                    .order('page_number');

                if (document && targetPageId !== pageId) {
                    router.replace(`/${targetPageId}`, { scroll: false });
                }

                setPages(allPages || []);
                setPageData(page);
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
        handleAuth,
        loadComments
    } = usePins(pageId, session);

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

                setPageData({ ...pageData, imageTitle: newTitle });
            } catch (error) {
                console.error('Erro na atualização do título:', error);
            }
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
        statusFilter,
        setStatusFilter,
        editingPinId,
        comments,
        handleCommentChange,
        handleCommentSave,
        handleDeletePin,
        handleStatusChange,
        setEditingPinId,
        userNames,
        session,
        loadComments,
        setShowAuthPopup
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
            {/* Sidebar de Comentários */}
            <div className="w-96 flex-shrink-0 bg-gray-100 border-r border-gray-300"> {/* Mantém a largura fixa aqui */}
                <CommentBar {...commentBarProps} />
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex">
                <ImageArea {...imageAreaProps} />
                {pages.length > 1 && isPagesOpen && (
                    <ImageSidebar
                        pages={pages}
                        currentPage={pageId}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {showAuthPopup && (
                <AuthPopup
                    isOpen={showAuthPopup}
                    onClose={() => setShowAuthPopup(false)}
                    onSubmit={handleAuth}
                />
            )}
        </div>
    );
}