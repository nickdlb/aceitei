import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export const createReply = async (
    pinId: string,
    replyText: string,
    session: Session | null,
    setReplyText: (text: string) => void,
    setShowAuthPopup: (show: boolean) => void,
    loadComments: () => Promise<void>,
    setShowReplies: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
    if (!replyText.trim()) return;

    if (!session?.user?.id) {
        setShowAuthPopup(true);
        return;
    }

    try {
        const { error } = await supabase
            .from('comment_reactions')
            .insert({
                comment_id: pinId,
                user_id: session.user.id,
                reaction_type: replyText,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Detailed error:', error);
            throw error;
        }
        setReplyText('');

        await loadComments();

    } catch (error: any) {
        console.error('Error adding reply:', error);
        alert(`Error adding reply: ${error.message || 'Unknown error'}`);
    }
};

export const replyToggle = (
    pinId: string,
    setShowReplies: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
    setShowReplies(prev => ({
        ...prev,
        [pinId]: !prev[pinId]
    }));
};

export const replyKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    pinId: string,
    handleReplyCallback: (pinId: string) => Promise<void>
) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleReplyCallback(pinId);
    }
};
