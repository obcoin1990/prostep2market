# Requirements: ProStep2Market

**Defined:** 2026-05-08
**Core Value:** Traders improve their discipline and emotional control, leading to more consistent and profitable trading outcomes.

## v1 Requirements

### Core Infrastructure

- [ ] **CORE-01**: Next.js project setup on Vercel with App Router
- [ ] **CORE-02**: Supabase project setup (Auth, Database, Storage, Edge Functions)
- [ ] **CORE-03**: Design system implementation (colors, typography, spacing tokens)
- [ ] **CORE-04**: Reusable UI component library (buttons, cards, alerts, badges)
- [ ] **CORE-05**: Responsive layout system (mobile-first approach)

### Authentication & Onboarding

- [ ] **AUTH-01**: Email/password signup and login
- [ ] **AUTH-02**: Email verification flow
- [ ] **AUTH-03**: Password reset via email link
- [ ] **AUTH-04**: Session persistence across browser refresh
- [ ] **AUTH-05**: User profile management (name, avatar, preferences)
- [ ] **ONBD-01**: Dashboard homepage with navigation
- [ ] **ONBD-02**: First-time user tour/highlights

### Module 1: Trader DNA System

- [ ] **DNA-01**: Psychological assessment questionnaire (5 sections)
- [ ] **DNA-02**: Risk personality assessment (aggression, risk appetite, loss tolerance, recovery)
- [ ] **DNA-03**: Emotional stability assessment (impulsiveness, patience, frustration response, revenge tendencies)
- [ ] **DNA-04**: Decision-making style assessment (analytical, emotional, reactive, structured)
- [ ] **DNA-05**: Trading behavior assessment (overtrading probability, FOMO, discipline, consistency)
- [ ] **DNA-06**: Learning style assessment (visual, structured, practical)
- [ ] **DNA-07**: Trader profile generation (personality type: Sniper, Analyst, Warrior, etc.)
- [ ] **DNA-08**: Personalized dashboard layout based on profile
- [ ] **DNA-09**: Personalized learning path recommendation
- [ ] **DNA-10**: Trader profile summary display

### Module 2: AI Trade Intelligence Engine

- [ ] **INTL-01**: MT5 read-only connection setup
- [ ] **INTL-02**: CSV trade import with standard format
- [ ] **INTL-03**: Manual trade entry form
- [ ] **INTL-04**: Trade quality analysis (entry timing, exit quality, RR efficiency)
- [ ] **INTL-05**: Behavioral analysis (revenge trading, impulsive trades, overconfidence flags)
- [ ] **INTL-06**: Risk analysis (lot size variance, drawdown behavior, exposure monitoring)
- [ ] **INTL-07**: Performance analysis (best sessions, worst conditions, pair performance)
- [ ] **INTL-08**: AI insights generation with actionable recommendations
- [ ] **INTL-09**: Exportable analysis reports (PDF summary for coaching)

### Module 3: Risk Guardian System

- [ ] **GRDN-01**: Continuous behavioral monitoring
- [ ] **GRDN-02**: Revenge trading alert system
- [ ] **GRDN-03**: Trading fatigue detection alert
- [ ] **GRDN-04**: Risk escalation warning
- [ ] **GRDN-05**: Emotional instability notification
- [ ] **GRDN-06**: Auto-pause trading suggestion after extended sessions
- [ ] **GRDN-07**: Exposure warning when current exposure exceeds profile normal
- [ ] **GRDN-08**: Configurable alert thresholds per user
- [ ] **GRDN-09**: Non-intrusive alert delivery (in-app notifications)

### Module 4: Trade Journal System

- [ ] **JRNL-01**: Trade log entry form (symbol, entry, exit, SL, TP, lot size, session)
- [ ] **JRNL-02**: Screenshot upload with trade association
- [ ] **JRNL-03**: Emotional tracking (confidence, stress, triggers)
- [ ] **JRNL-04**: Pre-trade plan adherence rating
- [ ] **JRNL-05**: Journal timeline view with filters (symbol, session, emotion)
- [ ] **JRNL-06**: AI review of journal entries (recurring mistakes, behavioral triggers)
- [ ] **JRNL-07**: Discipline score (daily and weekly)
- [ ] **JRNL-08**: Action plan generation for recurring issues

### Module 5: Edge Score System

- [ ] **EDGE-01**: Discipline score calculation (rule adherence, journaling consistency)
- [ ] **EDGE-02**: Risk score calculation (position sizing, drawdown control)
- [ ] **EDGE-03**: Emotional stability score (measured responses, recovery time)
- [ ] **EDGE-04**: Consistency score (streaks, return variance)
- [ ] **EDGE-05**: Strategy adherence score (following predefined rules)
- [ ] **EDGE-06**: Composite Edge Score display (0-100 scale)
- [ ] **EDGE-07**: Score trend sparkline visualization
- [ ] **EDGE-08**: Rank display (Beginner, Developing, Consistent, Advanced, Elite)
- [ ] **EDGE-09**: Quick tips to improve score
- [ ] **EDGE-10**: Leaderboard display (optional, privacy controls)

