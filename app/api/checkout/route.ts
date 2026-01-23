import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = body;

    let priceId = '';
    let mode: 'payment' | 'subscription' = 'payment';

    // AQUI ESTAVA O ERRO: Agora usamos os nomes exatos que estão na sua Vercel
    switch (planId) {
      case 'resume':
        // Plano Básico (Resume Optimization)
        priceId = process.env.STRIPE_PRICE_RESUME!; 
        mode = 'payment';
        break;
      case 'resume_cover':
        // Plano Intermediário (Resume + Cover Letter)
        priceId = process.env.STRIPE_PRICE_RESUME_COVER!; 
        mode = 'payment';
        break;
      case 'monthly':
        // Plano Mensal
        priceId = process.env.STRIPE_PRICE_MONTHLY!; 
        mode = 'subscription';
        break;
      default:
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Trava de Segurança: Verifica se a variável foi encontrada
    if (!priceId) {
      console.error(`ERRO CRÍTICO: Variável de ambiente não encontrada para o plano: ${planId}`);
      return NextResponse.json(
        { error: 'Configuration Error: Price ID missing. Check Vercel variables.' },
        { status: 500 }
      );
    }

    // URL Base segura
    const rawUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.perfectpaircareers.com';
    const baseUrl = rawUrl.replace(/\/$/, '');

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${baseUrl}/billing?success=true`,
      cancel_url: `${baseUrl}/billing?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        planId: planId
      },
    });

    return NextResponse.json({ url: stripeSession.url });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}