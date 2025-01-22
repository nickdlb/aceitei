import { supabase } from './supabaseClient';

export const deletePin = async (pinId: string) => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', pinId);

    if (error) throw error;
  } catch (error) {
    console.error('Erro ao deletar pin:', error);
    throw error;
  }
};
