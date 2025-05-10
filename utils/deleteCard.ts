import { supabase } from './supabaseClient';
import { toast } from 'sonner';

export const deleteCard = async (documentId: string, imageUrl?: string) => {

  try {
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('id')
      .eq('document_id', documentId);

    if (pagesError) throw pagesError;

    const pageIds = pages?.map(p => p.id) ?? [];

    if (pageIds.length > 0) {
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('id')
        .in('page_id', pageIds);

      if (commentsError) throw commentsError;

      const commentIds = comments?.map(c => c.id) ?? [];

      if (commentIds.length > 0) {
        const { error: reactionsError } = await supabase
          .from('comment_reactions')
          .delete()
          .in('comment_id', commentIds);
        if (reactionsError) throw reactionsError;
      }

      const { error: deleteCommentsError } = await supabase
        .from('comments')
        .delete()
        .in('page_id', pageIds);
      if (deleteCommentsError) throw deleteCommentsError;

      const { error: deletePagesError } = await supabase
        .from('pages')
        .delete()
        .eq('document_id', documentId);
      if (deletePagesError) throw deletePagesError;
    }

    const { error: deleteDocumentError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    if (deleteDocumentError) throw deleteDocumentError;

    if (imageUrl) {
      const imagePath = imageUrl.split('/').pop();
      if (imagePath) {
        const { error: storageError } = await supabase
          .storage
          .from('files')
          .remove([imagePath]);
        if (storageError) {
          console.warn('⚠️ Erro ao excluir imagem do storage:', storageError);
        }
      }
    }

    toast.success('Documento excluído com sucesso');
    return { success: true, message: 'Documento excluído com sucesso' };

  } catch (error: any) {
    console.error('❌ Erro ao excluir documento:', error);
    toast.error(error?.message || 'Erro desconhecido ao excluir documento');
    return {
      success: false,
      message: error?.message || 'Erro desconhecido ao excluir documento'
    };
  }
};
