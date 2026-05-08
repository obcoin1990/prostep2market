# Roadmap: ProStep2Market

**Created:** 2026-05-08
**Granularity:** Standard (5-8 phases, 3-5 plans each)
**Mode:** YOLO (auto-approved)

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria | Plans |
|---|-------|------|--------------|------------------|------|
| 1 | Foundation & Auth | Project setup, design system, auth, basic dashboard | CORE-01 to CORE-05, AUTH-01 to AUTH-05, ONBD-01 to ONBD-02, DASH-01 to DASH-02 | 12 | 4 |
| 2 | Trader DNA | Assessment flow, profile generation, personalized dashboard | DNA-01 to DNA-10 | 10 |
| 3 | Trade Journal | Entry, import, screenshots, AI review | INTL-01 to INTL-03, JRNL-01 to JRNL-08 | 11 |
| 4 | AI Trade Intelligence | Analysis engine, insights, exportable reports | INTL-04 to INTL-09, DASH-04 to DASH-07 | 12 |
| 5 | Risk Guardian | Behavioral monitoring, alerts, configurable thresholds | GRDN-01 to GRDN-09, DASH-08 | 9 |
| 6 | Edge Score | Gamified scoring, rankings, leaderboard | EDGE-01 to EDGE-10, DASH-05 to DASH-06 | 12 |
| 7 | Education & Strategy Lab | Courses, quizzes, strategy simulation | EDU-01 to EDU-11 | 11 |
| 8 | Public Pages & Launch | Landing, pricing, FAQ, legal, polish | HOME-01 to HOME-07, PRIC-01, FAQ-01 to FAQ-02, API-01 to API-06 | 15 |

**Total:** 8 phases | 85 requirements | 92 success criteria

---

## Phase 1: Foundation & Auth

**Goal:** Set up the project infrastructure, implement design system, authentication, and basic dashboard shell.

**Success Criteria:**
1. Next.js project initializes on Vercel with App Router and TypeScript
2. Supabase project configured with Auth, Database, Storage enabled
3. Design tokens (colors, typography, spacing) implemented as CSS variables
4. Core UI components render correctly (buttons, cards, alerts, badges)
5. Responsive layout works on mobile, tablet, desktop
6. User can sign up with email/password
7. Email verification flow completes successfully
8. Password reset via email link works
9. Session persists across browser refresh
10. User profile management (name, avatar, preferences)
11. Dashboard homepage with navigation renders
12. First-time user tour/highlights display

**Requirements:** CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, ONBD-01, ONBD-02, DASH-01, DASH-02

**Plans:**
- [ ] 01-01-PLAN.md — Project Foundation (Next.js, Supabase, Design Tokens)
- [ ] 01-02-PLAN.md — UI Component Library
- [ ] 01-03-PLAN.md — Authentication System
- [ ] 01-04-PLAN.md — Dashboard Shell & Onboarding

---

## Phase 2: Trader DNA

**Goal:** Build the psychological assessment system that creates personalized trader profiles.

**Success Criteria:**
1. Assessment questionnaire renders with all 5 sections
2. Risk personality questions capture (aggression, risk appetite, loss tolerance, recovery)
3. Emotional stability scenarios measure (impulsiveness, patience, frustration, revenge)
4. Decision-making style questions identify trader type
5. Trading behavior assessment captures (overtrading probability, FOMO, discipline, consistency)
6. Learning style preference collected
7. Trader profile generated (Sniper, Analyst, Warrior, etc.)
8. Personalized dashboard layout applies based on profile
9. Learning path recommendation calculated and displayed
10. Trader profile summary displays on profile page

**Requirements:** DNA-01, DNA-02, DNA-03, DNA-04, DNA-05, DNA-06, DNA-07, DNA-08, DNA-09, DNA-10

**Plans:**
- [ ] 02-01-PLAN.md — Assessment Data & Types
- [ ] 02-02-PLAN.md — Assessment Wizard UI
- [ ] 02-03-PLAN.md — Profile Generation & Storage
- [ ] 02-04-PLAN.md — Dashboard Personalization

---

## Phase 3: Trade Journal

**Goal:** Create the trade logging system with manual entry, CSV import, and MT5 sync.

**Success Criteria:**
1. Manual trade entry form captures (symbol, entry, exit, SL, TP, lot size, session)
2. Screenshot upload works with trade association
3. Emotional tracking captures (confidence, stress, triggers)
4. Pre-trade plan adherence rating saved with trade
5. Journal timeline view renders with filters (symbol, session, emotion)
6. CSV import validates and processes trade data correctly
7. MT5 read-only connection imports trades with session metadata
8. Journal entries persist and display in timeline

**Requirements:** INTL-01, INTL-02, INTL-03, JRNL-01, JRNL-02, JRNL-03, JRNL-04, JRNL-05

