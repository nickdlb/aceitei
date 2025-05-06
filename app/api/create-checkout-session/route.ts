import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

export async function POST(req: NextRequest) {
  try {
    const { userId, priceId } = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cancel`,
      metadata: { userId }, // <- esse é o que vai pro webhook
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Erro ao criar sessão:', err)
    return new NextResponse('Erro ao criar sessão de checkout', { status: 500 })
  }
}
