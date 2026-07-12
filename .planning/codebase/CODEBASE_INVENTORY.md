# ProStep2Market — Complete Codebase Inventory

**Inventory Date:** Sat Jul 11 2026
**Tech Stack:** Next.js 16.2.6 · Supabase Auth · Prisma ORM · Tailwind CSS v4 · TypeScript 5.4

---

## 1. Route Inventory — `src/app/`

### Route Groups

#### `(auth)/` — Authentication pages (light-themed, no dashboard sidebar)
| Route | File | Dynamic | Export Pattern |
|-------|------|---------|---------------|
| `/login` | `src/app/(auth)/login/page.tsx` | ○ static | `'use client'` — renders `<SignInForm />` + `<DemoLoginButton />` |
| `/signup` | `src/app/(auth)/signup/page.tsx` | ○ static | `'use client'` — renders `<SignUpForm />` |
| `/register` | `src/app/(auth)/register/page.tsx` | — | Empty directory (no page file) |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | ○ static | `'use client'` — password reset form |

#### `(dashboard)/` — Authenticated dashboard layout (dark-themed, sidebar)
| Route | File | Dynamic | Export Pattern |
|-------|------|---------|---------------|
| `/dashboard` | `src/app/(dashboard)/page.tsx` | ○ static | RSC — `redirect('/dashboard/user')` |
| `/dashboard/profile` | `src/app/(dashboard)/profile/page.tsx` | ƒ dynamic | RSC — fetches Supabase `trader_profiles`, SSR to client component |
| `/dashboard/mt-connect` | `src/app/(dashboard)/mt-connect/page.tsx` | ○ static | `'use client'` — MetaTrader connection manager |
| **Layout** | `src/app/(dashboard)/layout.tsx` | ƒ dynamic | RSC — `createClient()` → `supabase.auth.getUser()` auth guard |

#### `(public)/` — Public marketing pages
| Route | File | Dynamic | Export Pattern |
|-------|------|---------|---------------|
| `/dashboard-preview` | `src/app/(public)/dashboard-preview/page.tsx` | ○ static | RSC — marketing preview sections |
| **Layout** | `src/app/(public)/layout.tsx` | ○ static | Adds `<Footer />` |

### Top-Level Pages

| Route | File | Dynamic | Export Pattern |
|-------|------|---------|---------------|
| `/` | `src/app/page.tsx` | ○ static | RSC — landing page with 11 marketing sections |
| `/analysis` | `src/app/analysis/page.tsx` | ○ static | RSC — AI trade analysis |
| `/intelligence` | `src/app/intelligence/page.tsx` | ○ static | RSC — intelligence dashboard |
| `/platform` | `src/app/platform/page.tsx` | ○ static | RSC — platform overview |
| `/pricing` | `src/app/pricing/page.tsx` | ○ static | RSC — pricing page |
| `/faq` | `src/app/faq/page.tsx` | ○ static | RSC — FAQ page |
| `/forbidden` | `src/app/forbidden/page.tsx` | ○ static | RSC — 403 forbidden page |
| `/risk-guardian` | `src/app/risk-guardian/page.tsx` | ○ static | RSC — risk guardian main page |
| `/journal` | `src/app/journal/page.tsx` | ○ static | RSC — trade journal |
| `/update-password` | `src/app/update-password/page.tsx` | ○ static | `'use client'` — Supabase password update |
| `/education` | `src/app/education/page.tsx` | ○ static | RSC — education hub page |
| `/strategy-lab` | `src/app/strategy-lab/page.tsx` | ○ static | RSC — strategy lab page |
| `/demo` | `src/app/demo/page.tsx` | ○ static | `'use client'` — interactive demo with tabbed panels |

### Dynamic Routes

| Route | File | Dynamic | Export Pattern |
|-------|------|---------|---------------|
| `/verify/[token]` | `src/app/verify/[token]/page.tsx` | ƒ dynamic | RSC — email verification handler |
| `/courses/[id]/lessons/[lessonId]` | `src/app/courses/[id]/lessons/[lessonId]/page.tsx` | ƒ dynamic | RSC — lesson player |
| `/education/[pathId]` | `src/app/education/[pathId]/page.tsx` | ƒ dynamic | RSC — education path detail |
| `/education/[pathId]/courses/[courseId]` | `src/app/education/[pathId]/courses/[courseId]/page.tsx` | ƒ dynamic | RSC — course detail |
| `/education/quiz/[quizId]` | `src/app/education/quiz/[quizId]/page.tsx` | ƒ dynamic | RSC — quiz player |
| `/education/certificates` | `src/app/education/certificates/page.tsx` | ○ static | RSC — certificates listing |
| `/strategy-lab/builder` | `src/app/strategy-lab/builder/page.tsx` | ○ static | RSC — strategy builder |
| `/strategy-lab/builder/[strategyId]` | `src/app/strategy-lab/builder/[strategyId]/page.tsx` | ƒ dynamic | RSC — edit strategy |
| `/strategy-lab/simulate/[strategyId]` | `src/app/strategy-lab/simulate/[strategyId]/page.tsx` | ƒ dynamic | RSC — strategy simulation |
| `/journal/entry` | `src/app/journal/entry/page.tsx` | ○ static | RSC — new journal entry |
| `/journal/import` | `src/app/journal/import/page.tsx` | ○ static | RSC — CSV import |
| `/legal/terms` | `src/app/legal/terms/page.tsx` | ○ static | RSC — terms of service |
| `/legal/privacy` | `src/app/legal/privacy/page.tsx` | ○ static | RSC — privacy policy |
| `/legal/disclaimer` | `src/app/legal/disclaimer/page.tsx` | ○ static | RSC — legal disclaimer |

### Admin Routes (`/admin/*`)

