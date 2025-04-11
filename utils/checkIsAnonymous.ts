import { createSupabaseClient } from './supabaseClient';
import { redirect } from 'next/navigation';

export async function checkIsAnonymous() {
    const { data: { session } } = await createSupabaseClient.auth.getSession();

    if (session?.user?.id) {
        const { data: user, error } = await createSupabaseClient
            .from('users')
            .select('isAnonymous')
            .eq('user_id', session.user.id)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return false;
        }

        if (user?.isAnonymous) {
            redirect('/login');
        }
    }
}
