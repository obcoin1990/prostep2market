# Architecture Patterns: Enterprise SaaS Information Architecture

**Domain:** Enterprise SaaS marketing + documentation websites
**Researched:** 2026-07-11

## Recommended Architecture

### Multi-Subdomain Model
```
prostep2market.com          → Marketing site (homepage, product, solutions, pricing, blog)
docs.prostep2market.com     → Documentation portal (dev docs, user guides, admin guides)
app.prostep2market.com       → Application dashboard (existing)
developers.prostep2market.com → API reference, SDKs, code samples
status.prostep2market.com    → Status page / uptime
community.prostep2market.com → Forums, discussions (future)
academy.prostep2market.com   → Learning center, certifications (future)
```

**Rationale:** This is the dominant pattern across all 7 companies. Stripe: stripe.com + docs.stripe.com + dashboard.stripe.com. Datadog: datadoghq.com + docs.datadoghq.com + app.datadoghq.com. Vercel: vercel.com + vercel.com/docs (path-based, same subdomain).

**Decision point:** Use subdomain (docs.) vs path (/docs). 
- Subdomain: Better for independent deployment, team ownership, analytics separation
- Path: Better for SEO consolidation, user experience continuity
- Recommendation: Start with **path-based** `/docs` for SEO (smaller site), migrate to subdomain when docs team grows

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| Marketing Site | Homepage, product pages, solutions, pricing, blog | CMS, Analytics, Auth (signup redirect) |
| Docs Portal | Documentation, guides, API reference, tutorials | Git (content source), Algolia (search), Auth (for interactive examples) |
| App Dashboard | Core product UI, user management, trading metrics | API, Database, Auth |
| Status Page | Uptime display, incident history, maintenance calendar | Monitoring API |
| Community | User forums, Q&A, user groups | Auth, CMS |

### Data Flow

```
User → DNS → CDN (Cloudflare)
          ├── Marketing Site (Next.js SSG/ISR) → CMS → Headless CMS Database
          ├── Docs Portal (Next.js SSG) → Git → GitHub (MDX content)
          │                                     → Algolia (search index)
          ├── App Dashboard (Next.js SSR) → API → Application Database
          ├── API Reference (Next.js SSG) → OpenAPI Spec → GitHub
          └── Status Page (Next.js ISR) → Monitoring API
```

## Subdomain Strategies Comparison

| Company | Docs Location | Rationale |
|---------|--------------|-----------|
| Stripe | docs.stripe.com | Separate subdomain; docs team owns independent deployment; different latency requirements |
| Vercel | vercel.com/docs | Path-based; unified user experience; Next.js dogfooding |
| Datadog | docs.datadoghq.com | Separate subdomain; massive docs requiring independent scaling |
| HubSpot | knowledge.hubspot.com | Separate subdomain; knowledge base tool is a product itself |
| Linear | linear.app/docs | Path-based on app domain; docs feel integrated with product |
| Notion | notion.so/help | Path-based; help center is part of the main site |

**ProStep2Market recommendation:** Path-based `/docs` for Phase 1-2, plan subdomain migration for Phase 3.

## Patterns to Follow

### Pattern 1: Mega-Menu Navigation Architecture
**What:** Top-level nav items expand into categorized mega-menus with sub-items, descriptions, and icons
**When:** Product line has multiple distinct offerings (6+ sub-products or audience segments)
**How:**
```
Products (mega menu)
├── By Product Category
│   ├── Trading Platform ├── Features ├── Pricing
│   ├── Education Hub   ├── Courses  ├── Certifications
│   └── Analytics       ├── Metrics  ├── Reporting
├── By Audience
│   ├── Individual Traders  ├── Features ├── Pricing
│   ├── Proprietary Firms   ├── Enterprise├── Case Studies
│   └── Trading Coaches     ├── Resources ├── Partner Program
```
**Used by:** HubSpot, Atlassian, Datadog, Stripe (all have mega-menus)

### Pattern 2: Three-Tier Documentation Triage
**What:** Docs always split into developer reference, user guides, and admin/enterprise guides
**When:** Product has multiple user personas (developers + end users + admins)
**Example:** Datadog's doc nav has "Agent" (dev), "In The App" (user), "Administrator's Guide" (admin)
**ProStep2Market application:**
```
/docs
├── Getting Started (cross-audience)
├── Platform Guide (traders — how to use trading tools)
├── Developer Docs (API, webhooks, SDKs, integrations)
├── Admin Guide (firm owners — team management, compliance, billing)
└── Reference (glossary, keyboard shortcuts, release notes)
```

