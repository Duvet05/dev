import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.sketchfab.com',
        port: '',
        pathname: '/models/**',
      },
      {
        protocol: 'https',
        hostname: 'sketchfab.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  // Configuración para archivos estáticos grandes
  compress: false,
};

export default nextConfig;
