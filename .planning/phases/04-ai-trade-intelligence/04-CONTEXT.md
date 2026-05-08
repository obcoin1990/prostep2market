# Phase 4: AI Trade Intelligence - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Source:** YOLO mode (skipping discuss-phase per config)

<domain>
## Phase Boundary

Build the automated analysis engine that evaluates trade quality, detects behavioral patterns, monitors risk, and generates actionable AI insights. This phase consumes data from Phase 3 (Trade Journal) and produces insights consumed by Phase 5 (Risk Guardian) and the Dashboard.

</domain>

<decisions>
## Implementation Decisions

### AI Analysis Architecture
- **Rule-based heuristics** for deterministic patterns (win/loss streaks, lot size variance, session detection)
- **LLM-driven behavioral interpretation** for nuanced analysis (context-aware insights, emotional patterns)
- Ensemble approach: heuristics provide fast scoring, LLM provides depth
- Phase 4 focus: analysis engine, not the LLM integration itself (integration is Phase 4 delivery)

### Trade Quality Analysis
```typescript
interface TradeQualityAnalysis {
  entryTimingScore: number;     // 0-100: how close to optimal entry
  exitQualityScore: number;     // 0-100: quality of exit relative to signal
  rrEfficiency: number;         // Actual RR vs available RR
  qualityGrade: 'A' | 'B' | 'C' | 'D';  // Composite grade
}
```
- Entry timing: compare against common support/resistance levels (heuristic)
- Exit quality: compare exit price against optimal exit zone
- RR efficiency: (realized RR / theoretical max RR) * 100

### Behavioral Pattern Detection
```typescript
interface BehavioralPatterns {
  revengeTrading: { detected: boolean; severity: number; evidence: string[] };
  impulsiveTrades: { detected: boolean; count: number; triggers: string[] };
  overconfidence: { detected: boolean; evidence: string[] };
  fearExits: { detected: boolean; instances: string[] };
  overtrading: { detected: boolean; sessionCount: number; threshold: number };
}
```
- Revenge trading: 3+ trades after 2 consecutive losses within same session
- Impulsive trades: trades with <2min hold during high volatility (news events)
- Overconfidence: 5+ consecutive wins followed by increased lot size
- Fear exits: premature exits within 10% of TP during winning trades
- Overtrading: >8 trades in a single session

### Risk Analysis
```typescript
interface RiskMetrics {
  lotSizeVariance: number;      // Std deviation from average
  drawdownBehavior: DrawdownProfile;
  exposureProfile: ExposureSnapshot;
  marginPressureEvents: number;
}

interface DrawdownProfile {
  maxDrawdown: number;
  drawdownDuration: number;
  recoveryPattern: 'slow' | 'normal' | 'fast';
}
```

### Performance Analytics
```typescript
interface PerformanceAnalytics {
  bestSessions: SessionSummary[];
  worstConditions: ConditionSummary[];
  pairPerformance: Map<string, PairStats>;
  timeAnalysis: TimeHeatmap;
}

interface PairStats {
  winRate: number;
  avgRR: number;
  totalTrades: number;
  bestSession: string;
  conditions: string[];
}
```

### AI Insights Generation
- **Insight types:**
  - Behavioral: "Your trade size increased after a losing streak"
  - Risk: "Your lot size variance is 40% above normal"
  - Pattern: "You win 65% when trading during London session"
  - Action: "Reduce lot size by 20% for next session"
- **Confidence scoring:** Each insight has a confidence 0-1 based on data sufficiency
- **Actionability scoring:** Each insight tagged with effort level (quick fix, requires attention, strategic)

### Exportable Reports
- PDF format for coaching sessions
- Sections: Executive Summary, Trade Quality Trends, Behavioral Patterns, Risk Metrics, Recommendations
- Generated on-demand with date range selector
- Supabase Edge Function generates PDF via puppeteer or similar

### Dashboard Widgets (Phase 4 Scope)
- **AI Alerts Widget (DASH-04):** Recent behavioral warnings and suggested actions
- **Trade Statistics Widget (DASH-05):** Pair performance, best/worst times
- **Session Analytics Heatmap (DASH-06):** Heatmap of trading hours and performance by session
- **Actionable Insights Panel (DASH-07):** Top insights with suggested actions

### Database Schema Extensions
```sql
-- Analysis results table
CREATE TABLE trade_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  entry_timing_score INT,
  exit_quality_score INT,
  rr_efficiency DECIMAL,
  quality_grade TEXT CHECK (quality_grade IN ('A', 'B', 'C', 'D')),
  behavioral_patterns JSONB,
  risk_metrics JSONB,
  ai_insights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily analytics snapshot
CREATE TABLE daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_trades INT,
  win_rate DECIMAL,
  avg_rr DECIMAL,
  total_pnl DECIMAL,
  max_drawdown DECIMAL,
  lot_size_variance DECIMAL,
  behavioral_flags JSONB,
  top_insights JSONB,
  UNIQUE(user_id, date)
);
```

