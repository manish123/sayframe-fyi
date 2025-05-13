/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  },
};

module.exports = nextConfig;
