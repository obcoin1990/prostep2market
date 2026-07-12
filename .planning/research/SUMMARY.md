# Research Summary: Enterprise SaaS Information Architecture

**Domain:** Trader development platform (ProStep2Market)
**Researched:** 2026-07-11
**Overall confidence:** HIGH

## Executive Summary

This research analyzed 7 enterprise SaaS products (Stripe, Vercel, HubSpot, Atlassian, Datadog, Linear, Notion) to extract information architecture patterns, page structures, and content ecosystem best practices for ProStep2Market's website expansion.

**The universal pattern** across all 7 companies is a **5-pillar navigation model**: Products → Solutions → Resources → Docs → Pricing. This forms the backbone of how enterprise SaaS organizes information for multiple audiences simultaneously.

**Documentation is always triaged** into three tiers: developer docs (API references, SDKs), user guides (how-to, workflows), and admin guides (configuration, security, billing). The separation is never optional — it's structural. Stripe, Datadog, and Vercel maintain entirely separate subdomains for docs (docs.stripe.com, docs.datadoghq.com, vercel.com/docs), while Notion and Linear embed help within the app but link to dedicated developer portals.

**Customer journey pages follow a predictable funnel**: Free trial → Product-led onboarding → Case studies showing ROI → Enterprise sales contact. Every company studied places trial signup and sales contact as persistent CTAs in the nav bar itself.

**Social proof is layered**: Logos (awareness) → Case studies (consideration) → Metrics/reports (decision) → Analyst reports (validation). Datadog and HubSpot have the most mature trust architectures with dedicated trust/compliance centers.

**For ProStep2Market**, the key adaptation is that as a trader development platform serving B2B (proprietary trading firms) and B2C (individual traders), the site needs dual pathways: one for traders (features, learning, community) and one for firm owners/administrators (enterprise, compliance, team management). Stripe's "Payments for Platforms" + "Payments for Enterprises" bifurcation model is the most applicable pattern.

## Key Findings

**Stack:** The universal stack for enterprise SaaS marketing sites is Next.js + static generation + Algolia search + a headless CMS. Documentation is increasingly moving to MDX-based systems with integrated interactive code samples. Stripe uses custom tooling; Vercel uses Next.js itself; Datadog uses a custom static site generator with Hugo-like structure.

**Architecture:** The dominant pattern is a multi-subdomain approach: main site (marketing), docs subdomain (documentation), app subdomain (dashboard), blog subdomain (content), developers subdomain (API/developer portal). This separation serves different latency, auth, and access requirements.

**Critical pitfall:** The most common failure is conflating developer docs with user guides — creating a single "Help" section that serves no audience well. The second: not having a clear enterprise landing page. Every company studied has a dedicated `/enterprise` page that answers procurement questions (security, compliance, SSO, SLAs). ProStep2Market must have this.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Foundation: Navigation & IA Architecture** — Set up the 5-pillar nav, subdomain strategy, content hierarchy taxonomy
   - Addresses: Core page types from FEATURES.md
   - Avoids: Information architecture debt

2. **Marketing Site Revamp** — Homepage, product pages, solutions pages, pricing page
   - Addresses: Marketing ecosystem pages
   - Avoids: Feature gaps in table-stakes pages

3. **Documentation Portal** — Developer docs, user guides, admin guides with search
   - Addresses: Document triage, search, interactive examples
   - Avoids: Doc content sprawl

4. **Trust & Social Proof Layer** — Case studies, customer stories, metrics page, compliance/trust center
   - Addresses: Social proof, enterprise validation
   - Avoids: Missing enterprise trust signals

5. **Content Ecosystem** — Blog, guides, tutorials, academy/learning center
   - Addresses: Content marketing, SEO, community
   - Avoids: Thin content pitfall

6. **Community & Ecosystem** — Community hub, partner directory, marketplace/templates
   - Addresses: Network effects, user-generated content
   - Avoids: Isolation from user community

**Phase ordering rationale:**
- Navigation/IA must come first because every other page depends on the structure
- Marketing site precedes docs because marketing pages drive trial conversion
- Docs precede trust because docs inform case study creation (you need to understand the product to write great stories)
- Content comes last because it depends on product understanding and case study material

**Research flags for phases:**
- Phase 3 (Docs): Likely needs deeper research on documentation platform choices
- Phase 4 (Trust): SOC2/compliance requirements need legal input
- Phase 5 (Content): SEO keyword research needed specific to trading domain

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Navigation/IA | HIGH | Direct observation of all 7 sites |
| Page Types | HIGH | Consistent patterns verified across all studied examples |
| Documentation Structure | HIGH | Pages fetched and analyzed in detail |
| Customer Journey | MEDIUM | Inferred from CTA placement, not A/B test data |
| Social Proof Strategy | MEDIUM | Pattern consistent but ROI data from companies is proprietary |
| Pricing Page Structure | LOW | Only studied link destinations, not full pricing pages |

## Gaps to Address

- Pricing page structure details: Linear and Vercel use usage-based + seat-based hybrid; Stripe uses transparent per-transaction pricing; Atlassian uses per-user tiers. Need phase-specific research on trading industry pricing models.
- Specific trading domain case studies: The general patterns are clear but trading-specific social proof will need custom development.
- Compliance documentation requirements: Trading platforms have specific regulatory needs (FINRA, SEC) that go beyond standard enterprise SaaS compliance.
- SEO content strategy: Trading/education keywords need specific research not covered here.
