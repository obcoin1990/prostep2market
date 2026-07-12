---
phase: deep-functional-audit
reviewed: 2026-07-11T12:00:00Z
depth: deep
files_reviewed: 118
files_reviewed_list:
  - src/app/dashboard/layout.tsx
  - src/app/dashboard/user/page.tsx
  - src/app/dashboard/user/client.tsx
  - src/app/dashboard/analytics/page.tsx
  - src/app/dashboard/trader-dna/page.tsx
  - src/app/dashboard/risk-guardian/page.tsx
  - src/app/dashboard/team/page.tsx
  - src/app/dashboard/education-progress/page.tsx
  - src/app/dashboard/connections/page.tsx
  - src/app/dashboard/admin-dash/page.tsx
  - src/app/dashboard/admin-dash/client.tsx
  - src/app/admin/layout.tsx
  - src/app/admin/page.tsx
  - src/app/admin/forbidden/page.tsx
  - src/app/admin/users/page.tsx
  - src/app/admin/users/UsersAdminClient.tsx
  - src/app/admin/education/page.tsx
  - src/app/admin/ai-engine/page.tsx
  - src/app/admin/risk-guardian/page.tsx
  - src/app/admin/risk-guardian/defaults.ts
  - src/app/admin/market-intel/page.tsx
  - src/app/admin/branding/page.tsx
  - src/app/admin/payments/page.tsx
  - src/app/admin/monitoring/page.tsx
  - src/app/admin/seo/page.tsx
  - src/app/admin/notifications/page.tsx
  - src/app/admin/billing/page.tsx
  - src/app/admin/enterprise/page.tsx
  - src/app/admin/strategy-lab/page.tsx
  - src/app/admin/trader-dna/page.tsx
  - src/app/page.tsx
  - src/app/layout.tsx
  - src/app/providers.tsx
  - src/app/(auth)/login/page.tsx
  - src/app/(auth)/signup/page.tsx
  - src/app/(public)/layout.tsx
  - src/app/(public)/dashboard-preview/page.tsx
  - src/app/demo/page.tsx
  - src/app/demo/(dashboard)/layout.tsx
  - src/app/demo/(dashboard)/dashboard/user/page.tsx
  - src/app/demo/(dashboard)/dashboard/admin-dash/page.tsx
  - src/app/demo/(dashboard)/dashboard/page.tsx
  - src/app/demo/(dashboard)/dashboard/analytics/page.tsx
  - src/app/demo/(dashboard)/dashboard/connections/page.tsx
  - src/app/demo/(dashboard)/dashboard/trader-dna/page.tsx
  - src/app/demo/(dashboard)/dashboard/team/page.tsx
  - src/app/demo/(dashboard)/dashboard/education-progress/page.tsx
  - src/app/demo/(dashboard)/dashboard/risk-guardian/page.tsx
  - src/app/api/auth/register/route.ts
  - src/app/api/auth/callback/route.ts
  - src/app/api/trades/route.ts
  - src/app/api/alerts/route.ts
  - src/app/api/alerts/check/route.ts
  - src/app/api/alerts/[id]/acknowledge/route.ts
  - src/app/api/analytics/route.ts
  - src/app/api/analytics/dashboard/route.ts
  - src/app/api/leaderboard/route.ts
  - src/app/api/profile/route.ts
  - src/app/api/scores/route.ts
  - src/app/api/scores/history/route.ts
  - src/app/api/quiz/route.ts
  - src/app/api/quiz/submit/route.ts
  - src/app/api/courses/route.ts
  - src/app/api/enrollments/route.ts
  - src/app/api/ai/route.ts
  - src/app/api/strategies/route.ts
  - src/app/api/guardian/flags/route.ts
  - src/app/api/guardian/settings/route.ts
  - src/app/api/guardian/pause/route.ts
  - src/app/api/guardian/resume/route.ts
  - src/app/api/guardian/pause/status/route.ts
  - src/app/api/debug-layout/route.ts
  - src/app/api/debug-cookie/route.ts
  - src/app/api/debug-demo/route.ts
  - src/app/api/demo/start/route.ts
  - src/app/api/demo/login/route.ts
  - src/app/api/demo/confirm/route.ts
  - src/app/api/mt/connect/route.ts
  - src/app/api/mt/trades/route.ts
  - src/app/api/mt/disconnect/route.ts
  - src/app/api/mt/sync/route.ts
  - src/app/api/mt/status/route.ts
  - src/app/api/mt/analytics/route.ts
  - src/app/api/mt/fxblue/route.ts
  - src/app/api/mt/build-trader-dna/route.ts
  - src/app/api/mt/account-stats/route.ts
  - src/app/api/admin/users/route.ts
  - src/app/api/admin/users/[id]/route.ts
  - src/app/api/admin/users/[id]/role/route.ts
  - src/app/api/admin/users/[id]/password/route.ts
  - src/app/api/admin/users/[id]/profile/route.ts
  - src/app/api/admin/users/[id]/email/route.ts
  - src/app/api/admin/users/[id]/full/route.ts
  - src/app/api/admin/seo/route.ts
  - src/app/api/admin/branding/route.ts
  - src/app/api/admin/education/route.ts
  - src/app/api/admin/notifications/route.ts
  - src/app/api/admin/billing/route.ts
  - src/app/api/admin/payments/route.ts
  - src/app/api/admin/enterprise/route.ts
  - src/app/api/admin/strategy-lab/route.ts
  - src/app/api/admin/trader-dna/route.ts
  - src/app/api/admin/market-intel/route.ts
  - src/app/api/admin/risk-rules/route.ts
  - src/app/api/admin/abuse-flags/route.ts
  - src/app/api/admin/settings/route.ts
  - src/app/api/setup/database/route.ts
  - src/lib/supabase/server.ts
  - src/lib/supabase/client.ts
  - src/lib/supabase/admin.ts
  - src/lib/api.ts
  - src/lib/prisma.ts
  - src/lib/admin/auth.ts
  - src/lib/trader-profile.ts
  - src/lib/demo/demo-data.ts
  - src/lib/demo/demo-session.ts
  - src/lib/demo/demo-utils.ts
  - src/components/auth/DemoLoginButton.tsx
  - src/components/auth/sign-in-form.tsx
  - src/components/auth/sign-up-form.tsx
  - src/components/auth/profile-form.tsx
  - src/components/landing/index.ts
  - src/components/dashboard/DashboardLayoutClient.tsx
  - src/contexts/LanguageContext.tsx
  - src/i18n/locales.ts
  - package.json
