import React from 'react';
import { Home, User, LogOut } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/common/auth/AuthProvider';
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import BotaoPopupUploadMobile from './BotaoPopupUploadMobile';

const MobileMenu = () => {
  const router = useRouter();
  const { session } = useAuth();
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const { theme } = useTheme();

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
    <div>
      <BotaoPopupUploadMobile/>
      <div className="fixed bottom-2 w-full left-0 text-acpreto md:hidden">
        <nav className="px-6 py-2 flex items-center gap-4 bg-acbgbranco rounded-3xl justify-around mx-2">
          <Link href="/dashboard" className="flex flex-col items-center justify-center">
            <Home className="h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center justify-center">
            <User className="h-6 w-6" />
            <span className="text-xs">Conta</span>
          </Link>
          <button onClick={handleSupabaseSignOut} className="flex flex-col items-center justify-center">
            <LogOut className="h-6 w-6" />
            <span className="text-xs">Sair</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
