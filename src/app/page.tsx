import type { Metadata } from "next"
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/seo/JsonLd"
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
  openGraph: {
    title: "ProStep2Market — AI Powered Trader Development",
    description: "Transform your trading with AI behavioral analytics, discipline coaching, and performance intelligence.",
    url: "https://prostep2market.com",
    siteName: "ProStep2Market",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "ProStep2Market" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProStep2Market — AI Powered Trader Development",
    description: "Transform your trading with AI behavioral analytics, discipline coaching, and performance intelligence.",
    images: ["/og-default.png"],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
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
