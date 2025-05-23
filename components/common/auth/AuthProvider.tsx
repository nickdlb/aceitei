'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("getSession data:", data);
      console.log("getSession error:", error);
      if (!error && data.session?.user) {
        setSession(data.session);
        const userId = data.session.user.id;
        console.log("userId:", userId);
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('isFirstAccess')
          .eq('user_id', userId)
          .single();
        if (!userError && userData?.isFirstAccess === true) {
          console.log("Primeiro Acesso");
          const { data: userData, error: userError } = await supabase
          .from('users')
          .upsert({    user_id: userId,
                      isFirstAccess: false,
                  }, {
    onConflict: 'user_id'})
          .eq('user_id', userId)
          .single();  
          router.push("/start")
        }
      }
      setLoading(false);
    }

    getSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => {
      subscription.subscription?.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
