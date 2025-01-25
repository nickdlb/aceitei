import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';

const SidebarFooter = () => {
  const { session } = useAuth();
  const [userName, setUserName] = useState('Usuário Anônimo');
  const [userPhoto, setUserPhoto] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
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
          setUserPhoto(data.fotoperfil || ''); // Se você tiver um campo photo
        }
      }
    };

    fetchUserProfile();
  }, [session]);

  return (
    <div className="p-4 border-t bg-white border-t-gray-300">
      <div className="flex items-center gap-2">
        {userPhoto ? (
          <img
            src={userPhoto}
            alt="Foto do Usuário"
            className="w-8 h-8 rounded-full mr-2"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded"></div>
        )}
        <div className="flex items-center justify-between flex-1">
          <span className="font-medium">
            {userName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
