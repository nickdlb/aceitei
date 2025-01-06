import { supabase } from './supabaseClient';

    export const DeleteFile = async (id: string, deleteComments = false) => {
      try {
        console.log("Estou tentando deletar o ID", id)
        const { data: deleteData, error: insertError } = await supabase.from('images').delete().eq('id', id)

        if (insertError) {
          throw insertError;
        }

        if (deleteComments) {
          const { error: deleteCommentsError } = await supabase
            .from('markers')
            .delete()
            .eq('image_id', id);

          if (deleteCommentsError) {
            console.error("Erro ao deletar comentários:", deleteCommentsError);
            throw deleteCommentsError;
          }
          console.log("Comentários Removidos");
        }

        console.log("Imagem Removida", deleteData);
        return deleteData;
      } catch (error) {
        console.error("Erro:", error);
        throw error;
      }
    };
