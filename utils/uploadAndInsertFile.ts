import { supabase } from './supabaseClient';
    import { createContext, useState } from 'react';

    export const uploadAndInsertFile = async (file: File, onUploadProgress?: (progressEvent: any) => void) => {
      try {
        const fileNameOriginal = file.name;
        const fileExtension = fileNameOriginal.split('.').pop();
        const fileNameFinal = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${Math.floor(Math.random() * 10000)}.${fileExtension}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileNameFinal, file, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress,
          });

        if (uploadError) {
          throw uploadError;
        }

        const urlFile = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/images/${fileNameFinal}`;

        const { data: insertData, error: insertError } = await supabase.from('images').insert([
          {
            imageTitle: fileNameOriginal,
            image_url: urlFile,
            user_id: 'a08255eb-5731-422e-80e6-80c317d4fcb1',
          },
        ]).select();

        if (insertError) {
          throw insertError;
        }

        console.log("🚀 ~ Data inserida com sucesso:", insertData);
        return insertData[0];
      } 
      
      catch (error) {
        console.error("Erro:", error);
        throw error;
      }
    };
