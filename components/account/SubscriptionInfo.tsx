'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { Loader } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CustomerPortalButton } from './CustomerPortalButton'
import { StripePlans } from './StripePlans'

interface Invoice {
  id: string
  status: string
  amount: number
  currency: string
  date: number
  hosted_invoice_url: string | null
  invoice_pdf: string | null
}

interface Subscription {
  id: string
  status: string
  current_period_end: number
  start_date: number
  cancel_at_period_end: boolean
  trial_end: number | null
  plan_name: string
  amount: number
  currency: string
  interval: string
  invoices: Invoice[]
  nickname: string
}

export const SubscriptionInfo = () => {
  const { session } = useSession()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return

    const fetchSubscription = async () => {
      try {
        const res = await fetch('/api/subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        const data = await res.json()
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
      <div className="flex items-center text-sm">
        <Loader className="animate-spin mr-2 w-4 h-4" />
        Carregando assinatura...
      </div>
    )
  }

  if (!subscription) {
    return (
      <>
        <Card className="border-none bg-acbgbranco h-min">
          <CardContent className="flex flex-col gap-4 text-base text-acpreto">
            <p><strong> Plano: </strong> Free</p>
            <p><strong> Documentos: </strong> 1 / 5</p>
            <p><strong> Armazenamento </strong> 100mb / 2GB</p>
          </CardContent>
        </Card>
        <div className="text-sm text-muted-foreground italic">
        <StripePlans/>
        </div>
      </>
    )
  }

  return (
    <>
      <Card className="border-none bg-acbgbranco h-min">
        <CardContent className="flex flex-col gap-4 text-base text-acpreto">
          <p><strong>Plano:</strong> Premium</p>
          <p><strong> Documentos: </strong> 1 / ∞ </p>
          <p><strong> Armazenamento </strong> 100mb / 20GB</p>
          <p><strong>Status:</strong> Ativo </p>
          <p><strong>Valor:</strong>{' '}
            {subscription.currency === 'brl'
              ? `R$ ${(subscription.amount / 100).toFixed(2)}`
              : `${(subscription.amount / 100).toFixed(2)} ${subscription.currency.toUpperCase()}`}
          </p>
          {subscription.trial_end && (
            <p><strong>Fim do período de teste:</strong> {new Date(subscription.trial_end * 1000).toLocaleDateString('pt-BR')}</p>
          )}
          <p><strong>Próxima cobrança:</strong> {new Date(subscription.current_period_end * 1000).toLocaleDateString('pt-BR')}</p>
          <CustomerPortalButton />
        </CardContent>
      </Card>
      <Card className="border-none bg-acbgbranco h-min">
        <CardContent className="flex flex-col gap-4 text-base text-acpreto">
            <h3 className="font-semibold text-base">Últimas faturas</h3>
            <ul className="text-sm space-y-2">
              {subscription.invoices.map((invoice) => (
                <li key={invoice.id}>
                  <span className="block">
                    {new Date(invoice.date * 1000).toLocaleDateString('pt-BR')} - {' '}
                    {invoice.currency === 'brl'
                      ? `R$ ${(invoice.amount / 100).toFixed(2)}`
                      : `${(invoice.amount / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`}
                    {' '} - {' '}                    
                    {invoice.hosted_invoice_url && (
                      <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" >
                        Fatura 
                      </a>
                    )}
                    {' - '}
                    {invoice.invoice_pdf && (
                      <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" >
                        PDF
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
        </CardContent>
      </Card>
    </>   
  )
}
