import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

// Inicializa o Stripe sem travar a versão (para evitar erro de TypeScript)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export async function POST(req: Request) {
  try {
    // 1. Verifica se o usuário está logado
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Recebe qual plano o usuário clicou
    const body = await req.json();
    const { planId } = body;

    let priceId = '';
    let mode: 'payment' | 'subscription' = 'payment';

    // 3. Mapeia o ID do botão para o ID do Stripe e define o Modo
    switch (planId) {
      case 'resume':
        priceId = process.env.STRIPE_PRICE_BASIC!;
        mode = 'payment';
        break;
      case 'resume_cover':
        priceId = process.env.STRIPE_PRICE_PRO!;
        mode = 'payment';
        break;
      case 'monthly':
        priceId = process.env.STRIPE_PRICE_MAX!;
        mode = 'subscription';
        break;
      default:
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // 4. Define a URL base com segurança (Correção do erro de URL Inválida)
    // Se a variável de ambiente falhar, usa o domínio fixo como fallback
    const rawUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.perfectpaircareers.com';
    // Garante que não tenha barra no final para não duplicar (ex: .com//billing)
    const baseUrl = rawUrl.replace(/\/$/, '');

    // 5. Cria a sessão de checkout no Stripe
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
        userId: session.user.id, // Importante para o Webhook saber quem pagou
        planId: planId
      },
    });

    // 6. Devolve a URL de pagamento para o Front-end redirecionar
    return NextResponse.json({ url: stripeSession.url });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}