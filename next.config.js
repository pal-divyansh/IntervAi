/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ekdtkdnropuewcvqkvvs.supabase.co',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
  // Ensure middleware runs on all routes
  middleware: 'default',
  // For static export (if needed)
  // output: 'export',
  // distDir: 'build',
}

// Injected content via @vercel/next/plugins
const withVercel = require('@vercel/next/plugins')({ 
  // Vercel specific config
});

module.exports = withVercel(nextConfig);
