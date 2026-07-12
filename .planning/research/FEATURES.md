# Feature Landscape: Enterprise SaaS Information Architecture

**Domain:** Enterprise SaaS website structure and content ecosystem
**Researched:** 2026-07-11

## Table Stakes

Features users expect from any enterprise SaaS website. Missing = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 5-pillar top nav (Products/Solutions/Resources/Docs/Pricing) | Universal navigation model across all studied companies | Low | Must include sign-in and trial CTA in header |
| Products overview page with sub-product cards | First purchase consideration touchpoint | Medium | HubSpot uses mega-menu with icons; Stripe uses category groupings |
| Documentation portal (separate subdomain or path) | Required for developer evaluation | High | Triaged into dev docs, user guides, admin guides |
| Pricing page with transparent plans | Required for self-serve evaluation | Medium | Tiers: Free/Starter → Pro → Enterprise (with "Contact Sales") |
| Enterprise landing page | Procurement/security evaluation | Medium | At `/enterprise` — covers SSO, compliance, SLAs, support tiers |
| Customer story / case study library | Social proof for conversion | Medium | Filterable by industry, use case, company size |
| Blog with categorized content | SEO, thought leadership, product updates | Low | HubSpot uses 4+ blog sub-brands; Datadog has engineering, AI, security blogs |
| Search across docs and site | Required for self-serve support | Medium | Algolia is the standard; Datadog and Stripe have the best implementations |
| Changelog / What's New page | Product transparency, power users | Low | Linear has the best model: `/changelog` with date-versioned entries |
| Contact Sales form | Conversion path for high-value leads | Low | Usually gated: "Contact Sales" CTA in nav, demo request on enterprise page |
| Sign-up / Start Free Trial button | Primary conversion action | Low | Persistent in nav bar, contrasting color |
| Status page | Trust and transparency | Low | Stripe: status.stripe.com; Atlassian: status.atlassian.com |
| Legal / Privacy / Terms pages | Regulatory requirement | Low | Usually in footer, sometimes a dedicated trust center |
| Cookie consent and GDPR compliance | Legal requirement | Low | All sites have cookie preference centers |
| Responsive/mobile navigation | Required for all modern sites | Medium | All 7 sites have responsive hamburger navs |
| Sitemap / XML sitemap | SEO requirement | Low | Stripe has a comprehensive HTML sitemap linked from footer |

## Differentiators

Features that set product apart. Not universally expected, but create competitive advantage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Interactive API playground in docs | Immediate technical evaluation without signup | High | Stripe and Vercel have the best implementations |
| AI-powered site search (semantic) | Faster documentation navigation | High | Datadog has strong AI search; Notion uses AI for help center |
| Product roadmap (public) | Transparency, enterprise trust | Medium | Linear does this best: `/roadmap` with upvoting; Stripe has `/roadmap` |
| Interactive product demo / sandbox | Try without committing, no credit card | High | Vercel has "Deploy a template" one-click; Stripe has test mode |
| ROI calculator | Quantify value for procurement | Medium | HubSpot has `/roi-calculator` |
| Comparison pages vs competitors | SEO capture, competitive positioning | Medium | HubSpot has `/comparisons` directory; Atlassian has `/vs-*` pages |
| Partner / marketplace directory | Ecosystem signal, extensibility | High | Atlassian Marketplace; HubSpot Ecosystem; Stripe App Marketplace |
| Academy / certification program | Education lead gen, user stickiness | High | HubSpot Academy; Notion Academy; Datadog Learning Center |
| Community forum / user groups | Network effects, support deflection | Medium | Atlassian Community; HubSpot Community; Stripe Community |
| Webinar / events calendar | Lead generation, thought leadership | Medium | Datadog Events & Webinars; HubSpot INBOUND |
| Template library / starter kits | Reduce time-to-value, inspiration | Medium | Vercel Templates; Notion Templates; Atlassian Templates |
| On-demand sessions / conference talks | Authority building, evergreen content | Medium | Stripe Sessions; HubSpot INBOUND; Datadog DASH |
| Industry-specific solutions pages | SEO for vertical search, personalization | Medium | Datadog has 9 industry pages; Atlassian has 4+ |
| Status dashboard with historical uptime | Enterprise trust signal | Low | Stripe shows 99.999% uptime stat; Atlassian Trust Center |
| Open source contributions / SDKs | Developer credibility | Low | Stripe GitHub; Datadog Open Source; Vercel Open Source |
| Multi-language / localization | Global market reach | Medium | Stripe supports 30+ languages; HubSpot supports 6 |
| Accessibility statement / VPAT | Enterprise procurement requirement | Low | HubSpot has dedicated accessibility page |

## Anti-Features

