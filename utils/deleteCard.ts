import { supabase } from './supabaseClient';

/**
 * Deleta um card (documento) e todos os seus recursos associados no Supabase
 * @param documentId ID do documento a ser excluído
 * @param imageUrl URL da imagem associada ao documento (para exclusão do storage)
 * @returns Um objeto com status de sucesso e mensagem
 */
export const deleteCard = async (documentId: string, imageUrl?: string) => {
    try {
        // 1. Primeiro, buscar todas as páginas associadas ao documento
        const { data: pages, error: pagesError } = await supabase
            .from('pages')
            .select('id')
            .eq('document_id', documentId);

        if (pagesError) throw pagesError;

        // 2. Se houver páginas, buscar todos os comentários associados a essas páginas
        if (pages && pages.length > 0) {
            const pageIds = pages.map(page => page.id);
            
            // 3. Excluir todos os comentários associados às páginas
            const { error: commentsError } = await supabase
                .from('comments')
                .delete()
                .in('page_id', pageIds);

            if (commentsError) throw commentsError;
            
            // 4. Excluir todas as páginas associadas ao documento
            const { error: deletePageError } = await supabase
                .from('pages')
                .delete()
                .eq('document_id', documentId);

            if (deletePageError) throw deletePageError;
        }

        // 5. Excluir o documento
        const { error: documentError } = await supabase
            .from('documents')
            .delete()
            .eq('id', documentId);

        if (documentError) throw documentError;

        // 6. Se houver uma URL de imagem, excluir a imagem do storage
        if (imageUrl) {
            // Extrair o caminho da imagem da URL completa
            const imagePath = imageUrl.split('/').pop();
            if (imagePath) {
                const { error: storageError } = await supabase
                    .storage
                    .from('images')
                    .remove([imagePath]);

                if (storageError) {
                    console.error('Erro ao excluir imagem do storage:', storageError);
                    // Não interrompemos o fluxo se a exclusão da imagem falhar
                }
            }
        }

        return { success: true, message: 'Documento excluído com sucesso' };
    } catch (error: any) {
        console.error('Erro ao excluir documento:', error);
        return { success: false, message: error.message || 'Erro ao excluir documento' };
    }
};
