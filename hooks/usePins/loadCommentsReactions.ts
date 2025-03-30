import { createSupabaseClient } from '@/utils/supabaseClient';

export const loadCommentsReactions = async (commentIds: string[]) => {
    try {
        const { data: reactionsData, error: reactionsError } = await createSupabaseClient
            .from('comment_reactions')
            .select('*')
            .in('comment_id', commentIds);

        if (reactionsError) throw reactionsError;

        const commentReactionsMap = new Map();

        if (reactionsData) {
            reactionsData.forEach(reaction => {
                if (!commentReactionsMap.has(reaction.comment_id)) {
                    commentReactionsMap.set(reaction.comment_id, []);
                }
                commentReactionsMap.get(reaction.comment_id).push(reaction);
            });
        }

        return commentReactionsMap;
    } catch (error) {
        console.error('Error loading comment reactions:', error);
        return new Map();
    }
};
