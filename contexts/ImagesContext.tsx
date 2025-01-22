'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/AuthProvider';

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

    const refreshImages = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('documents')
                .select(`
                    id,
                    title,
                    created_at,
                    pages!inner (
                        id,
                        image_url,
                        imageTitle,
                        page_number,
                        document_id
                    )
                `)
                .eq('user_id', session.user.id)
                .eq('pages.page_number', 1)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const processedData = data?.map(doc => ({
                id: doc.id,
                document_id: doc.id,
                image_url: doc.pages[0].image_url,
                imageTitle: doc.pages[0].imageTitle,
                created_at: doc.created_at,
                page_id: doc.pages[0].id
            })) || [];

            setImages(processedData);
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id]);

    return (
        <ImagesContext.Provider value={{ images, loading, refreshImages }}>
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