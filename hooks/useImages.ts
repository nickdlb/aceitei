'use client';

    import { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '@/components/AuthProvider';
    import { supabase } from '@/utils/supabaseClient';

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
    }

    export const useImages = () => {
        const [images, setImages] = useState<ProcessedDocument[]>([]);
        const [loading, setLoading] = useState(true);
        const { session } = useAuth();

        const refreshImages = useCallback(async () => {
            if (!session?.user?.id) return;

            try {
                setLoading(true);
                console.log('1. Starting to fetch documents...');

                // 1. Buscar documentos com suas primeiras páginas
                const { data: documents, error: documentsError } = await supabase
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

                console.log('2. Documents fetched:', documents);

                // 2. Processar os documentos e contar comentários
                const processedDocuments = documents?.map(doc => {
                    const firstPage = doc.pages[0];
                    if (!firstPage) return null;

                    // Contar comentários ativos e resolvidos
                    const comments = firstPage.comments || [];
                    const activeCount = comments.filter(comment => comment.status === 'ativo').length;
                    const resolvedCount = comments.filter(comment => comment.status === 'resolvido').length;

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
                        user_id: doc.user_id
                    };
                }).filter((doc): doc is ProcessedDocument => doc !== null);

                setImages(processedDocuments || []);
                console.log('3. Processed documents:', processedDocuments);
            } catch (error) {
                console.error('Error processing images:', error);
            } finally {
                setLoading(false);
                console.log('4. Loading set to false.');
            }
        }, [session?.user?.id]);

        useEffect(() => {
            refreshImages();
        }, [refreshImages]);

        return { images, loading, refreshImages };
    };
