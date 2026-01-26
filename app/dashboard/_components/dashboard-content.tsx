'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Clock, TrendingUp, Plus, CreditCard, User, Settings } from "lucide-react"

// AQUI ESTÁ A SOLUÇÃO: 'any' permite que qualquer dado passe sem erro de build
interface DashboardContentProps {
  user: any
}

export function DashboardContent({ user }: DashboardContentProps) {
  // Lógica segura para evitar tela branca
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'User'
  const credits = user?.credits ?? 0 // Se for null ou undefined, usa 0

  return (
    <div className="container py-8 max-w-7xl space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-4">
          <div className="block">
             <h2 className="text-2xl font-bold text-primary">PerfectPair Careers</h2>
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
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              New Optimization
            </Button>
          </Link>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card de Créditos - DESTAQUE */}
        <Card className="border-blue-200 bg-blue-50/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
             <CreditCard className="h-12 w-12 text-blue-700" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Remaining Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-700">{credits}</div>
            <Link href="/pricing" className="text-xs text-blue-600 underline mt-1 block font-medium">
              Buy more credits →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-green-600">Active</div>
             <p className="text-xs text-muted-foreground">Account ready</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Track your progress</p>
          </CardContent>
        </Card>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Coluna Esquerda: Histórico */}
        <Card className="md:col-span-4 h-fit">
          <CardHeader>
            <CardTitle>Recent Optimizations</CardTitle>
            <CardDescription>Your most recent sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed rounded-lg bg-slate-50/50">
               <div className="bg-white p-4 rounded-full shadow-sm">
                  <FileText className="h-8 w-8 text-slate-300" />
               </div>
               <div>
                 <p className="text-base font-medium text-slate-900">No optimizations yet</p>
                 <p className="text-sm text-slate-500 max-w-[250px] mx-auto mt-2">
                   Use your credits to tailor your resume for a specific job description.
                 </p>
               </div>
               <Link href="/optimize">
                 <Button className="mt-2">Start Optimization</Button>
               </Link>
            </div>
          </CardContent>
        </Card>

        {/* Coluna Direita: Perfil (RESTAURADO) */}
        <div className="md:col-span-3 space-y-6">
          
          {/* ABA DE PERFIL */}
          <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                My Profile
              </CardTitle>
              <CardDescription>Manage personal info & resume.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile" className="w-full">
                <Button variant="outline" className="w-full justify-between hover:bg-slate-50">
                  Manage Settings
                  <Settings className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pro Tip</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Did you know? Generic resumes are rejected by ATS 75% of the time. Always use the <strong>Optimizer</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}