import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Leadership — ProStep2Market",
  description: "Meet the team behind ProStep2Market. Traders, behavioral scientists, and technology leaders transforming trader development.",
  openGraph: { title: "ProStep2Market Leadership", description: "The team building the future of trader development." },
}

export default function LeadershipPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Meet the Team Behind{" "}
            <span className="text-[#fcd535]">ProStep2Market</span>
          </h1>
          <p className="mx-auto mb-4 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            We&apos;re traders, scientists, and builders united by a single mission:
            transform how traders understand and improve their performance.
          </p>
        </div>
      </section>

      {/* Team Placeholder */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <div className="mx-auto max-w-2xl rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-12">
            <h2 className="mb-4 text-2xl font-bold text-white">Team Bios Coming Soon</h2>
            <p className="text-[#848e9c] leading-relaxed">
              We&apos;re currently finalizing our team page. In the meantime, you can learn
              about our mission and values on the{" "}
              <Link href="/company/about" className="text-[#fcd535] hover:underline">
                About page
              </Link>
              {" "}or reach out directly at{" "}
              <a href="mailto:hello@prostep2market.com" className="text-[#fcd535] hover:underline">
                hello@prostep2market.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Join Our Team</h2>
          <p className="mb-8 text-[#848e9c]">We&apos;re always looking for talented people who share our mission.</p>
          <Link href="/company/careers" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            View Open Positions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
