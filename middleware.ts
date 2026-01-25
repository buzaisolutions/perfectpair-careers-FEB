import { withAuth } from "next-auth/middleware"

export default withAuth({
  // Se o usuário tentar acessar o dashboard sem logar, 
  // ele será redirecionado para a página de login do NextAuth.
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

// Configuração de quais rotas devem ser protegidas
export const config = {
  // O matcher define onde o middleware vai atuar (bloquear).
  // Estamos bloqueando:
  // 1. /dashboard (e tudo dentro dele)
  // 2. /api/optimize (para ninguém usar sua IA de graça via Postman/Curl)
  matcher: [
    "/dashboard/:path*",
    "/api/optimize/:path*"
  ]
}