# Phase 8: Public Pages & Launch — Research

**Phase:** 8 of 8
**Research scope:** Public page conversion, marketing site patterns, legal compliance for fintech SaaS, Next.js App Router public/private layout patterns
**Status:** Retrospective (written after execution)

---

## Next.js App Router Public/Private Layout Pattern

The standard pattern for separating public marketing pages from authenticated dashboard pages in Next.js App Router is route groups:

```
src/app/
  (public)/          ← no auth, marketing layout
    layout.tsx       ← Navbar + Footer, no session check
    page.tsx         ← landing page lives here OR at root
  (auth)/            ← login/signup, minimal layout
    login/
    signup/
  (dashboard)/       ← protected, sidebar layout
    layout.tsx       ← checks Supabase session, redirects to /login if missing
    dashboard/
    journal/
    ...
  page.tsx           ← root page.tsx (landing) outside groups
```

**Implementation choice:** ProStep2Market places the landing page at `src/app/page.tsx` (root, outside any group) with a root `layout.tsx` that conditionally renders the Navbar using `ConditionalNavbar` — this avoids the `(public)` group entirely but achieves the same result.

---

## Landing Page Conversion Best Practices

### Above-the-fold requirements
- Clear value proposition in the headline (< 10 words)
- Specific, outcome-focused subheadline
- Primary CTA visible without scrolling
- Social proof signal (user count, logos, or testimonial)

**ProStep2Market headline:** "Become a Better Trader by Knowing Yourself First" — strong because it reframes the product around self-awareness, not tool features.

### Section order (proven conversion sequence)
1. Hero (what it is + CTA)
2. Problem statement (why it matters)
3. Solution overview (what it does)
4. Features (how it works in detail)
5. Social proof (who uses it)
6. Pricing teaser (cost signal)
7. Final CTA (close)

This matches the ProStep2Market landing page structure exactly.

### Component reuse
Landing page components (`HeroSection`, `FeaturesGrid`, etc.) should be kept in `src/components/landing/` and not share state with dashboard components. They are static/presentational only.

---

## Pricing Page Research

### SaaS pricing page patterns
- 3-tier (Free / Pro / Enterprise) is the dominant pattern for B2C SaaS with enterprise upsell
- The middle tier (Pro) should be visually highlighted as "most popular"
- Feature comparison table below pricing cards reduces buyer hesitation
- Enterprise tier should have "Contact Us" CTA, not a price — this forces sales conversations

### ProStep2Market tier structure
| Tier | Target | Monetization |
|------|--------|--------------|
| Free | Acquisition, habit formation | Loss leader; upsell to Pro |
| Pro | Individual serious traders | Recurring revenue core |
| Enterprise | Brokers, prop firms, academies | High ACV, white-label |

### Pricing page components
- `PricingCard.tsx` — individual tier card with feature list and CTA
- `ComparisonTable.tsx` — feature-by-feature grid (renders boolean ticks)
- Both components are presentational with no API calls needed

---

## FAQ Page Research

### FAQ design patterns
- Accordion style (one item open at a time) reduces cognitive load vs. all-expanded
- Most critical FAQ for a trading analytics SaaS:
  1. "Do you provide trading signals?" → Must be answered NO explicitly (regulatory)
  2. "Is my data secure?" → GDPR/data trust concern
  3. "How do I connect?" → Onboarding friction question
- FAQ page also serves SEO (question-format content indexes well)

### Implementation
- `FAQAccordion.tsx` — container managing open/closed state
- `FAQItem.tsx` — individual item with `useState` for expand/collapse
- No external library needed; CSS transition on height or `max-height` is sufficient

---

## Legal Pages Research

### Minimum legal requirements for fintech SaaS (UK/international retail)

| Page | Purpose | Required? |
|------|---------|-----------|
| Terms of Service | Define user obligations and platform limits | Yes |
| Privacy Policy | GDPR/CCPA compliance | Yes (legally required in EU/UK/CA) |
| Risk Disclaimer | Forex-specific; protects against liability claims | Yes (critical for trading platforms) |

### Risk Disclaimer — critical clauses for forex platforms
1. **Not financial advice** — must be explicit and prominent
2. **No guarantee of results** — past performance disclaimer
3. **Capital at risk** — retail trader warning (required by FCA, ESMA)
4. **Simulation ≠ live trading** — Strategy Lab simulations are for education only

Failure to include these clauses creates material legal liability in regulated markets (EU, UK, AU).

### ProStep2Market legal stance
The platform is positioned as a **behavioral analytics and education tool**, not a financial services provider. This is the correct framing — it avoids FCA/ESMA authorization requirements while still being able to serve retail traders.

---

## Navigation Architecture Research

### Public Navbar requirements
- Logo (brand anchor)
- Product links (scroll anchors or separate pages)
- Auth CTAs: "Sign In" + "Get Started Free"
- Mobile hamburger menu for < 768px breakpoint

### Dashboard Sidebar requirements
- All 6 module links must be present
- Active state highlighting via `usePathname()`
- Collapse to icon-only on mobile or narrow viewports
- User avatar + sign out at bottom

### Routing verification checklist
All these routes must return 200 with content (not 404):
- `/` — Landing
- `/pricing` — Pricing
- `/faq` — FAQ
- `/legal/terms` — Terms
- `/legal/privacy` — Privacy
- `/legal/disclaimer` — Disclaimer
- `/login` — Sign in
- `/signup` — Sign up (redirects to `/login` in Supabase auth flow)
- `/dashboard` — Protected dashboard (redirects to `/login` if unauthenticated)

---

## Deployment Research

### Vercel deployment configuration (`vercel.json`)
Key settings needed:
- `framework: "nextjs"` — enables Next.js-specific optimizations
- Security headers (X-Frame-Options, CSP, HSTS)
- Function region (closest to Supabase project region)
- Environment variable references

### Environment variables required at launch
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
ANTHROPIC_API_KEY (if Claude integration active)
```

### Build gotchas discovered during Phase 8 execution
1. **`@react-pdf/renderer` + React 19 peer dep conflict** → replaced with `pdf-lib`
2. **Async `params` in Next.js 16** → must `await params` in server components
3. **`legacy-peer-deps`** needed in `.npmrc` due to dependency tree conflicts
4. **Tailwind v4** imports changed from `@tailwind base/components/utilities` to `@import "tailwindcss"`
5. **`tsconfig.json`** needed to exclude `supabase/functions/` from main TS compilation

---

*Research written retrospectively: 2026-05-19*
*Source: Phase 8 plan files, git commit history, RESEURCES specification files*
