import { supabase } from './supabaseClient';
import { redirect } from 'next/navigation';

export async function isAnonymous() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user?.id) {
    const { data: user, error } = await supabase
      .from('users')
      .select('isAnonymous')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return false; // Or handle the error as needed
    }

    if (user?.isAnonymous) {
      redirect('/login');
    }
  }
}
