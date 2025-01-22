import { supabase } from './supabaseClient';
import { Page } from '@/types/Document';

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
                documents:document_id (
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

        return data || [];
    } catch (error) {
        console.error('Error in loadImages:', error);
        return [];
    }
};