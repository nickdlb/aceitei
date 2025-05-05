import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

// Supabase admin client (server role key necessária!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // <- cuidado com segurança em produção
)

// Lê o corpo cru (requisito do Stripe)
async function readRawBody(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = readable.getReader()
  const chunks = []

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
    console.error('Erro ao validar webhook:', err.message)
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
      console.error('Dados ausentes na sessão Stripe')
      return new NextResponse('Dados incompletos', { status: 400 })
    }
  
    const { error } = await supabase
      .from('users')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        is_premium: true,
      })
  
    if (error) {
      console.error('Erro ao salvar usuário no Supabase:', error)
      return new NextResponse('Erro ao salvar usuário', { status: 500 })
    }
  
    console.log('✅ Usuário atualizado com sucesso!')
  }

  return NextResponse.json({ received: true })
}