### Pattern 3: Platform + Enterprise Bifurcation
**What:** Same product marketed differently to individual users vs organizational buyers
**When:** Product serves both self-serve individuals and procurement-driven organizations
**Used by:** Stripe has "Payments" (developer) + "Enterprise" (procurement) + "Platforms" (marketplace); Notion has "Notion" (individual) + "Enterprise" (org); Atlassian has "Teams" + "Enterprise"
**ProStep2Market application:**
- `/individual-traders` — Features for solo traders: education, backtesting, analytics
- `/prop-firms` — Enterprise features: team management, risk controls, P&L allocation, compliance

### Pattern 4: Public Roadmap + Changelog
**What:** Transparent product development visibility drives trust and power-user engagement
**When:** Product is actively developed and community cares about direction
**Used by:** Linear (best-in-class), Stripe, Notion
**Linear's model:**
- `/roadmap` — Categories: Now, Next, Later; each item has vote count and status
- `/changelog` — Date-stamped entries with feature descriptions and links to docs
**ProStep2Market:** Implement `/roadmap` and `/changelog` with voting; drives community engagement and reduces support questions about "when will X feature ship?"

### Pattern 5: Category-Organized Blog Architecture
**What:** Blog content organized into distinct sub-brands/categories rather than a single feed
**When:** Content volume justifies specialization (30+ posts per category)
**Used by:** Datadog (Engineering, AI, Security Labs, The Monitor), HubSpot (Marketing, Sales, Service, CMS blogs)
**ProStep2Market:**
```
/blog
├── Trading Strategies (educational content)
├── Platform Updates (product releases, changelog)
├── Market Analysis (domain expertise, thought leadership)
├── Engineering (technical deep-dives, architecture)
└── Company (culture, hiring, press)
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Single "Resources" Dump
**What:** One page with every type of content (blog, guides, webinars, case studies, ebooks) in a flat list
**Why bad:** No clear user journey; prospects can't find what they need; poor SEO
**Instead:** Use the category grouping pattern seen in HubSpot's Resources menu (Education, Partners, Community, Tools, Services — each with sub-items)

### Anti-Pattern 2: Docs in PDF
**What:** Primary documentation available only as downloadable PDFs
**Why bad:** No search index, no internal linking, no mobile-friendly reading, no interactive elements
**Instead:** MDX-based web docs with Algolia search. PDF export is a secondary offering.

### Anti-Pattern 3: Feature Overload on Landing Pages
**What:** Homepage or product page listing every feature as bullet points
**Why bad:** No information hierarchy; overwhelming; no clear call-to-action
**Instead:** Use Stripe's approach — hero statement → 3-4 solution categories → key metrics → customer logos → case studies → CTA

## Scalability Considerations

| Concern | At 100 users (Phase 1) | At 10K users (Phase 2) | At 100K+ users (Phase 3) |
|---------|----------------------|-----------------------|--------------------------|
| Site hosting | Vercel Hobby tier | Vercel Pro + CDN | Vercel Enterprise + multi-region |
| Search | Algolia DocSearch (free) | Algolia Pro ($25/mo) | Algolia Elevate (custom) |
| Docs content | MDX in Next.js repo | MDX + headless CMS | Separate docs team, subdomain |
| Blog | MDX in marketing repo | Headless CMS with categories | Multi-blog sub-brands |
| Case studies | Single page, 3-5 stories | Filterable directory | Industry + use-case taxonomy |
| API reference | Hand-crafted pages | Auto-generated from OpenAPI | Interactive playground + SDKs |
| Community | No community page | Discourse/Mintlify forum | Managed community platform |
| Search | Site search | DocSearch + Algolia site search | AI-powered semantic search |
| Analytics | Plausible | Plausible + session recording | Full RUM + custom dashboards |
| Localization | English only | 3 languages | 10+ languages (i18n routing) |

## Sources

- Direct inspection of all 7 companies' site architecture (July 2026)
- URL structure analysis: stripe.com, vercel.com, datadoghq.com, hubspot.com, atlassian.com, linear.app, notion.so
- Documentation subdomain patterns: docs.stripe.com, docs.datadoghq.com, vercel.com/docs, linear.app/docs
