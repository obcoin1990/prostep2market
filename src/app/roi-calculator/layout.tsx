import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ROI Calculator",
  description: "Calculate your potential return on investment with ProStep2Market. See how improved trading discipline translates to better performance.",
}

export default function ROICalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
