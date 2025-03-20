import { supabase } from './supabaseClient';

export const deletePin = async (pinId: string): Promise<{ success: boolean, error?: any }> => {
    try {
        // First, delete related records from comment_reactions
        const { error: reactionsError } = await supabase
            .from('comment_reactions')
            .delete()
            .eq('comment_id', pinId);

        if (reactionsError) {
            console.error('Erro ao deletar reações do comentário:', reactionsError);
            return { success: false, error: reactionsError };
        }

        // Then, delete the comment itself
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', pinId);

        if (error) {
            console.error('Erro ao deletar pin:', error);
            return { success: false, error };
        }
        
        return { success: true };
    } catch (error) {
        console.error('Erro inesperado ao deletar pin:', error);
        return { success: false, error };
    }
};
