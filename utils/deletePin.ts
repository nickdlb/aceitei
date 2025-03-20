import { supabase } from './supabaseClient';

export const deletePin = async (pinId: string): Promise<{ success: boolean, error?: any }> => {
    try {
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
