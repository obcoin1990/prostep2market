import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, LifeBuoy, Compass, Wrench, BookOpen, MessageSquare, Search, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Help Center — ProStep2Market",
  description: "Official documentation, setup guides, and support resources for the ProStep2Market platform.",
  openGraph: {
    title: "Help Center — ProStep2Market",
    description: "Official documentation, setup guides, and support resources for the ProStep2Market platform.",
  },
}

const sections = [
  { icon: Compass, title: "Getting Started", desc: "New here? Follow our guided onboarding to set up your account and start your first trade journal.", href: "/help/getting-started", color: "#10b981" },
  { icon: BookOpen, title: "User Guides", desc: "Detailed documentation for every feature, module, and setting in the platform.", href: "/resources/guides", color: "#3b82f6" },
  { icon: Wrench, title: "Troubleshooting", desc: "Solutions for common issues, error messages, and connectivity problems.", href: "/help/troubleshooting", color: "#ef4444" },
  { icon: FileText, title: "Tutorials", desc: "Step-by-step walkthroughs for specific tasks and workflows.", href: "/resources/tutorials", color: "#8b5cf6" },
  { icon: MessageSquare, title: "Contact Support", desc: "Can't find what you need? Our support team is ready to help.", href: "/contact", color: "#fcd535" },
]

export default function HelpPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            <span className="text-[#fcd535]">Help</span> Center
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Find answers, guides, and support for everything ProStep2Market.
          </p>
          <div className="mx-auto flex max-w-md items-center gap-2 rounded-[10px] border border-[#2b3139] bg-[#1e2329] px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-[#848e9c]" />
            <input type="text" placeholder="Search help articles..." aria-label="Search help articles" className="w-full bg-transparent text-sm text-[#eaecef] placeholder-[#848e9c] outline-none" readOnly />
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <Link key={s.title} href={s.href} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${s.color}1A` }}>
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white group-hover:text-[#fcd535] transition-colors">{s.title}</h3>
                <p className="text-sm text-[#848e9c]">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
