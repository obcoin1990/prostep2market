import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trading Analysis",
  description: "Analyze your trading performance with AI-powered insights. Understand your patterns, strengths, and areas for improvement.",
  robots: { index: false, follow: false },
}

export default function AnalysisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