**Plans:**
- [ ] 03-01-PLAN.md — Database Schema & API
- [ ] 03-02-PLAN.md — Trade Entry Forms
- [ ] 03-03-PLAN.md — CSV Import
- [ ] 03-04-PLAN.md — Journal Timeline

---

## Phase 4: AI Trade Intelligence

**Goal:** Build the automated analysis engine that evaluates trade quality and generates actionable insights.

**Success Criteria:**
1. Trade quality analysis calculates entry timing and exit quality scores
2. RR efficiency metric displays correctly
3. Behavioral patterns detected (revenge trading, impulsive trades, overconfidence)
4. Risk metrics capture (lot size variance, drawdown behavior, exposure)
5. Performance analytics show (best sessions, worst conditions, pair performance)
6. AI insights generate with specific, actionable recommendations
7. Actionable insights panel displays on dashboard
8. Exportable PDF reports generate with analysis summary
9. AI alerts integrate with dashboard widget
10. Session analytics heatmap renders correctly
11. Trade statistics show pair performance and time analysis

**Requirements:** INTL-04, INTL-05, INTL-06, INTL-07, INTL-08, INTL-09, DASH-04, DASH-05, DASH-06, DASH-07

**Plans:**
- [ ] 04-01-PLAN.md — Analysis Engine Core (pattern detection, risk metrics, performance analytics)
- [ ] 04-02-PLAN.md — Database & Analytics Schema (trade_analyses table, daily_analytics table, API endpoints)
- [ ] 04-03-PLAN.md — Dashboard Widgets (AI Alerts, Trade Stats, Heatmap, Insights Panel)
- [ ] 04-04-PLAN.md — PDF Reports & Insight Generation (exportable reports, AI insight generation)

---

## Phase 5: Risk Guardian

**Goal:** Implement continuous behavioral monitoring with non-intrusive alerts.

**Success Criteria:**
1. Behavioral monitoring runs continuously during active sessions
2. Revenge trading alert triggers when pattern detected
3. Trading fatigue detection alert fires after extended sessions
4. Risk escalation warning activates when exposure exceeds normal
5. Emotional instability notification triggers appropriately
6. Auto-pause suggestion appears after long sessions
7. Exposure warning displays when limits exceeded
8. Alert thresholds configurable per user in settings
9. In-app notifications deliver alerts non-intrusively

**Requirements:** GRDN-01, GRDN-02, GRDN-03, GRDN-04, GRDN-05, GRDN-06, GRDN-07, GRDN-08, GRDN-09, DASH-08

**Plans:**
- [x] 05-01-PLAN.md — Alert Detection Engine (rules, detector, session tracker)
- [x] 05-02-PLAN.md — Database & API (migration, alerts/settings routes)
- [x] 05-03-PLAN.md — Alert UI & Real-time (toasts, badge, history, subscription)
- [x] 05-04-PLAN.md — Dashboard & Pause Mode (quick actions, overlay)

---

## Phase 6: Edge Score

**Goal:** Implement the gamified performance scoring system with ranks and leaderboard.

**Success Criteria:**
1. Discipline score calculates from rule adherence and journaling
2. Risk score calculates from position sizing and drawdown control
3. Emotional stability score measures response patterns and recovery
4. Consistency score tracks streaks and return variance
5. Strategy adherence score measures rule-following
6. Composite Edge Score displays (0-100 scale) on dashboard
7. Score trend sparkline renders next to score
8. Rank displays correctly (Beginner through Elite)
9. Quick tips to improve score appear contextually
10. Leaderboard renders with privacy controls
11. AI review identifies recurring mistakes and triggers
12. Action plan generates for addressing recurring issues

**Requirements:** EDGE-01, EDGE-02, EDGE-03, EDGE-04, EDGE-05, EDGE-06, EDGE-07, EDGE-08, EDGE-09, EDGE-10, JRNL-06, JRNL-07, JRNL-08

---

## Phase 7: Education and Strategy Lab

**Goal:** Build the structured learning platform and strategy simulation environment.

**Success Criteria:**
1. Learning paths display (beginner, intermediate, advanced, psychology-first)
2. Course structure supports (video lessons, quizzes, case studies)
3. Micro lessons render as 5-15 minute focused content
4. Progress tracking updates across all courses
5. Completion badges award and display correctly
6. Certificates generate on course completion
7. Quiz system renders questions with feedback
8. Strategy builder allows (entry rules, exit rules, RR, position sizing)
9. Session testing runs strategies across market conditions
10. RR optimization tests multiple combinations
11. Behavioral comparison simulates rules (stop after X losses)
12. Strategy performance metrics display (simulated PnL, drawdown, consistency)

**Requirements:** EDU-01, EDU-02, EDU-03, EDU-04, EDU-05, EDU-06, EDU-07, EDU-08, EDU-09, EDU-10, EDU-11

---

## Phase 8: Public Pages & Launch

**Goal:** Build public-facing pages (landing, pricing, FAQ, legal) and finalize APIs.

