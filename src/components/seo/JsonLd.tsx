interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const siteUrl = "https://prostep2market.com"

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ProStep2Market",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: "AI-Powered Trader Development and Performance Intelligence Platform",
  sameAs: [
    "https://twitter.com/prostep2market",
    "https://linkedin.com/company/prostep2market",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@prostep2market.com",
  },
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ProStep2Market",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/resources?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

export const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ProStep2Market",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description: "AI-Powered Trader Development and Performance Intelligence Platform with behavioral analytics, discipline coaching, and risk management.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free Plan",
    },
    {
      "@type": "Offer",
      price: "29",
      priceCurrency: "USD",
      name: "Pro Plan",
    },
  ],
}

export function FAQJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  )
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  image?: string
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url,
        datePublished,
        dateModified: dateModified || datePublished,
        image: image || `${siteUrl}/og-default.png`,
        author: {
          "@type": "Organization",
          name: "ProStep2Market",
          url: siteUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "ProStep2Market",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.png`,
          },
        },
      }}
    />
  )
}
