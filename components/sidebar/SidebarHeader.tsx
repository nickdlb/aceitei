import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SidebarHeader = () => {
  const { session } = useAuth();
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
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
          setUserName(data.nome || '');
          setUserPhoto(data.fotoperfil || '');
        }
      }
    };
    fetchUserProfile();
  }, [session]);

  return (
    <div className="p-4 h-12">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-semibold text-acpreto hover:text-acazul">
          Aceitei
        </Link>
      </div>
    </div>
  );
};

export default SidebarHeader;