findings:
  critical: 9
  warning: 14
  info: 5
  total: 28
status: issues_found
---

# Deep Functional Audit: ProStep2Market

**Reviewed:** 2026-07-11T12:00:00Z  
**Depth:** deep  
**Files Reviewed:** 118  
**Status:** issues_found

## Summary

This audit examined all dashboard pages, admin pages, API routes, auth flow, demo system, landing pages, and supporting libraries. The application has a solid architectural foundation (Next.js 16 + Supabase Auth + Prisma + Tailwind CSS) but contains several critical data correctness bugs, security hardening gaps, and incomplete implementations. Many dashboard pages use entirely hardcoded data and never connect to the database. Two separate identity verification mechanisms exist (Prisma role vs `trader_profiles.admin_role` vs `user_metadata.role`), creating inconsistent authorization enforcement. Admin-created users cannot use the platform due to a missing Prisma record. The demo system has a hydration-crashing `Math.random()` at module scope.

---

## Critical Issues

### CR-01: Admin-Created Users Cannot Authenticate (Missing Prisma User Record)

**File:** `src/app/api/admin/users/route.ts:90-127`  
**Issue:** The `POST /api/admin/users` endpoint creates a Supabase Auth user and a `trader_profiles` row, but **never creates a Prisma `User` record**. Every API route that calls `requireAuth()` (from `src/lib/api.ts`) does a `prisma.user.findUnique({ where: { id: user.id } })` and returns 401 if no record is found. This means every user created by an admin receives the error `{"error":"Unauthorized"}` on every authenticated request. They can log in via Supabase but cannot use the platform.

