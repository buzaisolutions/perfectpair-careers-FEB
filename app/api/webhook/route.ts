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

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const paymentType = session.metadata?.paymentType as
          | 'ONE_TIME_RESUME'
          | 'ONE_TIME_RESUME_COVER'
          | 'MONTHLY_SUBSCRIPTION'
          | undefined;

        if (!userId) break;

        const stripePaymentId = (session.payment_intent as string) || session.id;
        const existingPayment = await prisma.payment.findUnique({
          where: { stripePaymentId },
        });
        if (existingPayment) break;

        await prisma.payment.create({
          data: {
            userId,
            stripePaymentId,
            amount: session.amount_total || 0,
            paymentType: paymentType || 'ONE_TIME_RESUME',
            status: 'COMPLETED',
            creditsGranted: parseInt(session.metadata?.credits || '0', 10) || undefined,
            description: `Payment for ${session.metadata?.planId || 'unknown-plan'}`,
          },
        });

        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string | null;
          if (subscriptionId) {
            await prisma.subscription.upsert({
              where: { userId },
              update: {
                status: 'ACTIVE',
                planType: 'MONTHLY',
                stripeSubscriptionId: subscriptionId,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
              create: {
                userId,
                status: 'ACTIVE',
                planType: 'MONTHLY',
                stripeSubscriptionId: subscriptionId,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            });
          }

          await prisma.user.update({
            where: { id: userId },
            data: { credits: -1 },
          });
        } else {
          const creditsToAdd = parseInt(session.metadata?.credits || '0', 10);
          if (creditsToAdd > 0) {
            await prisma.user.update({
              where: { id: userId },
              data: { credits: { increment: creditsToAdd } },
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const dbSubscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (dbSubscription) {
          await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              status: 'CANCELLED',
              cancelAtPeriodEnd: true,
            },
          });
          await prisma.user.update({
            where: { id: dbSubscription.userId },
            data: { credits: 0 },
          });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
