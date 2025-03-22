import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/components/AuthProvider';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SidebarLogo = () => {
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
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-medium hover:text-blue-600">
          Aceitei
        </Link>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">Free</span>
      </div>
    </div>
  );
};

export default SidebarLogo;
