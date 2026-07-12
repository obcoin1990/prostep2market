import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Shield, Lock, Server, Database, Globe, Cpu, Layers, Zap, Cloud, CheckCircle2, RefreshCw } from "lucide-react"

export const metadata: Metadata = {
  title: "Architecture — ProStep2Market",
  description: "ProStep2Market platform architecture: secure, scalable, and built for enterprise-grade trading analytics.",
  openGraph: { title: "ProStep2Market Architecture", description: "Enterprise-grade platform built for scale and security." },
}

const layers = [
  {
    title: "Presentation Layer",
    icon: Globe,
    color: "#3b82f6",
    items: ["Next.js 16 React Server Components", "Responsive design (mobile + desktop)", "Real-time dashboard updates via WebSocket", "White-label support for enterprise clients"],
  },
  {
    title: "Application Layer",
    icon: Layers,
    color: "#8b5cf6",
    items: ["RESTful API with versioned endpoints", "Serverless functions for AI processing", "Webhook system for third-party integration", "Role-based access control (RBAC)"],
  },
  {
    title: "AI & Analytics Engine",
    icon: Cpu,
    color: "#fcd535",
    items: ["GPT-powered trade intelligence analysis", "Behavioral scoring algorithms (16 dimensions)", "Pattern recognition and anomaly detection", "Real-time risk assessment engine"],
  },
  {
    title: "Data Layer",
    icon: Database,
    color: "#10b981",
    items: ["PostgreSQL with Prisma ORM", "Redis for session caching and real-time data", "S3-compatible storage for journals/screenshots", "TimescaleDB for time-series trade data"],
  },
  {
    title: "Security Layer",
    icon: Shield,
    color: "#ef4444",
    items: ["SOC 2 Type II compliant infrastructure", "End-to-end encryption (TLS 1.3)", "Read-only broker connections only", "GDPR and data privacy compliance"],
  },
  {
    title: "Infrastructure",
    icon: Server,
    color: "#06b6d4",
    items: ["Vercel Edge Network for global CDN", "AWS/GCP multi-region deployment", "Auto-scaling serverless functions", "99.9% uptime SLA for enterprise tier"],
  },
]

const securityFeatures = [
  { icon: Lock, title: "Data Encryption", desc: "All data encrypted at rest (AES-256) and in transit (TLS 1.3). Your trading data remains yours." },
  { icon: Shield, title: "Read-Only Connections", desc: "ProStep2Market never has access to withdraw funds or place trades. Read-only API keys only." },
  { icon: Cloud, title: "SOC 2 Compliant", desc: "Our infrastructure undergoes regular third-party audits. Enterprise SOC 2 report available on request." },
  { icon: CheckCircle2, title: "Data Isolation", desc: "Multi-tenant architecture with strict data isolation. Your data is never commingled with other users." },
]

export default function ArchitecturePage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Built for{" "}
            <span className="text-[#fcd535]">Scale & Security</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Enterprise-grade architecture that processes millions of trades while maintaining 
            the highest standards of security, privacy, and reliability.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/trust/security" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Security Overview
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture Layers */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Platform Architecture</h2>
          <p className="mb-16 text-center text-[#848e9c]">Six layers designed for performance, security, and extensibility.</p>
          <div className="relative">
            {layers.map((layer, i) => (
              <div key={layer.title} className="relative mb-6 last:mb-0">
                <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${layer.color}1A` }}>
                      <layer.icon className="h-5 w-5" style={{ color: layer.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{layer.title}</h3>
                      <span className="text-xs text-[#848e9c]">Layer {i + 1}</span>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {layer.items.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-[#848e9c]">
                        <RefreshCw className="mt-0.5 h-3 w-3 shrink-0" style={{ color: layer.color }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                {i < layers.length - 1 && (
                  <div className="absolute -bottom-3 left-8 z-10 h-3 w-0.5 bg-[#2b3139]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Security & Compliance</h2>
          <p className="mb-16 text-center text-[#848e9c]">Your data security is our highest priority.</p>
          <div className="grid gap-6 md:grid-cols-2">
            {securityFeatures.map((s) => (
              <div key={s.title} className="flex gap-4 rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                  <s.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-semibold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-[#848e9c]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Technology Stack</h2>
          <p className="mb-16 text-center text-[#848e9c]">Modern, battle-tested technologies powering the platform.</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: "Next.js 16", desc: "React framework with RSC" },
              { name: "PostgreSQL", desc: "Primary data store" },
              { name: "Prisma ORM", desc: "Type-safe database access" },
              { name: "Redis", desc: "Caching & real-time" },
              { name: "Vercel", desc: "Edge deployment" },
              { name: "Supabase", desc: "Auth & storage" },
              { name: "OpenAI GPT", desc: "AI trade analysis" },
              { name: "WebSocket", desc: "Live dashboard updates" },
            ].map((t) => (
              <div key={t.name} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-4 text-center">
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="mt-1 text-xs text-[#848e9c]">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Enterprise Ready</h2>
          <p className="mb-8 text-[#848e9c]">Contact our sales team for enterprise部署 options, SSO, custom SLAs, and white-label solutions.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact Sales <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
