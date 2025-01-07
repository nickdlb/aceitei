import { supabase } from './supabaseClient';
import { Image } from '../types/Image';

function isImage(obj: any): obj is Image {
    return obj &&
           typeof obj.id === 'string' &&
           typeof obj.image_url === 'string' &&
           typeof obj.imageTitle === 'string' &&
           typeof obj.status === 'string' &&
           typeof obj.created_at === 'string' &&
           (obj.marks_num === undefined || typeof obj.marks_num === 'number');
           // Add checks for all other properties in your Image interface
}

export async function loadImages(): Promise<Image[]> {
    try {
        const { data, error } = await supabase
            .from('images')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching images:', error);
            return [];
        }

        // Robust type checking:
        const validImages = data ? data.filter(isImage) : [];
        return validImages;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}
