import { supabase } from './supabaseClient';

export default async function loadPins(id: string | string[] | undefined) {
    try {
        const { data: pins, error } = await supabase
            .from('markers')
            .select('*')
            .order('created_at', { ascending: false })
            .eq('image_id', id);

        if (error) throw error;
        return pins || []; // Garante que sempre retorna um array

    } catch (error) {
        console.error('Erro ao carregar pins:', error);
        return []; // Retorna array vazio em caso de erro
    }
}
