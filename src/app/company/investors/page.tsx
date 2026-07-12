import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Investor Relations — ProStep2Market",
  description: "ProStep2Market is transforming trader development through AI-powered behavioral analytics. Learn about our growth metrics, market opportunity, and investment thesis.",
  openGraph: { title: "ProStep2Market Investor Relations", description: "Building the future of trader development." },
}

export default function InvestorsPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Investor{" "}
            <span className="text-[#fcd535]">Relations</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            ProStep2Market is building the operating system for trader development.
            We&apos;re applying behavioral science and AI to the most overlooked factor
            in trading performance: the trader.
          </p>
          <Link href="mailto:ir@prostep2market.com" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact IR Team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Placeholder */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <div className="mx-auto max-w-2xl rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-12">
            <h2 className="mb-4 text-2xl font-bold text-white">Investor Materials Coming Soon</h2>
            <p className="text-[#848e9c] leading-relaxed">
              We&apos;re currently preparing our investor deck, financial data, and market analysis
              materials. In the meantime, contact our investor relations team for partnership
              discussions and pitch materials.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Invest in the Future of Trading</h2>
          <p className="mx-auto mb-8 max-w-2xl text-[#848e9c]">
            We&apos;re always open to conversations with strategic investors who share our vision.
            Contact our investor relations team for pitch materials, financial data, and partnership discussions.
          </p>
          <Link href="mailto:ir@prostep2market.com" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact IR <Mail className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
