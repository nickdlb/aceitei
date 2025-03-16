import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

/**
 * Handles submitting a reply to a comment
 */
export const handleReply = async (
    pinId: string,
    replyText: string,
    session: Session | null,
    setReplyText: (text: string) => void,
    setShowAuthPopup: (show: boolean) => void,
    loadComments: () => Promise<void>,
    setShowReplies: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
    if (!replyText.trim()) return;

    // Check if user is logged in
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
        
        // Load all comments
        await loadComments();
        
        // The open state of replies is now managed by the ref in CommentBar

    } catch (error: any) {
        console.error('Error adding reply:', error);
        alert(`Error adding reply: ${error.message || 'Unknown error'}`);
    }
};

/**
 * Toggles the visibility of replies for a specific pin
 */
export const toggleReplies = (
    pinId: string,
    setShowReplies: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
    setShowReplies(prev => ({
        ...prev,
        [pinId]: !prev[pinId]
    }));
};

/**
 * Handles keyboard events for reply input
 */
export const handleReplyKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    pinId: string,
    handleReplyCallback: (pinId: string) => Promise<void>
) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleReplyCallback(pinId);
    }
};