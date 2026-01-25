
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface PaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planId: string
  planName: string
  planPrice: string
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  planId,
  planName,
  planPrice,
}: PaymentMethodDialogProps) {
  const [loading, setLoading] = useState<'stripe' | 'paypal' | null>(null)

  const handleStripeCheckout = async () => {
    setLoading('stripe')
    
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Stripe checkout error:', error)
      toast.error('Failed to start Stripe checkout. Please try again.')
      setLoading(null)
    }
  }

  const handlePayPalCheckout = async () => {
    setLoading('paypal')
    
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create PayPal order')
      }

      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      }
    } catch (error) {
      console.error('PayPal checkout error:', error)
      toast.error('Failed to start PayPal checkout. Please try again.')
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
          <DialogDescription>
            {planName} - €{planPrice}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* PayPal Button - Primary */}
          <Button
            onClick={handlePayPalCheckout}
            disabled={loading !== null}
            className="w-full h-14 bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold text-lg"
            size="lg"
          >
            {loading === 'paypal' ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <div className="flex items-center justify-center w-full">
                <span className="font-bold text-xl">Pay</span>
                <span className="font-bold text-xl text-[#009cde] ml-0.5">Pal</span>
              </div>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or pay with card
              </span>
            </div>
          </div>

          {/* Stripe Button - Secondary */}
          <Button
            onClick={handleStripeCheckout}
            disabled={loading !== null}
            variant="outline"
            className="w-full h-12"
            size="lg"
          >
            {loading === 'stripe' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Credit/Debit Card
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Secure payment processing. Your payment information is encrypted.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
