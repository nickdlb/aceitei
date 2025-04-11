import { createSupabaseClient } from './supabaseClient';

export const deleteCard = async (documentId: string, imageUrl?: string) => {
    try {

        const { data: pages, error: pagesError } = await createSupabaseClient
            .from('pages')
            .select('id')
            .eq('document_id', documentId);

        if (pagesError) throw pagesError;

        if (pages && pages.length > 0) {
            const pageIds = pages.map(page => page.id);

            const { data: comments, error: commentsFetchError } = await createSupabaseClient
                .from('comments')
                .select('id')
                .in('page_id', pageIds);

            if (commentsFetchError) throw commentsFetchError;

            if (comments && comments.length > 0) {
                const commentIds = comments.map(comment => comment.id);
                const { error: reactionsError } = await createSupabaseClient
                    .from('comment_reactions')
                    .delete()
                    .in('comment_id', commentIds);

                if (reactionsError) throw reactionsError;
            }

            const { error: commentsError } = await createSupabaseClient
                .from('comments')
                .delete()
                .in('page_id', pageIds);

            if (commentsError) throw commentsError;

            const { error: deletePageError } = await createSupabaseClient
                .from('pages')
                .delete()
                .eq('document_id', documentId);

            if (deletePageError) throw deletePageError;
        }

        const { error: documentError } = await createSupabaseClient
            .from('documents')
            .delete()
            .eq('id', documentId);

        if (documentError) throw documentError;

        if (imageUrl) {

            const imagePath = imageUrl.split('/').pop();
            if (imagePath) {
                const { error: storageError } = await createSupabaseClient
                    .storage
                    .from('images')
                    .remove([imagePath]);

                if (storageError) {
                    console.error('Erro ao excluir imagem do storage:', storageError);

                }
            }
        }

        return { success: true, message: 'Documento excluído com sucesso' };
    } catch (error: any) {
        console.error('Erro ao excluir documento:', error);
        return { success: false, message: error.message || 'Erro ao excluir documento' };
    }
};
