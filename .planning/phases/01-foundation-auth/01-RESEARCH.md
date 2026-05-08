# Phase 1: Foundation & Auth - Research

**Researched:** 2026-05-08
**Domain:** Next.js 16 + Supabase Auth + Design System Implementation
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundational infrastructure for ProStep2Market including Next.js 16 project setup with App Router, Supabase authentication with email/password flows, design system implementation with CSS variables + Tailwind, and the basic dashboard shell with responsive layout. The research confirms modern patterns for each domain and identifies the most practical libraries for onboarding tours.

**Primary recommendation:** Use Next.js 16 with App Router, Supabase SSR package (v0.10.3) for cookie-based session management, Tailwind with CSS custom properties for design tokens, and react-joyride (v3.1.0) for onboarding tours since it's the most mature React-first solution.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Framework:** Next.js 14+ with App Router and TypeScript
- **Hosting:** Vercel (edge deployment)
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Colors:** Brand Red #E53935, Brand Green #2E7D32, Brand Black #0B0B0B, Pure White #FFFFFF
- **Typography:** Inter font family (fallback: Poppins)
- **Border radius:** 6px (sm), 12px (md)
- **Spacing:** Consistent 4px base unit
- **Authentication:** Email/password signup and login, email verification required, password reset via email, session persistence via cookies, user profile with name, avatar, preferences

### the agent's Discretion
- Dashboard layout implementation approach (sidebar vs other patterns)
- Onboarding tour library selection
- Specific Tailwind configuration approach

### Deferred Ideas (OUT OF SCOPE)
- Trader DNA assessment (Phase 2)
- AI Trade Intelligence engine (Phase 4)
- Risk Guardian system (Phase 5)
- Edge Score full implementation (Phase 6)
- Education content (Phase 7)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CORE-01 | Next.js project setup on Vercel with App Router | Use `npx create-next-app@latest` with TypeScript, Tailwind, App Router |
| CORE-02 | Supabase project setup (Auth, Database, Storage, Edge Functions) | Create Supabase project, configure Email auth, set up storage bucket for avatars |
| CORE-03 | Design system implementation (colors, typography, spacing tokens) | CSS custom properties in globals.css + Tailwind config |
| CORE-04 | Reusable UI component library (buttons, cards, alerts, badges) | Component patterns from RESEURCES/components.md |
| CORE-05 | Responsive layout system (mobile-first approach) | Sidebar pattern with hidden md:flex, drawer for mobile |
| AUTH-01 | Email/password signup and login | Supabase auth.signUp() and signInWithPassword() |
| AUTH-02 | Email verification flow | Supabase email redirect with emailConfirmRedirectTo |
| AUTH-03 | Password reset via email link | Supabase auth.resetPasswordForEmail() |
| AUTH-04 | Session persistence across browser refresh | Supabase SSR cookies with createServerClient |
| AUTH-05 | User profile management (name, avatar, preferences) | Supabase auth.updateUser() + storage for avatars |
| ONBD-01 | Dashboard homepage with navigation | Dashboard layout with sidebar, header, widget grid |
| ONBD-02 | First-time user tour/highlights | react-joyride v3.1.0 for React-first onboarding |
| DASH-01 | Edge Score card widget | Widget with score, sparkline, rank, tips display |
| DASH-02 | Emotional Risk Meter widget | Gradient indicator with action text |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Next.js App Router setup | Frontend Server (SSR) | — | Server-side rendering with App Router requires proper directory structure and layout nesting |
| Supabase Auth integration | Frontend Server (SSR) | Browser / Client | Session management happens via cookies on SSR; client browser handles token refresh |
| Design system / CSS tokens | Frontend Server (SSR) | Browser / Client | CSS variables defined in globals.css, applied during server render |
| Dashboard layout | Browser / Client | — | Responsive layout requires client-side state for sidebar toggle |
| Onboarding tour | Browser / Client | — | Tour library renders overlay in browser DOM |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.6 [VERIFIED: npm registry] | React framework with App Router | Industry standard for React SSR; v16 is latest stable |
| TypeScript | bundled | Type safety | Recommended by Next.js, prevents runtime errors |
| @supabase/ssr | 0.10.3 [VERIFIED: npm registry] | SSR cookie handling for Supabase | Official package, handles session persistence |
| @supabase/supabase-js | 2.105.4 [VERIFIED: npm registry] | Supabase client | Official JS client |
| Tailwind CSS | bundled with Next.js | Utility-first CSS | Default with create-next-app, integrates with design tokens |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-joyride | 3.1.0 [VERIFIED: npm registry] | Onboarding tour | React-first, supports SSR, MIT licensed |
| @supabase/storage | (included in supabase-js) | Avatar storage | Profile images, user uploads |
| lucide-react | (shadcn default) | Icons | Dashboard navigation, UI icons |
| recharts | latest | Charts/sparklines | Edge Score trend visualization |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-joyride | driver.js (1.4.0) | driver.js is vanilla JS only (~5KB smaller) but requires wrapper for React; react-joyride is React-native |
| @supabase/ssr | Manual cookie handling | More error-prone, requires custom session refresh logic |
| Tailwind + CSS vars | pure CSS modules | More code to maintain; Tailwind's utility classes speed development |

