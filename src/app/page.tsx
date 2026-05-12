import type { Metadata } from "next"
import {
  HeroSection,
  ProblemSection,
  SolutionSection,
  FeaturesGrid,
  DashboardPreview,
  TraderDNASection,
  AIRiskGuardianSection,
  HowItWorks,
  Testimonials,
  PricingTeaser,
  FooterCTA,
} from "@/components/landing"

export const metadata: Metadata = {
  title: "ProStep2Market — AI Powered Trader Development and Performance Intelligence",
  description: "Transform your trading with AI behavioral analytics, discipline coaching, and performance intelligence. Understand yourself before trying to understand the market.",
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesGrid />
      <DashboardPreview />
      <TraderDNASection />
      <AIRiskGuardianSection />
      <HowItWorks />
      <Testimonials />
      <PricingTeaser />
      <FooterCTA />
    </main>
  )
}
