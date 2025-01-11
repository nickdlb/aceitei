import { supabase } from './supabaseClient';

export const DeleteFile = async (id: string, deleteComments = false) => {
  try {
    const { data: imageData, error: imageError } = await supabase
      .from('images')
      .select('image_url, id') // Select id to check for existence
      .eq('id', id)
      .single();

    if (imageError) {
      console.error("Error fetching image data:", imageError);
      return { error: imageError.message || 'Failed to fetch image data' }; // Return error object
    }

    if (!imageData) {
      console.warn(`Image with ID "${id}" not found.`);
      return { message: `Image with ID "${id}" not found.` }; // Return message indicating failure
    }

    const imageUrl = imageData.image_url;
    const path = imageUrl.split('/storage/v1/object/public/images/')[1];

    // Delete from Supabase
    const { error: deleteError } = await supabase.from('images').delete().eq('id', id);
    if (deleteError) {
      console.error("Error deleting image data:", deleteError);
      return { error: deleteError.message || 'Failed to delete image data' }; // Return error object
    }

    // Delete from Storage
    try {
      const { error: storageError } = await supabase.storage.from('images').remove([path]);
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        return { error: storageError.message || 'Failed to delete file from storage' }; // Return error object
      }
      console.log("File removed from storage successfully!");
    } catch (storageError) {
      console.error("Error deleting file from storage:", storageError);
      return { error: (storageError as Error).message || 'Failed to delete file from storage' }; // Return error object
    }

    console.log("Image deleted successfully!");
    return { message: 'Image deleted successfully!' }; // Return success message
  } catch (error) {
    console.error("Error deleting image:", error);
    return { error: (error as Error).message || 'An unexpected error occurred' }; // Return error object
  }
};
