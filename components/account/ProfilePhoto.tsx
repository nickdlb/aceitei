'use client';
import ProfilePhotoProps from '@/types/ProfilePhotoProps';

import React, { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/utils/supabaseClient';

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ photoURL, onUpdatePhoto, userId }) => {
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fotoperfil')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const url = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/fotoperfil/${fileName}`;

      if (photoURL && photoURL.includes('fotoperfil')) {
        const oldFileName = photoURL.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('fotoperfil').remove([oldFileName]);
        }
      }

      const { error: updateError } = await supabase
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
          await supabase.storage.from('fotoperfil').remove([oldFileName]);
        }
      }

      const { error } = await supabase
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
        <img
          src={photoURL}
          alt="Foto do Usuário"
          className="w-20 h-20 rounded-full mr-4"
        />
      ) : (
        <UserCircleIcon className="w-20 h-20 text-gray-400 mr-4" />
      )}
      <div>
        <label htmlFor="photoUpload" className="cursor-pointer text-blue-500 hover:text-blue-700">
          Alterar Foto
        </label>
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        {uploading && <p>Uploading...</p>}
        {photoURL && (
          <button
            onClick={handleRemovePhoto}
            className="text-red-500 hover:text-red-700 block mt-2"
          >
            Remover Foto
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhoto;
