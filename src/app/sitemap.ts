import type { MetadataRoute } from "next"

const siteUrl = "https://prostep2market.com"

const now = new Date().toISOString()

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${siteUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/platform`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/intelligence`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/trader-dna`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/risk-guardian`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/strategy-lab`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/education`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/integrations`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ]

  const companyPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/company/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/company/mission`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/company/careers`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/company/leadership`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/company/press`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/company/media-kit`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/company/investors`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ]

  const solutionPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/solutions`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/solutions/retail-traders`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/solutions/prop-firms`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/solutions/brokerages`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/solutions/trading-coaches`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/solutions/enterprise`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/solutions/comparison`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/solutions/by-problem`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ]

  const productPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/product`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/product/features`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/product/architecture`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/product/roadmap`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/product/use-cases`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ]

  const resourcePages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/resources/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/resources/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/resources/tutorials`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/resources/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/resources/webinars`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/resources/whitepapers`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ]

  const trustPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/trust`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/trust/security`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/trust/compliance`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/trust/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/trust/data-protection`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/trust/certifications`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ]

  const caseStudyPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/case-studies/brokerage-churn-reduction`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/case-studies/enterprise-compliance`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/case-studies/prop-firm-risk-management`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/case-studies/retail-trader-consistency`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/case-studies/trading-coach-scale`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ]

  const legalPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/legal/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  const helpPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/help/getting-started`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/help/troubleshooting`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ]

  return [
    ...staticPages,
    ...companyPages,
    ...solutionPages,
    ...productPages,
    ...resourcePages,
    ...trustPages,
    ...caseStudyPages,
    ...legalPages,
    ...helpPages,
  ]
}
