import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Request a Demo",
  description: "Request a personalized demo of ProStep2Market. See how our AI-powered analytics can transform your trading or your firm's operations.",
  robots: { index: false, follow: false },
}

export default function DemoRequestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
