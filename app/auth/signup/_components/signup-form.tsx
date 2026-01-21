
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function SignUpForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    acceptTerms: false
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!formData?.acceptTerms) {
      setError('You must accept the terms of use')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error creating account')
      }

      toast({
        title: 'Account created successfully!',
        description: 'Signing in...',
      })

      // Auto-login after registration
      const result = await signIn('credentials', {
        email: formData?.email,
        password: formData?.password,
        redirect: false,
      })

      if (result?.error) {
        router.replace('/auth/signin?message=account-created')
      } else {
        router.replace('/dashboard')
      }
    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error?.message || 'Internal error. Please try again.')
      toast({
        variant: 'destructive',
        title: 'Error creating account',
        description: error?.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            value={formData?.firstName || ''}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={formData?.lastName || ''}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData?.email || ''}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Minimum 6 characters"
          value={formData?.password || ''}
          onChange={handleChange}
          required
          minLength={6}
          disabled={isLoading}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="acceptTerms"
          checked={formData?.acceptTerms || false}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, acceptTerms: !!checked }))
          }
          disabled={isLoading}
        />
        <Label 
          htmlFor="acceptTerms" 
          className="text-sm font-normal cursor-pointer"
        >
          I accept the terms of use and privacy policy
        </Label>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  )
}
