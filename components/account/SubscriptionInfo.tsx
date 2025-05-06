'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { Loader } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CustomerPortalButton } from './CustomerPortalButton'

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
        console.log("Assinatura recebida:", data)
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
      <div className="text-sm text-muted-foreground italic">
        Nenhuma assinatura ativa
      </div>
    )
  }

  return (
    <Card className="border-none bg-acbgbranco h-min">
      <CardContent className="flex flex-col gap-4 text-base text-acpreto">
        <p><strong>Plano:</strong> {subscription.plan_name}</p>
        <p><strong>Status:</strong> {subscription.status}</p>
        <p><strong>Valor:</strong>{' '}
          {subscription.currency === 'brl'
            ? `R$ ${(subscription.amount / 100).toFixed(2)}`
            : `${(subscription.amount / 100).toFixed(2)} ${subscription.currency.toUpperCase()}`}
        </p>
        <p><strong>Intervalo:</strong> {subscription.interval === 'month' ? 'Mensal' : subscription.interval}</p>
        <p><strong>Início:</strong> {new Date(subscription.start_date * 1000).toLocaleDateString('pt-BR')}</p>
        <p><strong>Próxima cobrança:</strong> {new Date(subscription.current_period_end * 1000).toLocaleDateString('pt-BR')}</p>
        <p><strong>Cancelamento ao final do ciclo:</strong> {subscription.cancel_at_period_end ? 'Sim' : 'Não'}</p>
        {subscription.trial_end && (
          <p><strong>Fim do período de teste:</strong> {new Date(subscription.trial_end * 1000).toLocaleDateString('pt-BR')}</p>
        )}

        <div className="mt-4">
          <h3 className="font-semibold text-base mb-2">Últimas faturas</h3>
          <ul className="text-sm space-y-2">
            {subscription.invoices.map((invoice) => (
              <li key={invoice.id}>
                <span className="block">
                  {new Date(invoice.date * 1000).toLocaleDateString('pt-BR')} —{' '}
                  {invoice.currency === 'brl'
                    ? `R$ ${(invoice.amount / 100).toFixed(2)}`
                    : `${(invoice.amount / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`}
                  {' '} — {invoice.status}
                </span>
                <div className="flex gap-4 mt-1">
                  {invoice.hosted_invoice_url && (
                    <a
                      href={invoice.hosted_invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver online
                    </a>
                  )}
                  {invoice.invoice_pdf && (
                    <a
                      href={invoice.invoice_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Baixar PDF
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <CustomerPortalButton />
      </CardContent>
    </Card>
  )
}
