import { CheckCircle2, FileText, Sparkles } from "lucide-react"

export function FeaturesSection() {
  return (
    // ADICIONADO id="features" AQUI 👇
    <section id="features" className="container py-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Why Choose Perfect Pair Careers?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          We combine cutting-edge AI with career expertise to create the perfect match between you and your dream job.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <Sparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold">AI Precision</h3>
          <p className="text-muted-foreground">Uses Google Gemini 1.5 Flash to match keywords accurately.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <CheckCircle2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold">ATS Friendly</h3>
          <p className="text-muted-foreground">Guaranteed formatting that recruitment robots can read effortlessly.</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold">PDF Analysis</h3>
          <p className="text-muted-foreground">Upload your current PDF and get instant feedback and optimization.</p>
        </div>
      </div>
    </section>
  )
}