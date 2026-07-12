import Link from 'next/link'

export default function TutorialNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-[80px] font-bold text-[#fcd535] leading-none mb-4">404</div>
        <h1 className="text-2xl font-semibold text-white mb-2">Tutorial not found</h1>
        <p className="text-white/60 mb-8">
          The tutorial you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/resources/tutorials"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#fcd535] text-[#181a20] font-medium hover:bg-[#f0b90b] transition-colors"
        >
          Browse all tutorials
        </Link>
      </div>
    </div>
  )
}
