import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para melhorar performance com arquivos grandes
  experimental: {
    // Aumentar limite de payload para uploads grandes
  },

  // Pacotes externos para server components
  serverExternalPackages: [],

  // Configurações do servidor
  serverRuntimeConfig: {
    // Configurações customizadas podem ser adicionadas aqui
  },

  // Configurações do webpack para melhor processamento
  webpack: (config, { dev }) => {
    if (dev) {
      // Aumentar limite de memória para desenvolvimento
      config.performance = {
        ...config.performance,
        maxAssetSize: 10000000, // 10MB
        maxEntrypointSize: 10000000, // 10MB
      };
    }

    return config;
  },

  // Headers para uploads grandes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
