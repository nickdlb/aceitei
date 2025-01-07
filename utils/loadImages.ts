import { supabase } from './supabaseClient';
import { Image } from '../types/Image';

export async function loadImages(): Promise<Image[]> {
    try {
        const { data, error } = await supabase
            .from('images')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching images:', error);
            // Handle the error appropriately (e.g., display an error message to the user)
            return []; // Return an empty array if there's an error
        }

        // Explicitly handle the case where data might be null or undefined
        return data ?? []; // Nullish coalescing operator: returns data if not null/undefined, otherwise returns []
    } catch (error) {
        console.error('Error fetching images:', error);
        // Handle the error appropriately (e.g., display an error message to the user)
        return []; // Return an empty array if there's an error
    }
}
