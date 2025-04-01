import React from 'react';
import SidebarMenuItem from './SidebarMenuItem';
import { Home, User, LogOut } from 'lucide-react';
import { createSupabaseClient } from '../../utils/supabaseClient'; // Import supabase client
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState, useEffect } from 'react';
import SidebarFooter from './SidebarFooter';

const SidebarNav = () => {
  const router = useRouter();
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

  const handleSupabaseSignOut = async () => {
    try {
      await createSupabaseClient.auth.signOut();
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="flex flex-col h-full relative">
      <ul className="space-y-2 p-4">
        <SidebarMenuItem href="/" icon={Home} label="Dashboard" />
        <SidebarMenuItem href="/account" icon={User} label="Minha Conta" />
        <SidebarMenuItem
          onClick={handleSupabaseSignOut}
          icon={LogOut}
          label="Sair"
        />
      </ul>
      <div className="absolute bottom-0 left-0 right-0">
        <SidebarFooter/>
      </div>
    </nav>
  );
};

export default SidebarNav;
