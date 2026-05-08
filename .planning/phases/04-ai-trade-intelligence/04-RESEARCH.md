# Phase 4: AI Trade Intelligence - Research

**Researched:** 2026-05-08
**Domain:** Trading Psychology Analysis / AI Pattern Detection / Risk Metrics
**Confidence:** HIGH

## Summary

Phase 4 builds the AI analysis engine that transforms raw trade data from Phase 3 into actionable behavioral insights. The core architecture uses a hybrid approach: deterministic rule-based heuristics for fast pattern detection (revenge trading, overtrading, lot size variance) paired with LLM-driven analysis for nuanced behavioral interpretation. This phase delivers four dashboard widgets (AI Alerts, Trade Statistics, Session Heatmap, Actionable Insights) plus exportable PDF coaching reports.

Key findings: The behavioral pattern detection taxonomy from existing trading journals (revenge trading, FOMO entries, overleverage, premature exits) maps well to the Phase 3 data model with minor extensions. PDF generation requires external services (Browserless.io or API2PDF) since Supabase Edge Functions cannot run headless browsers. Session-based heatmaps should use 7-day × 4-session grid with green-to-red gradient for P&L visualization.

**Primary recommendation:** Implement rule-based heuristics as the primary analysis layer with LLM enhancement for context-aware insights. This provides immediate actionable results while maintaining flexibility for deeper analysis.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **AI Analysis Architecture:** Rule-based heuristics + LLM-driven behavioral interpretation ensemble approach
- **Database Schema:** trade_analyses and daily_analytics tables as specified in CONTEXT.md
- **API Endpoints:** POST /api/ai/analyze, GET /api/analytics/dashboard, POST /api/reports/generate

### the agent's Discretion
- **PDF Generation:** Choose between Browserless.io, API2PDF, or alternative approaches
- **Heatmap Implementation:** Recharts custom grid vs. dedicated heatmap library
- **LLM Provider:** OpenAI vs. Anthropic Claude vs. other providers

### Deferred Ideas
- Full MT5 real-time sync (Phase 4 implements read-only connection stub)
- Push notifications (v2)
- Coach console (v2/Enterprise)
- TradingView embedding (v2/Advanced)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INTL-04 | Trade quality analysis (entry timing, exit quality, RR efficiency) | Rule-based scoring algorithms using trade metadata and price data |
| INTL-05 | Behavioral analysis (revenge trading, impulsive trades, overconfidence flags) | Pattern detection taxonomy from existing trading journals with measurable signatures |
| INTL-06 | Risk analysis (lot size variance, drawdown behavior, exposure monitoring) | Drawdown calculation algorithms (Max DD, recovery patterns), lot size variance formulas |
| INTL-07 | Performance analysis (best sessions, worst conditions, pair performance) | Session-based aggregation with statistical metrics per trading session |
| INTL-08 | AI insights generation with actionable recommendations | Confidence scoring + actionability tagging system |
| INTL-09 | Exportable analysis reports (PDF summary for coaching) | Supabase Edge Function + external PDF service integration |
| DASH-04 | AI alerts widget (recent warnings and suggested actions) | Alert severity levels and dismissal workflow |
| DASH-05 | Trade statistics widget (pair performance, best/worst times) | Performance aggregation by symbol and time |
| DASH-06 | Session analytics heatmap | 7-day × 4-session grid with P&L color coding |
| DASH-07 | Actionable insights panel | Top insights ranked by actionability score |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Trade quality scoring | API / Backend | — | Requires trade data aggregation, mathematical calculations |
| Behavioral pattern detection | API / Backend | — | Sequential trade analysis, rule evaluation |
| Risk metrics calculation | API / Backend | — | Time-series calculations on trade sequence |
| Performance analytics | API / Backend | Database | Aggregation queries, daily snapshots |
| AI insights generation | API / Backend | External LLM | LLM API calls for context-aware analysis |
| PDF report generation | External Service | API / Backend | Edge Function orchestrates, external service renders |
| Dashboard widget data | API / Backend | Frontend Server | REST API serves widget data |
| Widget UI rendering | Frontend Server | Browser | React components display data |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| date-fns | ^4.0 | Date manipulation for session detection | Lightweight, tree-shakeable, handles timezone conversion |
| recharts | ^2.15 | Heatmap and chart visualization | Used in existing dashboard implementations, well-maintained |
| @supabase/supabase-js | ^2.47 | Database and storage access | Already configured in Phase 1 |

