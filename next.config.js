/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use .next-build to avoid Windows Defender/Search Indexer locking .next artefacts
  distDir: '.next-build',
  // Keep Prisma and bcryptjs out of the Edge runtime
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  // Explicitly set workspace root to suppress turbopack warning
  // (caused by parent-directory package-lock.json)
  turbopack: {
    root: __dirname,
  },
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
  // No redirects needed — /dashboard is handled by (dashboard)/dashboard/page.tsx
  async redirects() {
    return []
  },
}

module.exports = nextConfig
