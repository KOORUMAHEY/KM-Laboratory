import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* existing config options */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack(config) {
    // Add alias to fix Handlebars require.extensions error
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    config.resolve.alias['handlebars/runtime'] = 'handlebars/dist/cjs/handlebars.runtime';
    config.resolve.alias['handlebars'] = 'handlebars/dist/cjs/handlebars';

    return config;
  },
};

export default nextConfig;
