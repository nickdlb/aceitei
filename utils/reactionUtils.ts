import { createSupabaseClient } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import { CommentReaction } from '@/types/PinProps';

/**
 * Verifica as permissões para excluir uma reação (resposta) a um comentário
 * @param reactionId ID da reação a ser verificada
 * @param session Sessão do usuário atual
 * @returns Objeto com permissão para excluir
 */
export const checkReactionPermissions = async (
    reactionId: string,
    session: Session | null
): Promise<{ canDelete: boolean }> => {
    // Se não houver usuário logado, não tem permissão
    if (!session?.user?.id) {
        return { canDelete: false };
    }

    try {
        // Buscar informações da reação
        const { data: reactionData, error: reactionError } = await createSupabaseClient
            .from('comment_reactions')
            .select('user_id, comment_id')
            .eq('id', reactionId)
            .single();

        // Verificar dados básicos da reação
        if (!reactionData?.user_id || !reactionData?.comment_id) {
            console.error('Dados incompletos da reação:', reactionData);
            return { canDelete: false };
        }

        if (reactionError) {
            console.error('Erro ao buscar reação:', reactionError);
            return { canDelete: false };
        }

        // Verificar se o usuário é o autor da reação
        const isReactionOwner = reactionData.user_id === session.user.id;

        // Verificar consistência dos IDs
        if (typeof reactionData.user_id !== 'string' || typeof session.user.id !== 'string') {
            console.error('Tipos inválidos para user IDs:', {
                reactionUserId: typeof reactionData.user_id,
                sessionUserId: typeof session.user.id
            });
            return { canDelete: false };
        }

        // Comparação segura com coerção explícita
        const canDelete = reactionData.user_id.toString() === session.user.id.toString();
        return { canDelete };
    } catch (error) {
        console.error('Erro inesperado ao verificar permissões:', error);
        return { canDelete: false };
    }
};

/**
 * Exclui uma reação (resposta) a um comentário
 * @param reactionId ID da reação a ser excluída
 * @param session Sessão do usuário atual
 * @param loadComments Função para recarregar os comentários após a exclusão
 */
export const deleteReaction = async (
    reactionId: string,
    session: Session | null,
    loadComments: () => Promise<void>
): Promise<void> => {
    try {
        // Verificar permissões
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

        // Excluir a reação
        const { error } = await createSupabaseClient
            .from('comment_reactions')
            .delete()
            .eq('id', reactionId);

        if (error) {
            console.error('Erro ao excluir resposta:', error);
            throw error;
        }

        // Recarregar comentários
        await loadComments();
    } catch (error: any) {
        console.error('Erro ao excluir resposta:', error);
        alert(`Erro ao excluir resposta: ${error.message || 'Erro desconhecido'}`);
    }
};