**Installation:**
```bash
npx create-next-app@latest prostep2market --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install @supabase/supabase-js @supabase/ssr react-joyride lucide-react recharts
```

**Version verification:**
- Next.js: 16.2.6 (published: 2026-05-??)
- @supabase/supabase-js: 2.105.4 (published: recent)
- @supabase/ssr: 0.10.3 (published: recent)
- react-joyride: 3.1.0 (published: 2026-04-29)

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Vercel Edge                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Next.js App Router                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ (root)       │  │ /auth         │  │ /dashboard   │   │   │
│  │  │ layout.tsx   │  │ /signup       │  │ /layout.tsx  │   │   │
│  │  │              │  │ /login        │  │              │   │   │
│  │  │ - Providers  │  │ /reset        │  │ - Sidebar    │   │   │
│  │  │ - CSS Vars   │  │               │  │ - Header     │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Supabase Cloud                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Auth       │  │  Database    │  │   Storage    │        │
│  │  - Users     │  │  - profiles  │  │  - avatars   │        │
│  │  - Sessions  │  │  - RLS       │  │              │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
prostep2market/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Sidebar + Header
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   └── profile/page.tsx
│   │   ├── api/
│   │   │   └── auth/callback/route.ts
│   │   ├── layout.tsx             # Root layout + Providers
│   │   ├── page.tsx              # Landing/redirect
│   │   └── globals.css           # Design tokens
│   ├── components/
│   │   ├── ui/                   # Reusable components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── badge.tsx
│   │   ├── auth/                 # Auth components
│   │   │   ├── sign-in-form.tsx
│   │   │   └── sign-up-form.tsx
│   │   ├── dashboard/            # Dashboard widgets
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── edge-score-card.tsx
│   │   │   └── risk-meter.tsx
│   │   └── tour/                 # Onboarding
│   │       └── onboarding-tour.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client (SSR)
│   │   │   └── middleware.ts     # Auth protection
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

### Pattern 1: Supabase SSR Client with Cookies
**What:** Server-side Supabase client that reads/writes cookies for session persistence
**When to use:** Every Server Component, Middleware, and API Route that needs auth
**Example:**
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}
```
Source: [VERIFIED: Context7 /supabase/ssr documentation]

### Pattern 2: Responsive Sidebar with Mobile Drawer
**What:** Desktop sidebar with hidden md:flex pattern, mobile uses sheet/drawer
**When to use:** Dashboard layouts requiring mobile-friendly navigation
**Example:**
```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r bg-background">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile: Use Sheet component for drawer */}
      <MobileNavSheet />
    </div>
  )
}
```
Source: [CITED: tailwindcss.com/plus/ui-blocks/application-ui/application-shells/sidebar]

### Pattern 3: Design Tokens with CSS Variables + Tailwind
**What:** Define brand colors/spacing in CSS custom properties, use in Tailwind
**When to use:** Implementing consistent design system across components
**Example:**
```css
/* src/app/globals.css */
@theme {
  --color-brand-red: #E53935;
  --color-brand-green: #2E7D32;
  --color-brand-black: #0B0B0B;
  --color-white: #FFFFFF;
  --color-muted-gray: #F5F7FA;
  --color-dark-gray: #1F2933;

  --radius-sm: 6px;
  --radius-md: 12px;

  --font-family-sans: 'Inter', 'Poppins', system-ui, sans-serif;
}
```
```tsx
// Using in components
<button className="bg-brand-red text-white rounded-md hover:opacity-90">
  Sign Up
