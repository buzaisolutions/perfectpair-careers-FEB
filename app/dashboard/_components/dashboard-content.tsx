'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Clock, TrendingUp, Plus, CreditCard } from "lucide-react"

// AQUI ESTAVA O ERRO: Adicionamos firstName, lastName e credits na tipagem
interface DashboardContentProps {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    firstName?: string | null // Novo
    lastName?: string | null  // Novo
    credits?: number          // Novo
  }
}

export function DashboardContent({ user }: DashboardContentProps) {
  // Agora o TypeScript aceita user.firstName
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'User'
  const credits = user?.credits || 0

  return (
    <div className="container py-8 max-w-7xl space-y-8">
      
      {/* 1. LOGO E CABEÇALHO */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-4">
          <div className="block">
            <Image 
              src="/logo.png" 
              alt="PerfectPair Careers" 
              width={200} 
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, <span className="font-semibold text-foreground">{firstName}</span>! Here's an overview of your career tools.
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
           <Link href="/pricing">
            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Add Credits
            </Button>
          </Link>
          <Link href="/optimize">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Optimization
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Optimizations</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Start your first optimization</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumes Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ready to export</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ATS Score Avg</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--%</div>
            <p className="text-xs text-muted-foreground">Unlock scores with credits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Exibe os créditos reais */}
            <div className="text-2xl font-bold">{credits}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/pricing" className="text-primary hover:underline">Buy more credits</Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Área Principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Optimizations</CardTitle>
            <CardDescription>
              Your most recent resume tailoring sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
               <div className="bg-slate-50 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-slate-400" />
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-900">No optimizations yet</p>
                 <p className="text-xs text-slate-500 max-w-[200px] mx-auto mt-1">
                   Start by clicking "New Optimization" to tailor your resume for a job.
                 </p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Resume Tips</CardTitle>
            <CardDescription>
              How to improve your success rate.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-start space-x-4 rounded-md border p-4">
              <Clock className="mt-1 h-5 w-5 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Tailor every application</p>
                <p className="text-sm text-muted-foreground">
                  Generic resumes are rejected by ATS 75% of the time. Always use the "New Optimization" button.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 rounded-md border p-4 bg-muted/50">
              <Sparkles className="mt-1 h-5 w-5 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Use Action Verbs</p>
                <p className="text-sm text-muted-foreground">
                  Start bullet points with strong verbs like "Led", "Developed", or "Increased".
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}