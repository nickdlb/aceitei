import { supabase } from './supabaseClient';

export const insertPin = async (
  pageId: string,
  xPercent: number,
  yPercent: number,
  pinNumber: number,
  content: string,
  userId: string
) => {
  try {
    // Verificar se a página existe
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id')
      .eq('id', pageId)
      .single();

    if (pageError || !page) {
      throw new Error('Página não encontrada');
    }

    // Inserir o comentário
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          page_id: pageId,
          pos_x: xPercent,
          pos_y: yPercent,
          pin_number: pinNumber,
          content: content,
          user_id: userId,
          status: 'ativo'
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Erro ao inserir pin:", error.message);
    throw error;
  }
};
