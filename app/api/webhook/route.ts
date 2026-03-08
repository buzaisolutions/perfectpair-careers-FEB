import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getSettingOrEnv } from '@/lib/runtime-settings';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    const stripeSecret = await getSettingOrEnv('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY)
    const webhookSecret = await getSettingOrEnv('STRIPE_WEBHOOK_SECRET', process.env.STRIPE_WEBHOOK_SECRET)
    if (!stripeSecret || !webhookSecret) {
      return NextResponse.json({ error: 'Stripe config missing' }, { status: 500 })
    }

    const stripe = new Stripe(stripeSecret, {
      typescript: true,
    });

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

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        let userId = paymentIntent.metadata?.userId;
        let paymentType = paymentIntent.metadata?.paymentType as
          | 'ONE_TIME_RESUME'
          | 'ONE_TIME_RESUME_COVER'
          | 'MONTHLY_SUBSCRIPTION'
          | undefined;
        let planId = paymentIntent.metadata?.planId;
        let credits = paymentIntent.metadata?.credits;

        // Fallback for old checkout sessions created before payment_intent metadata propagation
        if (!userId) {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          });
          const checkoutSession = sessions.data?.[0];
          if (checkoutSession?.metadata) {
            userId = checkoutSession.metadata.userId;
            paymentType = (checkoutSession.metadata.paymentType as any) || paymentType;
            planId = checkoutSession.metadata.planId || planId;
            credits = checkoutSession.metadata.credits || credits;
          }
        }

        if (!userId) break;

        await prisma.payment.create({
          data: {
            userId,
            // Keep null to avoid collisions with a later successful attempt using the same PaymentIntent id.
            stripePaymentId: null,
            amount: paymentIntent.amount || 0,
            paymentType: paymentType || 'ONE_TIME_RESUME',
            status: 'FAILED',
            creditsGranted: parseInt(credits || '0', 10) || undefined,
            description:
              paymentIntent.last_payment_error?.message ||
              `Payment failed for ${planId || 'unknown-plan'}`,
          },
        });

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
