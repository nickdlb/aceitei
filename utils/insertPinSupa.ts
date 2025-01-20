import { supabase } from './supabaseClient';

    export const insertPin = async (
      imageId: string | string[] | undefined,
      pos_x: number,
      pos_y: number,
      pin_number: number,
      comment: string = '',
      userId: string
    ) => {
      try {
        const { data, error } = await supabase
          .from('markers')
          .insert([
            {
              image_id: imageId,
              user_id: userId,
              pos_x: pos_x,
              pos_y: pos_y,
              status: 'ativo',
              pin_number: pin_number,
              comment: comment
            }
          ])
          .select();

        if (error) {
          throw error;
        }

        return data;
        
      } catch (error:any) {
        console.error("Erro ao inserir pin:", error.message);
        throw error;
      }
    }
