'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'           // Import necessário para o botão voltar
import { ArrowLeft } from 'lucide-react' // Ícone da seta

export default function OptimizePage() {
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleOptimize = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        body: JSON.stringify({
          documentId: result?.documentId, 
          jobTitle: result?.jobPosting?.title,
        }),
      })

      if (!response.ok) throw new Error('Optimization failed') // Traduzido

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.status === 'completed') {
                setResult(data.result)
                router.refresh()
              }
            } catch (e) {
              console.error("Error processing JSON stream", e) // Traduzido
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
      alert('Error optimizing resume.') // Traduzido
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 1. Botão de Voltar Adicionado */}
      <Link 
        href="/dashboard" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Título Traduzido */}
      <h1 className="text-2xl font-bold mb-4">Resume Optimization</h1>

      {/* Match Score Traduzido */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center justify-between">
        <div>
          <span className="text-sm text-blue-600 font-semibold uppercase">Match Score</span>
          <div className="text-3xl font-bold text-blue-900">
            {result?.atsScore || 0}%
          </div>
        </div>
        <div className="text-sm text-blue-700 max-w-xs text-right">
          {result?.status === 'COMPLETED' 
            ? "Your resume has been optimized for this job!" 
            : "Waiting for optimization..."}
        </div>
      </div>

      {/* Botão Traduzido */}
      <button
        onClick={handleOptimize}
        disabled={isLoading || result?.status === 'COMPLETED'}
        className={`w-full py-3 rounded-md font-bold transition ${
          isLoading || result?.status === 'COMPLETED'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isLoading ? 'Processing with AI...' : 
         result?.status === 'COMPLETED' ? 'Resume Already Optimized' : 'Optimize Now'}
      </button>

      {/* Sugestão de Nome Traduzido */}
      {result?.suggestedFileName && (
        <p className="mt-4 text-sm text-gray-500">
          Suggested filename: <span className="font-mono">{result.suggestedFileName}</span>
        </p>
      )}
    </div>
  )
}