'use client'

import React from 'react'
import { supabase } from '@/utils/supabaseClient'
import { toast } from 'sonner'

export const CustomerPortalButton: React.FC = () => {
  const handleOpenPortal = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      toast.error('Você precisa estar logado para gerenciar sua assinatura.')
      return
    }

    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        }
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('Erro ao criar portal:', errText)
        return
      }

      const { url } = await res.json()
      window.open(url, '_blank')
    } catch (err) {
      console.error('Erro ao redirecionar para o portal:', err)
    }
  }

  return (
    <button onClick={handleOpenPortal} className="bg-acazul hover:bg-acpreto hover:text-acbranco text-white px-4 py-2 rounded-xl h-min w-fit" >
      Gerenciar assinatura
    </button>
  )
}
