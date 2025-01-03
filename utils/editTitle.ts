import { supabase } from './supabaseClient';

export const editTitle = async (id: string, title: string) => {
  const { data, error } = await supabase.from('images').update([{
    imageTitle: title,
  }]).eq('id', id);

if (error) {
  throw error;
}

return data
}
