/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Vercel works best with the default Next.js configuration
  // No need for trailingSlash or custom output directory
};

module.exports = nextConfig; 