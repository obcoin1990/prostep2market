import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0e11] px-6">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-bold text-[#fcd535] leading-none mb-4">404</div>
        <h1 className="text-2xl font-semibold text-white mb-2">Page not found</h1>
        <p className="text-white/60 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#fcd535] text-[#181a20] font-medium hover:bg-[#f0b90b] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
