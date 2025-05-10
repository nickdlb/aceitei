'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/components/common/auth/AuthProvider'
import { toast } from 'sonner'

interface StripeProduct {
  id: string
  nickname: string | null
  unit_amount: number
  currency: string
  product: {
    name: string
    description?: string
  }
}

export const StripePlans = () => {
  const [plans, setPlans] = useState<StripeProduct[]>([])
  const [loading, setLoading] = useState(true)

  const { session } = useAuth()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/stripe-products')
        const data = await res.json()
        setPlans(data)
      } catch (err) {
        console.error('Erro ao buscar planos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handleSubscribe = async (priceId: string) => {
    if (!session?.user) {
      toast.error('Você precisa estar logado para assinar um plano.')
      return
    }

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        userId: session.user.id
      })
    })

    const { url } = await res.json()
    window.location.href = url
  }

  if (loading) return <p>Carregando planos...</p>

  return (
    <div className="flex gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="border rounded-lg p-6 bg-white text-black shadow-md"
        >
          <h2 className="text-xl font-bold mb-2">{plan.product.name}</h2>
          <p className="text-sm text-gray-700 mb-4">
            {plan.product.description || plan.nickname || 'Plano'}
          </p>
          <p className="text-2xl font-semibold mb-4">
            R$ {(plan.unit_amount / 100).toFixed(2)} / mês
          </p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => handleSubscribe(plan.id)}
          >
            Assinar agora
          </button>
        </div>
      ))}
    </div>
  )
}
