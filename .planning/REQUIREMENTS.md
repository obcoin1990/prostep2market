# Requirements: ProStep2Market

**Defined:** 2026-05-08
**Last Updated:** 2026-05-19
**Core Value:** Traders improve their discipline and emotional control, leading to more consistent and profitable trading outcomes.

## v1 Requirements

### Core Infrastructure

- [x] **CORE-01**: Next.js project setup on Vercel with App Router
- [x] **CORE-02**: Supabase project setup (Auth, Database, Storage, Edge Functions)
- [x] **CORE-03**: Design system implementation (colors, typography, spacing tokens)
- [x] **CORE-04**: Reusable UI component library (buttons, cards, alerts, badges)
- [x] **CORE-05**: Responsive layout system (mobile-first approach)

### Authentication & Onboarding

- [x] **AUTH-01**: Email/password signup and login
- [x] **AUTH-02**: Email verification flow
- [x] **AUTH-03**: Password reset via email link
- [x] **AUTH-04**: Session persistence across browser refresh
- [x] **AUTH-05**: User profile management (name, avatar, preferences)
- [x] **ONBD-01**: Dashboard homepage with navigation
- [x] **ONBD-02**: First-time user tour/highlights

### Module 1: Trader DNA System

- [x] **DNA-01**: Psychological assessment questionnaire (5 sections)
- [x] **DNA-02**: Risk personality assessment (aggression, risk appetite, loss tolerance, recovery)
- [x] **DNA-03**: Emotional stability assessment (impulsiveness, patience, frustration response, revenge tendencies)
- [x] **DNA-04**: Decision-making style assessment (analytical, emotional, reactive, structured)
- [x] **DNA-05**: Trading behavior assessment (overtrading probability, FOMO, discipline, consistency)
- [x] **DNA-06**: Learning style assessment (visual, structured, practical)
- [x] **DNA-07**: Trader profile generation (personality type: Sniper, Analyst, Warrior, etc.)
- [x] **DNA-08**: Personalized dashboard layout based on profile
- [x] **DNA-09**: Personalized learning path recommendation
- [x] **DNA-10**: Trader profile summary display

### Module 2: AI Trade Intelligence Engine

- [x] **INTL-01**: MT5 read-only connection setup
- [x] **INTL-02**: CSV trade import with standard format
- [x] **INTL-03**: Manual trade entry form
- [x] **INTL-04**: Trade quality analysis (entry timing, exit quality, RR efficiency)
- [x] **INTL-05**: Behavioral analysis (revenge trading, impulsive trades, overconfidence flags)
- [x] **INTL-06**: Risk analysis (lot size variance, drawdown behavior, exposure monitoring)
- [x] **INTL-07**: Performance analysis (best sessions, worst conditions, pair performance)
- [x] **INTL-08**: AI insights generation with actionable recommendations
- [x] **INTL-09**: Exportable analysis reports (PDF summary for coaching)

### Module 3: Risk Guardian System

- [x] **GRDN-01**: Continuous behavioral monitoring
- [x] **GRDN-02**: Revenge trading alert system
- [x] **GRDN-03**: Trading fatigue detection alert
- [x] **GRDN-04**: Risk escalation warning
- [x] **GRDN-05**: Emotional instability notification
- [x] **GRDN-06**: Auto-pause trading suggestion after extended sessions
- [x] **GRDN-07**: Exposure warning when current exposure exceeds profile normal
- [x] **GRDN-08**: Configurable alert thresholds per user
- [x] **GRDN-09**: Non-intrusive alert delivery (in-app notifications)

### Module 4: Trade Journal System

- [x] **JRNL-01**: Trade log entry form (symbol, entry, exit, SL, TP, lot size, session)
- [x] **JRNL-02**: Screenshot upload with trade association
- [x] **JRNL-03**: Emotional tracking (confidence, stress, triggers)
- [x] **JRNL-04**: Pre-trade plan adherence rating
- [x] **JRNL-05**: Journal timeline view with filters (symbol, session, emotion)
- [x] **JRNL-06**: AI review of journal entries (recurring mistakes, behavioral triggers)
- [x] **JRNL-07**: Discipline score (daily and weekly)
- [x] **JRNL-08**: Action plan generation for recurring issues

### Module 5: Edge Score System

- [x] **EDGE-01**: Discipline score calculation (rule adherence, journaling consistency)
- [x] **EDGE-02**: Risk score calculation (position sizing, drawdown control)
- [x] **EDGE-03**: Emotional stability score (measured responses, recovery time)
- [x] **EDGE-04**: Consistency score (streaks, return variance)
- [x] **EDGE-05**: Strategy adherence score (following predefined rules)
- [x] **EDGE-06**: Composite Edge Score display (0-100 scale)
- [x] **EDGE-07**: Score trend sparkline visualization
- [x] **EDGE-08**: Rank display (Beginner, Developing, Consistent, Advanced, Elite)
- [x] **EDGE-09**: Quick tips to improve score
- [x] **EDGE-10**: Leaderboard display (optional, privacy controls)

### Module 6: Education and Strategy Lab

