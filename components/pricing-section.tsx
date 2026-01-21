
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, FileText, Mail, Infinity, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const plans = [
  {
    id: 'resume',
    name: 'Resume Optimization',
    price: '9.99',
    description: 'Perfect for quick optimization',
    features: [
      'ATS analysis of your resume',
      'AI-powered optimization',
      'Compatibility score',
      'Improvement suggestions',
      'PDF download',
      'Multilingual support'
    ],
    icon: FileText,
    popular: false,
    credits: 1
  },
  {
    id: 'resume_cover',
    name: 'Resume + Cover Letter',
    price: '14.99',
    description: 'Complete combo to stand out',
    features: [
      'Everything from previous plan',
      'Optimized cover letter',
      'Job alignment',
      'Advanced personalization',
      'Professional templates',
      'Detailed feedback'
    ],
    icon: Mail,
    popular: true,
    credits: 2
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: '29.99',
    description: 'For active job seekers',
    features: [
      'Unlimited optimizations',
      'Everything from previous plans',
      'Priority support',
      'Complete history',
      'Multiple versions',
      'Automatic updates'
    ],
    icon: Infinity,
    popular: false,
    recurring: true
  }
]

export function PricingSection() {
  const { data: session } = useSession()
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose your plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Transparent and flexible pricing for all user profiles.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {plans?.map?.((plan, index) => {
            const IconComponent = plan?.icon
            return (
              <motion.div
                key={plan?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredPlan(plan?.id)}
                onHoverEnd={() => setHoveredPlan(null)}
              >
                <Card className={`relative h-full transition-all duration-300 hover:shadow-lg ${
                  plan?.popular ? 'ring-2 ring-purple-600' : 'hover:ring-1 hover:ring-purple-200'
                } ${
                  hoveredPlan === plan?.id ? 'scale-105' : ''
                }`}>
                  {plan?.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                      <IconComponent className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl font-bold">{plan?.name}</CardTitle>
                    <CardDescription className="mt-2">{plan?.description}</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">€{plan?.price}</span>
                        {plan?.recurring && <span className="text-base text-gray-500 ml-1">/mês</span>}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan?.features?.map?.((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mr-3 mt-0.5" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter className="pt-8">
                    <Button 
                      className={`w-full group ${
                        plan?.popular 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : ''
                      }`}
                      variant={plan?.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href={session ? '/billing' : '/auth/signup'}>
                        {session ? 'Select Plan' : 'Get Started Now'}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            All plans include multilingual support (Portuguese, English, Dutch) and complete ATS analysis.
          </p>
        </div>
      </div>
    </section>
  )
}
