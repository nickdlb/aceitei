import { supabase } from './supabaseClient'

// Esta função é responsável única e exclusivamente por buscar dados no Supabase
// Retorna apenas id e marksNum para manter a query eficiente

export const fetchImages = async () => {
  const { data } = await supabase
    .from('images')        // nome da sua tabela
    .select('id, image_url, updated_at') // seleciona apenas as colunas necessárias
  return data              // retorna array de objetos: [{id: 1, marksNum: 10}, ...]
}