| Route | File | Export Pattern |
|-------|------|---------------|
| `/admin` | `src/app/admin/page.tsx` | RSC — stat cards + recent signups + quick links |
| `/admin/ai-engine` | `src/app/admin/ai-engine/page.tsx` | RSC + client component |
| `/admin/billing` | `src/app/admin/billing/page.tsx` | RSC + client component |
| `/admin/branding` | `src/app/admin/branding/page.tsx` | RSC |
| `/admin/education` | `src/app/admin/education/page.tsx` | RSC + client component |
| `/admin/enterprise` | `src/app/admin/enterprise/page.tsx` | RSC |
| `/admin/forbidden` | `src/app/admin/forbidden/page.tsx` | RSC — 403 page |
| `/admin/market-intel` | `src/app/admin/market-intel/page.tsx` | RSC |
| `/admin/monitoring` | `src/app/admin/monitoring/page.tsx` | RSC |
| `/admin/notifications` | `src/app/admin/notifications/page.tsx` | RSC |
| `/admin/payments` | `src/app/admin/payments/page.tsx` | RSC |
| `/admin/risk-guardian` | `src/app/admin/risk-guardian/page.tsx` | RSC |
| `/admin/seo` | `src/app/admin/seo/page.tsx` | RSC |
| `/admin/strategy-lab` | `src/app/admin/strategy-lab/page.tsx` | RSC |
| `/admin/trader-dna` | `src/app/admin/trader-dna/page.tsx` | RSC |
| `/admin/users` | `src/app/admin/users/page.tsx` | RSC + client component |
| **Layout** | `src/app/admin/layout.tsx` | RSC — admin auth guard via `getAdminUser()` |

### Dashboard Sub-Routes (`/dashboard/*`)

| Route | File | Export Pattern |
|-------|------|---------------|
| `/dashboard/user` | `src/app/dashboard/user/page.tsx` | RSC — fetches data, renders `<UserDashboardClient />` |
| `/dashboard/analytics` | `src/app/dashboard/analytics/page.tsx` | RSC |
| `/dashboard/connections` | `src/app/dashboard/connections/page.tsx` | RSC |
| `/dashboard/education-progress` | `src/app/dashboard/education-progress/page.tsx` | RSC |
| `/dashboard/risk-guardian` | `src/app/dashboard/risk-guardian/page.tsx` | RSC |
| `/dashboard/trader-dna` | `src/app/dashboard/trader-dna/page.tsx` | RSC |
| `/dashboard/team` | `src/app/dashboard/team/page.tsx` | RSC |
| `/dashboard/admin-dash` | `src/app/dashboard/admin-dash/page.tsx` | RSC |
| **Layout** | `src/app/dashboard/layout.tsx` | RSC — dual auth (demo cookie or Supabase session) |

### Demo Dashboard Routes (`/demo/dashboard/*`)

| Route | File | Export Pattern |
|-------|------|---------------|
| `/demo/dashboard` | `src/app/demo/(dashboard)/dashboard/page.tsx` | RSC — redirect to `/demo/dashboard/user` |
| `/demo/dashboard/user` | `src/app/demo/(dashboard)/dashboard/user/page.tsx` | RSC |
| `/demo/dashboard/analytics` | `src/app/demo/(dashboard)/dashboard/analytics/page.tsx` | RSC |
| `/demo/dashboard/trader-dna` | `src/app/demo/(dashboard)/dashboard/trader-dna/page.tsx` | RSC |
| `/demo/dashboard/risk-guardian` | `src/app/demo/(dashboard)/dashboard/risk-guardian/page.tsx` | RSC |
| `/demo/dashboard/education-progress` | `src/app/demo/(dashboard)/dashboard/education-progress/page.tsx` | RSC |
| `/demo/dashboard/team` | `src/app/demo/(dashboard)/dashboard/team/page.tsx` | RSC |
| `/demo/dashboard/connections` | `src/app/demo/(dashboard)/dashboard/connections/page.tsx` | RSC |
| `/demo/dashboard/admin-dash` | `src/app/demo/(dashboard)/dashboard/admin-dash/page.tsx` | RSC |
| **Layout** | `src/app/demo/(dashboard)/layout.tsx` | RSC — wraps in `<DashboardLayoutClient>` with hardcoded demo email |

### Legal Routes (`/legal/*`)

| Route | File |
|-------|------|
| `/legal/terms` | `src/app/legal/terms/page.tsx` |
| `/legal/privacy` | `src/app/legal/privacy/page.tsx` |
| `/legal/disclaimer` | `src/app/legal/disclaimer/page.tsx` |
| **Layout** | `src/app/legal/layout.tsx` |

### Special Routes
| Route | File | Purpose |
|-------|------|---------|
| `/app/verify` | `src/app/app/verify/` | App-based email verification |
| `/verify/[token]` | `src/app/verify/[token]/page.tsx` | Email OTP verification handler |

---

## 2. Component Tree — `src/components/`

### Client vs Server Component Pattern

- **Server Components (RSC):** Default export — no `'use client'` directive. Used for static content, data fetching for SEO.
- **Client Components:** Start with `'use client'` directive. Used for interactivity (forms, state, event handlers).
- **All UI primitives** (`button.tsx`, `card.tsx`, `input.tsx`, etc.) are **server-compatible** (no `'use client'` — they only render props).
- **All dashboard/complex components** are **client components** (use `'use client'`).

### Directory Breakdown

#### `ui/` — Primitives (all server-compatible)
| Component | Status | Purpose |
|-----------|--------|---------|
| `button.tsx` | Server | 16 variants (`primary`, `trading-up`, `danger`, etc.), 4 sizes. Binance Yellow design |
| `card.tsx` | Server | `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardContent>` — compact layout primitives |
| `input.tsx` | Server | `<Input>` + `<Label>` — controlled via props |
| `badge.tsx` | Server | Status badges |
| `progress.tsx` | Server | Progress bars |
| `tabs.tsx` | Server | Tab primitives |
| `skeleton.tsx` | Server | Loading skeletons |
| `alert.tsx` | Server | Alert display |
| `Sidebar.tsx` | Server | Static sidebar shell |

#### `landing/` — Marketing site sections (all server-compatible)
| Component | File | Purpose |
|-----------|------|---------|
| `HeroSection` | `src/components/landing/HeroSection.tsx` | Hero with CTAs |
| `ProblemSection` | `src/components/landing/ProblemSection.tsx` | Problem statement |
| `SolutionSection` | `src/components/landing/SolutionSection.tsx` | Solution pitch |
| `FeaturesGrid` | `src/components/landing/FeaturesGrid.tsx` | Feature grid |
| `DashboardPreview` | `src/components/landing/DashboardPreview.tsx` | Dashboard screenshot |
| `TraderDNASection` | `src/components/landing/TraderDNASection.tsx` | Trader DNA pitch |
| `AIRiskGuardianSection` | `src/components/landing/AIRiskGuardianSection.tsx` | Risk Guardian pitch |
| `HowItWorks` | `src/components/landing/HowItWorks.tsx` | Steps/how-to |
| `Testimonials` | `src/components/landing/Testimonials.tsx` | Testimonials carousel |
| `PricingTeaser` | `src/components/landing/PricingTeaser.tsx` | Pricing callout |
| `FooterCTA` | `src/components/landing/FooterCTA.tsx` | Bottom CTA |
| `Footer` | `src/components/landing/Footer.tsx` | Site footer |
| `Navbar` | `src/components/landing/Navbar.tsx` | Marketing navbar |
| `index.ts` | Barrel — re-exports all landing components | |