### Analysis Engine
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| openai | ^4.57 | LLM integration for behavioral analysis | When generating context-aware insights requiring natural language |
| @anthropic-ai/sdk | ^0.39 | Alternative LLM provider | When preferring Claude's reasoning capabilities |
| browserless | ^2.0 | Headless browser for PDF generation | When generating PDF via external service |
| pdfkit | npm:pdf-parse | PDF content extraction | Only if reading uploaded PDFs (not for generation) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | ^3.24 | Response validation for LLM structured output | When enforcing schema on LLM responses |
| uuid | ^11.0 | ID generation for analysis records | When creating new analysis records |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| recharts | @nivo/heat | More heatmap-specific but larger bundle |
| Browserless.io | API2PDF, @pdfme/generator | Browserless offers more control but costs more |
| OpenAI | Anthropic Claude | Claude has better reasoning but different pricing |
| openai SDK | fetch + raw API | More control but less convenience |

**Installation:**
```bash
npm install date-fns recharts @supabase/supabase-js zod uuid openai
```

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ AI Alerts   │  │ Trade Stats │  │ Session     │  │ Insights    │    │
│  │ Widget      │  │ Widget      │  │ Heatmap     │  │ Panel       │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
└─────────┼─────────────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │                 │
          ▼                 ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        API LAYER (Next.js)                              │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  /api/analytics/dashboard  →  Returns widget data                │   │
│  │  /api/ai/analyze           →  Triggers analysis                  │   │
│  │  /api/reports/generate     →  Generates PDF                      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────┬───────────────────────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                    ANALYSIS ENGINE (Edge Functions)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐   │
│  │ Rule-Based      │  │ LLM-Driven      │  │ Metrics Calculator      │   │
│  │ Pattern Detector│  │ Insights Gen    │  │ (DD, RR, Variance)      │   │
│  └────────┬────────┘  └────────┬────────┘  └────────────┬────────────┘   │
│           │                    │                      │                 │
│           ▼                    ▼                      ▼                 │
│  ┌───────────────────────────────────────────────────────────────────┐   │
│  │              ANALYSIS ORCHESTRATOR                                │   │
│  │  1. Load trades from Phase 3                                      │   │
│  │  2. Run rule-based analysis                                       │   │
│  │  3. If LLM enabled → enhance with context                         │   │
│  │  4. Calculate metrics                                            │   │
│  │  5. Generate insights                                             │   │
│  │  6. Store results in trade_analyses / daily_analytics            │   │
│  └───────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER (Supabase)                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │ trades       │  │ trade_       │  │ daily_       │                   │
│  │ (Phase 3)    │  │ analyses     │  │ analytics    │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└───────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                                    │
│  ┌──────────────────────┐  ┌─────────────────────┐                      │
│  │ Browserless.io       │  │ LLM Provider        │                      │
│  │ (PDF Generation)     │  │ (OpenAI/Claude)    │                      │
│  └──────────────────────┘  └─────────────────────┘                      │
└───────────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   └── analyze/
│   │   │       └── route.ts       # POST /api/ai/analyze
│   │   ├── analytics/
│   │   │   └── dashboard/
│   │   │       └── route.ts       # GET /api/analytics/dashboard
│   │   └── reports/
│   │       └── generate/
│   │           └── route.ts      # POST /api/reports/generate
│   └── analysis/
│       └── page.tsx              # Full AI Analysis page
├── components/
│   ├── dashboard/
│   │   ├── AIAertsWidget.tsx      # DASH-04
│   │   ├── TradeStatsWidget.tsx   # DASH-05
│   │   ├── SessionHeatmap.tsx     # DASH-06
│   │   └── InsightsPanel.tsx       # DASH-07
│   └── analysis/
│       ├── TradeQualityCard.tsx   # INTL-04
│       ├── BehavioralPatterns.tsx # INTL-05
│       ├── RiskMetricsCard.tsx    # INTL-06
│       └── PerformanceSummary.tsx # INTL-07
├── lib/
│   ├── analysis/
│   │   ├── orchestrator.ts        # Analysis pipeline coordinator
│   │   ├── patterns/
│   │   │   ├── detector.ts        # Rule-based pattern detection
│   │   │   ├── revenge.ts        # Revenge trading detection
│   │   │   ├── overtrading.ts    # Overtrading detection
│   │   │   └── fomo.ts            # FOMO trade detection
│   │   ├── metrics/
│   │   │   ├── drawdown.ts       # Drawdown calculations
│   │   │   ├── risk.ts           # Risk metrics (variance, exposure)
│   │   │   └── quality.ts        # Entry/exit quality scoring
│   │   ├── insights/
│   │   │   ├── generator.ts      # AI insights generation
│   │   │   └── scorer.ts          # Confidence & actionability scoring
│   │   └── llm/
│   │       ├── client.ts         # LLM provider abstraction
│   │       └── prompts.ts        # System prompts for analysis
│   └── supabase/
│       ├── client.ts
│       └── analytics.ts          # Database queries for analytics
├── supabase/
│   └── functions/
│       └── generate-report/
│           └── index.ts         # Edge Function for PDF generation
└── types/
    └── analysis.ts              # TypeScript interfaces for analysis
