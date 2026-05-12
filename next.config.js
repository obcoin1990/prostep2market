/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Prisma and bcryptjs out of the Edge runtime
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'stream.mux.com' },
      { protocol: 'https', hostname: 'image.mux.com' },
      // Supabase storage (profile avatars, thumbnails)
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
  experimental: {},
  // Disable powered-by header in production
  poweredByHeader: false,
  // Compress responses
  compress: true,
  // Strict mode for React
  reactStrictMode: true,
  // Silence ESLint errors during Vercel builds (lint separately in CI)
  // Don't fail build on type errors — catch in CI instead
  typescript: {
    ignoreBuildErrors: false,
  },
  // Redirect bare /dashboard → role-based page (handled in page.tsx, but keep)
  async redirects() {
    return [
      {
        source:      '/dashboard',
        destination: '/dashboard/learner',
        permanent:   false,
      },
    ]
  },
}

module.exports = nextConfig
