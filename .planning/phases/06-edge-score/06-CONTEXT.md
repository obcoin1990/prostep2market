# Phase 6: Edge Score - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Source:** YOLO mode (skipping discuss-phase per config)

<domain>
## Phase Boundary

Build the gamified performance scoring system that quantifies trader skill across multiple dimensions (discipline, risk, emotional stability, consistency, strategy adherence) and displays composite Edge Score with ranks and leaderboard.

</domain>

<decisions>
## Implementation Decisions

### Score Components
```typescript
interface EdgeScoreBreakdown {
  disciplineScore: number;      // 0-100: rule adherence, journaling consistency
  riskScore: number;             // 0-100: position sizing, drawdown control
  emotionalStabilityScore: number; // 0-100: measured responses, recovery time
  consistencyScore: number;      // 0-100: streaks, return variance
  strategyAdherenceScore: number; // 0-100: following predefined rules
  compositeScore: number;        // 0-100: weighted average
}

interface ScoreHistory {
  date: Date;
  disciplineScore: number;
  riskScore: number;
  emotionalStabilityScore: number;
  consistencyScore: number;
  strategyAdherenceScore: number;
  compositeScore: number;
  rank: Rank;
}
```

### Ranks
| Rank | Composite Score Range | Description |
|------|----------------------|-------------|
| Beginner | 0-20 | Just starting out |
| Developing Trader | 21-40 | Learning fundamentals |
| Consistent Trader | 41-60 | Building habits |
| Advanced Trader | 61-80 | Refining edge |
| Elite Trader | 81-100 | Optimizing performance |

### Score Calculation Algorithms
**Discipline Score (GRDN-01, EDGE-01):**
- Rule adherence: % of trades following plan (trades with pre_trade_plan_adherence >= 4)
- Journaling consistency: % of days with at least 1 trade logged
- Formula: `(ruleAdherence * 0.6 + journalingConsistency * 0.4) * 100`

**Risk Score (EDGE-02):**
- Position sizing consistency: std dev of lot size vs average
- Drawdown control: max drawdown vs account size
- Calmar ratio consideration
- Formula: `baseScore - (lotSizeVariance * 10) - (drawdownRatio * 20)`

**Emotional Stability Score (EDGE-03):**
- Response patterns: trades after alerts vs calm trades
- Recovery time: avg time to resume after loss
- Alert frequency impact
- Formula: `(calmTradeRatio * 50) + (recoveryBonus * 30) + (alertPenalty * 20)`

**Consistency Score (EDGE-04):**
- Win streak analysis
- Return variance (lower = more consistent)
- Session-to-session consistency
- Formula: `(streakBonus * 40) + (lowVarianceBonus * 30) + (sessionConsistency * 30)`

**Strategy Adherence Score (EDGE-05):**
- Pre-trade plan adherence rate
- Post-trade review completion
- Strategy rule following in simulation
- Formula: `(planAdherence * 0.5) + (reviewCompletion * 0.3) + (strategyRules * 0.2) * 100`

### Composite Score
```typescript
const SCORE_WEIGHTS = {
  discipline: 0.25,
  risk: 0.25,
  emotionalStability: 0.20,
  consistency: 0.15,
  strategyAdherence: 0.15
};

compositeScore = Object.entries(scores)
  .reduce((sum, [key, score]) => sum + (score * SCORE_WEIGHTS[key]), 0);
```

### UI Components
**Edge Score Card (DASH-01):**
- Large score display (0-100) with circular progress
- Breakdown bars for each component
- Trend sparkline (last 30 days)
- Rank badge with icon
- Quick tips to improve score

**Leaderboard (EDGE-10):**
- Privacy controls: public/anonymous/hidden
- Weekly, monthly, all-time views
- Top 100 traders displayed
- User's rank highlighted
- Filter by friend groups (future)

