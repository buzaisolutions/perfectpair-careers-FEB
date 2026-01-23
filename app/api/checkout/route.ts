import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Verifique se o caminho do seu auth está aqui
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Usa a versão mais recente ou a que você tiver
});

export async function POST(req: Request) {
  try {
    // 1. Verifica se o usuário está logado
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Recebe qual plano o usuário clicou
    const { planId } = await req.json();

    let priceId = '';
    let mode: 'payment' | 'subscription' = 'payment';

    // 3. Mapeia o ID do botão para o ID do Stripe e define o Modo
    switch (planId) {
      case 'resume': // Plano de 9.99
        priceId = process.env.STRIPE_PRICE_BASIC!;
        mode = 'payment'; // Pagamento Único
        break;
      case 'resume_cover': // Plano de 14.99
        priceId = process.env.STRIPE_PRICE_PRO!;
        mode = 'payment'; // Pagamento Único
        break;
      case 'monthly': // Assinatura de 29.99
        priceId = process.env.STRIPE_PRICE_MAX!;
        mode = 'subscription'; // Assinatura Recorrente!
        break;
      default:
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // 4. Cria a sessão de checkout no Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode, // Aqui ele troca automaticamente entre assinatura ou pagamento único
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id, // Importante para sabermos quem pagou depois
        planId: planId
      },
    });

    // 5. Devolve a URL de pagamento para o Front-end
    return NextResponse.json({ url: stripeSession.url });

  } catch (error) {
    console.error('Stripe Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}