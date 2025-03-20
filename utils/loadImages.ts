import { supabase } from './supabaseClient';
import { Page } from '@/types/DocumentProps';

export const loadImages = async (userId?: string): Promise<Page[]> => {
    try {
        let query = supabase
            .from('pages')
            .select(`
                id,
                image_url,
                imageTitle,
                page_number,
                created_at,
                document_id,
                user_id,
                documents:documents (
                    id,
                    title,
                    created_at,
                    user_id
                )
            `)
            .order('created_at', { ascending: false });

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching pages:', error);
            return [];
        }

        console.log('Dados carregados:', data);

        // Converter os dados para o formato correto
        const formattedData: Page[] = data?.map(item => ({
            id: item.id,
            document_id: item.document_id,
            image_url: item.image_url,
            page_number: item.page_number,
            imageTitle: item.imageTitle,
            created_at: item.created_at,
            user_id: item.user_id,
            documents: Array.isArray(item.documents) && item.documents[0]
                ? {
                    id: item.documents[0].id,
                    title: item.documents[0].title,
                    created_at: item.documents[0].created_at,
                    user_id: item.documents[0].user_id,
                }
                : undefined
        })) || [];

        return formattedData;
    } catch (error) {
        console.error('Error in loadImages:', error);
        return [];
    }
};
