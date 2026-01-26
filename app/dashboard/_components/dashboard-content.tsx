'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Clock, TrendingUp, Plus, CreditCard } from "lucide-react"

interface DashboardContentProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="container py-8 max-w-7xl space-y-8">
      
      {/* 1. Cabeçalho com Boas-vindas e Botão de Ação */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}! Here's an overview of your career tools.
          </p>
        </div>
        <div className="flex space-x-2">
           {/* Botão para comprar créditos (Exemplo) */}
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

      {/* 2. Cards de Estatísticas (KPIs) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Optimizations</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumes Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Across 3 different industries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ATS Score Avg</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+12% improvement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Expires in 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Área Principal: Histórico Recente e Dicas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Tabela de Histórico (Ocupa 4 colunas) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Optimizations</CardTitle>
            <CardDescription>
              Your most recent resume tailoring sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Exemplo de Lista Vazia ou Preenchida */}
            <div className="space-y-4">
               {/* Item 1 */}
               <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                        <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none">Software Engineer - Google</p>
                        <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-green-600">92% Match</div>
               </div>

               {/* Item 2 */}
               <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none">Product Manager - Amazon</p>
                        <p className="text-xs text-muted-foreground">Updated yesterday</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-amber-600">78% Match</div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Lateral: Quick Tips ou Upgrade (Ocupa 3 colunas) */}
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