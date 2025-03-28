import PinProps from '@/types/PinProps';
import { createSupabaseClient } from '@/utils/supabaseClient';

export const CommentCheckPermissions = async (pin: PinProps, session: any) => {
    console.log('Checking permissions for pin:', pin, 'session:', session);
    if (!session?.user?.id) {
        console.log('No user ID in session, returning default permissions');
        return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
    }

    try {
        const { data: pageData, error: pageError } = await createSupabaseClient
            .from('pages')
            .select('user_id')
            .eq('id', pin.page_id)
            .single();

        if (pageError) {
            console.error('Error fetching page:', pageError);
            return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
        }

        const isDocumentOwner = pageData?.user_id === session.user.id;
        console.log('isDocumentOwner:', isDocumentOwner, 'pageData:', pageData, 'session.user.id:', session.user.id);

        if (!pin || !pin.id) {
            return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
        }

        const { data: commentData, error: commentError } = await createSupabaseClient
            .from('comments')
            .select('user_id')
            .eq('id', pin.id)
            .single();

        if (commentError) {
            if (commentError.code === 'PGRST116') {
                return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
            }
            console.error('Error fetching comment:', commentError);
            return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
        }

        const isCommentOwner = commentData?.user_id === session.user.id;
        console.log('isCommentOwner:', isCommentOwner, 'commentData:', commentData, 'session.user.id:', session.user.id);
        const hasPermission = isDocumentOwner || isCommentOwner;
        console.log('hasPermission:', hasPermission, 'isDocumentOwner:', isDocumentOwner, 'isCommentOwner:', isCommentOwner);

        return { isDocumentOwner, isCommentOwner, hasPermission };
    } catch (error) {
        console.error('Unexpected error checking permissions:', error);
        return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
    }
};