```

### Pattern 1: Rule-Based Behavioral Pattern Detection

**What:** Deterministic detection of trading psychology patterns using measurable signatures on trade sequences.

**When to use:** When you need immediate, consistent results without LLM latency/cost, and patterns have clear measurable definitions.

**Example:**
```typescript
// Source: Adapted from ai-trading-journal-audit-tool behavioral classifier
// Pattern: Revenge Trading - Entry within 10 min after loss + position size increase ≥ 1.5x

interface PatternDetectionConfig {
  revengeTradingWindowMinutes: number;
  overleverageMultiplier: number;
  fomoCandleThresholdPercent: number;
  minTradesForPattern: number;
}

function detectRevengeTrading(
  trades: Trade[],
  config: PatternDetectionConfig
): PatternDetection[] {
  const results: PatternDetection[] = [];
  
  for (let i = 1; i < trades.length; i++) {
    const current = trades[i];
    const previous = trades[i - 1];
    
    // Check if previous trade was a loss
    if (previous.pnl >= 0) continue;
    
    // Check time window
    const minutesSinceLoss = differenceInMinutes(
      current.entryTime,
      previous.exitTime
    );
    
    if (minutesSinceLoss > config.revengeTradingWindowMinutes) continue;
    
    // Check position size increase
    const sizeIncrease = current.lotSize / previous.lotSize;
    
    if (sizeIncrease >= 1.5) {
      results.push({
        type: 'REVENGE_TRADING',
        severity: sizeIncrease > 2 ? 'HIGH' : 'MEDIUM',
        tradeId: current.id,
        evidence: [
          `Entry ${minutesSinceLoss} min after loss`,
          `Position size increased ${((sizeIncrease - 1) * 100).toFixed(0)}%`
        ],
        estimatedCost: Math.abs(previous.pnl)
      });
    }
  }
  
  return results;
}
```

### Pattern 2: Drawdown Calculation

**What:** Calculate maximum drawdown, average drawdown, and recovery patterns from trade equity curve.

**When to use:** When computing risk metrics for the risk analysis component (INTL-06).

**Example:**
```typescript
// Source: Derived from financial analysis libraries and trading metrics standards

interface DrawdownProfile {
  maxDrawdown: number;        // Percentage (e.g., -25.5)
  maxDrawdownDuration: number; // Days
  avgRecoveryDays: number;
  recoveryPattern: 'slow' | 'normal' | 'fast';
  drawdownEpisodes: DrawdownEpisode[];
}

interface DrawdownEpisode {
  startDate: Date;
  troughDate: Date;
  recoveryDate: Date | null;
  depth: number;              // Percentage
  duration: number;           // Days to trough
  recoveryDuration: number;  // Days to recover
}

