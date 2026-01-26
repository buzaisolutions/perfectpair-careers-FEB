import { Suspense } from 'react'
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// IMPORTAÇÃO CORRIGIDA (Baseada no nome do arquivo que você confirmou)
// Se o VS Code sublinhar de vermelho, verifique se a função dentro do arquivo se chama 'SignInForm'
import { SignInForm } from "./_components/signin-form"
export const metadata: Metadata = {
  title: "Login | PerfectPair Careers",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0 bg-gray-50">
      
      {/* 1. BOTÃO VOLTAR PARA HOME */}
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="lg:p-8 w-full max-w-md mx-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6">
          
          {/* 2. LOGO CENTRALIZADA */}
          <div className="flex flex-col items-center text-center space-y-2">
            <Link href="/">
              <Image 
                src="/logo.png" 
                alt="PerfectPair Careers" 
                width={220} 
                height={80}
                className="h-16 w-auto object-contain mb-4"
                priority
              />
            </Link>
          </div>

          <Card className="shadow-lg border-slate-200">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Enter your email to sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                {/* Aqui carregamos o formulário */}
                <SignInForm />
              </Suspense>
              
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                    Sign up
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/policies/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/policies/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}