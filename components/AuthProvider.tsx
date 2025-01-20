'use client';

    import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
    import { useRouter } from 'next/navigation';
    import { supabase } from '@/utils/supabaseClient';
    import { Session } from '@supabase/supabase-js';

    interface AuthContextType {
      session: Session | null;
      loading: boolean;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export const AuthProvider = ({ children }: { children: ReactNode }) => {
      const [session, setSession] = useState<Session | null>(null);
      const [loading, setLoading] = useState(true);
      const router = useRouter();

      useEffect(() => {
        const fetchSession = async () => {
          setLoading(true);
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error fetching session:', error);
          }
          setSession(session);
          setLoading(false);
        };

        fetchSession();

        supabase.auth.onAuthStateChange((event, session) => {
          setSession(session);
        });
      }, []);

      useEffect(() => {
        if (!loading && !session) {
          router.push('/login');
        }
      }, [session, loading, router]);

      return (
        <AuthContext.Provider value={{ session, loading }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
