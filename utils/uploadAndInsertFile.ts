import { supabase } from './supabaseClient';

export const uploadAndInsertFile = async (file: File, onUploadProgress?: (progress: ProgressEvent) => void) => {
    try {
        const fileNameOriginal = file.name;
        const fileExtension = fileNameOriginal.split('.').pop() || 'jpg';
        const fileNameFinal = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileNameFinal, file, {
                cacheControl: '3600',
                upsert: false,
                onUploadProgress,
            } as any); // Type assertion to any

        if (uploadError) {
            console.error('Supabase Storage Upload Error:', uploadError);
            throw uploadError;
        }

        const imageUrl = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/images/${fileNameFinal}`;

        const { data: insertData, error: insertError } = await supabase.from('images').insert([
            {
                imageTitle: fileNameOriginal,
                image_url: imageUrl,
                user_id: 'a08255eb-5731-422e-80e6-80c317d4fcb1', // Replace with actual user ID retrieval
            },
        ]).select();

        if (insertError) {
            console.error('Supabase Images Insert Error:', insertError);
            // Consider rolling back the upload if the insert fails.  This requires more sophisticated error handling.
            await supabase.storage.from('images').remove([fileNameFinal]);
            throw insertError;
        }

        console.log("Data inserida com sucesso:", insertData);
        return insertData[0];
    } catch (error) {
        console.error('Error uploading and inserting file:', error);
        throw error;
    }
};
