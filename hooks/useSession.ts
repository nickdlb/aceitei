// hooks/useSession.ts
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export const useSession = () => {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const supabase = supabase()

    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }

    getSession()
  }, [])

  return { session }
}
