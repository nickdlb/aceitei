'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { createSupabaseClient } from '@/utils/supabaseClient';

interface ProcessedDocument {
    id: string;
    document_id: string;
    image_url: string;
    imageTitle: string;
    created_at: string;
    page_id: string;
    active_comments: number;
    resolved_comments: number;
    title: string;
    user_id: string;
    notifications: number;
}

export const useImages = (sortOrder: string) => {
    const [images, setImages] = useState<ProcessedDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const { session } = useAuth();

    const getNewCommentCount = useCallback(async (documentId: string) => {
        try {
            const { data: documentData, error: documentError } = await createSupabaseClient
                .from('documents')
                .select('last_acessed_at')
                .eq('id', documentId)
                .single();

            if (documentError) {
                console.error('Error fetching document:', documentError);
                return 0;
            }

            if (!documentData) {
                console.warn('Document not found with id:', documentId);
                return 0;
            }

            const lastAccessedAt = documentData.last_acessed_at || '1970-01-01T00:00:00Z';

            const { data: commentsData, error: commentsError } = await createSupabaseClient
                .from('comments')
                .select('*', { count: 'exact' })
                .eq('document_id', documentId)
                .gt('created_at', lastAccessedAt);

            if (commentsError) {
                console.error('Error fetching comments:', commentsError);
                return 0;
            }

            const newCommentCount = commentsData ? commentsData.length : 0;
            console.log(`New comments for document ${documentId}: ${newCommentCount}`);
            return newCommentCount;

        } catch (error) {
            console.error('Error getting new comment count:', error);
            return 0;
        }
    }, []);

    const refreshImages = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            setLoading(true);

            const { data: documents, error: documentsError } = await createSupabaseClient
                .from('documents')
                .select(`
                    id,
                    title,
                    created_at,
                    user_id,
                    pages!pages_document_id_fkey (
                        id,
                        image_url,
                        imageTitle,
                        page_number,
                        comments!comments_page_id_fkey (
                            status
                        )
                    )
                `)
                .eq('user_id', session.user.id)
                .eq('pages.page_number', 1)
                .order('created_at', { ascending: false });

            if (documentsError) {
                console.error('Error fetching documents:', documentsError);
                return;
            }

            const documentsWithNewComments = await Promise.all(documents?.map(async doc => {
                const firstPage = doc.pages[0];
                if (!firstPage) return null;

                const comments = firstPage.comments || [];
                const activeCount = comments.filter(comment => comment.status === 'ativo').length;
                const resolvedCount = comments.filter(comment => comment.status === 'resolvido').length;
                const newCommentCount = await getNewCommentCount(doc.id);

                return {
                    id: doc.id,
                    document_id: doc.id,
                    image_url: firstPage.image_url,
                    imageTitle: firstPage.imageTitle || doc.title || 'Sem título',
                    created_at: doc.created_at,
                    page_id: firstPage.id,
                    active_comments: activeCount,
                    resolved_comments: resolvedCount,
                    title: doc.title,
                    user_id: doc.user_id,
                    notifications: newCommentCount
                };
            }));

            const processedDocuments = documentsWithNewComments?.filter((doc): doc is ProcessedDocument => doc !== null) ?? [];

            let sortedDocuments = [...processedDocuments];

            switch (sortOrder) {
                case 'title':
                    sortedDocuments.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'date':
                default:
                    sortedDocuments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                    break;
            }

            setImages(sortedDocuments || []);
        } catch (error) {
            console.error('Error processing images:', error);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id, sortOrder, getNewCommentCount]);

    useEffect(() => {
        refreshImages();
    }, [refreshImages]);

    return { images, loading, refreshImages };
};
