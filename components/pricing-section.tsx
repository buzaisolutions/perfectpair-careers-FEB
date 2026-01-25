import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PricingSection() {
  return (
    // ADICIONADO id="pricing" AQUI 👇
    <section id="pricing" className="border-t bg-muted/40 py-24">
      <div className="container space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="text-gray-500 dark:text-gray-400">Start for free, upgrade for power.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col p-6 border rounded-xl bg-background shadow-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-2xl">Starter</h3>
              <p className="text-muted-foreground">Perfect for testing the waters.</p>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold">
              Free
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 1 Resume Optimization</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Basic ATS Check</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> PDF Download</li>
            </ul>
            <Link href="/dashboard" className="mt-8">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col p-6 border-2 border-indigo-600 rounded-xl bg-background shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-2xl">Professional</h3>
              <p className="text-muted-foreground">For serious job seekers.</p>
            </div>
            <div className="mt-4 flex items-baseline text-3xl font-bold">
              $9.99<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </div>
            <ul className="mt-6 space-y-3 flex-1">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Unlimited Optimizations</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Advanced AI Cover Letters</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Priority Support</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Multiple Resume Versions</li>
            </ul>
            <Link href="/dashboard" className="mt-8">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Subscribe Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}