function calculateDrawdown(trades: Trade[]): DrawdownProfile {
  // Build equity curve from trades
  let equity = 10000; // Starting balance
  const equityCurve: { date: Date; value: number }[] = [];
  
  for (const trade of trades.sort((a, b) => a.entryTime.getTime() - b.entryTime.getTime())) {
    equity += trade.pnl;
    equityCurve.push({ date: trade.entryTime, value: equity });
  }
  
  let peak = equityCurve[0].value;
  let maxDrawdown = 0;
  const episodes: DrawdownEpisode[] = [];
  
  let currentEpisode: Partial<DrawdownEpisode> | null = null;
  
  for (const point of equityCurve) {
    if (point.value > peak) {
      // New peak - end any ongoing drawdown
      if (currentEpisode && currentEpisode.troughDate) {
        currentEpisode.recoveryDate = point.date;
        currentEpisode.recoveryDuration = Math.floor(
          (point.date.getTime() - currentEpisode.troughDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        episodes.push(currentEpisode as DrawdownEpisode);
      }
      peak = point.value;
      currentEpisode = null;
    } else {
      // Below peak - potential drawdown
      const drawdown = (peak - point.value) / peak * 100;
      
      if (drawdown > Math.abs(maxDrawdown)) {
        maxDrawdown = -drawdown;
      }
      
      if (!currentEpisode || !currentEpisode.troughDate) {
        currentEpisode = {
          startDate: equityCurve.find(p => p.value === peak)?.date || point.date,
          troughDate: point.date,
          depth: drawdown,
          duration: Math.floor(
            (point.date.getTime() - (currentEpisode?.startDate || point.date).getTime()) / (1000 * 60 * 60 * 24)
          )
        };
      }
    }
  }
  
  // Calculate recovery pattern
  const recoveryDays = episodes.map(e => e.recoveryDuration || 0).filter(d => d > 0);
  const avgRecovery = recoveryDays.length > 0 
    ? recoveryDays.reduce((a, b) => a + b, 0) / recoveryDays.length 
    : 0;
    
  let recoveryPattern: 'slow' | 'normal' | 'fast';
  if (avgRecovery > 30) recoveryPattern = 'slow';
  else if (avgRecovery > 7) recoveryPattern = 'normal';
  else recoveryPattern = 'fast';
  
  return {
    maxDrawdown,
    maxDrawdownDuration: Math.max(...episodes.map(e => e.duration), 0),
    avgRecoveryDays: Math.round(avgRecovery),
    recoveryPattern,
    drawdownEpisodes: episodes
  };
}
```

### Pattern 3: LLM-Enhanced Insights

**What:** Use LLM to generate context-aware behavioral insights that rule-based systems cannot detect.

**When to use:** When patterns require contextual interpretation (e.g., "your exit quality drops during high volatility news events").

**Example:**
```typescript
// Source: Adapted from TradingAgents multi-agent pattern and LLM integration best practices

interface AIInsight {
  id: string;
  type: 'behavioral' | 'risk' | 'pattern' | 'action';
  title: string;
  description: string;
  confidence: number;        // 0-1
  actionability: 'quick_fix' | 'requires_attention' | 'strategic';
  suggestedAction: string;
  relatedTrades: string[];  // Trade IDs
}

const SYSTEM_PROMPT = `You are an expert trading coach analyzing trade data.
Analyze the provided trade history and behavioral patterns to generate actionable insights.
Focus on specific, measurable patterns that the trader can address.

Output format: JSON array of insights with the following structure:
{
  "insights": [
    {
      "type": "behavioral|risk|pattern|action",
      "title": "Brief insight title",
      "description": "Detailed explanation with specific evidence",
      "confidence": 0.0-1.0,
      "actionability": "quick_fix|requires_attention|strategic",
      "suggestedAction": "Specific action to take"
    }
  ]
}`;

async function generateInsights(
  trades: Trade[],
  patterns: DetectedPattern[],
  metrics: RiskMetrics
): Promise<AIInsight[]> {
  const context = buildAnalysisContext(trades, patterns, metrics);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: context }
    ],
    response_format: { type: 'json_object' },
    max_tokens: 2000
  });
  
  const result = JSON.parse(response.choices[0].message.content);
  return result.insights.map((i: any) => ({
    ...i,
    id: crypto.randomUUID(),
    relatedTrades: [] // Populated based on pattern evidence
  }));
}

