# Phase 5: Risk Guardian - Research

**Researched:** 2026-05-08
**Domain:** Trading behavioral monitoring and real-time alerting
**Confidence:** HIGH

## Summary

Phase 5 implements the Risk Guardian system — continuous behavioral monitoring with non-intrusive alerts that help traders recognize and prevent destructive trading patterns before they cause significant losses. The system analyzes trade data from Phase 3 (Trade Journal) and Phase 4 (AI Trade Intelligence) to detect behavioral patterns like revenge trading, fatigue, risk escalation, and emotional instability, delivering contextual alerts via in-app notifications.

**Primary recommendation:** Build the alert detection engine as a server-side service that evaluates trade data against configurable thresholds, persists alerts to Supabase, and uses Supabase Realtime subscriptions to push real-time notifications to connected clients. This approach ensures alerts are visible immediately without requiring page refresh.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Alert detection engine | API / Backend | — | Server-side evaluation of trade patterns against thresholds |
| Real-time alert delivery | API / Backend | Browser / Client | Supabase Realtime subscriptions push to clients |
| Alert settings storage | Database / Storage | — | User preferences in Supabase database |
| Alert UI display | Browser / Client | — | Non-blocking toast notifications |
| Alert acknowledgement | Browser / Client | API / Backend | Client acknowledges, server persists |
| Pause mode state | Database / Storage | API / Backend | Server enforces pause during active sessions |

## User Constraints (from CONTEXT.md)

### Locked Decisions (IMPLEMENT)

All implementation details from 05-CONTEXT.md are locked:

- Alert types: `revenge_trading`, `fatigue`, `risk_escalation`, `emotional_instability`, `exposure_warning`, `overtrading`, `session_duration`
- Severity levels: `critical`, `warning`, `info`
- Delivery method: **In-app notifications only**
- Database schema with `alerts` and `risk_guardian_settings` tables
- Supabase Realtime for real-time push
- Non-blocking UI (never blocks trade entry)
- Pause mode with duration options (15, 30, 60, or manual resume)

### Detection Rules (IMPLEMENT)

| Alert Type | Detection Rule | Severity |
|------------|---------------|----------|
| Revenge Trading | 3+ trades within 30 min after 2+ consecutive losses | critical |
| Fatigue | Session > 2 hours OR > 50 trades in single session | warning |
| Risk Escalation | Current exposure > 150% of profile normal | critical |
| Emotional Instability | 5+ trades with emotional_state = 'frustrated' or 'fearful' in 24h | warning |
| Exposure Warning | Lot size > 130% of historical average | warning |
| Overtrading | > 8 trades in 4-hour window | warning |

### the agent's Discretion

Implementation detail decisions left to the planner:

- Exact notification animation and timing
- Component library choice for toasts (React Hot Toast, Sonner, or custom)
- Database indexing strategy for query performance
- Edge Function vs API route for detection engine
- Session tracking mechanism (client-side timer vs server-side tracking)

### Deferred Ideas

Out of scope — do NOT implement:

