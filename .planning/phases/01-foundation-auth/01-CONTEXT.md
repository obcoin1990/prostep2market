# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Source:** YOLO mode (skipping discuss-phase per config)

<domain>
## Phase Boundary

Set up ProStep2Market project infrastructure, implement authentication system, build design system, and create basic dashboard shell.

</domain>

<decisions>
## Implementation Decisions

### Tech Stack
- **Framework:** Next.js 14+ with App Router and TypeScript
- **Hosting:** Vercel (edge deployment)
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **AI:** OpenAI and Claude APIs (for future phases)

### Design System
- **Colors:**
  - Brand Red: #E53935 (CTAs, primary accents)
  - Brand Green: #2E7D32 (positive states, success indicators)
  - Brand Black: #0B0B0B (primary text, UI chrome)
  - Pure White: #FFFFFF (backgrounds)
- **Typography:** Inter font family (fallback: Poppins)
- **Border radius:** 6px (sm), 12px (md)
- **Spacing:** Consistent 4px base unit

### Authentication
- Email/password signup and login
- Email verification required for onboarding
- Password reset via email link
- Session persistence (cookies with Supabase Auth)
- User profile with name, avatar, preferences

### Dashboard
- Edge Score card widget (score, trend sparkline, rank, tips)
- Emotional Risk Meter widget (gradient indicator with action text)
- Quick navigation to all 6 modules
- Mobile-first responsive design

### UI Components (from RESEURCES/components.md)
- Primary button: brand-red background, white text
- Secondary button: transparent, black border
- Cards: white/light-gray background, 12px radius, subtle shadow
- Alerts/badges: muted backgrounds with colored borders

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `RESEURCES/components.md` — UI component specifications
- `RESEURCES/style-tokens.md` — Design tokens and CSS variables
- `RESEURCES/brand-guidelines.md` — Brand essence and visual rules
- `RESEURCES/onboarding.md` — Onboarding flow (Step 1-6)
- `RESEURCES/dashboard.md` — Dashboard widgets and data refresh specs

### Config
- `.planning/PROJECT.md` — Project context and goals
- `.planning/REQUIREMENTS.md` — Phase requirements (CORE-01 to CORE-05, AUTH-01 to AUTH-05, ONBD-01 to ONBD-02, DASH-01 to DASH-02)
- `.planning/ROADMAP.md` — Phase 1 success criteria

</canonical_refs>

<specifics>
## Specific Ideas

### Next.js Setup
- Use `create-next-app` with TypeScript and App Router
- Enable Tailwind CSS for utility classes
- Configure path aliases (@/ for src/)
- Environment variables for Supabase connection

### Supabase Setup
- Create project at supabase.com
- Enable Email auth provider
- Create database schema for users (extend auth.users)
- Set up Row Level Security (RLS) policies
- Configure storage bucket for avatars

### Dashboard Layout
- Sidebar navigation (collapsible on mobile)
- Top bar with user avatar and quick actions
- Main content area with widget grid
- Mobile: bottom navigation bar

### Onboarding Flow (from onboarding.md)
1. Create account (email/password)
2. Verify email
3. Trader DNA assessment (Phase 2, but UI placeholder)
4. Dashboard tour for first-time users

</specifics>

<deferred>
## Deferred Ideas

- Trader DNA assessment (Phase 2)
- AI Trade Intelligence engine (Phase 4)
- Risk Guardian system (Phase 5)
- Edge Score full implementation (Phase 6)
- Education content (Phase 7)

None — Phase 1 is the complete foundation scope.

</deferred>

---

*Phase: 01-foundation-auth*
*Context gathered: 2026-05-08 via YOLO mode*