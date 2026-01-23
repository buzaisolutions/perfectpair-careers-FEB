import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    let event: Stripe.Event;

    // 1. Verifica se o aviso veio realmente do Stripe (Segurança)
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // 2. Processa o Evento
    const session = event.data.object as Stripe.Checkout.Session;

    // QUANDO O PAGAMENTO É APROVADO
    if (event.type === 'checkout.session.completed') {
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;

      if (!userId) {
        return NextResponse.json({ error: 'No user ID found in metadata' }, { status: 400 });
      }

      console.log(`💰 Pagamento recebido do usuário: ${userId} para o plano: ${planId}`);

      // Lógica de Entrega do Produto
      if (planId === 'resume') {
        // Adiciona 1 Crédito
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: 1 } },
        });
      } else if (planId === 'resume_cover') {
        // Adiciona 2 Créditos
        await prisma.user.update({
          where: { id: userId },
          data: { credits: { increment: 2 } },
        });
      } else if (planId === 'monthly') {
        // Ativa Assinatura (Exemplo simples, idealmente salvaria stripeSubscriptionId)
        await prisma.user.update({
          where: { id: userId },
          data: { 
            // Ajuste esses campos conforme seu Schema do Prisma
            // isPremium: true, 
            // subscriptionStatus: 'ACTIVE' 
            credits: { increment: 100 } // Exemplo: dá créditos infinitos/altos
          },
        });
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}