import { createSupabaseClient } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

export const checkReactionPermissions = async (
    reactionId: string,
    session: Session | null
): Promise<{ canDelete: boolean, reactionUserId?: string }> => {

    if (!session?.user?.id) {
        return { canDelete: false, reactionUserId: undefined };
    }

    try {

        const { data: reactionData, error: reactionError } = await createSupabaseClient
            .from('comment_reactions')
            .select('user_id, comment_id')
            .eq('id', reactionId)
            .single();

        if (!reactionData?.user_id || !reactionData?.comment_id) {
            console.error('Dados incompletos da reação:', reactionData);
            return { canDelete: false, reactionUserId: undefined };
        }

        if (reactionError) {
            console.error('Erro ao buscar reação:', reactionError);
            return { canDelete: false, reactionUserId: undefined };
        }

        const isReactionOwner = reactionData.user_id === session.user.id;

        if (typeof reactionData.user_id !== 'string' || typeof session.user.id !== 'string') {
            console.error('Tipos inválidos para user IDs:', {
                reactionUserId: typeof reactionData.user_id,
                sessionUserId: typeof session.user.id
            });
            return { canDelete: false };
        }

        const canDelete = reactionData.user_id.toString() === session.user.id.toString();
        return { canDelete, reactionUserId: reactionData.user_id };
    } catch (error) {
        console.error('Erro inesperado ao verificar permissões:', error);
        return { canDelete: false, reactionUserId: undefined };
    }
};

export const deleteReaction = async (
    reactionId: string,
    session: Session | null,
    loadComments: () => Promise<void>
): Promise<void> => {
    try {

        console.log('[DEBUG] Tentando excluir reactionId:', reactionId);
        console.log('[DEBUG] Sessão do usuário:', session?.user?.id);

        const permissions = await checkReactionPermissions(reactionId, session);

        if (!permissions.canDelete) {
            console.error('Sem permissão para excluir. IDs comparados:', {
                reactionUserId: permissions.reactionUserId,
                sessionUserId: session?.user?.id
            });
            return;
        }

        const { error } = await createSupabaseClient
            .from('comment_reactions')
            .delete()
            .eq('id', reactionId);

        if (error) {
            console.error('Erro ao excluir resposta:', error);
            throw error;
        }

        await loadComments();
    } catch (error: any) {
        console.error('Erro ao excluir resposta:', error);
        alert(`Erro ao excluir resposta: ${error.message || 'Erro desconhecido'}`);
    }
};