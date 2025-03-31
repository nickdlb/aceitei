'use client';

import React, { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { checkIsAnonymous } from '@/utils/checkIsAnonymous';
import ProfilePhoto from './ProfilePhoto';
import UserInfo from './UserInfo';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AccountContainer = () => {
  const [photoURL, setPhotoURL] = useState('');
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
  });
  const { session, loading } = useAuth();

  useEffect(() => {
    checkIsAnonymous();
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
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="w-[300px] h-[200px]" />
      </div>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-acpreto text-2xl font-bold">Minha Conta</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-acbgbranco rounded-lg shadow p-6">
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
      </CardContent>
    </Card>
  );
};

export default AccountContainer;
