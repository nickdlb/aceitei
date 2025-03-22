'use client';

import React, { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { isAnonymous } from '@/utils/isAnonymousCheck';
import ProfilePhoto from './ProfilePhoto';
import UserInfo from './UserInfo';
import { useAuth } from '@/components/auth/AuthProvider';

const AccountContainer = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
  });
  const { session, loading } = useAuth();

  useEffect(() => {
    isAnonymous();
    const fetchUserProfile = async () => {
      try {
        if (session?.user?.id) {
          const { data, error } = await createSupabaseClient
            .from('users')
            .select('fotoperfil, nome')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }

          if (data) {
            setPhotoURL(data.fotoperfil || '');
            setUserData({
              nome: data.nome || '',
              email: session.user.email || '',
            });
            localStorage.setItem('profilePhoto', data.fotoperfil || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (!loading && session) {
      fetchUserProfile();
    }
  }, [session, loading]);

  const handleUpdatePhoto = (url: string) => {
    setPhotoURL(url);
  };

  const handleUpdateName = (newName: string) => {
    setUserData(prev => ({ ...prev, nome: newName }));
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProfilePhoto
          photoURL={photoURL}
          onUpdatePhoto={handleUpdatePhoto}
          userId={session?.user?.id || null}
        />
        <UserInfo
          userData={userData}
          onUpdateName={handleUpdateName}
          userId={session?.user?.id || null}
        />
      </div>
    </div>
  );
};

export default AccountContainer;
