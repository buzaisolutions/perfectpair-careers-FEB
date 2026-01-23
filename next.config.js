/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignora erros de TypeScript durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignora erros de ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Otimização de imagens (padrão)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;