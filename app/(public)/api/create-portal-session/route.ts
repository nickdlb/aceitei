// app/api/create-portal-session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ✅ apenas leitura do usuário logado
)

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return new NextResponse('Token não fornecido', { status: 401 })
    }

    const {
      data: { user },
      error
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.error('Erro ao buscar usuário:', error)
      return new NextResponse('Usuário não autenticado', { status: 401 })
    }

    // Agora buscamos o ID do cliente Stripe vinculado ao user.id
    const { data, error: fetchError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !data?.stripe_customer_id) {
      console.error('Erro ao buscar Stripe ID:', fetchError)
      return new NextResponse('Stripe ID não encontrado', { status: 404 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${req.nextUrl.origin}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Erro ao criar sessão do portal:', err)
    return new NextResponse('Erro ao criar portal', { status: 500 })
  }
}
