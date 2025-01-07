import { supabase } from './supabaseClient';
import { Image } from '../types/Image'; // Import the Image interface


export async function loadImages(): Promise<Image[]> {
    try {
        const { data: images, error } = await supabase
            .from('images')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao carregar imagens:', error);
            alert('Erro ao carregar imagens. Por favor, tente novamente.');
            return []; // Return an empty array on error
        }

        // Handle potential null or undefined data
        return images || []; 
    } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        alert('Erro ao carregar imagens. Por favor, tente novamente.');
        return []; // Return an empty array on error
    }
}
