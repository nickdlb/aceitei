import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

const SidebarLogo = () => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  useEffect(() => {
    const loadProfilePhoto = async () => {
      try {
        const { data: user, error } = await supabase.auth.user();
        if (error) throw error;
        if (user) {
          setProfilePhotoUrl(user.user_metadata.fotoperfil || '');
        }
      } catch (error) {
        console.error('Error loading profile photo:', error);
      }
    };

    loadProfilePhoto();
  }, []);

  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-2">
        {profilePhotoUrl ? (
          <img
            src={profilePhotoUrl}
            alt="Foto de Perfil"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded"></div>
        )}
        <div className="flex items-center justify-between flex-1">
          <span className="font-medium">Aceitei</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Free</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarLogo;
