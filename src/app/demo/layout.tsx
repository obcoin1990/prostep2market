import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Live Demo",
  description: "Experience the ProStep2Market platform hands-on. Explore the trading journal, AI analytics, Edge Score, and Risk Guardian.",
  robots: { index: false, follow: false },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