</button>
```
Source: [VERIFIED: RESEURCES/style-tokens.md]

### Pattern 4: Auth Middleware Protection
**What:** Middleware that checks auth session and redirects unauthenticated users
**When to use:** Protecting dashboard routes
**Example:**
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          const response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
          return response
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```
Source: [VERIFIED: Context7 /supabase/ssr documentation]

### Pattern 5: Onboarding Tour with react-joyride
**What:** Client-side tour that highlights dashboard elements for first-time users
**When to use:** ONBD-02 first-time user tour requirement
**Example:**
```tsx
// components/tour/onboarding-tour.tsx
'use client'

import { useState } from 'react'
import Joyride, { STATUS } from 'react-joyride'

const steps = [
  {
    target: '[data-tour="edge-score"]',
    content: 'Your Edge Score tracks your trading discipline. Aim for consistency!',
    placement: 'bottom',
  },
  {
    target: '[data-tour="risk-meter"]',
    content: 'The Risk Meter shows your emotional state. Take breaks when it climbs.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="sidebar-journal"]',
    content: 'Log your trades here to track performance and get AI insights.',
    placement: 'right',
  },
]

export function OnboardingTour() {
  const [run, setRun] = useState(true)

  const handleJoyrideCallback = (data: any) => {
    const { status } = data
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false)
      // Save tour completed to localStorage/user preferences
    }
  }

  return (
    <Joyride
      run={run}
      steps={steps}
      continuous
      showProgress
      showSkipButton
      styles={{ primaryColor: '#E53935' }}
      callback={handleJoyrideCallback}
    />
  )
}
```
Source: [VERIFIED: react-joyride.com documentation]

### Anti-Patterns to Avoid

- **Anti-pattern: Using browser client in Server Components** — Never use `createClient` from `@supabase/supabase-js` in Server Components; it won't have access to cookies. Always use `@supabase/ssr`'s `createServerClient`.

- **Anti-pattern: Storing auth tokens in localStorage** — Supabase Auth uses HTTP-only cookies for security. Storing tokens in localStorage exposes them to XSS attacks.

- **Anti-pattern: Disabling RLS for development convenience** — Even in dev, practice proper RLS policies. It prevents accidental data leakage when the app goes to production.

- **Anti-pattern: Not handling session refresh in middleware** — The server client doesn't auto-refresh tokens (by design). Put refresh logic in middleware for protected routes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auth session management | Custom cookie handling | @supabase/ssr | Handles PKCE flow, token refresh, secure cookie options automatically |
| Responsive sidebar | Custom CSS media queries | Tailwind + Sheet component | Tailwind's responsive classes are battle-tested, Sheet provides mobile drawer |
| Onboarding tour | Custom overlay + positioned divs | react-joyride | Handles scrolling, focus trapping, keyboard navigation, SSR safety |
| Charts/sparklines | D3.js from scratch | recharts | Pre-built components, React-native, smaller bundle than D3 |
| Icons | Custom SVGs everywhere | lucide-react | Consistent style, tree-shakeable, accessible |

**Key insight:** Supabase's SSR package is specifically designed to solve the cookie propagation problem between Next.js server components and the browser. Building this manually is error-prone and introduces security risks.

---

## Runtime State Inventory

> This section is not applicable for Phase 1 (greenfield setup) — no existing runtime state to migrate.

---

## Common Pitfalls

### Pitfall 1: Server Component Auth Check Without Middleware
**What goes wrong:** Server Components check user but request hangs or returns null
**Why it happens:** The server client needs middleware to refresh expired sessions
**How to avoid:** Always include session refresh in middleware before route protection
**Warning signs:** Users redirected unexpectedly, auth state inconsistent between pages