Features to explicitly NOT build based on studied patterns.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Single "Help" section mixing docs, guides, and support | Confuses audiences; serves no one well | Separate: Docs (reference) / Guides (how-to) / Support (troubleshooting) |
| Login-gated documentation | Blocks evaluation; competitors show docs freely | All 7 companies show docs without authentication |
| Wall of logos without metrics | Low credibility; looks like paid placement | Always pair logos with measurable outcome stats |
| Paywalled case studies | Case studies are sales enablement, not revenue | All 7 show case studies freely |
| PDF-only documentation | Kills in-app search; hard to update | MDX-based docs with search (all 7 use web-native docs) |
| No pricing page (forced "Contact Sales") | Wastes low-touch prospect time | Show pricing transparently, gate only enterprise pricing |
| Stale blog (<1 post/month) | Kills SEO trust, looks abandoned | Commit to minimum 2 posts/month; use content calendar |
| No mobile-responsive docs | Developers work on mobile too | Linear, Notion, Stripe docs all mobile-optimized |
| Single audience focus | Misses adjacent buyer personas | Build dual paths (e.g., Stripe: developer + business owner; Notion: individual + admin) |

## Page-Type Catalog (Consolidated from All 7 Companies)

### Marketing Pages
| Page Type | Example | Purpose |
|-----------|---------|---------|
| Homepage | stripe.com | Value prop, social proof, product categories, CTA |
| Product page | stripe.com/payments | Feature deep-dive, pricing integration, use cases |
| Solutions page | stripe.com/enterprise | Audience-specific value prop, case studies, features |
| Pricing page | stripe.com/pricing | Plan comparison, feature matrix, FAQ |
| About page | stripe.com/about | Company story, leadership, press |
| Careers page | stripe.com/jobs | Culture, open positions, benefits |

### Documentation Pages
| Page Type | Example | Purpose |
|-----------|---------|---------|
| Docs homepage | docs.stripe.com | Getting started paths, product categories, search |
| API reference | docs.stripe.com/api | Auto-generated from OpenAPI/Spec, interactive |
| Quickstart guide | docs.stripe.com/quickstarts | Time-to-value focused, step-by-step |
| SDK/library page | docs.stripe.com/libraries | Language-specific setup |
| Changelog | docs.stripe.com/changelog | Version history, breaking changes |
| Tutorial/guide | docs.stripe.com/payments | Workflow-oriented, use-case based |

### Trust & Social Proof Pages
| Page Type | Example | Purpose |
|-----------|---------|---------|
| Customer stories | stripe.com/customers | Industry-filterable, metric-heavy case studies |
| Case study detail | stripe.com/customers/shopify | Problem → Solution → Results narrative |
| Trust center | datadoghq.com/trust | Compliance certs, security, privacy |
| Analyst reports | hubspot.com/analyst | Gartner, Forrester quadrants |
| Reviews/awards | hubspot.com/case-studies | G2 badges, TrustRadius awards |

### Content Pages
| Page Type | Example | Purpose |
|-----------|---------|---------|
| Blog | stripe.com/blog | Multi-category, searchable |
| Guides hub | stripe.com/guides | Topic-organized, gated/ungated |
| Webinars | datadoghq.com/webinars | On-demand + live, topic-filtered |
| Academy | academy.hubspot.com | Courses, certifications, quizzes |
| Templates | notion.so/templates | User-submitted, categories, featured |
| Roadmap | linear.app/roadmap | Public, votable, status-tracked |

### Ecosystem Pages
| Page Type | Example | Purpose |
|-----------|---------|---------|
| Integrations | stripe.com/partners | App directory, searchable, categorized |
| Marketplace | marketplace.atlassian.com | Community extensions, ratings |
| Partner directory | stripe.com/partners | Find consultants, agencies |
| Community | community.atlassian.com | Forums, Q&A, user groups |

### Support Pages
| Page Type | Example | Purpose |
|-----------|---------|---------|
| Help center | notion.so/help | FAQ, knowledge base, guided troubleshooting |
| Contact support | stripe.com/support | Ticket submission, priority tiers |
| Status page | status.stripe.com | Uptime, incidents, maintenance |
| Support plans | stripe.com/support-plans | SLA tiers, response times |

## MVP Recommendation

Prioritize (Phase 1-2):
1. **5-pillar navigation** — Products, Solutions, Resources, Docs, Pricing (+ Sign In + Free Trial)
2. **Homepage** — Value prop, product categories, customer logos, CTA
3. **Pricing page** — Plan comparison with clear upgrade path
4. **Enterprise landing page** — Security, compliance, SSO, SLAs
5. **Documentation portal** — Triaged into developer docs, user guides, admin guides
6. **Customer stories page** — Filterable case study grid with at least 3-5 initial stories

Defer (Phase 3+):
- Academy/certification program: Requires content development investment
- Marketplace/ecosystem: Requires third-party adoption
- Public roadmap: Requires product management discipline
- Interactive API playground: Requires engineering investment
- Multi-language: Requires localization infrastructure

## Sources

- Direct page inspection of stripe.com, vercel.com, hubspot.com, atlassian.com, datadoghq.com, linear.app, notion.so (July 2026)
- Documentation pages: docs.stripe.com, vercel.com/docs, docs.datadoghq.com, linear.app/docs, notion.so/help, confluence.atlassian.com
- Customer story pages: stripe.com/customers, datadoghq.com/customers, hubspot.com/case-studies
