import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Link2, Database, BarChart3, MessageSquare, Shield, Globe, RefreshCw, ExternalLink, Wifi, BookOpen, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Integrations — ProStep2Market",
  description: "Connect ProStep2Market with your trading stack. MT4, MT5, TradingView, and 20+ broker integrations for seamless trade synchronization.",
  openGraph: { title: "ProStep2Market Integrations", description: "Connect your entire trading stack." },
}

const integrationCategories = [
  {
    title: "Broker Connections",
    icon: Globe,
    color: "#3b82f6",
    integrations: [
      { name: "MetaTrader 4 (MT4)", desc: "Full trade history sync with real-time updates. Read-only connection — no trading permissions.", status: "Live" },
      { name: "MetaTrader 5 (MT5)", desc: "Multi-asset support including forex, stocks, and futures. Automatic trade import.", status: "Live" },
      { name: "cTrader", desc: "Direct integration with cTrader platform. Supports all account types.", status: "Live" },
      { name: "TradingView", desc: "Pine Script integration for strategy analysis. Coming Q3 2026.", status: "Coming Soon" },
      { name: "NinjaTrader", desc: "Full trade journal synchronization for NinjaTrader users.", status: "Beta" },
      { name: "Interactive Brokers", desc: "API-based connection for IBKR account holders.", status: "Planned" },
    ],
  },
  {
    title: "Data & Analytics",
    icon: BarChart3,
    color: "#10b981",
    integrations: [
      { name: "Excel Export", desc: "Export all trade data to CSV for custom analysis in Excel or Google Sheets.", status: "Live" },
      { name: "PDF Reports", desc: "Generate professional PDF performance reports with full metrics.", status: "Live" },
      { name: "Google Sheets", desc: "Live sync of trade data to Google Sheets via add-on.", status: "Beta" },
      { name: "Tableau / Power BI", desc: "Connect your data to BI tools for custom visualization.", status: "Enterprise" },
    ],
  },
  {
    title: "Communication & Productivity",
    icon: MessageSquare,
    color: "#8b5cf6",
    integrations: [
      { name: "Slack", desc: "Receive risk alerts and daily summaries directly in Slack channels.", status: "Live" },
      { name: "Discord", desc: "Community bot for leaderboards, challenges, and trade sharing.", status: "Live" },
      { name: "Telegram", desc: "Real-time risk alerts and trade notifications via Telegram bot.", status: "Live" },
      { name: "Email Reports", desc: "Automated daily/weekly performance reports delivered to your inbox.", status: "Live" },
    ],
  },
  {
    title: "Security & Compliance",
    icon: Shield,
    color: "#ef4444",
    integrations: [
      { name: "SSO (SAML/OIDC)", desc: "Single sign-on with Okta, Azure AD, Google Workspace, and any SAML 2.0 provider.", status: "Enterprise" },
      { name: "SOC 2 Compliance", desc: "Full SOC 2 Type II report available. Regular third-party audits.", status: "Enterprise" },
      { name: "Audit Logs", desc: "Comprehensive audit trail for all platform activity. SIEM integration ready.", status: "Enterprise" },
    ],
  },
  {
    title: "Developer Tools",
    icon: Link2,
    color: "#fcd535",
    integrations: [
      { name: "REST API", desc: "Full-featured REST API for custom integrations and data access.", status: "Beta" },
      { name: "Webhooks", desc: "Real-time event notifications for trades, alerts, and score changes.", status: "Beta" },
      { name: "Zapier", desc: "Connect ProStep2Market to 5,000+ apps via Zapier automation.", status: "Planned" },
      { name: "n8n / Make", desc: "Custom workflow automation with low-code platforms.", status: "Planned" },
    ],
  },
]

export default function IntegrationsPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2b3139] bg-[#1e2329] px-4 py-1.5 text-xs font-medium text-[#848e9c]">
            <Wifi className="h-3.5 w-3.5 text-[#fcd535]" />
            25+ Integrations & Growing
          </div>
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Connect Your{" "}
            <span className="text-[#fcd535]">Trading Stack</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            ProStep2Market integrates with the tools you already use. From broker connections 
            to productivity tools, your trading data flows seamlessly.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Connect Your Broker <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/api" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              <ExternalLink className="h-4 w-4" />
              API Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Categories */}
      {integrationCategories.map((cat) => (
        <section key={cat.title} className="border-t border-[#2b3139] py-20">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${cat.color}1A` }}>
                <cat.icon className="h-5 w-5" style={{ color: cat.color }} />
              </div>
              <h2 className="text-xl font-bold text-white">{cat.title}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.integrations.map((int) => (
                <div key={int.name} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5 transition-colors hover:border-[#3a3a5c]">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-sm font-semibold text-white">{int.name}</h3>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      int.status === "Live" ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]" :
                      int.status === "Beta" ? "bg-[rgba(252,213,53,0.15)] text-[#fcd535]" :
                      int.status === "Enterprise" ? "bg-[rgba(139,92,246,0.15)] text-[#8b5cf6]" :
                      "bg-[rgba(132,142,156,0.15)] text-[#848e9c]"
                    }`}>
                      {int.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#848e9c]">{int.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Key Metrics */}
      <section className="border-t border-[#2b3139] py-16 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "25+", label: "Integrations" },
              { value: "Growing", label: "Trades Synced" },
              { value: "Low", label: "Avg. Sync Latency" },
              { value: "< 1s", label: "Avg. Sync Time" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-3xl font-bold text-[#fcd535] md:text-4xl">{m.value}</div>
                <div className="mt-2 text-sm text-[#848e9c]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Sync?</h2>
          <p className="mb-8 text-[#848e9c]">Connect your broker in under 60 seconds and start tracking your trades.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Connect Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
