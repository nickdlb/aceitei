import { supabase } from '@/utils/supabaseClient';

export const loadPins = async (pageId: string) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('page_id', pageId);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error loading pins:', error);
        return null;
    }
};
