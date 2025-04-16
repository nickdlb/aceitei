'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/common/auth/AuthProvider';
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
    type: 'imagem' | 'site'; // Add type property
}

export const useImages = (sortOrder: string) => {
    const [images, setImages] = useState<ProcessedDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalNotifications, setTotalNotifications] = useState(0);
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

            // 1. Fetch basic documents
            const { data: basicDocuments, error: documentsError } = await createSupabaseClient
                .from('documents')
                .select('id, title, created_at, user_id, type')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (documentsError) {
                console.error('Error fetching basic documents:', documentsError);
                setImages([]); // Clear images on error
                setTotalNotifications(0);
                return;
            }

            if (!basicDocuments) {
                setImages([]);
                setTotalNotifications(0);
                return;
            }

            // 2. Fetch related data and combine
            const processedDocumentsPromises = basicDocuments.map(async (doc) => {
                // Fetch first page
                const { data: pageData, error: pageError } = await createSupabaseClient
                    .from('pages')
                    .select('id, image_url, imageTitle')
                    .eq('document_id', doc.id)
                    .eq('page_number', 1)
                    .single(); // Assuming only one page with page_number 1 per document

                if (pageError || !pageData) {
                    console.warn(`Error or no page found for document ${doc.id}:`, pageError);
                    // Decide how to handle this - maybe return null or a default structure
                    return null;
                }

                // Fetch comment counts for the page
                const { data: commentsData, error: commentsError, count: commentCount } = await createSupabaseClient
                    .from('comments')
                    .select('status', { count: 'exact', head: true }) // Use head:true for count only
                    .eq('page_id', pageData.id);

                let activeCount = 0;
                let resolvedCount = 0;
                if (!commentsError && commentCount !== null) {
                     // Need separate queries for counts by status if head:true doesn't work as expected
                     const { count: activeC, error: activeE } = await createSupabaseClient
                        .from('comments')
                        .select('*', { count: 'exact', head: true })
                        .eq('page_id', pageData.id)
                        .eq('status', 'ativo');
                     activeCount = activeE ? 0 : activeC ?? 0;

                     const { count: resolvedC, error: resolvedE } = await createSupabaseClient
                        .from('comments')
                        .select('*', { count: 'exact', head: true })
                        .eq('page_id', pageData.id)
                        .eq('status', 'resolvido');
                     resolvedCount = resolvedE ? 0 : resolvedC ?? 0;
                } else if (commentsError) {
                    console.warn(`Error fetching comment counts for page ${pageData.id}:`, commentsError);
                }


                // Get new comment count
                const newCommentCount = await getNewCommentCount(doc.id);

                return {
                    id: doc.id,
                    document_id: doc.id,
                    image_url: pageData.image_url,
                    imageTitle: pageData.imageTitle || doc.title || 'Sem título',
                    created_at: doc.created_at,
                    page_id: pageData.id,
                    active_comments: activeCount,
                    resolved_comments: resolvedCount,
                    title: doc.title,
                    user_id: doc.user_id,
                    notifications: newCommentCount,
                    type: doc.type
                };
            });

            const resolvedDocuments = await Promise.all(processedDocumentsPromises);
            const validProcessedDocuments = resolvedDocuments.filter((doc): doc is ProcessedDocument => doc !== null);

            const total = validProcessedDocuments.reduce((sum, doc) => sum + doc.notifications, 0);
            setTotalNotifications(total);

            let sortedDocuments = [...validProcessedDocuments]; // Use the correctly processed documents

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

    return { images, loading, refreshImages, totalNotifications };
};