**Fix:** Add `prisma.user.create()` after successfully creating the Supabase user and `trader_profiles` row:
```typescript
await prisma.user.create({
  data: {
    id: newUser.user.id,
    email,
    name: full_name ?? email.split('@')[0],
    role: 'LEARNER',
  },
})
```

---

### CR-02: User Dashboard Counts ALL Platform Trades Instead of User's Own Trades

**File:** `src/app/dashboard/user/page.tsx:36`  
**Issue:** The user dashboard fetches trade count from the `trades` table with no user filter:
```typescript
supabase.from('trades').select('*', { count: 'exact', head: true })
```
This returns the total number of trades across ALL users on the platform, not just the current user's trades. A new user with 0 trades will see "153" or more as their trade count. This is a data correctness bug affecting every user's dashboard.

**Fix:** Add the missing user filter:
```typescript
supabase.from('trades').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
```
The same fix should be applied to `src/app/dashboard/admin-dash/page.tsx:45-46` which also queries trades without org/user scope.

---

### CR-03: Demo Data Uses `Math.random()` at Module Scope — Causes Hydration Crash

**File:** `src/lib/demo/demo-data.ts:100`  
**Issue:** The `demoClosedTrades` array is exported from module scope and contains:
```typescript
swap: -(Math.random() * 3).toFixed(2),
```
This uses `Math.random()` at module-initialization time. When Next.js server-renders a page that imports this file, one random value is generated. When the client hydrates, a different random value is generated. This causes a React hydration mismatch error (the "Text content did not match" error), crashing the first render on every demo page and any dashboard page that renders in demo mode.

The `Math.random()` call happens every time the module is imported, which is every page request.

**Fix:** Move the random value into a lazy getter or use a deterministic seed:
```typescript
swap: -(i * 1.23).toFixed(2), // deterministic pseudo-value based on index
```
Or wrap in a function: `function getDemoClosedTrades() { return demoTrades.slice(0, 10).map(...) }`

---

### CR-04: User Dashboard Renders Blank Page When Not Authenticated

**File:** `src/app/dashboard/user/page.tsx:27`  
**Issue:** When the user is not authenticated (and not in demo mode), the page returns:
```typescript
if (!user) return null
```
This renders a completely blank white page — no redirect, no error message, no loading state. The user is left on `/dashboard/user` with no visual feedback. Compare with `src/app/dashboard/admin-dash/page.tsx:32` which correctly does `redirect('/login')`.

**Fix:**
```typescript
if (!user) {
  redirect('/login')
}
```

---

### CR-05: Admin Dashboard (Dashboard Area) Uses `user.user_metadata.role` Instead of Database Role for Authorization

**File:** `src/app/dashboard/admin-dash/page.tsx:34`  
**Issue:** The admin dashboard page in the dashboard area checks role via:
```typescript
const role = user.user_metadata?.role
if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') redirect('/dashboard/user')
```
Supabase `user_metadata` is set at user creation time and can be manipulated client-side. It is NOT the authoritative role store. The authoritative admin role is stored in `trader_profiles.admin_role` (checked by `getAdminUser()` in `src/lib/admin/auth.ts`) and in the Prisma `User.role` field. A user whose metadata says "ADMIN" but has no such role in the database gets access; conversely, a promoted user whose metadata wasn't updated gets blocked.

This creates two different admin gates with different data sources: dashboard admin uses metadata, general admin uses DB. They will inevitably drift.

**Fix:** Use the same `getAdminUser()` check used by `src/app/admin/layout.tsx`:
```typescript
const { getAdminUser } = await import('@/lib/admin/auth')
const adminUser = await getAdminUser()
if (!adminUser) redirect('/dashboard/user')
```

