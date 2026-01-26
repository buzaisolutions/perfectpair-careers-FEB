'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Clock, TrendingUp, Plus, CreditCard, User, Settings } from "lucide-react"

// CORREÇÃO: Definimos os campos opcionais corretamente para evitar erros
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
  // Lógica segura: se firstName for nulo, tenta quebrar o name, senão usa 'User'
  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'User'
  const credits = user?.credits || 0

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
              Welcome back, <span className="font-semibold text-foreground">{displayName}</span>!
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
        {/* Card de Créditos (Destaque) */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Remaining Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{credits}</div>
            <Link href="/pricing" className="text-xs text-blue-600 underline mt-1 block">
              Buy more credits
            </Link>
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
             <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
             <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold text-muted-foreground">Active</div>
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
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-2 border-dashed rounded-lg">
               <div className="bg-slate-100 p-4 rounded-full">
                  <FileText className="h-8 w-8 text-slate-400" />
               </div>
               <div>
                 <p className="text-base font-medium text-slate-900">No optimizations yet</p>
                 <Link href="/optimize">
                   <Button variant="secondary" className="mt-4">Start First Optimization</Button>
                 </Link>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Coluna Direita: Perfil e Dicas */}
        <div className="md:col-span-3 space-y-6">
          
          {/* AQUI ESTÁ A ABA DE PERFIL RESTAURADA */}
          <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                My Profile
              </CardTitle>
              <CardDescription>Manage personal info and default resume.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile" className="w-full">
                <Button variant="outline" className="w-full justify-between">
                  Manage Settings
                  <Settings className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Tips</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-start space-x-3 text-sm p-3 bg-slate-50 rounded-md">
                <Clock className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <p className="text-muted-foreground">Tailor every application to pass the ATS.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}