import type { Metadata } from "next"
import Link from "next/link"
import { BookMarked, Clock, BarChart3 } from "lucide-react"
import { guidePosts } from "@/lib/guides/posts"

export const metadata: Metadata = {
  title: "Guides — ProStep2Market Resources",
  description: "In-depth guides on trading psychology, risk management, strategy development, and platform mastery.",
}

export default function GuidesPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Guides</h1>
          <p className="text-[#848e9c]">Comprehensive guides to master trading psychology and platform features.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {guidePosts.map((guide) => (
              <Link key={guide.slug} href={`/resources/guides/${guide.slug}`} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c]">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                    <BookMarked className="h-5 w-5 text-[#fcd535]" />
                  </div>
                  <span className="rounded-full border border-[#2b3139] px-2.5 py-0.5 text-xs text-[#848e9c]">{guide.level}</span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white group-hover:text-[#fcd535] transition-colors">{guide.title}</h3>
                <p className="mb-4 text-sm text-[#848e9c]">{guide.desc}</p>
                <div className="flex items-center gap-4 text-xs text-[#848e9c]">
                  <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />{guide.sections} sections</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{guide.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
