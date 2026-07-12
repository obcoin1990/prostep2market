import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, Monitor, FileText, BookMarked, HelpCircle, LifeBuoy, Compass, Wrench, Megaphone, Search, MessageSquare, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Resources — ProStep2Market",
  description: "Explore ProStep2Market resources: blog, guides, tutorials, webinars, whitepapers, glossary, help center, and more.",
  openGraph: { title: "ProStep2Market Resources", description: "Everything you need to master trading psychology." },
}

const categories = [
  { icon: BookOpen, title: "Blog", desc: "Latest insights on trading psychology, platform tips, and industry trends.", href: "/resources/blog", count: "20+ articles", color: "#3b82f6" },
  { icon: BookMarked, title: "Guides", desc: "In-depth guides covering trading psychology, risk management, and strategy development.", href: "/resources/guides", count: "10 guides", color: "#10b981" },
  { icon: GraduationCap, title: "Tutorials", desc: "Step-by-step tutorials for using every feature of the ProStep2Market platform.", href: "/resources/tutorials", count: "10 tutorials", color: "#8b5cf6" },
  { icon: Monitor, title: "Webinars", desc: "Live and recorded webinars with trading psychologists, professional traders, and platform experts.", href: "/resources/webinars", count: "Monthly", color: "#f59e0b" },
  { icon: FileText, title: "Whitepapers", desc: "Research-backed whitepapers on behavioral finance, trading psychology, and performance analytics.", href: "/resources/whitepapers", count: "3 papers", color: "#ef4444" },
  { icon: Search, title: "Glossary", desc: "Comprehensive glossary of trading psychology terms, behavioral finance concepts, and platform terminology.", href: "/resources/glossary", count: "100+ terms", color: "#06b4d4" },
  { icon: HelpCircle, title: "FAQ", desc: "Frequently asked questions about ProStep2Market, pricing, integrations, and more.", href: "/faq", count: "Popular", color: "#ec4899" },
  { icon: LifeBuoy, title: "Help Center", desc: "Official documentation, setup guides, and support resources for the ProStep2Market platform.", href: "/help", count: "Full docs", color: "#fcd535" },
  { icon: Compass, title: "Getting Started", desc: "New to ProStep2Market? Start here for a guided onboarding experience.", href: "/help/getting-started", count: "5 min read", color: "#10b981" },
  { icon: Wrench, title: "Troubleshooting", desc: "Solutions for common issues, error messages, and technical problems.", href: "/help/troubleshooting", count: "Common fixes", color: "#ef4444" },
  { icon: Megaphone, title: "Release Notes", desc: "Stay up to date with the latest platform updates, new features, and bug fixes.", href: "/release-notes", count: "Changelog", color: "#3b82f6" },
]

export default function ResourcesPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            <span className="text-[#fcd535]">Resources</span> for Better Trading
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Explore our library of guides, tutorials, research, and support resources — 
            all designed to help you become a more consistent, self-aware trader.
          </p>
          <div className="mx-auto flex max-w-md items-center gap-2 rounded-[10px] border border-[#2b3139] bg-[#1e2329] px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-[#848e9c]" />
            <input type="text" placeholder="Search resources..." className="w-full bg-transparent text-sm text-[#eaecef] placeholder-[#848e9c] outline-none" readOnly />
          </div>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.title} href={cat.href} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${cat.color}1A` }}>
                    <cat.icon className="h-5 w-5" style={{ color: cat.color }} />
                  </div>
                  <span className="text-xs text-[#848e9c]">{cat.count}</span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-white group-hover:text-[#fcd535] transition-colors">{cat.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Can&apos;t Find What You Need?</h2>
          <p className="mb-8 text-[#848e9c]">Our support team is here to help.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact Support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
