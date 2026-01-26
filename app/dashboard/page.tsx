import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Settings, User } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container py-10 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Manage your resumes and optimize for new jobs.
          </p>
        </div>
        <Link href="/optimize">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Sparkles className="mr-2 h-4 w-4" />
            New Optimization
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card Principal: Começar Otimização */}
        <Card className="hover:border-primary/50 transition-colors cursor-pointer border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Sparkles className="mr-2 h-5 w-5" />
              Optimize a Resume
            </CardTitle>
            <CardDescription>
              Tailor your resume for a specific job description using AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/optimize">
              <Button className="w-full">Start Now</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card: Meus Documentos (Placeholder para o futuro) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              My Documents
            </CardTitle>
            <CardDescription>
              View and download your previously optimized resumes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Card: Perfil e Configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your subscription, profile details and password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile">
              <Button variant="outline" className="w-full">
                Manage Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}