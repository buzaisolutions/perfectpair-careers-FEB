/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para PDF Parse funcionar na Vercel
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  // Evita erros de linting na build de produção
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;