#### `auth/` — Auth forms (all client components)
| Component | File | Purpose |
|-----------|------|---------|
| `sign-in-form.tsx` | `src/components/auth/sign-in-form.tsx` | Email/password sign-in via Supabase |
| `sign-up-form.tsx` | `src/components/auth/sign-up-form.tsx` | Registration form |
| `DemoLoginButton.tsx` | `src/components/auth/DemoLoginButton.tsx` | "Launch Demo Account" button → redirects to `/demo/dashboard/user` |
| `profile-form.tsx` | `src/components/auth/profile-form.tsx` | Profile edit form |

#### `dashboard/` — Dashboard widgets (all client components)
Major components (33 total):
- **`DashboardLayoutClient.tsx`** — Layout wrapper with sidebar + header + mobile gesture support
- **`DashboardSidebar.tsx`** — Navigation sidebar with demo/real nav items, sign-out via Supabase
- **`DashboardHeader.tsx`** — Top bar with breadcrumb + user menu
- **`DashboardCard.tsx`** — Card layout primitives (`DashboardCard`, `DashboardCardHeader`, `DashboardCardTitle`, `DashboardCardBody`)
- **`StatCard.tsx`** — Metric display card
- **`EdgeScoreCard.tsx`** / `edge-score-card.tsx` — Edge score display (duplicate files)
- **`ScoreBreakdown.tsx`** — Radar/bar score breakdown
- **`ScoreSparkline.tsx`** — Sparkline chart
- **`Charts.tsx`** — Recharts chart wrappers
- **`InsightsPanel.tsx`** — AI insights feed
- **`AIAertsWidget.tsx`** — AI alerts widget
- **`TradeStatsWidget.tsx`** — Trade statistics
- **`OpenTradesWidget.tsx`** — Live open positions
- **`WatchlistWidget.tsx`** — Watchlist
- **`QuickActions.tsx`** — Quick action buttons
- **`RankBadge.tsx`** — Rank badge display
- **`StatusBadge.tsx`** — Status badge
- **`SectionHeader.tsx`** — Section header
- **`SessionHeatmap.tsx`** — Session heatmap
- **`DateRangeFilter.tsx`** — Date range picker
- **`OnboardingBanner.tsx`** / `OnboardingTour.tsx` — Onboarding UI
- **`PauseOverlay.tsx`** — Risk Guardian pause overlay
- **`LearningProgressWidget.tsx`** — Education progress
- **`CertificatesWidget.tsx`** — Certificate display
- **`EmptyState.tsx`** — Empty state placeholder
- **`Personalized-layout.tsx`** — Personalized dashboard layout
- **`DashboardGrid.tsx`** — Grid layout
- **`DashboardContent.tsx`** — Content wrapper
- **`DashboardTips.tsx`** — Tips display
- **`header.tsx`** / `sidebar.tsx` — Legacy header/sidebar (duplicates)

#### `mt/` — MetaTrader components (all client components)
| Component | File |
|-----------|------|
| `MTConnectForm.tsx` | Connection form (platform, server, account, password) |
| `MTConnectionStatus.tsx` | Connection status badge |
| `MTAccountStats.tsx` | Account statistics (balance, equity, margin) |
| `MTLiveTrades.tsx` | Live open positions table |
| `MTAnalyticsDashboard.tsx` | Full analytics dashboard |
| `MTEquityCurve.tsx` | Equity curve chart |
| `MTPerformanceMetrics.tsx` | Performance metrics |
| `MTMistakesPanel.tsx` | Common mistakes panel |
| `MTSessionHeatmap.tsx` | Session heatmap chart |
| `MTSymbolBreakdown.tsx` | Per-symbol performance |
| `MTTraderDNAPanel.tsx` | Trader DNA panel for MT data |

#### `strategy-lab/` — Strategy Lab components (all client components)
| Component | File |
|-----------|------|
| `StrategyBuilder.tsx` | Strategy builder UI |
| `EntryRuleForm.tsx` | Entry rules form |
| `ExitRuleForm.tsx` | Exit rules form |
| `RiskRuleForm.tsx` | Risk rules form |
| `SimulationControls.tsx` | Monte Carlo simulation controls |
| `SimulationResults.tsx` | Simulation results display |
| `EquityCurveChart.tsx` | Equity curve visualization |
| `DrawdownChart.tsx` | Drawdown chart |
| `MetricsSummary.tsx` | Strategy metrics summary |
| `TradeList.tsx` | Backtested trade list |
| `strategy-types.ts` | Strategy type definitions |

#### `journal/` — Trade Journal components (all client components)
| Component | File |
|-----------|------|
| `TradeForm.tsx` | Manual trade entry form |
| `TradeCard.tsx` | Trade display card |
| `Timeline.tsx` | Trade timeline |
| `CsvImporter.tsx` | CSV trade import |
| `ScreenshotUpload.tsx` | Screenshot upload via Supabase Storage |

#### `education/` — Education components
| Component | File | Status |
|-----------|------|--------|
| `CourseCard.tsx` | `src/components/education/CourseCard.tsx` | Server |
| `LearningPathCard.tsx` | `src/components/education/LearningPathCard.tsx` | Server |
| `LessonPlayer.tsx` | `src/components/education/LessonPlayer.tsx` | Client |
| `VideoPlayer.tsx` | `src/components/education/VideoPlayer.tsx` | Client (Mux) |
| `MarkdownContent.tsx` | `src/components/education/MarkdownContent.tsx` | Server |
| `QuizPlayer.tsx` | `src/components/education/QuizPlayer.tsx` | Client |
| `QuizResults.tsx` | `src/components/education/QuizResults.tsx` | Client |
| `ProgressBar.tsx` | `src/components/education/ProgressBar.tsx` | Server |
| `CertificateCard.tsx` | `src/components/education/CertificateCard.tsx` | Server |
| `CertificatePreview.tsx` | `src/components/education/CertificatePreview.tsx` | Server |

