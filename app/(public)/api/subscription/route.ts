// app/(public)/api/subscription/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/utils/createServerClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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
    expand: ['data.items.data.price'], // ✅ Correção aqui
  })

  const subscription = subscriptions.data[0]

  if (!subscription) {
    console.log('[API] Nenhuma assinatura ativa encontrada.')
    return NextResponse.json({ subscription: null })
  }

  const price = subscription.items.data[0]?.price

  return NextResponse.json({
    subscription: {
      id: subscription.id,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      plan_name: price?.nickname || 'Plano sem nome',
      amount: price?.unit_amount,
      currency: price?.currency,
    },
  })
}
