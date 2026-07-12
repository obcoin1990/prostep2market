import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FileText, Download, Clock, BarChart3 } from "lucide-react"

export const metadata: Metadata = {
  title: "Whitepapers — ProStep2Market Resources",
  description: "Research-backed whitepapers on behavioral finance, trading psychology, and performance analytics.",
}

const whitepapers = [
  { title: "Behavioral Finance in Modern Trading: A Quantitative Analysis", desc: "A comprehensive analysis of how behavioral biases impact trading performance, based on thousands of analyzed trades.", pages: 24, readTime: "45 min", date: "Jun 2026", authors: "Dr. Sarah Chen, Dr. James Park" },
  { title: "The Edge Score: Validating a Novel Metric for Trading Consistency", desc: "Methodology and validation of the Edge Score algorithm, including statistical analysis of its predictive power.", pages: 18, readTime: "35 min", date: "May 2026", authors: "Dr. James Park, Research Team" },
  { title: "Trader DNA: A Multi-Dimensional Framework for Behavioral Assessment", desc: "The theoretical framework and empirical validation behind the 16-dimension Trader DNA assessment model.", pages: 32, readTime: "55 min", date: "Apr 2026", authors: "Dr. Sarah Chen, Behavioral Science Lab" },
]

export default function WhitepapersPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Whitepapers</h1>
          <p className="text-[#848e9c]">Research-backed analysis and methodology papers from the ProStep2Market team.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="space-y-6">
            {whitepapers.map((wp) => (
              <div key={wp.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                      <FileText className="h-5 w-5 text-[#fcd535]" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{wp.title}</h3>
                      <p className="text-xs text-[#848e9c]">{wp.authors}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-[6px] bg-[#fcd535] px-4 py-2 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
                <p className="mb-4 text-sm text-[#848e9c]">{wp.desc}</p>
                <div className="flex items-center gap-4 text-xs text-[#848e9c]">
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{wp.pages} pages</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{wp.readTime}</span>
                  <span>{wp.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
