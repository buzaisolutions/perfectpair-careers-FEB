import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

// CORREÇÃO: Removemos a data específica para evitar conflito de versões.
// O "typescript: true" ajuda a tipagem a funcionar melhor.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

export async function POST(req: Request) {
  try {
    // 1. Verifica se o usuário está logado
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // 2. Recebe os dados da página de Pricing
    const body = await req.json()
    const { planId, price, name, credits } = body

    // URL base para retorno
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // 3. Cria a sessão de pagamento no Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          // Modo dinâmico: O preço vem do front-end (já com desconto do cupom)
          price_data: {
            currency: "usd",
            product_data: {
              name: name, // Ex: "Job Seeker Pack"
              description: `${credits} AI Optimization Credits`,
            },
            // Stripe usa centavos (multiplicamos por 100)
            unit_amount: Math.round(price * 100), 
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Pagamento único
      success_url: `${appUrl}/dashboard?success=true&credits=${credits}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id || "unknown",
        userEmail: session.user.email || "unknown",
        credits: credits.toString(),
        planId: planId,
      },
    })

    return NextResponse.json({ url: stripeSession.url })

  } catch (error) {
    console.error("[STRIPE_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}