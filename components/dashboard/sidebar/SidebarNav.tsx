import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { Home, User, LogOut } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/common/auth/AuthProvider';
import { useState, useEffect } from 'react';

const SidebarNav = () => {
  const router = useRouter();
  const { session } = useAuth();
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
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
          setUserName(data.nome || '');
          setUserPhoto(data.fotoperfil || '');
        }
      }
    };
    fetchUserProfile();
  }, [session]);

  const handleSupabaseSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="flex flex-col h-full relative">
      <ul className="space-y-2 p-4">
        <SidebarMenuItem href="/dashboard" icon={Home} label="Dashboard" />
        <SidebarMenuItem href="/account" icon={User} label="Minha Conta" />
        <SidebarMenuItem onClick={handleSupabaseSignOut} icon={LogOut} label="Sair" />
      </ul>
    </nav>
  );
};

export default SidebarNav;
