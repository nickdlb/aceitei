'use client';
import ProfilePhotoProps from '@/types/ProfilePhotoProps';

import React, { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/utils/supabaseClient';

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ photoURL, onUpdatePhoto, userId }) => {
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (userId) {
          const { data, error } = await createSupabaseClient
            .from('users')
            .select('nome')
            .eq('user_id', userId)
            .single();

          if (error) {
            console.error('Error fetching user name:', error);
            return;
          }
          if (data) {
            setUserName(data.nome || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (photoURL) {
      fetchUserName();
    }

  }, [photoURL, userId]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhoto(file);
      await uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const fileName = `profile-${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await createSupabaseClient.storage
        .from('fotoperfil')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const url = `https:

      if (photoURL && photoURL.includes('fotoperfil')) {
        const oldFileName = photoURL.split('/').pop();
        if (oldFileName) {
          await createSupabaseClient.storage.from('fotoperfil').remove([oldFileName]);
        }
      }

      const { error: updateError } = await createSupabaseClient
        .from('users')
        .update({ fotoperfil: url })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      onUpdatePhoto(url);
      localStorage.setItem('profilePhoto', url);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
      setNewPhoto(null);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      if (photoURL && photoURL.includes('fotoperfil')) {
        const oldFileName = photoURL.split('/').pop();
        if (oldFileName) {
          await createSupabaseClient.storage.from('fotoperfil').remove([oldFileName]);
        }
      }

      const { error } = await createSupabaseClient
        .from('users')
        .update({ fotoperfil: null })
        .eq('user_id', userId);

      if (error) throw error;

      onUpdatePhoto('');
      localStorage.removeItem('profilePhoto');
    } catch (error) {
      console.error('Error removing photo:', error);
    }
  };

  return (
    <div className="flex items-center mb-4">
      {photoURL ? (
        <Avatar className="w-20 h-20 mr-4">
          <AvatarImage src={photoURL} alt="Foto do Usuário" />
          <AvatarFallback>
            {(userName?.charAt(0) || 'U').toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="w-20 h-20 mr-4">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      <div>
        <Button className='bg-acbgbranco' asChild variant="outline">
          <label htmlFor="photoUpload" className="cursor-pointer text-acpreto">
            Alterar Foto
          </label>
        </Button>
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        {uploading && <p>Uploading...</p>}
        {photoURL && (
          <Button
            onClick={handleRemovePhoto}
            variant="outline"
            className="block mt-2 bg-transparent hover:text-acvermelho"
          >
            Remover Foto
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhoto;