#### `trader-dna/` — Trader DNA assessment
| Component | File | Status |
|-----------|------|--------|
| `assessment-wizard.tsx` | `src/components/trader-dna/assessment-wizard.tsx` | Client |
| `question-card.tsx` | `src/components/trader-dna/question-card.tsx` | Client |
| `profile-summary.tsx` | `src/components/trader-dna/profile-summary.tsx` | Server |
| `profile-badge.tsx` | `src/components/trader-dna/profile-badge.tsx` | Server |
| `learning-path-display.tsx` | `src/components/trader-dna/learning-path-display.tsx` | Server |
| `progress-bar.tsx` | `src/components/trader-dna/progress-bar.tsx` | Server |
| **question-types/** | | |
| `multiple-choice.tsx` | | Client |
| `rating-scale.tsx` | | Client |
| `frequency-scale.tsx` | | Client |
| `scenario-selection.tsx` | | Client |

#### `risk-guardian/`
| Component | File | Status |
|-----------|------|--------|
| `BehavioralFlagsCard.tsx` | `src/components/risk-guardian/BehavioralFlagsCard.tsx` | Client |

#### `admin/` — Admin components
| Component | File | Status |
|-----------|------|--------|
| `AdminLayoutClient.tsx` | `src/components/admin/AdminLayoutClient.tsx` | Client |
| `AdminSidebar.tsx` | `src/components/admin/AdminSidebar.tsx` | Client |
| `UserManagement.tsx` | `src/components/admin/UserManagement.tsx` | Client |
| `UserList.tsx` | `src/components/admin/UserList.tsx` | Client |
| `UserDetailDrawer.tsx` | `src/components/admin/UserDetailDrawer.tsx` | Client |
| `CreateUserForm.tsx` | `src/components/admin/CreateUserForm.tsx` | Client |

#### `alerts/` — Alert components (all client)
| Component | File |
|-----------|------|
| `AlertBadge.tsx` | Alert badge indicator |
| `AlertBanner.tsx` | Alert banner |
| `AlertHistory.tsx` | Alert history log |
| `AlertToaster.tsx` | Toast-style alerts |

#### `analysis/` — Analysis components (all client)
| Component | File |
|-----------|------|
| `BehavioralPatterns.tsx` | Behavioral pattern display |
| `TradeQualityCard.tsx` | Trade quality score |
| `RiskMetricsCard.tsx` | Risk metrics display |

#### Other components
| Component | File | Status | Purpose |
|-----------|------|--------|---------|
| `ConditionalNavbar.tsx` | `src/components/ConditionalNavbar.tsx` | Client | Shows marketing navbar only on non-dashboard routes |
| `ThemeSwitcher.tsx` | `src/components/ThemeSwitcher.tsx` | Client | Dark/light mode toggle |

---

## 3. API Route Inventory — `src/app/api/`

### Auth API
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/auth/callback` | GET | Supabase OTP verification callback | `src/app/api/auth/callback/route.ts` |
| `/api/auth/register` | POST | Create Supabase user + Prisma user + Organization | `src/app/api/auth/register/route.ts` |

### Demo API
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/demo/login` | POST | Auto-create and sign in demo user | `src/app/api/demo/login/route.ts` |
| `/api/demo/start` | ? | Start demo session | `src/app/api/demo/start/route.ts` |
| `/api/demo/confirm` | ? | Confirm demo data seeded | `src/app/api/demo/confirm/route.ts` |

### MetaTrader API (`/api/mt/*`)
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/mt/connect` | POST | Provision MetaApi terminal + create connection row | `src/app/api/mt/connect/route.ts` |
| `/api/mt/disconnect` | POST | Disconnect MT account | `src/app/api/mt/disconnect/route.ts` |
| `/api/mt/sync` | POST | Full MT sync (account info → positions → history) | `src/app/api/mt/sync/route.ts` |
| `/api/mt/status` | GET | Connection status check | `src/app/api/mt/status/route.ts` |
| `/api/mt/trades` | GET | Fetch synced trades | `src/app/api/mt/trades/route.ts` |
| `/api/mt/account-stats` | GET | Account statistics | `src/app/api/mt/account-stats/route.ts` |
| `/api/mt/analytics` | GET | MT analytics dashboard data | `src/app/api/mt/analytics/route.ts` |
| `/api/mt/build-trader-dna` | POST | Build trader DNA from MT data | `src/app/api/mt/build-trader-dna/route.ts` |
| `/api/mt/fxblue` | GET | FX Blue stats integration | `src/app/api/mt/fxblue/route.ts` |

### AI API
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/ai` | GET | Fetch user's AI learning path | `src/app/api/ai/route.ts` |
| `/api/ai` | POST | Generate/refresh AI learning path via GPT-4o | `src/app/api/ai/route.ts` |
| `/api/ai/analyze` | POST | AI trade analysis | `src/app/api/ai/analyze/route.ts` |

### Scores & Analytics
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/scores` | GET | Edge score data | `src/app/api/scores/route.ts` |
| `/api/scores/history` | GET | Edge score history (30/90 days) | `src/app/api/scores/history/route.ts` |
| `/api/analytics` | GET | Analytics data | `src/app/api/analytics/route.ts` |
| `/api/analytics/dashboard` | GET | Dashboard analytics snapshot | `src/app/api/analytics/dashboard/route.ts` |
| `/api/leaderboard` | GET | Leaderboard data | `src/app/api/leaderboard/route.ts` |

### Guardian (Risk)
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/guardian/settings` | GET | Risk Guardian settings | `src/app/api/guardian/settings/route.ts` |
| `/api/guardian/flags` | GET | Behavioral flags | `src/app/api/guardian/flags/route.ts` |
| `/api/guardian/pause` | POST | Pause Risk Guardian | `src/app/api/guardian/pause/route.ts` |
| `/api/guardian/pause/status` | GET | Pause status | `src/app/api/guardian/pause/status/route.ts` |
| `/api/guardian/resume` | POST | Resume Risk Guardian | `src/app/api/guardian/resume/route.ts` |

### Alerts
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/alerts` | GET | List alerts | `src/app/api/alerts/route.ts` |
| `/api/alerts/check` | GET | Check for new alerts | `src/app/api/alerts/check/route.ts` |
| `/api/alerts/[id]/acknowledge` | PATCH | Acknowledge an alert | `src/app/api/alerts/[id]/acknowledge/route.ts` |

### Courses & Education
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/courses` | GET | List courses | `src/app/api/courses/route.ts` |
| `/api/courses/[id]` | GET | Course detail | `src/app/api/courses/[id]/route.ts` |
| `/api/enrollments` | GET/POST | Enrollment management | `src/app/api/enrollments/route.ts` |
| `/api/lessons/[id]/progress` | PATCH | Update lesson progress | `src/app/api/lessons/[id]/progress/route.ts` |
| `/api/progress/mark-lesson` | POST | Mark lesson complete | `src/app/api/progress/mark-lesson/route.ts` |
| `/api/quiz` | GET/POST | Quiz data | `src/app/api/quiz/route.ts` |
| `/api/quiz/submit` | POST | Submit quiz attempt | `src/app/api/quiz/submit/route.ts` |
| `/api/quizzes/[id]` | GET | Quiz detail | `src/app/api/quizzes/[id]/route.ts` |
| `/api/quizzes/[id]/attempt` | POST | Start quiz attempt | `src/app/api/quizzes/[id]/attempt/route.ts` |
| `/api/certificates` | GET | List user certificates | `src/app/api/certificates/route.ts` |
| `/api/certificates/[id]` | GET | Certificate detail | `src/app/api/certificates/[id]/route.ts` |
| `/api/certificates/[id]/pdf` | GET | Generate certificate PDF | `src/app/api/certificates/[id]/pdf/route.ts` |

### Profile
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/profile` | GET/PATCH | User profile | `src/app/api/profile/route.ts` |

### Trades
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/trades` | GET/POST | List/create trades | `src/app/api/trades/route.ts` |
| `/api/trades/[id]` | GET/PATCH/DELETE | Single trade CRUD | `src/app/api/trades/[id]/route.ts` |
| `/api/trades/batch` | POST | Batch import trades (CSV) | `src/app/api/trades/batch/route.ts` |

### Strategies & Simulation
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/strategies` | GET/POST | List/create strategies | `src/app/api/strategies/route.ts` |
| `/api/simulation/run` | POST | Run Monte Carlo simulation | `src/app/api/simulation/run/route.ts` |
| `/api/reports/generate` | POST | Generate PDF report | `src/app/api/reports/generate/route.ts` |

### Admin API (`/api/admin/*`)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/users` | GET | List all users |
| `/api/admin/users/[id]` | GET/PATCH | User detail/update |
| `/api/admin/users/[id]/role` | PATCH | Update user role |
| `/api/admin/users/[id]/profile` | PATCH | Update profile |
| `/api/admin/users/[id]/password` | POST | Reset password |
| `/api/admin/users/[id]/email` | PATCH | Update email |
| `/api/admin/users/[id]/full` | GET | Full user data |
| `/api/admin/billing` | GET | Billing overview |
| `/api/admin/billing/[subId]` | GET/PATCH | Subscription detail |
| `/api/admin/branding` | GET/PATCH | Branding settings |
| `/api/admin/branding/tenants` | GET/POST | Tenant list/create |
| `/api/admin/branding/tenants/[id]` | GET/PATCH/DELETE | Tenant detail |
| `/api/admin/education` | GET/POST | Education paths CRUD |
| `/api/admin/education/[id]` | GET/PATCH/DELETE | Education path detail |
| `/api/admin/education/lessons` | GET/POST | Lessons CRUD |
| `/api/admin/education/lessons/[id]` | GET/PATCH/DELETE | Lesson detail |
| `/api/admin/market-intel` | GET/POST | Market intel CRUD |
| `/api/admin/market-intel/[id]` | GET/PATCH/DELETE | Market intel detail |
| `/api/admin/market-intel/config` | GET/PATCH | Market intel config |
| `/api/admin/notifications` | GET | List notifications |
| `/api/admin/notifications/[id]` | GET/PATCH | Notification detail |
| `/api/admin/notifications/send` | POST | Send notification |
| `/api/admin/notifications/logs` | GET | Notification logs |
| `/api/admin/abuse-flags` | GET | List abuse flags |
| `/api/admin/abuse-flags/[id]` | PATCH | Update abuse flag |
| `/api/admin/risk-rules` | GET/POST | Risk rules CRUD |
| `/api/admin/seo` | GET/POST | SEO entries |
| `/api/admin/seo/[pageId]` | GET/PATCH | SEO entry detail |
| `/api/admin/settings` | GET/PATCH | Admin settings |
| `/api/admin/trader-dna` | GET | All trader DNA profiles |
| `/api/admin/trader-dna/[userId]` | GET | Single DNA profile |
| `/api/admin/strategy-lab` | GET/POST | Strategy templates |
| `/api/admin/strategy-lab/[id]` | GET/PATCH | Strategy template detail |
| `/api/admin/payments` | GET | Payment overview |
| `/api/admin/enterprise` | GET/POST | Enterprise clients |
| `/api/admin/enterprise/[id]` | GET/PATCH | Enterprise client detail |
| `/api/admin/ai-engine` | ? | AI engine config |

### Debug/Root Routes
| Route | Method | Purpose | File |
|-------|--------|---------|------|
| `/api/setup/database` | POST | Database setup helper | `src/app/api/setup/database/route.ts` |
| `/api/debug-demo` | GET | Debug demo state | `src/app/api/debug-demo/route.ts` |
| `/api/debug-cookie` | GET | Debug cookie state | `src/app/api/debug-cookie/route.ts` |
| `/api/debug-layout` | GET | Debug layout state | `src/app/api/debug-layout/route.ts` |

**Total API routes: 89 route handlers across 26 route directories**

---

## 4. Data Layer

### Prisma Schema (`prisma/schema.prisma`)

**Database:** PostgreSQL (via Supabase or direct connection)
**ORM:** Prisma 5.14

**Models (20 total):**

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `Organization` | Tenant/company | `id`, `name`, `slug`, `plan` (STARTER/GROWTH/ENTERPRISE), `seatLimit` |
| `User` | Platform user (id = Supabase Auth UUID) | `id`, `email`, `name`, `role`, `organizationId`, `skillLevel`, `onboarded` |
| `Team` | Organizational teams | `name`, `organizationId` |
| `TeamMember` | User-team membership | `userId`, `teamId` (unique pair) |
| `Invitation` | Org invitation | `email`, `role`, `token`, `expiresAt`, `organizationId` |
| `Course` | Course catalog | `title`, `level`, `category`, `tags`, `published`, `featured`, `price` |
| `CoursePrerequisite` | Course prerequisite graph | `courseId`, `prerequisiteId` |
| `Module` | Course modules | `title`, `order`, `courseId` |
| `Lesson` | Module lessons | `title`, `type` (VIDEO/TEXT/INTERACTIVE), `videoUrl` (Mux), `isFree`, `durationSec` |
| `Quiz` | Lesson quizzes | `title`, `passMark`, `maxAttempts`, `lessonId` |
| `Question` | Quiz questions | `text`, `type` (SINGLE/MULTIPLE/TRUE_FALSE), `order`, `quizId` |
| `Option` | Question answer options | `text`, `isCorrect`, `order`, `questionId` |
| `QuizAttempt` | User quiz attempts | `score`, `passed`, `answers` (JSON), `userId`, `quizId` |
| `SkillAssessment` | Skill self-assessment | `skill`, `score`, `level`, `userId` |
| `Enrollment` | Course enrollment | `status` (ACTIVE/COMPLETED/DROPPED/OVERDUE), `progress`, `userId`, `courseId` |
| `LessonProgress` | Per-lesson progress | `completed`, `watchedSec`, `enrollmentId`, `lessonId` |
| `LearningPath` | AI-generated learning path | `title`, `goal`, `aiGenerated`, `userId` (unique) |
| `LearningPathCourse` | Path-course junction | `order`, `reason`, `learningPathId`, `courseId` |
| `Certificate` | Course completion certificate | `title`, `verifyToken`, `blockchainTx`, `userId`, `courseId` |
| `Subscription` | Stripe subscription | `stripeSubId`, `stripePriceId`, `status`, `organizationId` |

**Enums:** `Role`, `Plan`, `SkillLevel`, `LessonType`, `QuestionType`, `EnrollmentStatus`

### Supabase Schema (migrations in `supabase/migrations/`)

Supabase tables (used alongside Prisma, primarily for trading/analytics data):

| Table | Migration | Purpose |
|-------|-----------|---------|
| `trader_profiles` | `001_create_trader_profiles.sql` | Trader DNA profiles |
| `alerts` | `005_add_alerts.sql` | Risk Guardian alerts |
| `edge_scores` | `006_add_edge_scores.sql` | Daily edge scores |
| Courses/Education tables | `007_add_education.sql` | Education system (Supabase native) |
| `strategies` | `008_add_strategies.sql` | Strategy definitions |
| `simulations` | `009_add_simulations.sql` | Simulation results |
| `admin_settings` | `010_admin_system.sql` | Admin settings (JSONB) |
| `trade_analyses` | `04_add_analyses_tables.sql` | AI trade analysis results |
| `daily_analytics` | `04_add_analyses_tables.sql` | Daily analytics rollup |
| `trades` | `20260508_create_trades.sql` | Trade journal entries |
| `abuse_flags` | `20260525_add_abuse_detection.sql` | Abuse detection flags |
| `mt_connections` | `20260526_add_mt_connections.sql` | MetaTrader connections |
| `mt_account_stats` | — | Account balance/equity snapshots |
| `mt_open_positions` | — | Current open positions |
| `mt_closed_trades` | — | Closed trades from MT |
| `leaderboard_settings` | — | Leaderboard visibility |

### Supabase Client Files (`src/lib/supabase/`)

| File | Purpose |
|------|---------|
| `client.ts` | `createClient()` — browser Supabase client (`createBrowserClient`) |
| `server.ts` | `createClient()` — server Supabase client (`createServerClient` with cookie handling) |
| `admin.ts` | `createAdminClient()` — service-role client (`createClient` with `SUPABASE_SERVICE_ROLE_KEY`) |
| `storage.ts` | Screenshot upload/download/delete to `trade-screenshots` bucket |
| `analytics.ts` | Analytics CRUD helpers for `trade_analyses` and `daily_analytics` tables |

### Data Fetching Patterns

**Server Components (RSC):**
1. `import { createClient } from '@/lib/supabase/server'` → `await supabase.auth.getUser()`
2. Direct Supabase queries (`.from('tablename').select(...)`)
3. Or Prisma queries via `import { prisma } from '@/lib/prisma'`
4. Pass data as props to client components

**API Routes:**
1. `import { requireAuth } from '@/lib/api'` — verifies Supabase JWT, fetches Prisma role
2. Or `import { createClient } from '@/lib/supabase/server'` for manual auth
3. Respond with `apiSuccess(data)` / `apiError(msg, status)` helpers from `src/lib/api.ts`

**Client Components (React Query):**
1. Custom hooks like `useDashboardData()`, `useAlerts()`, `useCertificates()` from `src/hooks/`
2. All use `@tanstack/react-query` with `useQuery`/`useMutation`
3. Queries to `/api/*` endpoints
4. Stale times: 30s (alerts), 5min (scores), 10min (leaderboard)

**Demo Mode (no DB):**
1. `demoOrFetch(userId, resource, fetcher)` — if `userId === DEMO_USER_ID`, return in-memory data from `src/lib/demo/demo-data.ts`
2. `src/app/dashboard/user/page.tsx` checks `p2m_demo_session` cookie before hitting Supabase
3. Demo data includes: 15 trades, 7 edge scores, 5 alerts, 2 MT connections, 2 educational paths

---

## 5. Auth System — End-to-End Flow

### Architecture: Supabase Auth + Prisma Role Lookup

```
Browser Cookie (JWT) 
       ↓
Supabase Auth Server → verify JWT → user UUID
       ↓
Prisma User (keyed by same UUID) → role + organizationId
       ↓
Merged AuthSession { id, email, name, role, organizationId }
```

### Flow Details

**Registration (`POST /api/auth/register`):**
1. Validate with Zod (`name`, `email`, `password`, optional `organizationName`/`inviteToken`)
2. If invite flow: validate `Invitation` record → create Supabase user via Service Role API (`auth.admin.createUser`) → create Prisma User with `id = Supabase UUID`
3. If self-signup: Prisma transaction → create `Organization` → create Supabase user → create Prisma User (`role: ADMIN`) → link to org
4. Supabase manages passwords (bcrypt). Prisma never stores hashed passwords.

**Sign-in (`SignInForm`):**
1. `supabase.auth.signInWithPassword({ email, password })`
2. On success, `window.location.replace('/dashboard')`

**Session Verification (Server Components):**
- `src/lib/auth.ts` → `getPageSession()`:
  1. `createClient()` (server) → `supabase.auth.getUser()`
  2. `prisma.user.findUnique({ id: user.id })` → get role + organizationId
  3. Returns `PageSession` or null (=> redirect to /login)

**Session Verification (API Routes):**
- `src/lib/api.ts` → `requireAuth()` / `requireRole(roles)`:
  1. Same chain: Supabase JWT → Prisma role lookup
  2. Returns `AuthSession` or 401/403 `NextResponse`

**Protected Routes (Middleware):**
- `src/proxy.ts` (middleware):
  1. Creates Supabase server client from request cookies
  2. Checks `supabase.auth.getUser()`
  3. Protected prefixes: `/dashboard`, `/journal`, `/analysis`, `/strategy-lab`, `/education`, `/profile`, `/trader-dna`, `/admin`
  4. Auth routes: `/login`, `/signup`, `/reset-password` → redirect to /dashboard if already logged in

**Admin Auth:**
- `src/lib/admin/auth.ts` → `getAdminUser()` / `getAdminContext()`:
  1. Two-tier check: DB `trader_profiles.admin_role = 'super_admin'` OR email whitelist (`ADMIN_EMAILS` env var)
  2. Admin layout (`src/app/admin/layout.tsx`) calls `getAdminUser()` → redirect to /dashboard if not admin

**Password Management:**
- `/update-password` page: `supabase.auth.updateUser({ password })` for password reset flow
- `/api/auth/callback`: Handles `recovery` type OTP → redirect to `/update-password`
- `/api/auth/register` route handles the initial password (only via Supabase)

**Role Model:**
- Prisma `Role` enum: `SUPER_ADMIN | ADMIN | MANAGER | LEARNER`
- `requireRole(['ADMIN', 'SUPER_ADMIN'])` enforces role-based access in API routes
- Organizations have `plan` field (STARTER/GROWTH/ENTERPRISE) and `seatLimit`

---

## 6. Demo System

### Architecture

The demo system provides full functionality without a database. Users click "Launch Demo Account" and are taken to pre-populated dashboards.

### Files

| File | Purpose |
|------|---------|
| `src/lib/demo/demo-data.ts` | All demo data in-memory (trader profile, 15 trades, 7 edge scores, 5 alerts, 2 MT connections, education paths, notifications, leaderboard). Exports `DEMO_USER_ID`, `DEMO_EMAIL`, `DEMO_PASSWORD`, `getDemoData(resource)` |
| `src/lib/demo/demo-session.ts` | `getDemoSession()` — checks for `p2m_demo_session` cookie in both `headers()` and `cookies()` |
| `src/lib/demo/demo-utils.ts` | `isDemoUser(userId)`, `demoFetch(resource)`, `demoOrFetch(userId, resource, fetcher)` — used by API routes to return demo data for the demo user |
| `src/app/api/demo/login/route.ts` | `POST /api/demo/login` — tries to sign in as demo@prostep2market.com, if account doesn't exist, creates it via Supabase admin API |
| `src/components/auth/DemoLoginButton.tsx` | "Launch Demo Account" button → redirects to `/demo/dashboard/user` |
| `src/app/demo/page.tsx` | Interactive demo page with tabbed panels (Dashboard, Trade Journal, Risk Guardian, Strategy Lab, Trader DNA) — all hardcoded UI |
| `src/app/demo/(dashboard)/` | Full demo dashboard layout (9 routes) with hardcoded DEMO_EMAIL |
| `scripts/demo-seed.sql` | SQL script to seed Supabase tables with demo data for the demo user |
| `scripts/setup-db.js` | Database setup script that creates Supabase tables (trader_profiles, edge_scores, trades, alerts, etc.) |

### Detection Pattern

**Server-side (RSC pages):**
```typescript
// Check p2m_demo_session cookie first
const c = await cookies()
if (c.get('p2m_demo_session')?.value) {
  // Return demo data
  return <UserDashboardClient profile={demoTraderProfile} ... />
}
// Otherwise, hit Supabase DB
const supabase = await createClient()
```

**API Routes:**
```typescript
import { isDemoUser, demoOrFetch } from '@/lib/demo/demo-utils'

// In route handler:
const userId = user.id // from requireAuth()
const data = await demoOrFetch(userId, 'trades', () => 
  supabase.from('trades').select('*').eq('user_id', userId)
)
```

---

## 7. Third-Party Integrations

### Supabase (`@supabase/supabase-js` 2.105.4, `@supabase/ssr` 0.10.3)
- **Auth provider** — single identity source for user authentication
- **Database** — PostgreSQL (used alongside Prisma for trading/analytics data)
- **Storage** — Screenshot uploads via `trade-screenshots` bucket
- **Client patterns:** Browser client, server client (cookie-based), admin client (service role key)

### MetaTrader via MetaApi (`src/lib/metaapi/`)
- **SDK:** Custom REST wrapper (no npm package — direct fetch to `agiliumtrade.agiliumtrade.ai`)
- **Provisioning:** Creates cloud MT4/MT5 terminals using investor (read-only) password
- **Sync:** Account info → open positions → closed trade history
- **Auth:** `METAAPI_TOKEN` environment variable
- **Types:** `src/types/mt-connection.ts` — full type definitions for MetaApi responses
- **Files:** `src/lib/metaapi/client.ts` (provision, positions, history), `src/lib/metaapi/sync.ts` (orchestrator)

### FX Blue (`src/lib/fxblue/`)
- **Purpose:** Supplementary historical stats for users with public FX Blue profiles
- **Integration:** REST client to `fxblue.com/users/{username}/system/stats`
- **Status:** Read-only public stats fetcher
- **File:** `src/lib/fxblue/client.ts`

### OpenAI (`openai` 6.0.0)
- **Purpose:** AI learning path generation via GPT-4o
- **Integration:** `POST /api/ai` → GPT-4o with `response_format: 'json_object'`
- **Models:** `gpt-4o` with temperature 0.3
- **Additionally:** `POST /api/ai/analyze` for trade analysis

### Stripe (via Prisma `Subscription` model)
- **Purpose:** Subscription billing management
- **Integration:** Prisma model stores `stripeSubId`, `stripePriceId`, `status`
- **Scope:** Subscription tracking only — no direct Stripe API calls in the current codebase (the Stripe SDK is not in package.json dependencies beyond what's needed)

### Mux (`@mux/mux-node` 8.3.0, `@mux/mux-player-react` 2.9.0)
- **Purpose:** Video hosting for course lessons
- **Integration:** `Lesson.videoUrl` stores Mux playback URL, `Lesson.videoId` stores Mux asset ID
- **Component:** `VideoPlayer.tsx` wraps Mux Player React component

### React Query (`@tanstack/react-query` 5.100.9)
- **Purpose:** Client-side data fetching and caching
- **Pattern:** Custom hooks in `src/hooks/` use `useQuery`/`useMutation`
- **Provider:** `src/app/providers.tsx` wraps app with `QueryClientProvider`
- **Defaults:** `staleTime: 30000`, `retry: 1`

### Recharts (`recharts` 3.0.0)
- **Purpose:** Charts and data visualization
- **Usage:** Dashboard charts (`Charts.tsx`), equity curves, heatmaps

### Additional Libraries
| Library | Purpose |
|---------|---------|
| `react-hook-form` + `@hookform/resolvers` + `zod` | Form handling + validation |
| `zustand` 5.0.13 | Lightweight state (alertStore) |
| `date-fns` 4.0.0 | Date formatting |
| `lucide-react` | Icon set |
| `sonner` / `@radix-ui/react-toast` | Toast notifications |
| `canvas-confetti` | Celebration effects |
| `papaparse` | CSV trade import |
| `pdf-lib` | Certificate PDF generation |
| `qrcode` | QR code generation |
| `react-markdown` + `remark-gfm` | Markdown rendering for lesson content |
| `clsx` + `tailwind-merge` | Class name merging (`cn()` utility) |
| `uuid` | UUID generation |

---

## 8. Lib/Utils — `src/lib/`

| File/Directory | Purpose |
|----------------|---------|
| `src/lib/prisma.ts` | PrismaClient singleton (dev: query logging, prod: errors only) |
| `src/lib/auth.ts` | `getPageSession()` — Supabase JWT → Prisma role merge for Server Components |
| `src/lib/api.ts` | `requireAuth()`, `requireRole()`, `apiSuccess()`, `apiError()` — API route auth helpers |
| `src/lib/utils.ts` | `cn()` (clsx+twMerge), `formatDuration()`, `formatProgress()`, `slugify()`, `paginate()` |
| `src/lib/validation.ts` | Zod schemas: `tradeSchema`, `csvRowSchema`, `formatValidationErrors()` |
| `src/lib/trader-profile.ts` | Server actions: `saveTraderProfile()`, `getTraderProfile()`, `getProfileWithDefaults()` — Supabase `trader_profiles` table |
| `src/lib/proxy.ts` | (alias — actually middleware at `src/proxy.ts`) |
| `src/lib/supabase/` | Supabase client factories: `client.ts`, `server.ts`, `admin.ts`, `storage.ts`, `analytics.ts` |
| `src/lib/demo/` | Demo system: `demo-data.ts` (15 trades, 7 edge scores, etc.), `demo-session.ts` (cookie check), `demo-utils.ts` (`isDemoUser`, `demoOrFetch`) |
| `src/lib/metaapi/` | MetaTrader: `client.ts` (provision/positions/history REST client), `sync.ts` (full sync orchestrator) |
| `src/lib/fxblue/` | FX Blue stats: `client.ts` (REST fetcher for public stats) |
| `src/lib/mt-analytics/` | MT analytics: `compute.ts` (performance metrics calculation) |
| `src/lib/edge-score/` | Edge Score System: `types.ts`, `index.ts`, `ranking.ts`, `tips.ts`, and 5 calculation modules under `calculations/` (discipline, risk, emotional-stability, consistency, strategy-adherence, composite) |
| `src/lib/analysis/` | Full trade analysis pipeline: `orchestrator.ts`, 5 pattern detectors (`patterns/`), metrics (`metrics/`: drawdown, risk, quality), performance (`performance/`: sessions, pairs), LLM client (`llm/`), insight generator (`insights/`), report generator (`reports/`) |
| `src/lib/risk-guardian/` | Risk Guardian engine: `detector.ts` (rule engine), `alertStore.ts` (Zustand store), `session-tracker.ts`, and 7 rule modules under `rules/` (scalping, revenge, overtrading, hedging, fatigue, exposure, emotional, arbitrage) |
| `src/lib/strategy-lab/` | Strategy Lab: `builder.ts`, `indicators.ts`, `metrics.ts`, `session-filters.ts`, `simulation.ts` |
| `src/lib/education/` | Education: `courses.ts`, `paths.ts`, `progress.ts`, `certificates.ts`, `badges.ts` |
| `src/lib/admin/` | Admin utilities: `auth.ts` (`getAdminUser()`, `getAdminContext()`, admin settings CRUD) |
| `src/lib/trader-dna/` | Trader DNA: `auto-builder.ts` (auto-build DNA profile from MT data) |

### Key Interfaces & Types (`src/types/`)

| File | Key Types |
|------|-----------|
| `index.ts` | Domain types: `Role`, `Plan`, `SkillLevel`, `UserProfile`, `CourseCard`, `EnrollmentWithCourse`, `AnalyticsSummary`, `LearningPath`, `ApiResponse<T>` |
| `analysis.ts` | `TradeQualityAnalysis`, `BehavioralPatterns`, `FullAnalysisResult` (177 lines) |
| `guardian.ts` | `AlertType` (11 types), `Severity`, `Alert`, `RiskGuardianSettings` (230 lines) |
| `mt-connection.ts` | `MTPlatform`, `MTConnection`, `MetaApiAccountInfo/Position/Deal`, `SyncResult` (172 lines) |
| `trader-dna.ts` | Trader profile and assessment types |
| `strategy-lab.ts` | Strategy and simulation types |
| `education.ts` | Education/course types |

---

## 9. Pages Directory Inventory — `src/pages/`

No `pages/` directory exists. The application uses the **App Router exclusively** (`src/app/`).

### Page Export Pattern Summary

**For the pages in `src/app/`, the export patterns are:**

1. **Server Component (RSC) — default export, no `'use client'`:**
   - Used for: static content, data fetching, SEO pages
   - ~60% of pages
   - Pattern: `export default function Page() { ... }`
   - Examples: `/`, `/pricing`, `/faq`, `/platform`, `/admin/*`, `/dashboard/*`, all legal pages

2. **`'use client'` Component:**
   - Used for: interactive pages with state/effects
   - ~25% of pages
   - Pattern: `'use client'` at top, `export default function Page() { ... }`
   - Examples: `/login`, `/signup`, `/demo`, `/update-password`, `/demo/*`, MT Connect

3. **RSC + Client Component hybrid:**
   - RSC page fetches data → renders client component with props
   - ~15% of pages
   - Pattern: `page.tsx` (RSC) imports `page.client.tsx` (client component)
   - Examples: `/profile` (RSC + `page.client.tsx`), `/dashboard/user` (RSC + `client.tsx`)
   - Admin pages: RSC page files import `*Client.tsx` (e.g., `UsersAdminClient.tsx`, `BillingManagerClient.tsx`)

4. **Redirect pages:**
   - Simple re-export that redirects
   - Pattern: `export default function Page() { redirect('/path') }`
   - Examples: `/(dashboard)/page.tsx` → `/dashboard/user`, `/demo/(dashboard)/dashboard/page.tsx` → `/demo/dashboard/user`
