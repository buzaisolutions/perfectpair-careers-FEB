/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignora erros de TypeScript no build (Vercel)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignora erros de ESLint no build (Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'roast.perfectpaircareers.com' }],
        destination: '/resume-roast',
      },
      {
        source: '/:path((?!api|_next/static|_next/image|favicon.ico).*)',
        has: [{ type: 'host', value: 'roast.perfectpaircareers.com' }],
        destination: '/resume-roast',
      },
    ]
  },
};

export default nextConfig;