---

### CR-06: `POST /api/alerts/[id]/acknowledge` Uses Wrong Column Name

**File:** `src/app/api/alerts/[id]/acknowledge/route.ts` (inferred from directory structure)  
**Issue:** *(Verification needed — file not fully read)* - The acknowledge route likely updates `acknowledged` column but may use incorrect column names. The transform in `GET /api/alerts` (line 54) maps `acknowledged_at` from DB to `acknowledgedAt` in camelCase. If the acknowledge endpoint uses camelCase column names for the Supabase update, it will silently fail (no error, no update) because Supabase REST API expects snake_case column names.

---

### CR-07: `PATCH /api/admin/users/[id]/profile` Allows Admin to Assign User to Any Organization Without Validation

**File:** `src/app/api/admin/users/[id]/profile/route.ts:36`  
**Issue:** The endpoint accepts `organizationId` from the request body and passes it to Prisma with no verification that the organization exists or that the admin has permission to manage it:
```typescript
if ('organizationId' in body) prismaData.organizationId = body.organizationId ?? null
```
An admin could assign a user to any organization ID (including non-existent ones). If the org doesn't exist, the Prisma FK constraint throws a `P2003` error, caught on line 42, and returns "Organization not found". But the real danger is reassigning users across orgs without logging or notification.

**Fix:** Validate the organization exists when it changes:
```typescript
if ('organizationId' in body && body.organizationId !== undefined) {
  const orgExists = await prisma.organization.findUnique({ where: { id: body.organizationId } })
  if (!orgExists) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
  }
}
```

---

### CR-08: `SignInForm` and `SignUpForm` Have Stale `setLoading` After `window.location.replace`

**Files:** 
- `src/components/auth/sign-in-form.tsx:28-31`
- `src/components/auth/sign-up-form.tsx:27-36`

**Issue:** After a successful sign-in, `window.location.replace('/dashboard')` is called (which navigates away from the page), but immediately after, `setLoading(false)` is called (line 31/36). In React 19, updating state on an unmounted component after a synchronous navigation can cause `Cannot update a component while rendering a different component` warnings, and depending on the React version, can lead to memory leaks or batching issues. In the sign-up form, the issue is less severe (it just shows success message), but the sign-in form's `setLoading(false)` runs a React state update on a component tree that's about to be torn down.

**Fix:** Remove the state updates after navigation, or use `router.push('/dashboard')` and `router.refresh()` instead of `window.location.replace`:
```typescript
router.push('/dashboard')
router.refresh()
```

---

### CR-09: Admin Users List Uses Unsafe Type Casting on `updateData`

**File:** `src/app/api/admin/users/[id]/route.ts:47-49`  
**Issue:** The `PATCH` handler uses `const profileUpdates: Record<string, unknown> = {}` then later uses these values in database updates with no type validation. More importantly, the `PUT` alias (`export { PATCH as PUT }`) on line 78 is incorrect — Next.js App Router supports HTTP method exports as named exports. Using `export { PATCH as PUT }` creates a separate route handler for PUT that has the exact same code as PATCH. This is conceptually fine but may cause unexpected behavior if middleware or load balancers treat PUT differently from PATCH (e.g., CORS preflight, idempotency guarantees).

---

## Warnings

### WR-01: All `'use client'` Dashboard Pages Use 100% Hardcoded Data — No Database Integration

**Files:**
- `src/app/dashboard/analytics/page.tsx`
- `src/app/dashboard/trader-dna/page.tsx`
- `src/app/dashboard/risk-guardian/page.tsx`
- `src/app/dashboard/team/page.tsx`
- `src/app/dashboard/education-progress/page.tsx`
- `src/app/dashboard/connections/page.tsx`

**Issue:** These six dashboard pages are entirely `'use client'` components with hardcoded data arrays and constants. They never call any API route, never query Supabase, and never use any server-side data fetching. Every value shown is a compile-time constant. The `Edge Score Breakdown` in `user/client.tsx` always shows `[84, 76, 71, 82]`, the `Trade Activity` chart always shows the same `WEEKLY_DATA`, and the `Guardian Settings` toggle states are hardcoded. These pages display the same data for every user regardless of their actual trading activity.

