// Forcando atualizacao do arquivo
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// CORREÇÃO: Removemos "optimizationInitialData" dos argumentos.
// O Next.js não aceita props customizadas na página principal.
export default function OptimizePage() {
  const router = useRouter()
  
  // 1. Estados para controlar a interface
  const [isLoading, setIsLoading] = useState(false)
  // Inicializamos como null ou objeto vazio para evitar erro de tipo
  const [result, setResult] = useState<any>(null)

  const handleOptimize = async () => {
    // Se não tivermos dados para enviar (ex: documentId), paramos.
    // Em um cenário real, você pegaria o ID da URL ou de um contexto.
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        // Atenção: Certifique-se de que result tem os dados antes de enviar
        // Ou pegue os dados de um formulário/contexto local
        body: JSON.stringify({
          documentId: result?.documentId, 
          jobTitle: result?.jobPosting?.title,
          // Adicione aqui outros campos se necessário
        }),
      })

      if (!response.ok) throw new Error('Falha na otimização')

      // Lógica para ler a Stream
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
              console.error("Erro ao processar JSON stream", e)
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao otimizar currículo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Otimização de Currículo</h1>

      {/* Exibição do Match Score */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center justify-between">
        <div>
          <span className="text-sm text-blue-600 font-semibold uppercase">Match Score</span>
          <div className="text-3xl font-bold text-blue-900">
            {result?.atsScore || 0}%
          </div>
        </div>
        <div className="text-sm text-blue-700 max-w-xs">
          {result?.status === 'COMPLETED' 
            ? "Seu currículo foi otimizado para esta vaga!" 
            : "Aguardando otimização..."}
        </div>
      </div>

      {/* Botão com as travas de segurança */}
      <button
        onClick={handleOptimize}
        disabled={isLoading || result?.status === 'COMPLETED'}
        className={`w-full py-3 rounded-md font-bold transition ${
          isLoading || result?.status === 'COMPLETED'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isLoading ? 'Processando com IA...' : 
         result?.status === 'COMPLETED' ? 'Currículo já Otimizado' : 'Otimizar Agora'}
      </button>

      {/* Exibição do Nome do Arquivo Sugerido */}
      {result?.suggestedFileName && (
        <p className="mt-4 text-sm text-gray-500">
          Sugestão de nome: <span className="font-mono">{result.suggestedFileName}</span>
        </p>
      )}
    </div>
  )
}