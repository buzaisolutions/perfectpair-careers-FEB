import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// CONFIGURAÇÃO CORRIGIDA (Sem travar versão)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
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

    // 2. Processa o Evento de Pagamento Aprovado
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Pegamos os dados que enviamos no metadata lá no checkout
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;

      if (userId) {
        console.log(`💰 Pagamento confirmado! User: ${userId} | Plano: ${planId}`);

        // 3. Atualiza o banco de dados com os créditos
        if (planId === 'resume') {
          // Plano Básico: +1 Crédito
          await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: 1 } },
          });
        } else if (planId === 'resume_cover') {
          // Plano Pro: +2 Créditos
          await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: 2 } },
          });
        } else if (planId === 'monthly') {
          // Plano Mensal: +100 Créditos (ou lógica de assinatura premium)
          await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: 100 } },
          });
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}