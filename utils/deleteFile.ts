import { supabase } from './supabaseClient';

export const DeleteFile = async (id: string) => {
  try {
    console.log("Estou tentando deletar o ID", id)
    const { data: deleteData, error: insertError } = await supabase.from('images').delete().eq('id', id)

    if (insertError) {
      throw insertError;
    }

    console.log("Imagem Removida", deleteData);
    return deleteData;
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  } finally {
    window.location.reload()
  }
};