### Pitfall 2: CSS Variables Not Applying in Tailwind
**What goes wrong:** Custom properties defined but not accessible via Tailwind classes
**Why it happens:** Tailwind v4 uses `@theme` directive differently than v3; or wrong config path
**How to avoid:** Use `@theme` block in globals.css for v4, or configure in tailwind.config.ts for v3
**Warning signs:** Classes like `text-brand-red` don't resolve

### Pitfall 3: Onboarding Tour Fails on SSR
**What goes wrong:** Tour renders on server, causes hydration mismatch
**Why it happens:** Joyride components reference window/DOM directly
**How to avoid:** Always wrap tour in `'use client'` directive and lazy-load or use useEffect
**Warning signs:** `Text content does not match server-rendered HTML` errors

### Pitfall 4: Email Confirmation Redirect Loop
**What goes wrong:** User clicks email link but gets redirected back to unverified state
**Why it happens:** `emailConfirmRedirectTo` not set in signUp options, or redirect URL doesn't match Supabase allowed URLs
**How to avoid:** Set `options.emailRedirectTo` to full URL and add it to Supabase dashboard redirect allowlist
**Warning signs:** "Invalid callback URL" error or endless redirect loop

### Pitfall 5: Storage Bucket Not Accessible After Upload
**What goes wrong:** Avatar uploads succeed but can't be retrieved
**Why it happens:** RLS policies on storage bucket not configured, or wrong bucket name used
**How to avoid:** Set RLS policies for authenticated users to upload/read, use correct public URL generation
**Warning signs:** 403 errors on avatar display, upload succeeds but no public URL returned

---

## Code Examples

### Complete Auth Flow: Sign Up with Email Verification
```typescript
// app/(auth)/signup/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for the confirmation link!')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        minLength={6}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  )
}
```
Source: [VERIFIED: Context7 /supabase/supabase documentation]

