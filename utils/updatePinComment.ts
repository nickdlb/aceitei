import { supabase } from './supabaseClient';

export const updatePinComment = async (pinId: string, comment: string) => {
  try {
    const { error } = await supabase
      .from('markers')
      .update({ comment })
      .eq('id', pinId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    throw error;
  }
};
