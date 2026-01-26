'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Clock, TrendingUp, Plus, CreditCard, User, Settings } from "lucide-react"

// CORREÇÃO: Definimos que o usuário PODE ter firstName, lastName e credits
interface DashboardContentProps {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    firstName?: string | null
    lastName?: string | null
    credits?: number
  }
}

export function DashboardContent({ user }: DashboardContentProps) {
  // Lógica segura para exibir o nome
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'User'
  
  // Garante que mostre 0 se for nulo
  const credits = user?.credits || 0

  return (
    <div className="container py-8 max-w-7xl space-y-8">
      
      {/* 1. CABEÇALHO */}
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
              Welcome back, <span className="font-semibold text-foreground">{firstName}</span>!
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

      {/* 2. ESTATÍSTICAS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* CARD DE CRÉDITOS */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Remaining Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {/* AQUI ESTÁ A VARIÁVEL QUE MOSTRA OS CRÉDITOS REAIS */}
            <div className="text-3xl font-bold text-primary">{credits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/pricing" className="underline hover:text-primary">Buy more credits</Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Optimizations</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Lifetime total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumes Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Documents ready</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--%</div>
            <p className="text-xs text-muted-foreground">Complete your profile</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. ÁREA PRINCIPAL */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Histórico Recente */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Optimizations</CardTitle>
            <CardDescription>
              Your most recent resume tailoring sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
               <div className="bg-slate-50 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-slate-400" />
               </div>
               <div>
                 <p className="text-sm font-medium text-slate-900">No optimizations yet</p>
                 <p className="text-xs text-slate-500 max-w-[200px] mx-auto mt-1">
                   Start by clicking "New Optimization" to tailor your resume.
                 </p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* ÁREA LATERAL (PERFIL E DICAS) */}
        <div className="col-span-3 space-y-4">
          
          {/* CARD DE PERFIL (RESTAURADO) */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5" />
                My Profile
              </CardTitle>
              <CardDescription>
                Manage your personal info and documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button variant="outline" className="w-full justify-between">
                  Manage Settings
                  <Settings className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-start space-x-3 text-sm">
                <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                <p className="text-muted-foreground">
                  Use the <strong>Job Seeker</strong> pack for better ATS matching algorithms.
                </p>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <Clock className="mt-0.5 h-4 w-4 text-primary" />
                <p className="text-muted-foreground">
                  Always upload the specific job description for best results.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}