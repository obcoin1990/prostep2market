import type { Metadata } from "next"
import { ArrowRight, FlaskConical, CheckCircle2, Star, Bug } from "lucide-react"

export const metadata: Metadata = {
  title: "Release Notes — ProStep2Market",
  description: "Stay up to date with the latest ProStep2Market platform updates, new features, and improvements.",
}

const releases = [
  {
    version: "v2.4.0", date: "Jul 1, 2026", type: "major",
    features: [
      { icon: Star, title: "Strategy Lab 2.0", desc: "Completely redesigned strategy builder with drag-and-drop interface, improved backtesting engine, and portfolio simulation." },
      { icon: Star, title: "Multi-Account Aggregation", desc: "Connect and view multiple broker accounts in a unified dashboard with aggregate performance metrics." },
    ],
    improvements: [
      "AI trade analysis response time reduced by 40%",
      "Improved trade journal search performance",
      "Enhanced mobile responsiveness for dashboard pages",
    ],
    fixes: [
      "Fixed issue with Risk Guardian alerts not firing for some configuration",
      "Fixed Edge Score calculation edge case with very small trade samples",
      "Fixed broken pagination in trade history for accounts with 10,000+ trades",
    ],
  },
  {
    version: "v2.3.0", date: "Jun 1, 2026", type: "minor",
    features: [
      { icon: Star, title: "Advanced Analytics Suite", desc: "New metrics dashboard with custom report builder, cohort analysis, and performance comparisons." },
    ],
    improvements: [
      "Updated Trader DNA assessment with 4 new behavioral dimensions (16 total)",
      "Improved onboarding flow with guided setup wizard",
      "Enhanced data export with custom field selection",
    ],
    fixes: [
      "Fixed MT5 connection timeout for accounts with large trade histories",
      "Fixed duplicate journal entry issue on rapid manual entry",
      "Fixed incorrect timezone handling in trade timestamps",
    ],
  },
  {
    version: "v2.2.0", date: "May 1, 2026", type: "minor",
    features: [
      { icon: Star, title: "Team Management", desc: "Enterprise feature for creating teams, assigning roles, and managing permissions across organizations." },
      { icon: Star, title: "Webhook System", desc: "Real-time event notifications for trades, alerts, and score changes via customizable webhooks." },
    ],
    improvements: [
      "Performance optimization for dashboard loading (3x faster)",
      "Updated API documentation with interactive examples",
      "Enhanced security with optional IP whitelisting",
    ],
    fixes: [
      "Resolved issue with Edge Score not updating after trade import",
      "Fixed sorting in leaderboard for tied scores",
      "Corrected currency formatting in export reports",
    ],
  },
  {
    version: "v2.1.0", date: "Apr 1, 2026", type: "patch",
    features: [],
    improvements: [
      "Improved AI analysis with GPT-4o integration",
      "Enhanced mobile layout for Risk Guardian dashboard",
      "Added bulk trade import from CSV",
    ],
    fixes: [
      "Fixed session timeout causing data loss in journal entries",
      "Corrected risk-reward ratio calculation in analytics",
      "Fixed UI alignment issues in Firefox browser",
      "Resolved intermittent sync delay with Interactive Brokers",
    ],
  },
  {
    version: "v2.0.0", date: "Mar 15, 2026", type: "major",
    features: [
      { icon: Star, title: "Complete Platform Redesign", desc: "Modernized UI with improved navigation, faster page loads, and consistent design language." },
      { icon: Star, title: "AI Trade Intelligence v2", desc: "Upgraded AI engine with deeper analysis, pattern recognition, and personalized coaching insights." },
      { icon: Star, title: "Risk Guardian Circuit Breakers", desc: "Automated trading pause when configurable risk parameters are breached." },
      { icon: Star, title: "Education Platform", desc: "Structured learning paths, interactive quizzes, and certification programs." },
    ],
    improvements: [
      "10x performance improvement on dashboard load times",
      "Completely rebuilt trade journal with better UX",
      "New API endpoints for analytics and profiles",
    ],
    fixes: [
      "Hundreds of bug fixes and quality improvements across all modules",
    ],
  },
]

export default function ReleaseNotesPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">Release Notes</h1>
          <p className="text-[#848e9c]">Stay up to date with the latest platform updates, features, and improvements.</p>
        </div>
      </section>

      {releases.map((release) => (
        <section key={release.version} className="border-t border-[#2b3139] py-16">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">{release.version}</h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    release.type === "major" ? "bg-[rgba(252,213,53,0.15)] text-[#fcd535]" : "bg-[rgba(59,130,246,0.15)] text-[#3b82f6]"
                  }`}>
                    {release.type === "major" ? "Major Release" : release.type === "minor" ? "Minor Update" : "Patch"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#848e9c]">{release.date}</p>
              </div>
            </div>

            {release.features.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#10b981]">
                  <FlaskConical className="h-4 w-4" />
                  New Features
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {release.features.map((f) => (
                    <div key={f.title} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-4">
                      <div className="mb-1 flex items-center gap-2">
                        <f.icon className="h-4 w-4 text-[#fcd535]" />
                        <h4 className="text-sm font-semibold text-white">{f.title}</h4>
                      </div>
                      <p className="text-sm text-[#848e9c]">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {release.improvements.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#3b82f6]">
                  <CheckCircle2 className="h-4 w-4" />
                  Improvements
                </h3>
                <ul className="space-y-1">
                  {release.improvements.map((imp) => (
                    <li key={imp} className="flex items-start gap-2 text-sm text-[#848e9c]">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#3b82f6]" />
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {release.fixes.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#ef4444]">
                  <Bug className="h-4 w-4" />
                  Bug Fixes
                </h3>
                <ul className="space-y-1">
                  {release.fixes.map((fix) => (
                    <li key={fix} className="flex items-start gap-2 text-sm text-[#848e9c]">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#ef4444]" />
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
