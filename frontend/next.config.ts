import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // If you need to use environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};

export default nextConfig;