import { supabase } from './supabaseClient';

export const uploadImage = async (
  files: File | File[],
  userId: string,
  title: string,
  combine = false
) => {
  try {
    const fileList = Array.isArray(files) ? files : [files];

    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert([{ title: title || fileList[0].name, user_id: userId }])
      .select()
      .single();

    if (documentError || !documentData) {
      console.error('Error creating document:', documentError);
      return null;
    }

    const pageDataList = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
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

      const { data: publicUrlData } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);

      if (!publicUrlData) {
        console.error('Error getting public URL for file:', fileName);
        await supabase.from('documents').delete().eq('id', documentData.id);
        await supabase.storage.from('files').remove([fileName]);
        return null;
      }

      const imageUrl = publicUrlData.publicUrl;

      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .insert([
          {
            document_id: documentData.id,
            image_url: imageUrl,
            imageTitle: title || file.name,
            page_number: i + 1,
            user_id: userId,
          },
        ])
        .select('id, image_url, imageTitle, page_number, created_at, document_id, user_id')
        .single();

      if (pageError || !pageData) {
        console.error('Error creating page:', pageError);
        await supabase.from('documents').delete().eq('id', documentData.id);
        await supabase.storage.from('files').remove([fileName]);
        return null;
      }

      pageDataList.push(pageData);
    }

    const { data: documentWithPage, error: documentFetchError } = await supabase
      .from('documents')
      .select('id, title, created_at, user_id')
      .eq('id', documentData.id)
      .single();

    if (documentFetchError) {
      console.error('Error fetching document:', documentFetchError);
      return pageDataList;
    }

    return pageDataList.map((page) => ({
      ...page,
      documents: documentWithPage,
    }));
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
};
