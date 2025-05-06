'use client'

import { useEffect } from 'react'
import { useSession } from '@/hooks/useSession'

const DebugUserId = () => {
  const { session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      console.log('[DEBUG] user_id:', session.user.id)
    } else {
      console.log('[DEBUG] Nenhuma sessão encontrada')
    }
  }, [session])

  return null
}

export default DebugUserId
