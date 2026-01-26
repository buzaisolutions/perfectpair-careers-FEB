'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft, Zap, Tag, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// CONFIGURAÇÃO DOS PLANOS (EM EURO)
const PLANS = [
  {
    id: "resume",
    name: "Resume Optimization",
    description: "Optimize a single resume for a specific job.",
    price: 9.99, // Valor em Euro
    credits: 5,
    features: ["5 Credits", "PDF Export included", "Basic ATS Analysis"],
    highlight: false,
  },
  {
    id: "resume_cover",
    name: "Resume + Cover Letter",
    description: "Full application package optimization.",
    price: 19.99, // Valor em Euro
    credits: 20,
    features: ["20 Credits", "Cover Letter Generation", "Priority Processing", "Editable DOCX Export"],
    highlight: true,
  },
  {
    id: "monthly",
    name: "Career Growth",
    description: "Best for active job seekers applying often.",
    price: 29.99, // Valor em Euro
    credits: 50,
    features: ["50 Credits", "LinkedIn Optimization", "All Premium Features", "24/7 Support"],
    highlight: false,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "PROMO20") {
      setDiscount(0.2)
      setMessage({ text: "Coupon applied! 20% off unlocked.", type: "success" })
    } else {
      setDiscount(0)
      setMessage({ text: "Invalid or expired coupon code.", type: "error" })
    }
  }

  const handleCheckout = async (plan: typeof PLANS[0]) => {
    try {
      setLoadingPlan(plan.id)
      
      const finalPrice = discount > 0 ? (plan.price * (1 - discount)) : plan.price

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          name: plan.name,
          price: finalPrice,
          credits: plan.credits,
          currency: "eur" // Força o envio em Euro para a API
        }),
      })

      if (response.status === 401) {
        router.push(`/auth/signin?callbackUrl=/pricing`)
        return
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("Failed to create checkout session")
      }

    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {/* Container principal centralizado */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 w-full">
        
        <div className="w-full max-w-6xl">
            <div className="mb-8 text-left">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
            </div>

            <div className="text-center space-y-4 mb-10">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get the credits you need to land your dream job. Pricing in Euros (€).
            </p>
            </div>

            {/* CUPOM */}
            <div className="max-w-md mx-auto mb-14">
            <div className="flex space-x-2">
                <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Enter coupon code (Try: PROMO20)" 
                    className="pl-9 bg-white"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                />
                </div>
                <Button onClick={applyCoupon} variant="secondary">Apply</Button>
            </div>
            {message && (
                <p className={cn("text-sm mt-2 text-center font-medium", 
                message.type === 'success' ? "text-green-600" : "text-red-500"
                )}>
                {message.text}
                </p>
            )}
            </div>

            {/* CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {PLANS.map((plan) => {
                const finalPrice = discount > 0 ? (plan.price * (1 - discount)).toFixed(2) : plan.price
                const isLoading = loadingPlan === plan.id

                return (
                <Card 
                    key={plan.id}
                    className={cn(
                    "flex flex-col transition-all duration-200 h-full",
                    plan.highlight 
                        ? "border-primary shadow-xl scale-105 relative bg-white z-10" 
                        : "border-slate-200 shadow-sm hover:shadow-md"
                    )}
                >
                    {plan.highlight && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Most Popular
                        </span>
                    </div>
                    )}

                    <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className={cn("text-xl", plan.highlight ? "text-primary" : "")}>
                        {plan.name}
                        </CardTitle>
                        {plan.highlight && <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="flex-1">
                    <div className="mb-6">
                        {discount > 0 && (
                        <span className="text-lg text-muted-foreground line-through mr-2">
                            €{plan.price}
                        </span>
                        )}
                        <span className="text-4xl font-bold">
                        €{finalPrice}
                        </span>
                    </div>
                    
                    <ul className="space-y-3 text-sm text-slate-600 font-medium">
                        {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <Check className={cn("h-4 w-4 mr-2", plan.highlight ? "text-primary" : "text-green-500")} />
                            {feature}
                        </li>
                        ))}
                    </ul>
                    </CardContent>
                    
                    <CardFooter>
                    <Button 
                        className="w-full" 
                        variant={plan.highlight ? "default" : "outline"}
                        onClick={() => handleCheckout(plan)}
                        disabled={!!loadingPlan} 
                    >
                        {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                        ) : (
                        `Choose ${plan.name.split(' ')[0]}`
                        )}
                    </Button>
                    </CardFooter>
                </Card>
                )
            })}
            </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  )
}