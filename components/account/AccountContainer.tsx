'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { checkIsAnonymous } from '@/utils/checkIsAnonymous';
import ProfilePhoto from './ProfilePhoto';
import UserInfo from './UserInfo';
import { useAuth } from '@/components/common/auth/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomerPortalButton } from '@/components/account/CustomerPortalButton'
import { SubscriptionInfo } from './SubscriptionInfo';

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
          const { data, error } = await supabase
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
    <div className='space-y-4 pl-6 pt-12'>
      <h2 className="text-acpreto text-2xl font-bold">Minha Conta</h2>
      <div className="bg-acbgbranco rounded-lg shadow p-6">
        <ProfilePhoto photoURL={photoURL} onUpdatePhoto={handleUpdatePhoto} userId={session?.user?.id || null} />
        <UserInfo userData={userData} onUpdateName={handleUpdateName} userId={session?.user?.id || null} />
      </div>
        <SubscriptionInfo />
    </div>
  );
};

export default AccountContainer;