- [x] **EDU-01**: Learning paths (beginner, intermediate, advanced, psychology-first)
- [x] **EDU-02**: Course structure (video lessons, interactive quizzes, case studies)
- [x] **EDU-03**: Micro lessons (5-15 minute focused content)
- [x] **EDU-04**: Progress tracking across courses
- [x] **EDU-05**: Completion badges and certificates
- [x] **EDU-06**: Quiz system with feedback
- [x] **EDU-07**: Strategy Lab: custom strategy builder (entry rules, exit rules, RR, sizing)
- [x] **EDU-08**: Session testing across market conditions
- [x] **EDU-09**: RR optimization testing
- [x] **EDU-10**: Behavioral comparison (simulate rules like stop after X losses)
- [x] **EDU-11**: Strategy performance metrics (simulated PnL, max drawdown, consistency)

### Dashboard

- [x] **DASH-01**: Edge Score card widget (current score, trend, rank, tips)
- [x] **DASH-02**: Emotional Risk Meter widget (live indicator with gradient, action text)
- [x] **DASH-03**: Weekly performance widget (PnL, win rate, average RR, session breakdown)
- [x] **DASH-04**: AI alerts widget (recent warnings and suggested actions)
- [x] **DASH-05**: Trade statistics widget (pair performance, best/worst times)
- [x] **DASH-06**: Session analytics heatmap
- [x] **DASH-07**: Actionable insights panel
- [x] **DASH-08**: Quick action buttons (upload trade, journal, simulation, pause mode)

### Public Pages

- [x] **HOME-01**: Landing page with hero section, problem statement, solution overview
- [x] **HOME-02**: Key features snapshot grid
- [x] **HOME-03**: AI Dashboard preview section
- [x] **HOME-04**: How it works steps
- [x] **HOME-05**: Testimonials section
- [x] **HOME-06**: Pricing teaser with plan comparison
- [x] **HOME-07**: Footer CTA
- [x] **PRIC-01**: Pricing page with 3-tier comparison table
- [x] **FAQ-01**: FAQ page with common questions
- [x] **FAQ-02**: Legal/Terms/Privacy page

### Data & API

- [x] **API-01**: POST /api/trades/upload endpoint
- [x] **API-02**: POST /api/journal/entry endpoint
- [x] **API-03**: POST /api/ai/analyze endpoint
- [x] **API-04**: Risk Guardian webhook for alerts
- [x] **API-05**: CSV import with validation
- [x] **API-06**: MT5 connection verification endpoint

## v2 Requirements

### Notifications

- [ ] **NOTF-01**: Push notifications for alerts
- [ ] **NOTF-02**: Email notifications (new followers, comments on posts)
- [ ] **NOTF-03**: Configurable notification preferences

### Enterprise

- [ ] **ENTR-01**: White-label customization
- [ ] **ENTR-02**: Multi-tenant architecture
- [ ] **ENTR-03**: SSO integration
- [ ] **ENTR-04**: Coach console for reviewing trader journals
- [ ] **ENTR-05**: Admin dashboard with user analytics

### Advanced Features

- [ ] **ADV-01**: TradingView chart embedding
- [ ] **ADV-02**: Market intelligence page (volatility heatmaps, session activity, news impact)
- [ ] **ADV-03**: Correlation tracking (symbol matrix, regime changes)
- [ ] **ADV-04**: Mobile responsive improvements (deeper mobile polish)
- [ ] **ADV-05**: Offline support for journal entries

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time trading signals | Against brand promise; adds liability |
| Automated trade execution | Safety risk; outside scope |
| Copy trading | Not aligned with coaching philosophy |
| Mobile native apps | Web-first; mobile later |
| Prop firm direct integration | Enterprise feature for later |
| Social trading features | Not core to trader development |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 to CORE-05 | Phase 1 | ✅ Complete |
| AUTH-01 to AUTH-05 | Phase 1 | ✅ Complete |
| ONBD-01 to ONBD-02 | Phase 1 | ✅ Complete |
| DNA-01 to DNA-10 | Phase 2 | ✅ Complete |
| INTL-01 to INTL-03 | Phase 3 | ✅ Complete |
| INTL-04 to INTL-09 | Phase 4 | ✅ Complete |
| GRDN-01 to GRDN-09 | Phase 5 | ✅ Complete |
| JRNL-01 to JRNL-05 | Phase 3 | ✅ Complete |
| JRNL-06 to JRNL-08 | Phase 6 | ✅ Complete |
| EDGE-01 to EDGE-10 | Phase 6 | ✅ Complete |
| EDU-01 to EDU-11 | Phase 7 | ✅ Complete |
| DASH-01 to DASH-08 | Phases 1, 4, 5 | ✅ Complete |
| HOME-01 to HOME-07 | Phase 8 | ✅ Complete |
| PRIC-01, FAQ-01 to FAQ-02 | Phase 8 | ✅ Complete |
| API-01 to API-06 | Phase 8 | ✅ Complete |

**Coverage:**
- v1 requirements: 85 total
- Mapped to phases: 85/85
- Complete: 85/85 ✅

---
*Requirements defined: 2026-05-08*
*Last updated: 2026-05-19 — all v1 requirements marked complete per git history and SUMMARY files*
