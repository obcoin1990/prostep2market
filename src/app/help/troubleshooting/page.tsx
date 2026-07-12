import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Wrench, Link2, AlertTriangle, RefreshCw, Shield, Database, Globe, ChevronDown } from "lucide-react"

export const metadata: Metadata = {
  title: "Troubleshooting — ProStep2Market Help",
  description: "Solutions for common issues with ProStep2Market, including connection problems, sync issues, and account setup.",
}

const issues = [
  { icon: Link2, title: "MT4/MT5 Connection Failed", desc: "If your broker connection fails, verify your account number and server name. Ensure your MT4/MT5 is running and you've allowed API connections in your terminal settings.", solution: "Restart your MT4/MT5 terminal and try reconnecting. If the issue persists, check your broker's server status." },
  { icon: RefreshCw, title: "Trades Not Syncing", desc: "If trades aren't appearing after connecting your broker, check that your terminal is running and has received the trades.", solution: "Manual sync is available. Go to Connections > Sync Now. Most sync issues resolve within 60 seconds." },
  { icon: AlertTriangle, title: "Risk Guardian Not Alerting", desc: "If you're not receiving alerts, check your notification preferences and ensure your risk rules are properly configured.", solution: "Verify alert channels (email, Slack, Telegram) in Settings > Notifications. Test with a sample alert." },
  { icon: Shield, title: "Login Issues", desc: "If you can't log in, check your email/password combination. Use the 'Forgot Password' option to reset.", solution: "Clear browser cache and cookies. If using SSO, ensure your identity provider is accessible." },
  { icon: Database, title: "Data Loading Slowly", desc: "Large trade histories may take a moment to load. Dashboard performance depends on your connection speed.", solution: "Use date filters to narrow your data range. Export large datasets instead of viewing in-browser." },
  { icon: Globe, title: "Page Not Loading / 404 Errors", desc: "If you encounter 404 errors or pages not loading, you may be using an outdated link.", solution: "Navigate from the main dashboard or resources page. Clear your browser cache and try again." },
]

export default function TroubleshootingPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Troubleshooting</h1>
          <p className="text-[#848e9c]">Solutions for common issues and error messages.</p>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="space-y-4">
            {issues.map((issue) => (
              <details key={issue.title} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] transition-colors hover:border-[#3a3a5c]">
                <summary className="flex cursor-pointer items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                    <issue.icon className="h-5 w-5 text-[#fcd535]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{issue.title}</h3>
                    <p className="text-sm text-[#848e9c]">{issue.desc}</p>
                  </div>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#848e9c] transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-[#2b3139] px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 rounded-full bg-[rgba(252,213,53,0.15)] px-2.5 py-0.5 text-xs font-medium text-[#fcd535]">Solution</span>
                    <p className="text-sm text-[#eaecef]">{issue.solution}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Still Having Issues?</h2>
          <p className="mb-8 text-[#848e9c]">Our support team is available 24/7 to help resolve any problems.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            Contact Support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
