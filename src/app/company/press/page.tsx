import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Press & News — ProStep2Market",
  description: "Latest press releases, media coverage, and industry mentions for ProStep2Market. Contact our press team for media inquiries.",
  openGraph: { title: "ProStep2Market Press & News", description: "Latest news and media coverage." },
}

export default function PressPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Press &{" "}
            <span className="text-[#fcd535]">News</span>
          </h1>
          <p className="mx-auto mb-4 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Latest updates, media coverage, and announcements from ProStep2Market.
          </p>
        </div>
      </section>

      {/* Placeholder */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <div className="mx-auto max-w-2xl rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-12">
            <h2 className="mb-4 text-2xl font-bold text-white">Press Coverage Coming Soon</h2>
            <p className="text-[#848e9c] leading-relaxed">
              We&apos;re a young company focused on building a great product. As we grow,
              we&apos;ll share press releases, media mentions, and industry recognition here.
              For media inquiries, please reach out to our press team.
            </p>
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Media Inquiries</h2>
          <p className="mb-8 text-[#848e9c]">
            For press and media inquiries, please contact our communications team.
          </p>
          <Link href="mailto:press@prostep2market.com" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            press@prostep2market.com <Mail className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
