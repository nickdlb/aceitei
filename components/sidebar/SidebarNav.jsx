import React from 'react';
import SidebarMenuItem from './SidebarMenuItem.jsx';
import {
  HomeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { createSupabaseClient } from '../../utils/supabaseClient'; // Import supabase client
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
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
    <nav className="p-4 flex flex-col h-full relative">
      <ul className="space-y-2">
        <SidebarMenuItem href="/" icon={<HomeIcon className="w-5 h-5" />} label="Dashboard" />
        <SidebarMenuItem href="/account" icon={<UserCircleIcon className="w-5 h-5" />} label="Minha Conta" />
        <li>
          <button onClick={() => handleSupabaseSignOut()} className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m-3 0l-3-3" />
            </svg>
            <span>Logout</span>
          </button>
        </li>
      </ul>
      <div className="absolute bottom-0 left-0 right-0">
        <SidebarFooter />
      </div>
    </nav>
  );
};

export default SidebarNav;
