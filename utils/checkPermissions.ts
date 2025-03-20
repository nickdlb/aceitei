import PinProps from '@/types/Pin';
import { supabase } from '@/utils/supabaseClient';

/**
 * Checks if the current user has permission to modify a pin
 * @param pin The pin to check permissions for
 * @param session The current user session
 * @returns Object with permission details
 */
export const checkPermissions = async (pin: PinProps, session: any) => {
    if (!session?.user?.id) {
        // Se não houver usuário na sessão, não tem permissão.
        return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
    }

    try {
        // 1. Busque o documento (página) no Supabase
        const { data: documentData, error: documentError } = await supabase
            .from('pages')
            .select('user_id')
            .eq('id', pin.page_id)  // Certifique-se que "id" é a chave primária da página
            .single();

        if (documentError) {
            console.error("Erro ao buscar o documento:", documentError);
            // Em vez de lançar o erro, apenas registramos e continuamos
            return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
        }

        const isDocumentOwner = documentData?.user_id === session.user.id;

        // 2. Busque o pin (comentário) no Supabase
        // Verificar se o pin existe antes de tentar buscá-lo
        if (!pin || !pin.id) {
            // Se o pin não existir, retornar permissões baseadas apenas na propriedade do documento
            return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
        }

        // Declarar a variável fora do bloco try para poder acessá-la depois
        let pinData: any = null;

        try {
            const { data, error: pinError } = await supabase
                .from('comments')
                .select('user_id')
                .eq('id', pin.id)
                .single();

            pinData = data;

            if (pinError) {
                // Se o erro for 'not found', significa que o pin foi excluído
                if (pinError.code === 'PGRST116') {
                    // Pin não encontrado (provavelmente foi excluído)
                    return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
                }

                console.error("Erro ao buscar o pin:", pinError);
                // Em vez de lançar o erro, apenas registramos e continuamos
                // Se o usuário for dono do documento, ele ainda tem permissão
                return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
            }
        } catch (error) {
            console.error("Erro inesperado ao buscar o pin:", error);
            return { isDocumentOwner, isCommentOwner: false, hasPermission: isDocumentOwner };
        }

        // Se chegamos aqui, temos os dados do pin
        const isCommentOwner = pinData?.user_id === session.user.id;

        // Se o usuário for dono do documento ou do comentário, ele tem permissão.
        const hasPermission = isDocumentOwner || isCommentOwner;

        return { isDocumentOwner, isCommentOwner, hasPermission };
    } catch (error) {
        // Captura qualquer outro erro não tratado
        console.error("Erro inesperado ao verificar permissões:", error);
        return { isDocumentOwner: false, isCommentOwner: false, hasPermission: false };
    }
};
