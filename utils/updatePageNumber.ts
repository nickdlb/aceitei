import { supabase } from './supabaseClient';

export const updatePageNumber = async (pages: any[]) => {
  try {
    const hasPageOne = pages.some(p => p.page_number === 1);
    const allUnique = new Set(pages.map(p => p.page_number)).size === pages.length;

    if (!hasPageOne || !allUnique) {
      console.warn('Abortando updatePageNumber: valores inconsistentes.');
      return;
    }

    // Atualiza um por um (ou use upsert para otimizar)
    for (const page of pages) {
      const { error } = await supabase
        .from('pages')
        .update({ page_number: page.page_number })
        .eq('id', page.id);

      if (error) {
        console.error(`Erro ao atualizar page ${page.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Erro geral em updatePageNumber:', error);
  }
};
