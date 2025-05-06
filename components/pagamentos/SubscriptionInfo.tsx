'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { Loader } from 'lucide-react'

interface Subscription {
  id: string
  status: string
  current_period_end: number
  plan_name: string
  amount: number
  currency: string
}

export const SubscriptionInfo = () => {
  const { session } = useSession()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return
  
    const fetchSubscription = async () => {
      console.log('[DEBUG] Chamando rota /api/subscription') // 👈 Adicione isso
      try {
        const res = await fetch('/api/subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        const data = await res.json()
        console.log('[DEBUG] Dados recebidos:', data) // 👈 E isso
        setSubscription(data.subscription)
      } catch (err) {
        console.error('Erro ao buscar assinatura:', err)
      } finally {
        setLoading(false)
      }
    }
  
    fetchSubscription()
  }, [session])

  if (loading) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Loader className="animate-spin mr-2 w-4 h-4" />
        Carregando assinatura...
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Nenhuma assinatura ativa
      </div>
    )
  }

  return (
    <div className="text-sm space-y-1 bg-acbgbranco p-4 rounded-xl shadow-sm border">
      <p><strong>Plano:</strong> {subscription.plan_name}</p>
      <p><strong>Status:</strong> {subscription.status}</p>
      <p>
        <strong>Próxima cobrança:</strong>{' '}
        {new Date(subscription.current_period_end * 1000).toLocaleDateString('pt-BR')}
      </p>
      <p>
        <strong>Valor:</strong>{' '}
        {subscription.currency === 'brl'
          ? `R$ ${(subscription.amount / 100).toFixed(2)}`
          : `${(subscription.amount / 100).toFixed(2)} ${subscription.currency.toUpperCase()}`}
      </p>
    </div>
  )
}
