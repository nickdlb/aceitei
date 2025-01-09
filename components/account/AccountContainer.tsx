'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import ProfilePhoto from './ProfilePhoto';
import UserInfo from './UserInfo';

const AccountContainer = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [userData, setUserData] = useState({
    nome: '',
    usuario: '',
    email: '',
  });
  const userId = '1';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const { data, error } = await supabase
            .from('users')
            .select('fotoperfil, nome, usuario, email')
            .eq('id', userId)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }

          if (data) {
            setPhotoURL(data.fotoperfil || '');
            setUserData({
              nome: data.nome || '',
              usuario: data.usuario || '',
              email: data.email || '',
            });
            localStorage.setItem('profilePhoto', data.fotoperfil || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleUpdatePhoto = (url: string) => {
    setPhotoURL(url);
  };

  const handleUpdateName = (newName: string) => {
    setUserData(prev => ({ ...prev, nome: newName }));
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProfilePhoto 
          photoURL={photoURL} 
          onUpdatePhoto={handleUpdatePhoto} 
          userId={userId}
        />
        <UserInfo 
          userData={userData} 
          onUpdateName={handleUpdateName} 
          userId={userId}
        />
      </div>
    </div>
  );
};

export default AccountContainer;