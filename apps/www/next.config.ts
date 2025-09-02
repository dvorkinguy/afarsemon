import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better monorepo support
  experimental: {
    externalDir: true, // Allow importing from outside the app directory
  },
  
  // Configure webpack to properly resolve workspace packages
  webpack: (config, { isServer }) => {
    // Handle workspace packages resolution
    if (!isServer) {
      // For client-side builds, ensure proper resolution
      config.resolve.alias = {
        ...config.resolve.alias,
        '@afarsemon/env': require.resolve('../../../packages/env/src/index.ts'),
      };
    }
    
    return config;
  },
  
  // Transpile workspace packages
  transpilePackages: ['@afarsemon/env'],
};

export default nextConfig;
