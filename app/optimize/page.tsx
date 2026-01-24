const handleOptimize = async () => {
    if (!selectedDocId || !jobDescription || !jobTitle) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill in all fields.' })
      return
    }

    setStep('processing')
    setStreamMessage('Analyzing resume (this may take 10-20 seconds)...')

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: selectedDocId,
          jobTitle,
          jobDescription,
          optimizationType: 'RESUME_ONLY'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Optimization failed')
      }

      // Sucesso!
      if (data.result) {
        setResult({
          originalScore: Math.floor((data.result.atsScore || 50) * 0.4),
          optimizedScore: data.result.atsScore || 85,
          missingKeywords: data.result.keywordAnalysis?.criticalMissing || [],
          strongPoints: data.result.keywordAnalysis?.importantMatched || [],
          analysis: data.result.feedback
        })
        setStep('result')
      } else {
        throw new Error('AI returned empty result')
      }

    } catch (error: any) {
      console.error(error)
      // Agora veremos o erro real na tela vermelha!
      toast({ variant: 'destructive', title: 'Error', description: error.message })
      setStep('input')
    }
  }