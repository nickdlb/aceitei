import { createSupabaseClient } from '@/utils/supabaseClient';

/**
 * Updates the last_accessed_at timestamp for a page if the user is the owner
 * @param pageId The ID of the page being accessed
 * @param session The current user session
 * @returns Promise resolving to boolean indicating success
 */
export const updatePageLastAccessed = async (pageId: string, session: any): Promise<boolean> => {
    // If no session exists, return false
    if (!session?.user?.id) {
        return false;
    }

    try {
        // Directly check if the user is the page owner
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

        // Update the last_accessed_at timestamp
        const { error } = await createSupabaseClient
            .from('pages')
            .update({
                last_accessed_at: new Date().toISOString()
            })
            .eq('id', pageId);

        // If there's an error during update, return false
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
