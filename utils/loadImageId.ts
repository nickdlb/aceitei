import { supabase } from './supabaseClient';

export default async function loadImageId(id: string | string[] | undefined) {
    try {
        const { data: image, error } = await supabase
            .from('images')
            .select('image_url')
            .eq('id', id)
            .single();
            
        if (error) throw error;
        
        if (!image) throw new Error('Imagem não encontrada');
        
        return image.image_url;

    } catch (error) {
        console.error('Erro ao carregar imagem:', error);
        throw error;
    }
}
