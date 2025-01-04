import { supabase } from '@/utils/supabaseClient';

    export const uploadProfilePhoto = async (newPhoto: File, userId: string, photoURL: string) => {
      try {
        const fileName = `profile-${Date.now()}-${newPhoto.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('fotoperfil')
          .upload(fileName, newPhoto, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Supabase Storage Upload Error:', uploadError);
          throw uploadError;
        }

        const url = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/fotoperfil/${fileName}`;

        if (userId) {
          // Delete old photo if exists
          if (photoURL && photoURL.includes('fotoperfil')) {
            const oldFileName = photoURL.split('/').pop();
            if (oldFileName) {
              const { error: deleteError } = await supabase.storage
                .from('fotoperfil')
                .remove([oldFileName]);
              if (deleteError) {
                console.error('Error deleting old photo:', deleteError);
              }
            }
          }

          const { data: updateData, error: updateError } = await supabase
            .from('users')
            .update({ fotoperfil: url })
            .eq('id', userId);

          if (updateError) {
            console.error('Supabase Users Update Error:', updateError);
            throw updateError;
          }
        } else {
          console.error('User ID is undefined, cannot update user profile.');
        }

        return url;
      } catch (error) {
        console.error('Error uploading photo:', error);
        throw error;
      }
    };
