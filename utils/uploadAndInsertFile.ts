import { supabase } from './supabaseClient';

    export const uploadAndInsertFile = async (file: File, userId: string, onUploadProgress?: (progress: number) => void) => {
        try {
            const fileNameOriginal = file.name;
            const fileExtension = fileNameOriginal.split('.').pop() || 'jpg';
            const fileNameFinal = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;

            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileNameFinal}`; // Supabase REST API endpoint

            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('PUT', url, true); // Use PUT for uploads
                xhr.setRequestHeader('Authorization', `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`); // Add auth token
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const progress = Math.round((e.loaded / e.total) * 100);
                        onUploadProgress && onUploadProgress(progress); // Call the callback if provided
                    }
                };
                xhr.onload = async () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const { data: insertData, error: insertError } = await supabase.from('images').insert([
                            {
                                imageTitle: fileNameOriginal,
                                image_url: url,
                                user_id: userId,
                            },
                        ]).select();

                        if (insertError) {
                            console.error('Supabase Images Insert Error:', insertError);
                            reject(insertError);
                        } else {
                            resolve(insertData[0]);
                        }
                    } else {
                        console.error('Upload failed with status:', xhr.status);
                        reject(new Error(`Upload failed with status: ${xhr.status}`));
                    }
                };
                xhr.onerror = () => {
                    console.error('Upload failed');
                    reject(new Error('Upload failed'));
                };
                xhr.send(file);
            });
        } catch (error) {
            console.error('Error uploading and inserting file:', error);
            throw error;
        }
    };