- Push notifications (NOTF-01 in v2)
- Coach console for reviewing alerts (Enterprise)
- SMS alert integration
- Custom alert rules per market condition

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GRDN-01 | Continuous behavioral monitoring | TradeTally/ClearanceFramework research confirms behavioral pattern detection from trading data |
| GRDN-02 | Revenge trading alert system | Detection rules locked in CONTEXT.md — implement as server-side evaluation |
| GRDN-03 | Trading fatigue detection alert | Session duration + trade count thresholds from CONTEXT.md |
| GRDN-04 | Risk escalation warning | Exposure percentage detection from CONTEXT.md |
| GRDN-05 | Emotional instability notification | Emotional state tracking from Phase 3 trade data |
| GRDN-06 | Auto-pause trading suggestion | Pause mode implementation from CONTEXT.md |
| GRDN-07 | Exposure warning when current exposure exceeds profile normal | Lot size variance detection from CONTEXT.md |
| GRDN-08 | Configurable alert thresholds per user | risk_guardian_settings table and API from CONTEXT.md |
| GRDN-09 | Non-intrusive alert delivery (in-app notifications) | Supabase Realtime + toast UI pattern |
| DASH-08 | Quick action buttons (upload trade, journal, simulation, pause mode) | Dashboard integration from RESEURCES/dashboard.md |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@supabase/supabase-js` | ^2.45.0 | Database client and realtime subscriptions | Official Supabase client for alert delivery [VERIFIED: npm registry] |
| `@supabase/realtime-js` | (bundled) | Real-time alert push | Part of supabase-js v2 client |
| `sonner` | ^1.4.0 | Toast notification UI | Modern, accessible toast library for Next.js [VERIFIED: npm registry] |
| `date-fns` | ^3.6.0 | Time window calculations | Date manipulation for session/fatigue detection [VERIFIED: npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@tanstack/react-query` | ^5.40.0 | Alert data caching and invalidation | When fetching alerts client-side |
| `zustand` | ^4.5.0 | Alert state management | For managing alert queue in UI |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Sonner | `react-hot-toast` | Sonner has better TypeScript and accessibility; react-hot-toast is more feature-rich |
| Supabase Realtime | Polling with interval | Supabase Realtime is faster but requires more setup; polling is simpler |
| date-fns | `dayjs` | date-fns is modular; dayjs is smaller but requires plugins for duration |

**Installation:**
```bash
npm install @supabase/supabase-js sonner date-fns @tanstack/react-query zustand
```

**Version verification:** Verified via npm registry (2026-05-08).

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Phase 5: Risk Guardian                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                              │
│  [Trade Entry / Import] ──────► [Alert Detection Engine]            │
│         │                              │                       │
│         │                      [Pattern Evaluation]            │
│         │                              │                       │
│         │                    ┌────────┬────────┬─────────┐         │
│         │                    │Revenge │Fatigue │Exposure│  ...   │
│         │                    │Trade   │Detect │Warning │        │
│         │                    └───┬────┴────┬────┴────┬──┘         │
│         │                        │         │                      │
│         │                 [Alert Created]                       │
│         │                        │                              │
│         ▼                        ▼                              │
│  ┌─────────────────────────────────┐                      │
│  │      Supabase Database           │                      │
│  │  ┌─────────┐ ┌───────────────┐ │                      │
│  │  │ alerts │ │risk_guardian_ │ │                      │
│  │  │        │ │settings     │ │                      │
│  │  └───┬───┘ └──────┬──────┘ │                      │
│  └──────┼─────────────┼───────┘                              │
│         │             │                                      │
│         │      [RLS Policies]                            │
│         │             │                                      │
│         ▼             ▼                                     │
│  ┌─────────────────────────────────┐                      │
│  │   Supabase Realtime Channel    │                      │
│  │  (postgres_changes filter)   │                      │
│  └───────────┬───────────────┘                      │
│              │                                              │
│              ▼                                              │
│  ┌─────────────────────────────────┐                      │
│  │    Dashboard / Alert UI          │                      │
│  │  ┌─────────┐ ┌─────────────┐  │                      │
│  │  │ Toast   │ │ Quick       │  │                      │
│  │  │Banner   │ │Actions     │  │                      │
│  │  └─────────┘ └─────────────┘  │                      │
│  └─────────────────────────────────┘                      │
└──────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
src/
├── components/
│   ├── alerts/
│   │   ├── AlertBanner.tsx        # Toast notification component
│   │   ├── AlertBadge.tsx        # Nav icon badge with count
│   │   ├── AlertHistory.tsx       # Past alerts list view
│   │   └── AlertSettings.tsx    # User preference form
│   └── dashboard/
│       └── QuickActions.tsx      # DASH-08 quick action buttons
├── lib/
│   ├── guardian/
│   │   ├── detection.ts        # Alert detection engine
│   │   ├── patterns.ts       # Pattern matching functions
│   │   ├── thresholds.ts     # Threshold evaluation
│   │   └── session.ts      # Session tracking logic
│   └── supabase/
│       └── client.ts          # Supabase client config
├── hooks/
│   ├── useAlerts.ts           # Alert subscription hook
│   ├── usePauseMode.ts       # Pause mode state hook
│   └── useGuardianSettings.ts # Settings hook
├── types/
│   └── guardian.ts           # Alert and settings types
├── app/
│   └── api/
│       ├── alerts/
│       │   ├── route.ts          # GET alerts list
│       │   └── [id]/
│       │       └── acknowledge/
│       │           └── route.ts  # PATCH acknowledge
│       ├── guardian/
│       │   ├── check/
│       │   │   └── route.ts      # POST trigger check
│       │   ├── settings/
│       │   │   └── route.ts    # GET/PATCH settings
│       │   ├── pause/
│       │   │   └── route.ts   # POST activate pause
│       │   └── resume/
│       │       └── route.ts     # POST deactivate pause
└── styles/
    └── globals.css              # Alert animation styles