**Success Criteria:**
1. Landing page hero section renders with headline and CTAs
2. Problem statement section displays with compelling copy
3. Solution overview shows feature bullets
4. Key features grid displays 6 feature cards
5. AI Dashboard preview section renders
6. How It Works steps display in correct order
7. Testimonials section renders with quotes
8. Pricing teaser shows 3 tiers with comparison
9. Footer CTA appears with start button
10. Pricing page comparison table works
11. FAQ page renders with expandable questions
12. Legal page displays terms, privacy, disclaimer
13. POST /api/trades/upload endpoint processes trade data
14. POST /api/journal/entry endpoint saves journal entries
15. POST /api/ai/analyze endpoint triggers analysis

**Requirements:** HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, PRIC-01, FAQ-01, FAQ-02, API-01, API-02, API-03

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | 1 | Pending |
| CORE-02 | 1 | Pending |
| CORE-03 | 1 | Pending |
| CORE-04 | 1 | Pending |
| CORE-05 | 1 | Pending |
| AUTH-01 | 1 | Pending |
| AUTH-02 | 1 | Pending |
| AUTH-03 | 1 | Pending |
| AUTH-04 | 1 | Pending |
| AUTH-05 | 1 | Pending |
| ONBD-01 | 1 | Pending |
| ONBD-02 | 1 | Pending |
| DASH-01 | 1 | Pending |
| DASH-02 | 1 | Pending |
| DNA-01 | 2 | Pending |
| DNA-02 | 2 | Pending |
| DNA-03 | 2 | Pending |
| DNA-04 | 2 | Pending |
| DNA-05 | 2 | Pending |
| DNA-06 | 2 | Pending |
| DNA-07 | 2 | Pending |
| DNA-08 | 2 | Pending |
| DNA-09 | 2 | Pending |
| DNA-10 | 2 | Pending |
| INTL-01 | 3 | Pending |
| INTL-02 | 3 | Pending |
| INTL-03 | 3 | Pending |
| JRNL-01 | 3 | Pending |
| JRNL-02 | 3 | Pending |
| JRNL-03 | 3 | Pending |
| JRNL-04 | 3 | Pending |
| JRNL-05 | 3 | Pending |
| INTL-04 | 4 | Pending |
| INTL-05 | 4 | Pending |
| INTL-06 | 4 | Pending |
| INTL-07 | 4 | Pending |
| INTL-08 | 4 | Pending |
| INTL-09 | 4 | Pending |
| DASH-04 | 4 | Pending |
| DASH-05 | 4 | Pending |
| DASH-06 | 4 | Pending |
| DASH-07 | 4 | Pending |
| GRDN-01 | 5 | Pending |
| GRDN-02 | 5 | Pending |
| GRDN-03 | 5 | Pending |
| GRDN-04 | 5 | Pending |
| GRDN-05 | 5 | Pending |
| GRDN-06 | 5 | Pending |
| GRDN-07 | 5 | Pending |
| GRDN-08 | 5 | Pending |
| GRDN-09 | 5 | Pending |
| DASH-08 | 5 | Pending |
| EDGE-01 | 6 | Pending |
| EDGE-02 | 6 | Pending |
| EDGE-03 | 6 | Pending |
| EDGE-04 | 6 | Pending |
| EDGE-05 | 6 | Pending |
| EDGE-06 | 6 | Pending |
| EDGE-07 | 6 | Pending |
| EDGE-08 | 6 | Pending |
| EDGE-09 | 6 | Pending |
| EDGE-10 | 6 | Pending |
| JRNL-06 | 6 | Pending |
| JRNL-07 | 6 | Pending |
| JRNL-08 | 6 | Pending |
| EDU-01 | 7 | Pending |
| EDU-02 | 7 | Pending |
| EDU-03 | 7 | Pending |
| EDU-04 | 7 | Pending |
| EDU-05 | 7 | Pending |
| EDU-06 | 7 | Pending |
| EDU-07 | 7 | Pending |
| EDU-08 | 7 | Pending |
| EDU-09 | 7 | Pending |
| EDU-10 | 7 | Pending |
| EDU-11 | 7 | Pending |
| HOME-01 | 8 | Pending |
| HOME-02 | 8 | Pending |
| HOME-03 | 8 | Pending |
| HOME-04 | 8 | Pending |
| HOME-05 | 8 | Pending |
| HOME-06 | 8 | Pending |
| HOME-07 | 8 | Pending |
| PRIC-01 | 8 | Pending |
| FAQ-01 | 8 | Pending |
| FAQ-02 | 8 | Pending |
| API-01 | 8 | Pending |
| API-02 | 8 | Pending |
| API-03 | 8 | Pending |

**Coverage:**
- v1 requirements: 85 total
- Mapped to phases: 85
- Unmapped: 0 ✓

---
*Roadmap created: 2026-05-08*
*Last updated: 2026-05-08 after roadmap creation*