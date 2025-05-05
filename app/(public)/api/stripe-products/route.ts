import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      recurring: { interval: 'month' } // apenas planos mensais
    })

    return NextResponse.json(prices.data)
  } catch (err) {
    console.error('Erro ao listar preços:', err)
    return new NextResponse('Erro ao buscar produtos', { status: 500 })
  }
}
