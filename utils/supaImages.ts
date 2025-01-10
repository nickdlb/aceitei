import { supabase } from './supabaseClient'

// Esta função é responsável única e exclusivamente por buscar dados no Supabase
// Retorna apenas id e marksNum para manter a query eficiente

export const fetchImages = async () => {
  const { data } = await supabase
      .from('images')
      .select('id, image_url, updated_at, marks_num') // Added marks_num
  return data;
};
