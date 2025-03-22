import { supabase } from '@/utils/supabaseClient';
import { checkPermissions } from '@/utils/checkPermissions';
import PinProps from '@/types/PinProps';

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
        // First, check if the user is the page owner
        const pinDummy: PinProps = {
            id: 'dummy-pin-id',
            x: 0,
            y: 0,
            num: 0,
            comment: '',
            created_at: new Date().toISOString(),
            status: 'ativo',
            user_id: session.user.id,
            page_id: pageId
        };
        const { isDocumentOwner } = await checkPermissions(pinDummy, session);

        // If not the page owner, return false
        if (!isDocumentOwner) {
            return false;
        }

        // Update the last_accessed_at timestamp
        const { error } = await supabase
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