### User Profile Management
```typescript
// Update user profile (name, avatar URL)
const { data, error } = await supabase.auth.updateUser({
  data: {
    full_name: 'John Trader',
    avatar_url: 'https://example.com/avatar.jpg',
  }
})

// Upload avatar to storage + update user
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('avatars')
  .upload(`${user.id}/avatar`, fileBlob)

const avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/avatar`
await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } })
```
Source: [VERIFIED: Context7 /supabase/supabase documentation]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router | App Router | Next.js 13+ | Server components by default, better performance |
| Manual Supabase cookies | @supabase/ssr package | 2023 | Built-in PKCE, secure session handling |
| React Context for auth | Next.js middleware + server client | Now standard | More reliable, works across all rendering modes |
| Joyride v2 | react-joyride v3.x | 2026-04 | Better React 19 support, smaller bundle |
| Tailwind v3 config | Tailwind v4 @theme | 2024 | CSS-first configuration, better CSS variables integration |

**Deprecated/outdated:**
- `createClient` from `@supabase/supabase-js` for SSR — use `@supabase/ssr` instead
- `getServerSession` pattern — Supabase handles session via cookies natively
- react-joyride v2 — has issues with React 19, upgrade to v3

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Next.js 16 is stable and recommended | Standard Stack | LOW - v16 is latest stable as of May 2026 |
| A2 | react-joyride v3 works with Next.js App Router | Onboarding | LOW - v3 released April 2026, includes SSR-safe components |
| A3 | Design tokens use Tailwind v4 @theme approach | Architecture | MEDIUM - If project uses Tailwind v3, config approach differs |

---

## Open Questions

1. **Tailwind Version Selection**
   - What we know: Next.js 16 bundles Tailwind, v4 is current
   - What's unclear: Whether to use v4's CSS-first @theme or v3's JS config
   - Recommendation: Use v4 @theme approach for better CSS variable integration

2. **Avatar Storage Configuration**
   - What we know: Supabase Storage needs bucket + RLS policies
   - What's unclear: Whether to use Supabase's built-in avatar system or custom bucket
   - Recommendation: Create `avatars` bucket with authenticated user RLS policy

3. **Onboarding Tour Persistence**
   - What we know: react-joyride can track completion via callback
   - What's unclear: Store completion in Supabase user_metadata or localStorage
   - Recommendation: Store in Supabase user_metadata for cross-device consistency

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/development | Check on machine | — | Install via nvm or official installer |
| npm/pnpm | Package management | Check on machine | — | — |
| Supabase CLI | Local dev | Optional | — | Use cloud dashboard |
| Vercel CLI | Deployment | Optional | — | Use web dashboard |

**Missing dependencies with no fallback:**
- None identified — all Phase 1 dependencies are npm packages that install during project setup

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (bundled with Next.js) |
| Config file | `vitest.config.ts` (create if needed) |
| Quick run command | `npm run lint` |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CORE-01 | Next.js project initializes | smoke | `npm run build` | ✅ |
| CORE-02 | Supabase configured | manual | — | — |
| CORE-03 | Design tokens apply | smoke | Visual verification | ❌ |
| CORE-04 | UI components render | unit | `npm run lint` | ❌ |
| CORE-05 | Responsive layout works | e2e | Browser test | ❌ |
| AUTH-01 | Email/password signup | integration | Supabase test | ❌ |
| AUTH-02 | Email verification flow | integration | Manual test | ❌ |
| AUTH-03 | Password reset works | integration | Manual test | ❌ |
| AUTH-04 | Session persists | integration | Browser test | ❌ |
| AUTH-05 | Profile management | integration | Manual test | ❌ |
| ONBD-01 | Dashboard renders | smoke | `npm run build` | ✅ |
| ONBD-02 | Tour displays | e2e | Browser test | ❌ |
| DASH-01 | Edge Score widget | unit | Component test | ❌ |
| DASH-02 | Risk Meter widget | unit | Component test | ❌ |

### Sampling Rate
- **Per task commit:** `npm run lint`
- **Per wave merge:** `npm run build`
- **Phase gate:** Full build + lint + manual auth flow test

### Wave 0 Gaps
- [ ] `src/app/globals.css` — design tokens with @theme
- [ ] `src/components/ui/` — button, card, input, badge components
- [ ] `src/components/dashboard/` — sidebar, header, widget components
- [ ] `src/lib/supabase/client.ts` and `server.ts` — client setup
- [ ] `src/middleware.ts` — auth protection
- [ ] `src/app/(auth)/*` — login, signup, reset pages

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Supabase Auth with email/password, PKCE flow |
| V3 Session Management | yes | @supabase/ssr cookies with secure, httpOnly, sameSite=lax |
| V4 Access Control | yes | Supabase RLS policies on database and storage |
| V5 Input Validation | yes | Client-side: React forms; Server: Supabase validation |
| V6 Cryptography | yes | Supabase handles at rest (PostgreSQL encryption) |

### Known Threat Patterns for Next.js + Supabase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via user content in dashboard | Tampering | React escapes by default; sanitize if using dangerouslySetInnerHTML |
| Auth token leakage | Information Disclosure | Use httpOnly cookies via @supabase/ssr, never localStorage |
| SQL injection | Tampering | Supabase uses parameterized queries, RLS adds layer of protection |
| Middleware auth bypass | Elevation of Privilege | Test middleware thoroughly, use Supabase's getUser() not getSession() |
| RLS misconfiguration | Information Disclosure | Always test RLS policies with different user contexts |

---

## Sources

### Primary (HIGH confidence)
- [Context7 /supabase/ssr] - Cookie handling and server client setup
- [Context7 /supabase/supabase] - Auth methods (signUp, signInWithPassword, resetPasswordForEmail)
- [VERIFIED: npm registry] - Package versions: next@16.2.6, @supabase/ssr@0.10.3, @supabase/supabase-js@2.105.4, react-joyride@3.1.0

### Secondary (MEDIUM confidence)
- [tailwindcss.com/plus/ui-blocks/application-ui/application-shells/sidebar] - Responsive sidebar patterns
- [react-joyride.com/docs/how-it-works] - Tour implementation patterns

### Tertiary (LOW confidence)
- [nirajiitr.com/blog/dashboard-ui-tailwind-shadcn] - Dashboard layout patterns (needs verification)

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH - versions verified via npm registry, libraries are official/standard
- Architecture: HIGH - patterns verified via Context7 official docs
- Pitfalls: MEDIUM - common issues documented, some are Supabase-specific

**Research date:** 2026-05-08
**Valid until:** 2026-06-08 (30 days for stable tech; update if library versions change significantly)