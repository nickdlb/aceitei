import { Pin } from '@/types/Pin';
import { supabase } from '@/utils/supabaseClient';

/**
 * Checks if the current user has permission to modify a pin
 * @param pin The pin to check permissions for
 * @param session The current user session
 * @returns Object with permission details
 */
export const checkPermissions = async (pin: Pin, session: any) => {
    if (!session?.user?.id) {
        // Se não houver usuário na sessão, não tem permissão.
        return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
    }

    // 1. Busque o documento (página) no Supabase
    const { data: documentData, error: documentError } = await supabase
        .from('pages')
        .select('user_id')
        .eq('id', pin.page_id)  // Certifique-se que "id" é a chave primária da página
        .single();

    if (documentError) {
        console.error("Erro ao buscar o documento:", documentError);
        throw documentError;
    }

    const isDocumentOwner = documentData?.user_id === session.user.id;

    // 2. Busque o pin (comentário) no Supabase
    const { data: pinData, error: pinError } = await supabase
        .from('comments')
        .select('user_id')
        .eq('id', pin.id)
        .single();

    if (pinError) {
        console.error("Erro ao buscar o pin:", pinError);
        throw pinError;
    }

    const isCommentOwner = pinData?.user_id === session.user.id;

    // Se o usuário for dono do documento ou do comentário, ele tem permissão.
    const hasPermission = isDocumentOwner || isCommentOwner;

    return { isDocumentOwner, isCommentOwner, hasPermission };
};
