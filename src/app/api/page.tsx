import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Code2, BookOpen, Shield, Zap, Webhook, Lock, Globe, Terminal, Database, RefreshCw, ExternalLink, CheckCircle2, Link2, FlaskConical } from "lucide-react"

export const metadata: Metadata = {
  title: "API — ProStep2Market",
  description: "Build on ProStep2Market with our REST API. Access trade data, Trader DNA profiles, risk analytics, and more. Webhooks and SDKs available.",
  openGraph: { title: "ProStep2Market API", description: "Build custom trading tools with our API." },
}

const apiFeatures = [
  { icon: Terminal, title: "RESTful API", desc: "Full-featured REST API with versioned endpoints, rate limiting, and comprehensive documentation." },
  { icon: Webhook, title: "Real-Time Webhooks", desc: "Subscribe to trade events, risk alerts, score changes, and more with instant webhook notifications." },
  { icon: Shield, title: "Enterprise Security", desc: "API keys with granular permissions, OAuth 2.0 support, and IP whitelisting for enterprise clients." },
  { icon: Database, title: "Full Data Access", desc: "Access trade history, Trader DNA profiles, Edge Scores, journal entries, and risk analytics." },
  { icon: RefreshCw, title: "Rate Limiting", desc: "Generous rate limits with burst support. Enterprise tier gets dedicated API capacity." },
  { icon: Globe, title: "Global CDN", desc: "API served via Vercel Edge Network for low-latency access worldwide." },
]

const endpoints = [
  { method: "GET", path: "/v1/trades", desc: "List all trades with filtering and pagination" },
  { method: "GET", path: "/v1/trades/:id", desc: "Get a single trade with full details" },
  { method: "POST", path: "/v1/trades", desc: "Import a new trade entry" },
  { method: "GET", path: "/v1/profile", desc: "Get Trader DNA profile and scores" },
  { method: "GET", path: "/v1/edge-score", desc: "Get current Edge Score and history" },
  { method: "GET", path: "/v1/alerts", desc: "List risk alerts and notifications" },
  { method: "POST", path: "/v1/webhooks", desc: "Create and manage webhook subscriptions" },
  { method: "GET", path: "/v1/analytics", desc: "Get performance analytics and metrics" },
]

const useCases = [
  { icon: Code2, title: "Custom Dashboards", desc: "Build your own trading dashboard by pulling trade data, analytics, and scores via API." },
  { icon: BookOpen, title: "Automated Reporting", desc: "Generate custom reports on schedule by combining trade data with your own metrics." },
  { icon: Link2, title: "Third-Party Integration", desc: "Connect ProStep2Market data to your existing tools, CRM, or trading platform." },
  { icon: FlaskConical, title: "Research & Analysis", desc: "Access raw trade data for academic research, strategy development, or custom analysis." },
]

export default function ApiPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2b3139] bg-[#1e2329] px-4 py-1.5 text-xs font-medium text-[#848e9c]">
            <Code2 className="h-3.5 w-3.5 text-[#fcd535]" />
            Developer Platform — Beta
          </div>
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Build on{" "}
            <span className="text-[#fcd535]">ProStep2Market</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Our REST API gives you programmatic access to trade data, behavioral profiles, 
            risk analytics, and more. Build custom tools, automate workflows, and integrate 
            with your existing stack.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Request API Access <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#docs" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              <BookOpen className="h-4 w-4" />
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">API Features</h2>
          <p className="mb-16 text-center text-[#848e9c]">Everything you need to build powerful trading tools.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apiFeatures.map((f) => (
              <div key={f.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <f.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section id="docs" className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Sample Endpoints</h2>
          <p className="mb-16 text-center text-[#848e9c]">Our API is organized around REST. Here are some of the available endpoints.</p>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-[12px] border border-[#2b3139]">
            {endpoints.map((ep, i) => (
              <div key={ep.path} className={`flex items-center gap-4 p-4 ${i < endpoints.length - 1 ? "border-b border-[#2b3139]" : ""} hover:bg-[#1e2329] transition-colors`}>
                <span className={`shrink-0 rounded-[4px] px-2 py-0.5 text-xs font-bold ${
                  ep.method === "GET" ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]" : "bg-[rgba(252,213,53,0.15)] text-[#fcd535]"
                }`}>
                  {ep.method}
                </span>
                <code className="shrink-0 font-mono text-sm text-[#eaecef]">{ep.path}</code>
                <span className="hidden text-sm text-[#848e9c] md:block">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">What You Can Build</h2>
          <p className="mb-16 text-center text-[#848e9c]">The API unlocks endless possibilities for customization and automation.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map((uc) => (
              <div key={uc.title} className="flex gap-4 rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <uc.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-semibold text-white">{uc.title}</h3>
                  <p className="text-sm leading-relaxed text-[#848e9c]">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">SDKs & Tools</h2>
          <p className="mb-16 text-center text-[#848e9c]">Coming soon — official SDKs for your preferred language.</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: "Python SDK", desc: "For data analysis and automation" },
              { name: "JavaScript SDK", desc: "For web and Node.js apps" },
              { name: "TypeScript SDK", desc: "Type-safe API client" },
              { name: "CLI Tool", desc: "Command-line data access" },
            ].map((sdk) => (
              <div key={sdk.name} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-4 text-center opacity-60">
                <div className="text-sm font-semibold text-white">{sdk.name}</div>
                <div className="mt-1 text-xs text-[#848e9c]">{sdk.desc}</div>
                <div className="mt-2 text-xs font-medium text-[#fcd535]">Coming Soon</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Build?</h2>
          <p className="mb-8 text-[#848e9c]">Join our developer waitlist and get early access to the API platform.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Request Early Access <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
