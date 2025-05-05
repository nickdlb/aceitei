import React from 'react';
import { useAuth } from '@/components/common/auth/AuthProvider';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const UserProfile = () => {
  const { session } = useAuth();
  const [userName, setUserName] = useState('Usuário Anônimo');
  const [userPhoto, setUserPhoto] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await createSupabaseClient
          .from('users')
          .select('nome, fotoperfil')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (data) {
          setUserName(data.nome);
          setUserPhoto(data.fotoperfil || '');
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        {userPhoto ? (
          <Avatar className="w-8 h-8">
            <AvatarImage src={userPhoto} alt="Foto do Usuário" />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="w-8 h-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col">
          <span className="text-actextocinza font-medium">
            {userName}
          </span>
          <span className='text-xs'>
            Seja Bem Vindo ao Aceitei
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