### API Endpoints
```typescript
// POST /api/ai/analyze - Trigger analysis for a trade or date range
// Request: { tradeId?: string, startDate?: string, endDate?: string }
// Response: { analysis: TradeAnalysis, insights: AIInsight[] }

// GET /api/analytics/dashboard - Get dashboard widget data
// Response: { aiAlerts: Alert[], tradeStats: PairStats[], heatmap: TimeHeatmap }

// POST /api/reports/generate - Generate PDF report
// Request: { startDate: string, endDate: string, includeSections: string[] }
// Response: { reportUrl: string }
```

### Integration Points
- **Phase 1:** Auth (RLS policies), Supabase setup, Storage
- **Phase 2:** Trader DNA (profile affects risk thresholds and analysis weights)
- **Phase 3:** Trade Journal (source of trade data)
- **Phase 5:** Risk Guardian (consumes behavioral alerts)
- **Phase 6:** Edge Score (consumes analysis for scoring)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `RESEURCES/ai-analysis.md` — AI Analysis page specs
- `RESEURCES/dashboard.md` — Dashboard widgets specs
- `RESEURCES/modules.md` — Module 2 AI Trade Intelligence overview
- `.planning/REQUIREMENTS.md` — Phase 4 requirements (INTL-04 to INTL-09, DASH-04 to DASH-07)
- `.planning/ROADMAP.md` — Phase 4 success criteria
- `.planning/phases/03-trade-journal/03-CONTEXT.md` — Trade data model (Phase 3)
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Phase 1 context (auth, DB schema)

### Tech Decisions from Prior Phases
- Next.js App Router with TypeScript
- Supabase for database, storage, and Edge Functions
- Tailwind CSS for styling
- Brand colors: Red #E53935, Green #2E7D32, Black #0B0B0B
- React Hook Form + Zod for forms (Phase 3)
- Papa Parse 5.x for CSV import (Phase 3)
- Supabase Storage with private bucket for screenshots (Phase 3)

</canonical_refs>

<specifics>
## Specific Ideas

### AI Analysis Flow
1. User views dashboard or opens AI Analysis page
2. System loads trades for selected date range
3. Analysis engine processes each trade:
   - Calculate entry/exit quality scores
   - Detect behavioral patterns across the period
   - Compute risk metrics
   - Aggregate performance analytics
4. AI insights generated from analysis results
5. Results stored in `trade_analyses` and `daily_analytics` tables
6. Dashboard widgets updated with new data

### Behavior Detection Rules
| Pattern | Detection Rule | Severity |
|---------|---------------|----------|
| Revenge Trading | 3+ trades after 2 consecutive losses in same session | High |
| Impulsive Trades | <5min hold during news events (high volatility) | Medium |
| Overconfidence | 5+ wins then increased lot size >30% | High |
| Fear Exit | Exit within 20% of TP while profitable | Medium |
| Overtrading | >8 trades in single session | High |
| FOMO Trades | High volatility entry without plan | Medium |

### Dashboard Widget Specifications
**AI Alerts Widget (DASH-04):**
- Max 5 alerts shown
- Alert card: severity icon, message, suggested action, dismiss button
- Severity levels: critical (red), warning (amber), info (blue)
- Click to expand with full context

**Trade Statistics Widget (DASH-05):**
- Top 5 pairs by win rate
- Best/worst trading times
- Sortable table with pair, win rate, avg RR, total trades
- Click pair for detailed breakdown

**Session Analytics Heatmap (DASH-06):**
- 7 rows (days) x 4 columns (sessions)
- Cell color: green (profitable) to red (loss) gradient
- Hover shows: session time, trade count, total P&L

**Actionable Insights Panel (DASH-07):**
- Top 3 insights by actionability score
- Each: insight text, confidence %, action button
- "View all" link to AI Analysis page

### PDF Report Structure
1. **Executive Summary** (1 page)
   - Overall score, key metrics, top strength/weakness
2. **Trade Quality Trends** (2-3 pages)
   - Entry/exit quality over time
   - RR efficiency chart
3. **Behavioral Patterns** (2-3 pages)
   - Pattern frequency chart
   - Specific instances with dates
4. **Risk Metrics** (1-2 pages)
   - Drawdown chart
   - Exposure profile
5. **Recommendations** (1 page)
   - Top 5 actionable insights
   - Next steps for improvement

</specifics>

<deferred>
## Deferred Ideas

- Full MT5 real-time sync (Phase 4 implements read-only connection stub, real-time in Phase 8)
- Push notifications for alerts (v2 feature)
- Coach console for reviewing trader journals (v2/Enterprise)
- TradingView chart embedding (v2/Advanced)

None — Phase 4 is self-contained for AI analysis delivery.

</deferred>

---

*Phase: 04-ai-trade-intelligence*
*Context gathered: 2026-05-08 via YOLO mode*