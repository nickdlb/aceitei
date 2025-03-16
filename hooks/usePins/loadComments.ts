import { supabase } from '@/utils/supabaseClient';
import { Pin } from '@/types/Pin';

interface LoadCommentsResult {
    pins: Pin[];
    comments: { [key: string]: string };
}

export const loadComments = async (pageId: string, setPins: (pins: Pin[]) => void, setComments: (comments: { [key: string]: string }) => void): Promise<void> => {
    if (!pageId) return;

    try {
        const { data: commentsData, error: commentsError } = await supabase
            .from('comments')
            .select('*')
            .eq('page_id', pageId);

        if (commentsError) throw commentsError;

        if (!commentsData || commentsData.length === 0) {
            setPins([]);
            setComments({});
            return;
        }

        const commentIds = commentsData.map(comment => comment.id);

        const { data: reactionsData, error: reactionsError } = await supabase
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

        const pinsData = commentsData.map(comment => {
            const reactions = commentReactionsMap.get(comment.id) || [];
            return {
                id: comment.id,
                x: comment.pos_x,
                y: comment.pos_y,
                num: comment.pin_number,
                comment: comment.content || '',
                created_at: comment.created_at,
                status: comment.status || 'ativo',
                user_id: comment.user_id,
                page_id: comment.page_id,
                reactions: reactions
            };
        });

        setPins(pinsData);

        const commentState: { [key: string]: string } = {};
        commentsData.forEach(comment => {
            commentState[comment.id] = comment.content || '';
        });
        setComments(commentState);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
};