function buildAnalysisContext(trades: Trade[], patterns: DetectedPattern[], metrics: RiskMetrics): string {
  // Build a concise context string for the LLM
  const recentTrades = trades.slice(-20).map(t => 
    `${t.symbol} ${t.result} ${t.pnl} RR${(t.pnl / (t.stopLoss * t.lotSize)).toFixed(1)}`
  ).join('\n');
  
  const patternSummary = patterns.map(p => 
    `- ${p.type}: ${p.evidence.join(', ')}`
  ).join('\n');
  
  return `
Recent Trades (last 20):
${recentTrades}

Detected Patterns:
${patternSummary}

Risk Metrics:
- Max Drawdown: ${metrics.drawdown.maxDrawdown}%
- Lot Size Variance: ${metrics.lotSizeVariance}%
- Win Rate: ${metrics.winRate}%

Generate 3-5 actionable insights based on this data.
`.trim();
}
```

### Anti-Patterns to Avoid

- **Single-source pattern claims:** Never flag a behavioral pattern based on a single trade. Require minimum sample size (3+ trades for pattern-level detection).
- **Ignoring session context:** Don't analyze trades without considering trading session (Asian, London, New York) - same behavior may have different implications in different sessions.
- **Hard-coding thresholds:** Make pattern detection thresholds configurable per user based on their Trader DNA profile (Phase 2).
- **Missing dollar attribution:** Always calculate estimated cost of behavioral errors to prioritize fixes (high-ROI first).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Session detection | Custom timezone logic | date-fns with built-in session detection | Handles DST automatically, tested edge cases |
| Drawdown calculation | Manual peak/trough algorithm | Standard financial formulas | Avoids edge case bugs in recovery tracking |
| PDF generation | Deno-based PDF creation | Browserless.io or API2PDF | Edge Functions cannot run headless browsers |
| LLM response parsing | Regex parsing | Zod schema validation | Ensures type safety, catches malformed responses |
| Heatmap visualization | Canvas drawing | recharts with custom cell rendering | Already in stack, responsive, accessible |

**Key insight:** Trading journal analysis is a well-established domain with proven patterns. Existing open-source tools (like ai-trading-journal-audit-tool) provide battle-tested detection algorithms that outperform custom implementations.

---

## Common Pitfalls

### Pitfall 1: Overfitting Pattern Detection
**What goes wrong:** AI flags patterns that are statistical noise, not real behavioral issues.
**Why it happens:** Without holdout validation, patterns that appear in small samples are treated as significant.
**How to avoid:** Require minimum 3 trades before flagging any pattern. Apply effect size threshold - insight must shift expectancy by ≥0.3R to be actionable.
**Warning signs:** "You lose 80% on Thursdays" with only 5 Thursday trades.

### Pitfall 2: Ignoring Data Quality
**What goes wrong:** Analysis produces garbage results from incomplete trade records.
**Why it happens:** Trades without exit times, missing lot sizes, or inconsistent session labels.
**How to avoid:** Validate data quality before analysis. Mark trades with incomplete data and exclude from pattern detection but include in aggregate stats.
**Warning signs:** High variance in "lotSizeVariance" metric indicates data quality issues.

### Pitfall 3: PDF Generation Timeout
**What goes wrong:** Edge Function times out when generating large PDF reports.
**Why it happens:** Loading months of trade data and rendering charts takes more than Edge Function timeout.
**How to avoid:** Implement pagination in PDF generation. Generate summary pages first, then append detailed sections. Use pre-computed daily analytics instead of raw trade data.
**Warning signs:** Report generation takes >30 seconds for 100+ trades.

### Pitfall 4: LLM Cost Explosion
**What goes wrong:** Analyzing every trade with LLM incurs high API costs.
**Why it happens:** Sending full trade context for each of hundreds of trades.
**How to avoid:** Use LLM only for summary insights, not per-trade analysis. Run rule-based heuristics first, then pass aggregated patterns to LLM. Cache LLM responses with TTL.
**Warning signs:** >$50/month on LLM API for single user.

---

## Code Examples

### Session Detection (for heatmap)
```typescript
// Source: Standard forex session times from market structure research

type TradingSession = 'asian' | 'london' | 'newyork' | 'sydney';

const SESSION_RANGES: Record<TradingSession, { start: number; end: number }> = {
  sydney: { start: 22, end: 7 },    // 22:00 - 07:00 UTC
  tokyo: { start: 0, end: 9 },       // 00:00 - 09:00 UTC
  london: { start: 8, end: 16 },    // 08:00 - 16:00 UTC
  newyork: { start: 13, end: 22 }    // 13:00 - 22:00 UTC
};

