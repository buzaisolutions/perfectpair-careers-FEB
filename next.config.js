/** @type {import('next').NextConfig} */
const nextConfig = {
  // Diz ao Next.js para não tentar otimizar esses pacotes no lado do cliente
  serverExternalPackages: ['pdf-parse', 'mammoth', 'canvas'],

  webpack: (config) => {
    // Ignora módulos de canvas nativos que não funcionam no servidor
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;