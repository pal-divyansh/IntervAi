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
  // For static export (if needed)
  // output: 'export',
  // distDir: 'build',
}

module.exports = nextConfig
