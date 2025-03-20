import { supabase } from './supabaseClient';

export const insertFileSupa = async (file: File) => {
    const { data, error } = await supabase.from('images').insert([{
        image_irl: `${file}`,
        user_id: 'a08255eb-5731-422e-80e6-80c317d4fcb1',
        cacheControl: '3600',
    }]);
    if (error) {
        throw error;
    }

    return data;
}