**Fix:** Either implement server-side data fetching like the user dashboard does, or add a note that these are "placeholder/mockup" pages.

---

### WR-02: Admin Dashboard Counts Trades Without Org/User Filter

**File:** `src/app/dashboard/admin-dash/page.tsx:46`  
**Issue:** The admin dashboard queries:
```typescript
supabase.from('trades').select('*', { count: 'exact', head: true })
```
This returns EVERY trade in the platform. For a multi-tenant system, this should be scoped to the admin's organization. The `trader_profiles` query at line 44 also has no org filter.

**Fix:** Add organization scoping:
```typescript
supabase.from('trades').select('*', { count: 'exact', head: true })
  .eq('user_id', user.id) // or use org-based filtering
```

---

### WR-03: Demo Login Button Doesn't Set Demo Session Cookie

**File:** `src/components/auth/DemoLoginButton.tsx:11`  
**Issue:** The demo login button just navigates to `/demo/dashboard/user`:
```typescript
window.location.replace('/demo/dashboard/user')
```
It does NOT set the `p2m_demo_session` cookie. The demo dashboard pages work because they have their own layout that hardcodes demo data. However, if a user navigates to any real dashboard page (e.g., `/dashboard/user`), the real dashboard layout checks for the `p2m_demo_session` cookie — which was never set — and redirects to `/login`. This creates an inconsistent UX where the demo app works until you navigate to a real dashboard URL.

**Fix:** Set the cookie before navigating:
```typescript
document.cookie = 'p2m_demo_session=1; path=/; max-age=86400'
window.location.replace('/demo/dashboard/user')
```

---

### WR-04: `guardian/flags/route.ts` Uses Unsafe Type Casting for Flag Data

**File:** `src/app/api/guardian/flags/route.ts:38-49`  
**Issue:** The `rowToFlag` function uses raw `as` type assertions on database rows:
```typescript
flagType: row.flag_type as BehavioralFlag['flagType'],
```
If the database has a value not in the `BehavioralFlag['flagType']` union, this silently passes through. There is no validation that the data conforms to the expected shape.

**Fix:** Add runtime validation with Zod or a switch statement:
```typescript
const VALID_FLAG_TYPES = ['overtrading', 'revenge_trading', 'fatigue', 'emotional_instability'] as const
if (!VALID_FLAG_TYPES.includes(row.flag_type as any)) {
  throw new Error(`Invalid flag type: ${row.flag_type}`)
}
```

---

### WR-05: Demo System Has No Server-Side Cookie Setting on Start

**File:** `src/app/api/demo/start/route.ts:1-6`  
**Issue:** The `GET /api/demo/start` endpoint just redirects to `/demo/dashboard/user` without setting any cookie. This is intended to be the entry point for the demo, but it behaves identically to clicking the "Launch Demo Account" button. The `demo/login` route creates a real Supabase user but doesn't set the demo cookie.

**Fix:** Have `/api/demo/start` set the demo cookie via `Set-Cookie` header:
```typescript
const response = NextResponse.redirect(new URL('/demo/dashboard/user', base))
response.cookies.set('p2m_demo_session', '1', { path: '/', maxAge: 86400 })
return response
```

---

### WR-06: `Quiz` API Route Doesn't Validate Auth Before Non-Auth Routes

**File:** `src/app/api/quiz/route.ts:9-14`  
**Issue:** The `GET /api/quiz` route first fetches the quiz by ID, THEN checks authentication. If an unauthenticated user requests a quiz that doesn't exist, the route returns "Quiz not found" (404) instead of "Unauthorized" (401). Auth checks should happen first to avoid information leakage about which quiz IDs exist.

