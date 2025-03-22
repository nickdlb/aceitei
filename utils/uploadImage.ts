import { createSupabaseClient } from './supabaseClient';

export const uploadImage = async (file: File, userId: string, title: string) => {
    try {
        // 1. Criar um novo documento
        const { data: documentData, error: documentError } = await createSupabaseClient
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

        // 2. Upload da imagem diretamente no bucket
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { error: storageError } = await createSupabaseClient.storage
            .from('images')
            .upload(fileName, file);

        if (storageError) {
            console.error('Error uploading file:', storageError);
            await createSupabaseClient.from('documents').delete().eq('id', documentData.id);
            return null;
        }

        // 3. Criar uma nova página
        const { data: pageData, error: pageError } = await createSupabaseClient
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
            await createSupabaseClient.from('documents').delete().eq('id', documentData.id);
            await createSupabaseClient.storage.from('images').remove([fileName]);
            return null;
        }

        // 4. Buscar os dados do documento separadamente
        const { data: documentWithPage, error: documentFetchError } = await createSupabaseClient
            .from('documents')
            .select('id, title, created_at, user_id')
            .eq('id', documentData.id)
            .single();

        if (documentFetchError) {
            console.error('Error fetching document:', documentFetchError);
            return pageData;
        }

        // 5. Combinar os dados
        return {
            ...pageData,
            documents: documentWithPage
        };
    } catch (error) {
        console.error('Error in uploadImage:', error);
        return null;
    }
};
