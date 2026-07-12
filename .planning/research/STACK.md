# Technology Stack Recommendations

**Project:** ProStep2Market website expansion
**Researched:** 2026-07-11

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 14+ (App Router) | Marketing + docs site framework | Vercel uses it themselves; supports SSG/ISR for docs + SSR for marketing; best-in-class for content-heavy SaaS sites |
| TypeScript | 5.x | Type safety across all code | Universal standard across all 7 studied companies |
| Tailwind CSS | 4.x | Utility-first styling | Notion, Linear, Vercel all use it; fastest iteration for marketing sites |

### Content Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| MDX / Contentlayer | latest | Documentation content | Allows embedded interactive components; used by Linear (MDX in Next.js); Datadog uses similar approach |
| Headless CMS (Sanity or Contentful) | latest | Marketing pages | Stripe uses custom; HubSpot uses their own CMS; Vercel uses Contentful/sanity for marketing; easier than custom for non-dev content editors |
| Strapi | 5.x | Self-hosted alternative | Lower cost than Sanity/Contentful if needed |

### Search
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Algolia DocSearch | latest | Documentation search | Industry standard: Stripe, Datadog, Vercel, Linear all use Algolia for docs search |
| Algolia (site-wide) | latest | Full-site search | Same engine powers both docs and marketing search |

### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel | - | Hosting + Edge functions | All 7 companies use either Vercel or similar edge infrastructure; optimal for Next.js |
| Cloudflare | - | CDN, DDoS, DNS | Stripe uses Cloudflare; standard for enterprise CDN |
| GitHub | - | Version control for docs | Linear, Vercel, Stripe all use Git-backed docs workflows |

### Analytics & Monitoring
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Plausible / Fathom | latest | Privacy-first analytics | HubSpot uses their own; Datadog uses Datadog; for non-Datadog shops, Plausible is GDPR-compliant |
| Hotjar / FullStory | latest | Session recording, heatmaps | Understand how users navigate docs; identify search fail terms |
| Datadog RUM | latest | Real user monitoring | If already using Datadog stack |

### Developer Tooling
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| MDX | 3.x | Interactive docs | Embeddable code blocks, live examples |
| OpenAPI / Stoplight | latest | API reference docs | Stripe-style auto-generated API docs; OpenAPI 3.1 |
| Shiki / Prism | latest | Syntax highlighting in docs | Both used across industry; Shiki has better edge/SSR support |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 14+ | Astro | Astro is excellent for pure content sites but Next.js provides unified framework for docs + marketing + app; hybrid rendering model wins |
| Framework | Next.js 14+ | Docusaurus | Great for docs, weak for marketing landing pages; forces React + MDX constraints |
| Headless CMS | Sanity | WordPress | WordPress + REST is manageable but lacks structured content capabilities; Sanity has GROQ for flexible queries |
| Search | Algolia | Meilisearch | Meilisearch is good open-source alternative; Algolia has better doc search integrations and is the industry standard for docs |
| Hosting | Vercel | AWS Amplify | Vercel has better Next.js integration, preview deployments, and edge functions; AWS Amplify is catching up |
| API Docs | OpenAPI/Stoplight | ReadMe.io | ReadMe is great but proprietary; OpenAPI + Stoplight is open standard, portable |

## Installation

```bash
# Core
npm install next react react-dom
npm install typescript @types/react @types/node -D
npm install tailwindcss postcss autoprefixer

# Content/Docs
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install contentlayer next-contentlayer

# Search
npm install @docsearch/react @docsearch/css

# CMS (if Sanity)
npm install next-sanity @portabletext/react

# API Docs
npm install @stoplight/elements
```

## Documentation Platform Pattern

Based on the 7 companies studied, documentation platforms fall into three categories:

| Approach | Used By | When to Use |
|----------|---------|-------------|
| Standalone SSG (Docusaurus, Hugo) | Notion (custom), Datadog (custom Hugo-like) | When docs are the primary product interface |
| Integrated in main site (Next.js) | Linear, Vercel | When docs are an extension of the marketing site |
| Separate subdomain + framework | Stripe (docs.stripe.com), HubSpot (knowledge.hubspot.com) | When docs need different scaling, auth, or team ownership |

**Recommendation for ProStep2Market:** Start with Next.js integrated (docs.prostep2market.com subdomain, separate Next.js instance) for maximum flexibility. The separate subdomain allows independent team workflows while keeping the same framework.

## Sources

- Direct inspection: docs.stripe.com, vercel.com/docs, docs.datadoghq.com (July 2026)
- linear.app/docs, notion.so/help (July 2026)
- Industry pattern observation from all 7 companies' tech stack analysis
