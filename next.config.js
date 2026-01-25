/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignora pacotes que causam erro no servidor (PDF e Canvas)
  serverExternalPackages: ['pdf-parse', 'mammoth', 'canvas'],

  // Ajuste do Webpack para ignorar dependências de navegador
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;