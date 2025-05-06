import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

// Supabase admin client (service role key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function readRawBody(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = readable.getReader()
  const chunks: Uint8Array[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }

  return Buffer.concat(chunks)
}

export async function POST(req: Request) {
  const rawBody = await readRawBody(req.body!)
  const sig = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('❌ Erro ao validar webhook:', err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const customerId = session.customer as string
    const subscriptionId = session.subscription as string

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 1
    })
    const priceId = lineItems.data?.[0]?.price?.id ?? 'unknown'

    console.log('🔁 Webhook recebido - userId:', userId)

    if (!userId || !customerId || !subscriptionId) {
      console.error('❌ Dados ausentes na sessão Stripe')
      return new NextResponse('Dados incompletos', { status: 400 })
    }

    // Buscar dados da assinatura para popular stripe_customers
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription
    const subscriptionItem = subscription.items.data[0]
    
    const currentPeriodEnd = subscriptionItem?.current_period_end || null
    const planActive = subscription.status === 'active'

    // Atualizar tabela `users`
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        is_premium: true,
      })

    if (userError) {
      console.error('❌ Erro ao salvar na tabela users:', userError)
      return new NextResponse('Erro ao salvar usuário', { status: 500 })
    }

    // Atualizar tabela `stripe_customers`
    const { error: customerError } = await supabase
      .from('stripe_customers')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        subscription_id: subscriptionId,
        plan_active: planActive,
        plan_expires: currentPeriodEnd
      }, {
        onConflict: 'user_id'
      })

    if (customerError) {
      console.error('❌ Erro ao salvar na tabela stripe_customers:', customerError)
      return new NextResponse('Erro ao salvar stripe_customers', { status: 500 })
    }

    console.log('✅ Dados salvos com sucesso!')
  }

  return NextResponse.json({ received: true })
}
