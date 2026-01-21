
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  FileText, 
  Mail, 
  Infinity, 
  Check,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'

interface BillingDate {
  user: {
    credits: number
    subscription?: {
      status: string
      planType: string
      currentPeriodEnd?: string
    }
  }
  payments: Array<{
    id: string
    amount: number
    paymentType: string
    status: string
    createdAt: string
    description?: string
  }>
}

const plans = [
  {
    id: 'resume',
    name: 'Resume Optimization',
    price: '9.99',
    description: 'Perfect for a quick optimization',
    features: [
      'ATS analysis of your resume',
      'AI-powered optimization',
      'Compatibility score',
      'Improvement suggestions',
      'PDF download',
      'Multilingual support'
    ],
    icon: FileText,
    credits: 1,
    paymentType: 'ONE_TIME_RESUME'
  },
  {
    id: 'resume_cover',
    name: 'Resume + Cover Letter',
    price: '14.99',
    description: 'Complete combo to stand out',
    features: [
      'Everything from previous plan',
      'Optimized cover letter',
      'Alignment with job posting',
      'Advanced personalization',
      'Professional templates',
      'Detailed feedback'
    ],
    icon: Mail,
    credits: 2,
    paymentType: 'ONE_TIME_RESUME_COVER',
    popular: true
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: '29.99',
    description: 'For those actively searching',
    features: [
      'Unlimited optimizations',
      'Everything from previous plans',
      'Priority support',
      'Complete history',
      'Multiple versions',
      'Automatic updates'
    ],
    icon: Infinity,
    recurring: true,
    paymentType: 'MONTHLY_SUBSCRIPTION'
  }
]

export function BillingContent() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [billingDate, setBillingDate] = useState<BillingDate | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)

  useEffect(() => {
    fetchBillingDate()
  }, [])

  const fetchBillingDate = async () => {
    try {
      const response = await fetch('/api/billing')
      if (response.ok) {
        const data = await response.json()
        setBillingDate(data)
      }
    } catch (error) {
      console.error('Error fetching billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (planId: string) => {
    setProcessingPayment(planId)

    try {
      // For now, simulate purchase (Stripe will be implemented later)
      toast({
        title: 'Feature coming soon',
        description: 'Stripe integration will be implemented soon. For now, you can test the features using test credits.',
      })

      // Simular compra para testes
      const plan = plans.find(p => p.id === planId)
      if (plan && !plan.recurring) {
        // Add test credits
        const response = await fetch('/api/billing/add-test-credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credits: plan.credits })
        })

        if (response.ok) {
          toast({
            title: 'Test credits added!',
            description: `${plan.credits} credit(s) have been added to your account for testing.`,
          })
          fetchBillingDate()
        }
      }
    } catch (error) {
      console.error('Purchase error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not process payment. Please try again.',
      })
    } finally {
      setProcessingPayment(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2)
  }

  const getPaymentStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { label: 'Paid', color: 'bg-green-100 text-green-800', icon: Check }
      case 'PENDING':
        return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
      case 'FAILED':
        return { label: 'Failed', color: 'bg-red-100 text-red-800', icon: AlertCircle }
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Credits & Billing</h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your credits, plans and payment history
            </p>
          </div>

          {/* Current Status */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{billingDate?.user?.credits || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {billingDate?.user?.subscription?.status === 'ACTIVE' ? 'Active plan' : 'Paid credits'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                  <Badge className={billingDate?.user?.subscription?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {billingDate?.user?.subscription?.status === 'ACTIVE' ? 'Premium' : 'Basic'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {billingDate?.user?.subscription?.status === 'ACTIVE' ? 'Active' : 'Basic'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current plan type
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Stripe Integration Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Test Version:</strong> Stripe integration will be implemented soon. 
                For now, you can add test credits to try all features.
              </AlertDescription>
            </Alert>
          </motion.div>

          {/* Pricing Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose your plan</h2>
              <p className="text-gray-600">Select the ideal plan for your needs</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {plans?.map?.((plan, index) => {
                const IconComponent = plan?.icon
                const isProcessing = processingPayment === plan?.id
                
                return (
                  <motion.div
                    key={plan?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className={`relative h-full transition-all duration-300 hover:shadow-lg ${
                      plan?.popular ? 'ring-2 ring-purple-600' : 'hover:ring-1 hover:ring-purple-200'
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
                            {plan?.recurring && <span className="text-base text-gray-500 ml-1">/month</span>}
                          </div>
                          {!plan?.recurring && (
                            <p className="text-sm text-gray-500 mt-1">
                              {plan?.credits} credit{(plan?.credits && plan.credits > 1) ? 's' : ''}
                            </p>
                          )}
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
                        
                        <Button 
                          className={`w-full ${
                            plan?.popular 
                              ? 'bg-purple-600 hover:bg-purple-700' 
                              : ''
                          }`}
                          variant={plan?.popular ? 'default' : 'outline'}
                          disabled={isProcessing}
                          onClick={() => handlePurchase(plan?.id)}
                        >
                          {isProcessing ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Processing...
                            </>
                          ) : (
                            `${plan?.recurring ? 'Subscribe' : 'Purchase'} Now`
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment History
                </CardTitle>
                <CardDescription>
                  All your transactions and credit purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                {billingDate?.payments && billingDate.payments.length > 0 ? (
                  <div className="space-y-4">
                    {billingDate.payments.map((payment) => {
                      const status = getPaymentStatus(payment?.status)
                      const StatusIcon = status?.icon
                      
                      return (
                        <div key={payment?.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-full bg-blue-100">
                              <CreditCard className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {payment?.description || 
                                 (payment?.paymentType === 'ONE_TIME_RESUME' ? 'Resume Optimization' :
                                  payment?.paymentType === 'ONE_TIME_RESUME_COVER' ? 'Resume + Cover Letter' :
                                  payment?.paymentType === 'MONTHLY_SUBSCRIPTION' ? 'Monthly Plan' : 'Payment')}
                              </p>
                              <p className="text-sm text-gray-600">
                                €{formatAmount(payment?.amount)} • {formatDate(payment?.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${status?.color} flex items-center space-x-1`}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{status?.label}</span>
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No transactions yet
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Your purchases and payments will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
