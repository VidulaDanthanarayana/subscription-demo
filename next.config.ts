import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remove distDir and output settings for better Netlify compatibility
};

export default nextConfig;
