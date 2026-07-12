import type { Metadata } from "next"
import { JsonLd, productJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for every trader. Start free, upgrade when you're ready. No hidden fees, no long-term contracts.",
  openGraph: {
    title: "Pricing — ProStep2Market",
    description: "Simple, transparent pricing for every trader. Start free, upgrade when you're ready.",
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={productJsonLd} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://prostep2market.com" },
        { name: "Pricing", url: "https://prostep2market.com/pricing" },
      ]} />
      {children}
    </>
  )
}
