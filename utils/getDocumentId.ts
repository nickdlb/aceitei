import { supabase } from '@/utils/supabaseClient';

export async function getDocumentId(pageId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('document_id')
      .eq('id', pageId)
      .single();

    if (error) {
      console.error('Error fetching document_id:', error);
      return null;
    }

    if (!data) {
      console.warn('Page not found for pageId:', pageId);
      return null;
    }

    console.log(data)
    return data.document_id;
  } catch (error) {
    console.error('Unexpected error in getDocumentId:', error);
    return null;
  }
}