### Database Schema
```sql
CREATE TABLE edge_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  discipline_score DECIMAL NOT NULL,
  risk_score DECIMAL NOT NULL,
  emotional_stability_score DECIMAL NOT NULL,
  consistency_score DECIMAL NOT NULL,
  strategy_adherence_score DECIMAL NOT NULL,
  composite_score DECIMAL NOT NULL,
  rank TEXT CHECK (rank IN ('beginner', 'developing', 'consistent', 'advanced', 'elite')),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_edge_scores_user_date ON edge_scores(user_id, date DESC);

CREATE TABLE leaderboard_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  visibility TEXT DEFAULT 'anonymous' CHECK (visibility IN ('public', 'anonymous', 'hidden')),
  show_in_leaderboard BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Quick Tips Logic (EDGE-09)
- Lowest scoring component gets priority tip
- Tips stored in `src/lib/edge-score/tips.ts` as rule-based mappings
- Example: If consistencyScore < 40 → "Focus on maintaining consistent session lengths"
- Dynamic tips based on trade history analysis from Phase 4

### Integration Points
- **Phase 2:** Trader DNA (profile affects scoring weights)
- **Phase 3:** Trade Journal (source of trade data for scoring)
- **Phase 4:** AI Trade Intelligence (behavioral analysis for scoring)
- **Phase 5:** Risk Guardian (alert frequency affects emotional stability score)
- **Phase 7:** Education Lab (course completion bonus to score)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `RESEURCES/modules.md` — Module 5 Edge Score overview
- `RESEURCES/dashboard.md` — Edge Score card widget specs
- `.planning/REQUIREMENTS.md` — Phase 6 requirements (EDGE-01 to EDGE-10, JRNL-06 to JRNL-08)
- `.planning/ROADMAP.md` — Phase 6 success criteria
- `.planning/phases/03-trade-journal/03-CONTEXT.md` — Trade data model
- `.planning/phases/04-ai-trade-intelligence/04-CONTEXT.md` — Behavioral analysis results
- `.planning/phases/05-risk-guardian/05-CONTEXT.md` — Alert frequency data
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Phase 1 context (auth, DB schema)

### Tech Decisions from Prior Phases
- Next.js App Router with TypeScript
- Supabase for database and Edge Functions
- Tailwind CSS for styling
- Recharts for sparkline visualizations
- Sonner for notifications

</canonical_refs>

<specifics>
## Specific Ideas

### Score Calculation Flow
1. Daily cron job or triggered on new trade entry
2. Load trade data for user (last 30 days)
3. Calculate each component score using algorithms above
4. Compute composite score with weights
5. Determine rank from composite score
6. Store in `edge_scores` table
7. Push score history to cache (for fast dashboard load)

### Daily Calculation Trigger
- Supabase Edge Function scheduled daily at midnight
- Also triggered on-demand when user opens dashboard
- Re-calculate if last score is older than 24 hours

### Score History for Sparkline
```typescript
interface SparklineData {
  date: string; // ISO date
  score: number;
}
```

### Rank Display
- Badge component with color coding:
  - Beginner: gray
  - Developing: blue
  - Consistent: green
  - Advanced: purple
  - Elite: gold gradient

### Leaderboard Privacy
- User setting stored in `leaderboard_settings`
- Privacy levels:
  - `public`: Show username and score
  - `anonymous`: Show "Trader #XXX" and score
  - `hidden`: Exclude from leaderboard entirely

### Quick Tips Examples
| Condition | Tip |
|-----------|-----|
| disciplineScore < 40 | "Log your trades within 24 hours to improve journaling consistency" |
| riskScore < 40 | "Review your position sizing — variance is above normal" |
| emotionalStabilityScore < 40 | "Take more breaks between trades — alert frequency suggests fatigue" |
| consistencyScore < 40 | "Focus on maintaining consistent session lengths" |
| strategyAdherenceScore < 40 | "Complete your pre-trade plan before entering trades" |

### Recharts Sparkline Component
```tsx
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface ScoreSparklineProps {
  data: SparklineData[];
  width?: number;
  height?: number;
}
```

</specifics>

<deferred>
## Deferred Ideas

- Friend groups and private leaderboards (v2)
- Achievements and badges system (v2)
- Shareable score cards with charts (v2)
- Coach console for reviewing trader scores (v2/Enterprise)

None — Phase 6 is self-contained for Edge Score delivery.

</deferred>

---

*Phase: 06-edge-score*
*Context gathered: 2026-05-08 via YOLO mode*