import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better monorepo support
  experimental: {
    externalDir: true, // Allow importing from outside the app directory
    // turbopackPersistentCaching: true, // Only available in Next.js canary versions
  },
  
  // Turbopack configuration (replaces webpack when using --turbopack)
  turbopack: {
    // Configure module aliases for workspace packages
    resolveAlias: {
      '@afarsemon/env': '../../../packages/env/src/index.ts',
    },
    // Ensure proper file extension resolution
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  
  // Transpile workspace packages
  transpilePackages: ['@afarsemon/env'],
};

export default nextConfig;
