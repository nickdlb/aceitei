import { createSupabaseClient } from '@/utils/supabaseClient';

export const updatePageLastAccessed = async (pageId: string, session: any): Promise<boolean> => {

    if (!session?.user?.id) {
        return false;
    }

    try {

        const { data: pageData, error: pageError } = await createSupabaseClient
            .from('pages')
            .select('user_id')
            .eq('id', pageId)
            .single();

        if (pageError) {
            console.error('Error fetching page data:', pageError);
            return false;
        }

        if (pageData?.user_id !== session.user.id) {
            return false;
        }

        const { error } = await createSupabaseClient
            .from('pages')
            .update({
                last_accessed_at: new Date().toISOString()
            })
            .eq('id', pageId);

        if (error) {
            console.error('Error updating last_accessed_at:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Unexpected error in updatePageLastAccessed:', error);
        return false;
    }
};
