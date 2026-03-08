import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

// Configuração do Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { planId } = body as { planId?: string }
    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    })

    const plans: Record<
      string,
      { priceId: string; credits?: number; recurring?: boolean; paymentType: string }
    > = {
      resume: {
        priceId: process.env.STRIPE_PRICE_RESUME || "",
        credits: 1,
        paymentType: "ONE_TIME_RESUME",
      },
      resume_cover: {
        priceId: process.env.STRIPE_PRICE_RESUME_COVER || "",
        credits: 5,
        paymentType: "ONE_TIME_RESUME_COVER",
      },
      monthly: {
        priceId: process.env.STRIPE_PRICE_MONTHLY || "",
        credits: 10,
        paymentType: "MONTHLY_SUBSCRIPTION",
      },
    }

    const plan = plans[planId]
    if (!plan?.priceId) {
      return NextResponse.json({ error: "Invalid plan or missing Stripe Price ID" }, { status: 400 })
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${appUrl}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id || "unknown",
        userEmail: session.user.email || "unknown",
        credits: String(plan.credits || 0),
        planId,
        paymentType: plan.paymentType,
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error("[STRIPE_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