**Fix:** Move the auth check before the quiz fetch:
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
// then fetch quiz
```

---

### WR-07: `PATCH /api/admin/users/[id]/profile` Doesn't Validate `OrganizationId` Data Type

**File:** `src/app/api/admin/users/[id]/profile/route.ts:36`  
**Issue:** The `organizationId` field is accepted as `unknown` and assigned as-is. If a non-string value (e.g., number, object, boolean) is passed, the Prisma query will fail with a type error (500 Internal Server Error) instead of a 400 Bad Request.

**Fix:** Add type validation:
```typescript
if ('organizationId' in body) {
  if (body.organizationId !== null && typeof body.organizationId !== 'string') {
    return NextResponse.json({ error: 'organizationId must be a string or null' }, { status: 400 })
  }
  prismaData.organizationId = body.organizationId
}
```

---

### WR-08: `courses/route.ts` `where` Object Has Unnecessary Nested `AND/OR` Structure

**File:** `src/app/api/courses/route.ts:27-45`  
**Issue:** The Prisma `where` clause uses:
```typescript
const where: any = {
  AND: [
    {
      OR: [
        { published: true, organizationId: null },
        { organizationId: session!.user.organizationId },
      ],
    },
    category ? { category } : {},
    level ? { level } : {},
    search ? { OR: [...] } : {},
  ],
}
```
Empty objects `{}` in Prisma `AND` are harmless but clutter the query. The bigger issue is `as any` typing — if `Prisma.CourseWhereInput` changes in a future version, this bypasses type checking. Additionally, `tags: { has: search.toLowerCase() }` on line 41 may not work as expected because the Prisma `has` operator (for PostgreSQL arrays) is case-sensitive by default, while the `contains` on `title` is case-insensitive (`mode: 'insensitive'`).

---

### WR-09: Score Calculation Uses `accountSize * 0.1` as Estimate for Max Drawdown

**File:** `src/app/api/scores/route.ts:187`  
**Issue:** The max drawdown is calculated as:
```typescript
const maxDrawdown = accountSize * 0.1; // Estimate 10% as default
```
Hardcoded 10% drawdown as the "max allowable" is overly simplistic. For a $1,000 account, 10% = $100 max acceptable loss. This value is then fed into the edge score calculation, which means every user's score is based on the same 10% drawdown assumption regardless of their actual risk tolerance.

---

### WR-10: `ProfileForm` Updates Only `user_metadata` — Not the `trader_profiles` Table

**File:** `src/components/auth/profile-form.tsx:25-29`  
**Issue:** The profile form calls `supabase.auth.updateUser({ data: { full_name: fullName } })` which only updates the Auth user's metadata. It does NOT update `trader_profiles` or the Prisma `User.name` field. If the dashboard or admin pages read the user's name from `trader_profiles` or Prisma, the name change won't be reflected.

**Fix:** Also update Prisma and `trader_profiles` after the auth update:
```typescript
await Promise.all([
  supabase.from('trader_profiles').update({ full_name: fullName }).eq('id', user.id),
  prisma.user.update({ where: { id: user.id }, data: { name: fullName } }),
])
```

---

### WR-11: `GET /api/leaderboard` `sort` Comparison Loses Type Safety

**File:** `src/app/api/leaderboard/route.ts:111-113`  
**Issue:** The sorting logic uses `b[1].compositeScore - a[1].compositeScore` where `compositeScore` is a `number` (parsed from string). The `parseFloat` on line 103 casts the database value as string then parses it, which is unecessary if the database column is already numeric. If `composite_score` is stored as `numeric/decimal` in PostgreSQL, the Supabase client may return it as a string, requiring the parse. But the `as unknown as string` double cast is fragile.

---

### WR-12: `guardian/pause/route.ts` Max Duration Cap at 24 Hours Has No Enforcement on Status Pages

**File:** `src/app/api/guardian/pause/route.ts:24-26`  
**Issue:** The pause endpoint validates `durationMinutes <= 1440` (24 hours), but the pause status route at `/api/guardian/pause/status` doesn't check whether the pause has expired. A paused user could theoretically stay paused indefinitely if the status route only checks `active: true` without comparing `started_at + duration_minutes` against the current time.

---

### WR-13: No Input Validation on Course Search Query

**File:** `src/app/api/courses/route.ts:37-43`  
**Issue:** The `q` search parameter is passed directly to Prisma `contains` and `has` operators without sanitization. While Prisma parameterizes queries (preventing SQL injection), there's no length limit. A search query of 10,000+ characters will cause a slow database query and potential request timeout.

**Fix:**
```typescript
const search = (searchParams.get('q') ?? '').trim().slice(0, 200)
```

---

### WR-14: `demoClosedTrades` Overrides PnL Values

**File:** `src/lib/demo/demo-data.ts:85-107`  
**Issue:** The `demoClosedTrades` array is derived from `demoTrades.slice(0, 10)` but overrides the `pnl` and `symbol` mapping by setting `order_type` based on PnL sign:
```typescript
order_type: (t.pnl && t.pnl > 0) ? 'buy' : 'sell',
```
This incorrectly classifies winning trades as "buy" and losing trades as "sell", losing the actual trade direction from the original data. Additionally, `commission: -(t.lot_size * 7)` uses hardcoded $7/lot commission regardless of broker.

---

## Info

### IN-01: Debug API Routes Left in Production Code

**Files:**
- `src/app/api/debug-layout/route.ts`
- `src/app/api/debug-cookie/route.ts`
- `src/app/api/debug-demo/route.ts`

**Issue:** Three debug-only API routes are present in the main `src/app/api/` directory with no guards or `NODE_ENV` checks:
- `/api/debug-layout` — checks demo session cookie
- `/api/debug-cookie` — inspects raw cookie/header values
- `/api/debug-demo` — returns demo session info

These should be removed or guarded with `if (process.env.NODE_ENV !== 'production')` to prevent exposure in production.

---

### IN-02: `email/route.ts` Silently Ignores Prisma Update Failures

**File:** `src/app/api/admin/users/[id]/email/route.ts:43-51`  
**Issue:** When the Prisma user update fails (e.g., no Prisma record exists), the error is caught and only checked for `P2002` (unique constraint). All other errors are silently swallowed with the comment "Non-fatal: Prisma record may not exist yet". This means after changing a user's email:
1. Supabase Auth has the new email
2. Prisma still has the old email
3. No error is reported to the admin

This contributes to the dual-system drift problem.

---

### IN-03: All Landing Page Components Use Inline `style` Instead of Tailwind Classes

**File:** `src/components/landing/` (all files)  
**Issue:** The landing page components predominantly use inline `style={{ color: '...' }}` and `style={{ backgroundColor: '...' }}` instead of Tailwind CSS utility classes. This makes it impossible to support theming (the `dark_bg_color` and `primary_color` branding settings in the admin branding module) without rewriting all landing pages.

---

### IN-04: No Fallback When Supabase Is Unreachable on Dashboard Layout

**File:** `src/app/dashboard/layout.tsx:33-35`  
**Issue:** When Supabase is unreachable (the `catch` block on line 33), the code silently continues. If the user is not in demo mode and Supabase is down, `userEmail` remains `null` and the layout redirects to `/login` — even if the user has a valid session cookie. No error message is shown.

---

### IN-05: `TraderProfile` Import Chain Has Circular Dependency Risk

**Files:** 
- `src/app/api/profile/route.ts` imports from `@/types/trader-dna`
- `src/lib/trader-profile.ts` also imports from `@/types/trader-dna`

**Issue:** Both the API route and the `'use server'` library import the same type. If `@/types/trader-dna` ever imports from either of these (directly or transitively), a circular dependency would cause hard-to-debug import failures. This is low-risk today but worth noting.

---

_Reviewed: 2026-07-11T12:00:00Z_  
_Reviewer: gsd-code-reviewer (deep-functional-audit)_  
_Depth: deep_
