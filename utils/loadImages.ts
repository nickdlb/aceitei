import { supabase } from './supabaseClient';

export async function loadImages() {
    try {
        const { data: images, error } = await supabase
            .from('images')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return images;

    } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        alert('Erro ao carregar imagens. Por favor, tente novamente.');
    }
}
