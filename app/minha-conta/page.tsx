'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/utils/supabaseClient';

const MinhaConta = () => {
  const [user, setUser] = useState({
    username: '',
    name: '',
    email: '',
    photoURL: '',
  });

  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: userdata, error } = await supabase.auth.user();
        if (error) throw error;
        if (userdata) {
          setUser({
            username: userdata.user_metadata.username || '',
            name: userdata.user_metadata.name || '',
            email: userdata.email || '',
            photoURL: userdata.user_metadata.fotoperfil || '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPhoto(e.target.files?.[0] || null); // Handle undefined case
  };

  const handlePhotoUpload = async () => {
    if (newPhoto) {
      try {
        const { data, error } = await supabase.storage
          .from('fotoperfil')
          .upload('profile.jpg', newPhoto, {
            cacheControl: '3600',
            upsert: true,
          });

        if (error) {
          console.error('Error uploading photo:', error);
          throw error;
        }

        // Update user metadata in Supabase
        const { error: updateError } = await supabase.auth.updateUser({
          data: { fotoperfil: data.publicURL },
        });

        if (updateError) {
          console.error('Error updating user metadata:', updateError);
          throw updateError;
        }

        setUser({ ...user, photoURL: data.publicURL });
        setNewPhoto(null);
      } catch (error) {
        console.error('Error during photo upload or update:', error);
        // Add user-friendly error handling here (e.g., alert)
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <img
              src={user.photoURL}
              alt="Foto do Usuário"
              className="w-20 h-20 rounded-full mr-4"
            />
            <div>
              <label htmlFor="photoUpload" className="cursor-pointer">
                <UserCircleIcon className="w-6 h-6 text-blue-500 hover:text-blue-700" />
                Alterar Foto
              </label>
              <input
                type="file"
                id="photoUpload"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button onClick={handlePhotoUpload} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded">
                Salvar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username">Usuário:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            {/* Add other fields as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhaConta;
