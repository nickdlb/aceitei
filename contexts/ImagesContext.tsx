'use client';

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/common/auth/AuthProvider';

interface ImagesContextType {
    images: any[];
    loading: boolean;
    refreshImages: () => Promise<void>;
}

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export function ImagesProvider({ children }: { children: React.ReactNode }) {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { session } = useAuth();
    const userId = useMemo(() => session?.user?.id, [session]);

    const refreshImages = useCallback(async () => {
        if (!userId) {
            setImages([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('documents')
                .select(`
                    id,
                    title,
                    created_at,
                    pages!pages_document_id_fkey (
                        id,
                        image_url,
                        imageTitle,
                        page_number,
                        document_id
                    )
                `)
                .eq('user_id', userId)
                .eq('pages.page_number', 1)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const processedData = (data ?? [])
                .filter(doc => doc.pages && doc.pages.length > 0)
                .map(doc => ({
                    id: doc.id,
                    document_id: doc.id,
                    image_url: doc.pages[0].image_url,
                    imageTitle: doc.pages[0].imageTitle,
                    created_at: doc.created_at,
                    page_id: doc.pages[0].id
                }));

            setImages(processedData);
        } catch (error: any) {
            console.error('Error loading images:', error.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        refreshImages();
    }, [refreshImages]);

    const contextValue = useMemo(() => ({
        images,
        loading,
        refreshImages
    }), [images, loading, refreshImages]);

    return (
        <ImagesContext.Provider value={contextValue}>
            {children}
        </ImagesContext.Provider>
    );
}

export function useImages() {
    const context = useContext(ImagesContext);
    if (context === undefined) {
        throw new Error('useImages must be used within a ImagesProvider');
    }
    return context;
}