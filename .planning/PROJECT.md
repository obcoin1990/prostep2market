# ProStep2Market

## What This Is

AI-powered trader development and performance intelligence platform for retail forex traders. The platform analyzes trading behavior and psychology to improve discipline, decision quality, and consistency — helping traders understand themselves before trying to understand the market.

## Core Value

Traders improve their discipline and emotional control, which leads to more consistent and profitable trading outcomes.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Module 1: Trader DNA System — psychological assessment and personalized profile
- [ ] Module 2: AI Trade Intelligence Engine — automated trade quality and behavioral analysis
- [ ] Module 3: Risk Guardian System — behavioral monitoring and non-intrusive alerts
- [ ] Module 4: Trade Journal System — professional journaling with AI review
- [ ] Module 5: Edge Score System — gamified performance ranking across multiple dimensions
- [ ] Module 6: Education and Strategy Lab — structured learning and strategy simulation

### Out of Scope

- Real-time trading signals or automated trading
- Direct MT5 trade execution
- Mobile native apps (web-first approach)
- Prop firm integration or copy trading

## Context

**Source:** RESEURCES folder contains complete platform specification including:
- Brand guidelines (ProStep red #E53935, green #2E7D32, black #0B0B0B)
- UI components and style tokens
- All 6 module specifications
- Landing page, pricing, onboarding flows
- Tools and API integration specs

**Audit State (2026-07-11):** Full CTO audit completed — 28 findings across 118 files. All 85 v1 requirements have code but many have data correctness bugs, security gaps, or use hardcoded data. See `REVIEW.md` for details. Requirements must be re-verified before production launch.

**Target Users:**
- Retail forex traders (beginner to advanced)
- Trading coaches and academies (Enterprise)
- Brokers and prop firms (Enterprise white-label)

## Constraints

- **Frontend:** Vercel hosting, Next.js with React
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **AI:** OpenAI and Claude APIs for behavioral analysis
- **Data Sources:** MT5 read-only connection, CSV imports, manual entry
- **Security:** Read-only trading connections, encrypted storage, user data control

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Web-first approach | Focus on core experience before mobile | — Pending |
| Read-only MT5 | Safety and trust for users | — Pending |
| Gamified scoring | Behavioral change through engagement | — Pending |
| AI ensemble approach | Rule-based + LLM for robustness | — Pending |
| Demo dashboard bypasses auth | Client walkthrough without signup friction | ✅ Implemented as `/demo/dashboard/*` route group with permissive layout |
| Admin account as SUPER_ADMIN | Single account for platform management | ✅ `ob6013@gmail.com` — role set in Auth metadata, Prisma, trader_profiles |
| Supabase as single identity source | Avoid dual-auth complexity (reverted NextAuth) | ✅ Supabase Auth only; auth layer was partially reverted on 2026-05-12 |
| CTO audit before feature work | Validate existing code quality before adding new features | ✅ 28 findings documented in REVIEW.md — blocking 85 "complete" requirements from being considered production-ready |

---

*Last updated: 2026-07-11 after CTO audit*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state