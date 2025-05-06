import { supabase } from './supabaseClient';

export const uploadImage = async (file: File, userId: string, title: string) => {
    try {

        const { data: documentData, error: documentError } = await supabase
            .from('documents')
            .insert([
                {
                    title: title || file.name,
                    user_id: userId
                }
            ])
            .select()
            .single();

        if (documentError) {
            console.error('Error creating document:', documentError);
            return null;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: storageError } = await supabase.storage
            .from('files')
            .upload(fileName, file);

        if (storageError) {
            console.error('Error uploading file:', storageError);
            await supabase.from('documents').delete().eq('id', documentData.id);
            return null;
        }

        const { data: pageData, error: pageError } = await supabase
            .from('pages')
            .insert([
                {
                    document_id: documentData.id,
                    image_url: fileName,
                    imageTitle: title || file.name,
                    page_number: 1,
                    user_id: userId
                }
            ])
            .select('id, image_url, imageTitle, page_number, created_at, document_id, user_id')
            .single();

        if (pageError) {
            console.error('Error creating page:', pageError);
            await supabase.from('documents').delete().eq('id', documentData.id);
            await supabase.storage.from('files').remove([fileName]);
            return null;
        }

        const { data: documentWithPage, error: documentFetchError } = await supabase
            .from('documents')
            .select('id, title, created_at, user_id')
            .eq('id', documentData.id)
            .single();

        if (documentFetchError) {
            console.error('Error fetching document:', documentFetchError);
            return pageData;
        }

        return {
            ...pageData,
            documents: documentWithPage
        };
    } catch (error) {
        console.error('Error in uploadImage:', error);
        return null;
    }
};
