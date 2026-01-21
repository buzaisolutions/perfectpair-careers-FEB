
import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      credits: number
      firstName: string
      lastName: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: string
    credits: number
    firstName: string
    lastName: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: string
    credits: number
    firstName: string
    lastName: string
  }
}

export interface OptimizationRequest {
  jobDescription: string
  jobTitle: string
  jobCompany?: string
  jobLocation?: string
  jobUrl?: string
  optimizationType: 'RESUME_ONLY' | 'COVER_LETTER_ONLY' | 'RESUME_AND_COVER_LETTER'
  targetLanguage: 'PORTUGUESE' | 'ENGLISH' | 'DUTCH'
  documentId?: string
  coverLetter?: string
}

export interface OptimizationResponse {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  optimizedContent: string
  feedback?: string
  atsScore?: number
  keywordMatches: string[]
  improvementSuggestions: string[]
  optimizedPdfPath?: string
}
