import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/utils/createServerClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    console.log('[API] Token ausente.')
    return NextResponse.json({ subscription: null })
  }

  const supabase = createServerClient(token)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log('[API] Usuário não autenticado:', userError)
    return NextResponse.json({ subscription: null })
  }

  const { data: customerData, error: customerError } = await supabase
    .from('stripe_customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (customerError || !customerData) {
    console.log('[API] Cliente Stripe não encontrado:', customerError)
    return NextResponse.json({ subscription: null })
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerData.stripe_customer_id,
    status: 'all',
    expand: ['data.items.data.price']
  })

  const subscription = subscriptions.data[0]
  
  if (!subscription) {
    return NextResponse.json({ subscription: null })
  }

  const price = subscription.items.data[0]?.price

  // Buscar últimas 5 faturas
  const invoices = await stripe.invoices.list({
    customer: customerData.stripe_customer_id,
    limit: 5,
  })

  const formattedInvoices = invoices.data.map((invoice) => ({
    id: invoice.id,
    status: invoice.status,
    amount: invoice.amount_paid || invoice.amount_due,
    currency: invoice.currency,
    date: invoice.created,
    hosted_invoice_url: invoice.hosted_invoice_url,
    invoice_pdf: invoice.invoice_pdf,
  }))

  // Primeiro item da assinatura para obter informações específicas
  const subscriptionItem = subscription.items.data[0];

  return NextResponse.json({
    subscription: {
      id: subscription.id,
      status: subscription.status,
      current_period_end: subscriptionItem?.current_period_end || null,
      start_date: subscription.start_date,
      cancel_at_period_end: subscription.cancel_at_period_end,
      trial_end: subscription.trial_end,
      plan_name: price?.nickname || 'Plano sem nome',
      amount: price?.unit_amount,
      currency: subscription.currency,
      interval: price?.recurring?.interval,
      invoices: formattedInvoices,
    }
  })
}