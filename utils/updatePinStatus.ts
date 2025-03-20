import { supabase } from './supabaseClient';

export const updatePinStatus = async (pinId: string, status: 'ativo' | 'resolvido') => {
    try {
        const { error } = await supabase
            .from('markers')
            .update({ status })
            .eq('id', pinId);

        if (error) throw error;
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
    }
};