### Module 6: Education and Strategy Lab

- [ ] **EDU-01**: Learning paths (beginner, intermediate, advanced, psychology-first)
- [ ] **EDU-02**: Course structure (video lessons, interactive quizzes, case studies)
- [ ] **EDU-03**: Micro lessons (5-15 minute focused content)
- [ ] **EDU-04**: Progress tracking across courses
- [ ] **EDU-05**: Completion badges and certificates
- [ ] **EDU-06**: Quiz system with feedback
- [ ] **EDU-07**: Strategy Lab: custom strategy builder (entry rules, exit rules, RR, sizing)
- [ ] **EDU-08**: Session testing across market conditions
- [ ] **EDU-09**: RR optimization testing
- [ ] **EDU-10**: Behavioral comparison (simulate rules like stop after X losses)
- [ ] **EDU-11**: Strategy performance metrics (simulated PnL, max drawdown, consistency)

### Dashboard

- [ ] **DASH-01**: Edge Score card widget (current score, trend, rank, tips)
- [ ] **DASH-02**: Emotional Risk Meter widget (live indicator with gradient, action text)
- [ ] **DASH-03**: Weekly performance widget (PnL, win rate, average RR, session breakdown)
- [ ] **DASH-04**: AI alerts widget (recent warnings and suggested actions)
- [ ] **DASH-05**: Trade statistics widget (pair performance, best/worst times)
- [ ] **DASH-06**: Session analytics heatmap
- [ ] **DASH-07**: Actionable insights panel
- [ ] **DASH-08**: Quick action buttons (upload trade, journal, simulation, pause mode)

### Public Pages

- [ ] **HOME-01**: Landing page with hero section, problem statement, solution overview
- [ ] **HOME-02**: Key features snapshot grid
- [ ] **HOME-03**: AI Dashboard preview section
- [ ] **HOME-04**: How it works steps
- [ ] **HOME-05**: Testimonials section
- [ ] **HOME-06**: Pricing teaser with plan comparison
- [ ] **HOME-07**: Footer CTA
- [ ] **PRIC-01**: Pricing page with 3-tier comparison table
- [ ] **FAQ-01**: FAQ page with common questions
- [ ] **FAQ-02**: Legal/Terms/Privacy page

### Data & API

- [ ] **API-01**: POST /api/trades/upload endpoint
- [ ] **API-02**: POST /api/journal/entry endpoint
- [ ] **API-03**: POST /api/ai/analyze endpoint
- [ ] **API-04**: Risk Guardian webhook for alerts
- [ ] **API-05**: CSV import with validation
- [ ] **API-06**: MT5 connection verification endpoint

## v2 Requirements

### Notifications

- **NOTF-01**: Push notifications for alerts
- **NOTF-02**: Email notifications (new followers, comments on posts)
- **NOTF-03**: Configurable notification preferences

### Enterprise

- **ENTR-01**: White-label customization
- **ENTR-02**: Multi-tenant architecture
- **ENTR-03**: SSO integration
- **ENTR-04**: Coach console for reviewing trader journals
- **ENTR-05**: Admin dashboard with user analytics

### Advanced Features

- **ADV-01**: TradingView chart embedding
- **ADV-02**: Market intelligence page (volatility heatmaps, session activity, news impact)
- **ADV-03**: Correlation tracking (symbol matrix, regime changes)
- **ADV-04**: Mobile responsive improvements
- **ADV-05**: Offline support for journal entries

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
| CORE-01 to CORE-05 | TBD | Pending |
| AUTH-01 to AUTH-05 | TBD | Pending |
| ONBD-01 to ONBD-02 | TBD | Pending |
| DNA-01 to DNA-10 | TBD | Pending |
| INTL-01 to INTL-09 | TBD | Pending |
| GRDN-01 to GRDN-09 | TBD | Pending |
| JRNL-01 to JRNL-08 | TBD | Pending |
| EDGE-01 to EDGE-10 | TBD | Pending |
| EDU-01 to EDU-11 | TBD | Pending |
| DASH-01 to DASH-08 | TBD | Pending |
| HOME-01 to HOME-07 | TBD | Pending |
| PRIC-01, FAQ-01 to FAQ-02 | TBD | Pending |
| API-01 to API-06 | TBD | Pending |

**Coverage:**
- v1 requirements: 85 total
- Mapped to phases: 0
- Unmapped: 85 ⚠️

---
*Requirements defined: 2026-05-08*
*Last updated: 2026-05-08 after initial definition*