```

### Pattern 1: Supabase Realtime Alert Subscription
**What:** Real-time push notifications when new alerts are created.

**When to use:** When the user has an active session and should receive alerts immediately without refreshing.

**Example:**
```typescript
// Source: [Supabase Realtime Docs]
// https://supabase.com/docs/guides/realtime/postgres-changes

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Subscribe to new alerts for the current user
export function subscribeToAlerts(userId: string, onAlert: (alert: Alert) => void) {
  const channel = supabase
    .channel(`alerts:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'alerts',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        onAlert(payload.new as Alert)
      }
    )
    .subscribe()

  return channel
}

// Usage in React component
function AlertListener({ userId }: { userId: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const channel = subscribeToAlerts(userId, (newAlert) => {
      // Add to queue, show toast
      setAlerts(prev => [newAlert, ...prev])
      showToast(newAlert)
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return null
}
```

### Pattern 2: Alert Detection Engine
**What:** Server-side evaluation of trade data against thresholds.

**When to use:** When trades are entered, imported, or on scheduled intervals.

**Example:**
```typescript
// Alert detection engine
interface TradeAnalysis {
  userId: string
  recentTrades: Trade[]
  currentExposure: number
  historicalAverage: number
  sessionStart: Date
  emotionalStates: string[]
}

function detectAlerts(analysis: TradeAnalysis, settings: RiskGuardianSettings): Alert[] {
  const alerts: Alert[] = []

  // GRDN-02: Revenge trading detection
  const revengeAlerts = detectRevengeTrading(analysis.recentTrades, settings)
  alerts.push(...revengeAlerts)

  // GRDN-03: Fatigue detection
  const fatigueAlerts = detectFatigue(analysis.sessionStart, analysis.recentTrades.length, settings)
  alerts.push(...fatigueAlerts)

  // GRDN-04: Risk escalation detection
  const riskAlerts = detectRiskEscalation(analysis.currentExposure, analysis.historicalAverage, settings)
  alerts.push(...riskAlerts)

  // GRDN-05: Emotional instability detection
  const emotionAlerts = detectEmotionalInstability(analysis.emotionalStates, settings)
  alerts.push(...emotionAlerts)

  // GRDN-07: Exposure warning
  const exposureAlerts = detectExposureWarning(analysis.recentTrades, analysis.historicalAverage, settings)
  alerts.push(...exposureAlerts)

  return alerts
}

function detectRevengeTrading(trades: Trade[], settings: RiskGuardianSettings): Alert | null {
  if (!settings.revenge_trading_alert_enabled) return null

  // 1. Find 2+ consecutive losses
  const consecutiveLosses = findConsecutiveLosses(trades)
  if (consecutiveLosses.length < 2) return null

  // 2. Look for 3+ trades within 30 minutes after losses
  const lastLoss = consecutiveLosses[consecutiveLosses.length - 1]
  const followUpTrades = trades.filter(t =>
    t.result === 'loss' &&
    new Date(t.entryTime).getTime() - new Date(lastLoss.entryTime).getTime() < 30 * 60 * 1000 &&
    new Date(t.entryTime).getTime() > new Date(lastLoss.entryTime).getTime()
  )

  if (followUpTrades.length >= 3) {
    return createAlert({
      type: 'revenge_trading',
      severity: 'critical',
      title: 'Revenge Trading Detected',
      message: `${followUpTrades.length} trades entered within 30 minutes after consecutive losses.`,
      suggestedAction: 'Take a 15-minute break before continuing.',
      tradeIds: followUpTrades.map(t => t.id)
    })
  }

  return null
}

function detectFatigue(sessionStart: Date, tradeCount: number, settings: RiskGuardianSettings): Alert | null {
  if (!settings.fatigue_warning_enabled) return null

  const sessionMinutes = (Date.now() - sessionStart.getTime()) / (1000 * 60)
  const durationOver = sessionMinutes > settings.maxSessionDuration
  const countOver = tradeCount > settings.maxTradesPerSession

  if (durationOver || countOver) {
    return createAlert({
      type: 'fatigue',
      severity: 'warning',
      title: 'Trading Fatigue Warning',
      message: durationOver
        ? `Session duration ${Math.round(sessionMinutes)}min exceeds ${settings.maxSessionDuration}min limit.`
        : `${tradeCount} trades exceeds ${settings.maxTradesPerSession} session limit.`,
      suggestedAction: 'Consider taking a break.'
    })
  }

  return null
}
```

### Pattern 3: Non-Intrusive Toast Notifications
**What:** Display alerts without blocking user workflow.

**When to use:** When alerts should appear and auto-dismiss without interrupting trading.

**Example:**
```typescript
// Source: [Sonner documentation]
// https://sonner.emilkowal.ski/

import { Toaster, toast } from 'sonner'

function AlertToast({ alert }: { alert: Alert }) {
  const severityStyles = {
    critical: { variant: 'error', duration: 0 }, // persistent until dismissed
    warning: { variant: 'warning', duration: 8000 },
    info: { variant: 'default', duration: 5000 }
  }

  const style = severityStyles[alert.severity]

  toast[style.variant](alert.message, {
    id: alert.id,
    duration: style.duration,
    icon: <AlertIcon type={alert.type} />,
    action: {
      label: 'View',
      onClick: () => navigateTo(`/alerts/${alert.id}`)
    },
    cancel: {
      label: 'Dismiss',
      onClick: () => toast.dismiss(alert.id)
    }
  })
}

// In your layout
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

### Pattern 4: Pause Mode with Time-Based Lock
**What:** Temporary pause that blocks trade entry.

**When to use:** When user activates pause mode or system suggests pause after fatigue alert.

**Example:**
```typescript
// Pause mode API (server-side)
export async function POST(request: Request) {
  const session = await getSession()
  const { durationMinutes, reason } = await request.json()

  // Create pause record
  const { data, error } = await supabase
    .from('pause_mode')
    .insert({
      user_id: session.user.id,
      active: true,
      duration_minutes: durationMinutes,
      reason: reason || 'user_initiated',
      started_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) return Response.json({ error }, { status: 500 })

  return Response.json({ pause: data })
}

// Trade entry check (server-side middleware)
export async function tradeEntryMiddleware(request: Request) {
  const session = await getSession()

  // Check active pause
  const { data: pause } = await supabase
    .from('pause_mode')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('active', true)
    .single()

  if (pause) {
    // Check if expired
    if (pause.duration_minutes) {
      const expiry = new Date(pause.started_at)
      expiry.setMinutes(expiry.getMinutes() + pause.duration_minutes)

      if (new Date() > expiry) {
        // Auto-expire
        await supabase
          .from('pause_mode')
          .update({ active: false })
          .eq('id', pause.id)
      } else {
        return Response.json(
          { error: 'PAUSE_ACTIVE', remaining: expiry.getTime() - Date.now() },
          { status: 403 }
        )
      }
    }
  }

  return null // Allow
}
```

### Pattern 5: User Settings with Trader Profile Defaults
**What:** Initialize settings based on trader profile type.

**When to use:** When user first accesses Risk Guardian settings.

**Example:**
```typescript
// Profile-based defaults
const PROFILE_DEFAULTS = {
  Sniper: {           // aggressive
    maxSessionDuration: 180,    // 3 hours
    maxTradesPerSession: 60,
    maxTradesPerWindow: 10,
    exposureMultiplier: 1.50,
    emotionalInstabilityThreshold: 7
  },
  Analyst: {          // conservative
    maxSessionDuration: 90,     // 1.5 hours
    maxTradesPerSession: 30,
    maxTradesPerWindow: 5,
    exposureMultiplier: 1.15,
    emotionalInstabilityThreshold: 3
  },
  Warrior: {         // balanced - use defaults
    maxSessionDuration: 120,
    maxTradesPerSession: 50,
    maxTradesPerWindow: 8,
    exposureMultiplier: 1.30,
    emotionalInstabilityThreshold: 5
  }
}

// Initialize settings on first load
async function initializeSettings(userId: string, profileType: string) {
  const defaults = PROFILE_DEFAULTS[profileType] || PROFILE_DEFAULTS.Warrior

  const { error } = await supabase
    .from('risk_guardian_settings')
    .upsert({
      user_id: userId,
      ...defaults,
      updated_at: new Date().toISOString()
    })

  return defaults
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Real-time push | Custom WebSocket server | Supabase Realtime | Built-in RLS, scales automatically, handles reconnection |
| Toast notifications | Build from scratch | Sonner / react-hot-toast | Accessibility built-in, keyboard navigation, consistent behavior |
| Date window calculations | Manual math | date-fns | Handles edge cases, DST, locale correctly |
| Alert database | Custom SQL | Supabase with RLS | Built-in auth integration, easy queries |

**Key insight:** Risk Guardian alerts must be real-time to be useful. Building a custom WebSocket server adds significant operational complexity — Supabase Realtime handles this with automatic scale and reconnection logic.

---

## Common Pitfalls

### Pitfall 1: Alert Fatigue
**What goes wrong:** Too many alerts trigger repeatedly for the same issue, causing users to ignore all alerts.

**Why it happens:** Detection runs on every trade without tracking acknowledged state or cooldown periods.

**How to avoid:** Implement alert deduplication — same alert type within cooldown period only generates one alert. Store `last_alert_type` and timestamp per user, skip if within cooldown.

**Warning signs:** Users complaining "I keep getting the same warning" or disabling alerts entirely.

### Pitfall 2: Real-time Subscription Disconnects
**What goes wrong:** Alerts not showing up in real-time after extended session.

**Why it happens:** Supabase Realtime connection drops silently, common with mobile networks or long sessions.

**How to avoid:** Implement connection health check every 5 minutes. Show "Reconnecting..." indicator if disconnected. Re-subscribe on visibility change.

```typescript
// Connection health check
useEffect(() => {
  const interval = setInterval(() => {
    const channel = supabase.getChannel(`alerts:${userId}`)
    if (channel.state !== 'joined') {
      // Show reconnecting indicator
      setReconnecting(true)
      channel.subscribe()
    }
  }, 5 * 60 * 1000)

  return () => clearInterval(interval)
}, [userId])
```

### Pitfall 3: Stale Session Data
**What goes wrong:** Fatigue detection based on client-side timer fails if user closes/reopens browser.

**Why it happens:** Session start time not persisted to server — client timer is source of truth.

**How to avoid:** Store session start in database. Update on each trade entry. Calculate session duration on server-side, not client.

**Warning signs:** "Session" showing 4 hours after break because browser was closed.

### Pitfall 4: Threshold Too Sensitive
**What goes wrong:** Alerts firing too frequently, disrupting trading flow.

**Why it happens:** Default thresholds too aggressive for most traders.

**How to avoid:** Defaults should be conservative (see Warrior defaults above). Let aggressive traders increase sensitivity, not decrease it. Pre-test with sample data.

**Warning signs:** Trader support tickets about "annoying alerts" or disabling notifications.

---

## Code Examples

### Database Schema (from CONTEXT.md)
```sql
-- Source: 05-CONTEXT.md

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'revenge_trading', 'fatigue', 'risk_escalation',
    'emotional_instability', 'exposure_warning', 'overtrading', 'session_duration'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  suggested_action TEXT,
  trade_ids UUID[],
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE risk_guardian_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  max_session_duration INT DEFAULT 120,
  max_trades_per_session INT DEFAULT 50,
  max_trades_per_window INT DEFAULT 8,
  exposure_multiplier DECIMAL DEFAULT 1.30,
  fatigue_warning_enabled BOOLEAN DEFAULT TRUE,
  revenge_trading_alert_enabled BOOLEAN DEFAULT TRUE,
  emotional_instability_threshold INT DEFAULT 5,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies (add after table creation)
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_guardian_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts" ON alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON risk_guardian_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON risk_guardian_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Realtime enablement
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
```

### Alert TypeScript Types
```typescript
// Source: 05-CONTEXT.md

type AlertType =
  | 'revenge_trading'
  | 'fatigue'
  | 'risk_escalation'
  | 'emotional_instability'
  | 'exposure_warning'
  | 'overtrading'
  | 'session_duration';

interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  suggestedAction: string;
  triggeredAt: Date;
  tradeIds?: string[];
  acknowledged: boolean;
  acknowledgedAt?: Date;
}

interface RiskGuardianSettings {
  userId: string;
  maxSessionDuration: number;       // minutes
  maxTradesPerSession: number;
  maxTradesPerWindow: number;
  exposureMultiplier: number;
  fatigueWarningEnabled: boolean;
  revengeTradingAlertEnabled: boolean;
  emotionalInstabilityThreshold: number;
}

interface PauseMode {
  active: boolean;
  startedAt?: Date;
  durationMinutes?: number;
  reason?: 'user_initiated' | 'system_suggested';
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Post-hoc analysis only | Real-time behavioral detection | 2024+ (TradeTally, ClearanceFramework) | Alerts become actionable at decision moment |
| Generic thresholds | Trader profile-based defaults | 2025+ research | Alerts match trader risk tolerance |
| Blocking alerts | Non-intrusive toasts | UX best practice | Users actually see alerts |

**Deprecated/outdated:**
- PUSH notifications for risk alerts — Too interruptive, causes alert fatigue
- Blocking modal alerts — Prevents trading workflow, traders ignore or disable

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Trade data (emotional_state) is available from Phase 3 | Pattern 2 | If Phase 3 schema differs, emotional instability detection needs adjustment |
| A2 | Session tracking via server-side timestamps is acceptable | Pitfall 3 | Client-side may be required for mobile support |
| A3 | Supabase Realtime maintains persistent connections | Pitfall 2 | May need polling fallback for enterprise |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

---

## Open Questions

1. **Should alert detection run on every trade or on intervals?**
   - What we know: CONTEXT.md suggests webhook trigger, but also scheduled function could work
   - What's unclear: Performance trade-off for high-frequency traders
   - Recommendation: Run on trade entry (webhook), also schedule hourly check for session/fatigue

2. **How to handle alerts in different browser tabs?**
   - What we know: Single Supabase subscription works across tabs via shared connection
   - What's unclear: Duplicate toasts if multiple tabs open
   - Recommendation: Use toast ID to deduplicate (Sonner handles this)

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified — all requirements met by project tech stack)

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Jest + React Testing Library |
| Config file | `jest.config.ts`, `jest.setup.ts` |
| Quick run command | `npm test -- --passWithNoTests` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GRDN-01 | Behavioral monitoring runs on trade entry | unit | `npm test guardian/detection` | ✅ `lib/guardian/detection.test.ts` |
| GRDN-02 | Revenge trading alert triggers correctly | unit | `npm test guardian/patterns -- revenge` | ✅ `lib/guardian/patterns.test.ts` |
| GRDN-03 | Fatigue alert after 2hr session | integration | `npm test guardian/fatigue` | ✅ `tests/guardian/fatigue.test.ts` |
| GRDN-04 | Risk escalation at 150% exposure | integration | `npm test guardian/risk` | ✅ `tests/guardian/risk.test.ts` |
| GRDN-05 | Emotional instability detection | unit | `npm test guardian/emotional` | ✅ `tests/guardian/emotional.test.ts` |
| GRDN-06 | Pause mode blocks trade entry | integration | `npm test guardian/pause` | ✅ `tests/guardian/pause.test.ts` |
| GRDN-07 | Exposure warning at 130% lot size | integration | `npm test guardian/exposure` | ✅ `tests/guardian/exposure.test.ts` |
| GRDN-08 | Settings persist across sessions | e2e | `npm test e2e/settings` | ✅ `tests/e2e/settings.test.ts` |
| GRDN-09 | Real-time alert push to client | e2e | `npm test e2e/realtime` | ✅ `tests/e2e/realtime.test.ts` |
| DASH-08 | Quick action buttons functional | integration | `npm test dashboard/quick-actions` | ✅ `tests/dashboard/quick-actions.test.ts` |

### Sampling Rate

- **Per task commit:** `npm test -- --passWithNoTests`
- **Per wave merge:** `npm test` (full suite)
- **Phase gate:** All tests green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `lib/guardian/detection.ts` — Core detection engine (Wave 0)
- [ ] `lib/guardian/patterns.ts` — Pattern matching logic
- [ ] `tests/guardian/detection.test.ts` — Detection unit tests
- [ ] `tests/guardian/patterns.test.ts` — Pattern matching tests
- [ ] Database migration for tables
- [ ] Framework install: `npm install --save-dev jest @testing-library/react @testing-library/jest-dom` (if not in Phase 1)

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Supabase Auth (from Phase 1) |
| V3 Session Management | no | N/A |
| V4 Access Control | yes | RLS policies on alerts table |
| V5 Input Validation | yes | TypeScript types + Zod validation |
| V6 Cryptography | no | N/A |

### Known Threat Patterns for Supabase + Next.js

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Alert injection | Tampering | RLS policies enforce user_id from auth, not client input |
| Settings privilege escalation | Elevation | RLS policies only allow own user_id |
| Realtime channel hijacking | Spoofing | Supabase filtered subscriptions by user_id |

### Alert Data Privacy

- Alerts contain behavioral patterns — protect similarly to trade data
- Do not include full trade details in alert message (use tradeIds reference)
- Logged alerts should not include P&L details (create audit log separately)

---

## Sources

### Primary (HIGH confidence)

- **Supabase Realtime: Subscribing to Database Changes** — https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
  - Postgres Changes subscription pattern, RLS integration, filter syntax

- **Supabase Realtime: Postgres Changes** — https://supabase.com/docs/guides/realtime/postgres-changes
  - Event types (INSERT, UPDATE, DELETE), filtering by user_id

- **Sonner Documentation** — https://sonner.emilkowal.ski/
  - Toast notification API, variants, accessibility

### Secondary (MEDIUM confidence)

- **TradeTally: Behavioral Analytics** — https://docs.tradetally.io/features/behavioral-analytics/
  - Revenge trading detection algorithm (2-hour window, position size escalation)

- **ClearanceFramework: Behavioral Risk Detection** — https://www.clearanceframework.com/
  - Decision tempo, position sizing baselines from last 50 trades

- **PatternFly: Alert Design Guidelines** — https://patternfly.org/components/alert/design-guidelines
  - Toast vs inline alert patterns, severity levels

### Tertiary (LOW confidence)

- ** psych.sh: Solana Trading Psychology** — https://psych.sh/docs
  - Behavioral pattern types (tilts, overtrading, loss clustering) — marked for validation against Phase 3 data model

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — Supabase/Next.js well-established, all versions verified
- Architecture: HIGH — Patterns from official docs and multiple industry sources
- Pitfalls: MEDIUM — Some assumptions on detection thresholds, need validation with production data
- Behavioral algorithms: MEDIUM — Derived from TradeTally/ClearanceFramework, thresholds from CONTEXT.md

**Research date:** 2026-05-08
**Valid until:** 2026-06-07 (30 days — behavioral monitoring is relatively stable)

---

*Phase: 05-risk-guardian*
*Research complete: 2026-05-08*