function detectSession(date: Date): TradingSession {
  const hour = date.getUTCHours();
  
  if (hour >= 22 || hour < 7) return 'sydney';
  if (hour >= 0 && hour < 9) return 'tokyo';
  if (hour >= 8 && hour < 16) return 'london';
  return 'newyork';
}
```

### Heatmap Data Aggregation
```typescript
// Source: TradingView session visualization patterns

interface HeatmapCell {
  dayOfWeek: number;    // 0-6 (Sunday-Saturday)
  session: TradingSession;
  totalTrades: number;
  totalPnl: number;
  winRate: number;
  avgRR: number;
}

function buildHeatmap(trades: Trade[]): HeatmapCell[] {
  const cells: Map<string, HeatmapCell> = new Map();
  
  for (const trade of trades) {
    const key = `${trade.entryTime.getDay()}-${detectSession(trade.entryTime)}`;
    
    const existing = cells.get(key) || {
      dayOfWeek: trade.entryTime.getDay(),
      session: detectSession(trade.entryTime),
      totalTrades: 0,
      totalPnl: 0,
      wins: 0,
      totalRR: 0
    };
    
    existing.totalTrades++;
    existing.totalPnl += trade.pnl;
    if (trade.result === 'win') existing.wins++;
    existing.totalRR += trade.pnl / (trade.stopLoss * trade.lotSize);
    
    cells.set(key, existing);
  }
  
  return Array.from(cells.values()).map(cell => ({
    ...cell,
    winRate: cell.totalTrades > 0 ? (cell.wins / cell.totalTrades) * 100 : 0,
    avgRR: cell.totalTrades > 0 ? cell.totalRR / cell.totalTrades : 0
  }));
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual trade review | AI pattern detection | 2023+ (Lune, TradingRehab) | Scales to hundreds of trades, detects invisible patterns |
| Generic win rate metrics | Session/contextual analysis | 2024+ (TradeTrakR) | Reveals time-specific weaknesses |
| Rule-only analysis | Hybrid heuristics + LLM | 2025+ (TradingAgents) | Combines speed with context understanding |
| Server-side PDF generation | External browser service | 2022+ (Supabase docs) | Edge Functions cannot run headless browsers |

**Deprecated/outdated:**
- **Manual journaling review:** Replaced by automated pattern detection — same blind spots
- **Single metric focus (win rate only):** Replaced by multi-dimensional analysis — miss behavioral drivers
- **Local-only data processing:** Replaced by cloud analysis — cannot aggregate across sessions/devices

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Phase 3 trades table includes entry_time and exit_time as TIMESTAMPTZ | Integration | Analysis calculations need date handling - verify schema |
| A2 | Emotion tracking in Phase 3 includes confidence_score and stress_score as INT 1-5 | Behavioral Analysis | Pattern detection relies on emotional state data |
| A3 | User's Trader DNA profile affects pattern detection thresholds | Configuration | Need to verify Phase 2 profile schema |
| A4 | Browserless.io or API2PDF available for PDF generation | PDF Generation | May need fallback if service unavailable |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

---

## Open Questions

1. **Which LLM provider should be primary?**
   - What we know: OpenAI and Anthropic both offer strong reasoning capabilities
   - What's unclear: Pricing difference at scale, response latency for real-time insights
   - Recommendation: Start with OpenAI GPT-4o as primary (widely used in trading apps), add Anthropic as option

2. **How granular should the session heatmap be?**
   - What we know: 4 sessions (Asian, London, New York, Sydney) are standard
   - What's unclear: Should heatmap include hour-level granularity within sessions?
   - Recommendation: Start with session-level (4 columns × 7 rows), expand if needed

3. **What triggers LLM analysis vs rule-only?**
   - What we know: Full analysis on dashboard load, detailed on-demand
   - What's unclear: Should every user get LLM analysis or only premium tiers?
   - Recommendation: Rule-based always, LLM enhancement optional based on user tier

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js runtime | ✓ | 20.x | — |
| Supabase | Database, Storage | ✓ | — | — |
| date-fns | Session detection | ✓ | 4.x via npm | Native Date with timezone math |
| recharts | Heatmap visualization | ✓ | 2.x via npm | Custom CSS grid |
| OpenAI API | LLM insights | Configured | GPT-4o | Rule-only analysis |
| Browserless.io | PDF generation | External | — | API2PDF as alternative |

**Missing dependencies with no fallback:**
- None identified

**Missing dependencies with fallback:**
- PDF generation service (Browserless.io) — can use rule-based summary only without PDF

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 2.x |
| Config file | `vitest.config.ts` |
| Quick run command | `npm run test -- --run` |
| Full suite command | `npm run test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INTL-04 | Trade quality scoring calculates correctly | unit | `npm run test -- --run --grep "trade quality"` | ❌ Wave 0 |
| INTL-05 | Revenge trading detection identifies pattern | unit | `npm run test -- --run --grep "revenge"` | ❌ Wave 0 |
| INTL-06 | Drawdown calculation matches expected values | unit | `npm run test -- --run --grep "drawdown"` | ❌ Wave 0 |
| INTL-07 | Session aggregation produces correct stats | unit | `npm run test -- --run --grep "session"` | ❌ Wave 0 |
| INTL-08 | Insight generation produces valid output | integration | `npm run test -- --run --grep "insights"` | ❌ Wave 0 |
| INTL-09 | PDF generation returns valid file | integration | Manual test with Browserless | ❌ Wave 0 |
| DASH-04 | Alert widget renders with correct data | component | `npm run test -- --run --grep "alerts"` | ❌ Wave 0 |
| DASH-05 | Trade stats widget displays pair data | component | `npm run test -- --run --grep "stats"` | ❌ Wave 0 |
| DASH-06 | Heatmap renders with color gradient | component | `npm run test -- --run --grep "heatmap"` | ❌ Wave 0 |
| DASH-07 | Insights panel shows ranked insights | component | `npm run test -- --run --grep "insights panel"` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run test -- --run --grep "<task-name>"` (target <30s)
- **Per wave merge:** Full test suite
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/lib/analysis/patterns.test.ts` — covers INTL-05 (behavioral patterns)
- [ ] `tests/lib/analysis/metrics.test.ts` — covers INTL-04, INTL-06 (quality, risk)
- [ ] `tests/lib/analysis/insights.test.ts` — covers INTL-08 (insights generation)
- [ ] `tests/components/dashboard/*.test.tsx` — covers DASH-04 through DASH-07
- [ ] `vitest.config.ts` — Test configuration

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Supabase Auth (from Phase 1) |
| V3 Session Management | Yes | Supabase Auth tokens |
| V4 Access Control | Yes | RLS policies on trade_analyses, daily_analytics |
| V5 Input Validation | Yes | Zod schemas for API payloads |
| V6 Cryptography | No | No sensitive crypto operations |

### Known Threat Patterns for Trading Analytics

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| SQL injection via trade filters | Tampering | Parameterized queries via Supabase client |
| LLM prompt injection | Tampering | Sanitize trade data before LLM context, system prompt isolation |
| Data exposure via API | Information Disclosure | RLS policies, validate user owns requested data |
| PDF injection (malicious content) | Tampering | Use trusted PDF service, validate output |

---

## Sources

### Primary (HIGH confidence)
- ai-trading-journal-audit-tool (GitHub) - Behavioral classifier patterns with measurable signatures
- Supabase docs - Edge Functions PDF generation limitations and workarounds
- TradingView session indicators - Session time standards and visualization patterns

### Secondary (MEDIUM confidence)
- TradingRehab, Lune, TradeTrakR - AI trading journal feature patterns
- Wikipedia/Scientific sources on drawdown calculation formulas
- OpenAI/Anthropic API documentation for structured output patterns

### Tertiary (LOW confidence)
- Various GitHub trading dashboards - Heatmap implementation approaches (need verification)

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH - Libraries verified via npm, patterns from established trading journals
- Architecture: HIGH - Schema defined in CONTEXT.md, validated against Phase 3 data model
- Pitfalls: MEDIUM - Based on industry patterns, some specific to this implementation

**Research date:** 2026-05-08
**Valid until:** 2026-06-07 (30 days - LLM API patterns stabilize slowly, PDF services evolve)

---