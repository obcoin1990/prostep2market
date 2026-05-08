# Phase 5: Risk Guardian - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Source:** YOLO mode (skipping discuss-phase per config)

<domain>
## Phase Boundary

Build the continuous behavioral monitoring system that issues non-intrusive warnings when trader risk or emotional patterns escalate. This phase consumes data from Phase 3 (Trade Journal) and Phase 4 (AI Trade Intelligence) and produces alerts consumed by the Dashboard.

</domain>

<decisions>
## Implementation Decisions

### Alert Types
```typescript
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
  tradeIds?: string[];     // Related trades that triggered alert
  acknowledged: boolean;
  acknowledgedAt?: Date;
}
```

### Detection Rules
| Alert Type | Detection Rule | Severity |
|------------|---------------|----------|
| Revenge Trading | 3+ trades within 30 min after 2+ consecutive losses | critical |
| Fatigue | Session > 2 hours OR > 50 trades in single session | warning |
| Risk Escalation | Current exposure > 150% of profile normal | critical |
| Emotional Instability | 5+ trades with emotional_state = 'frustrated' or 'fearful' in 24h | warning |
| Exposure Warning | Lot size > 130% of historical average | warning |
| Overtrading | > 8 trades in 4-hour window | warning |

### Alert Delivery
- **In-app notifications** (primary delivery method)
- **Dashboard widget** (DASH-08: Quick Actions - pause mode)
- **No push notifications** (v2 feature)
- **Non-blocking**: Alerts appear as dismissible banners, never block trade entry

### User Settings (Configurable Thresholds)
```typescript
interface RiskGuardianSettings {
  userId: string;
  maxSessionDuration: number;       // minutes, default 120
  maxTradesPerSession: number;      // default 50
  maxTradesPerWindow: number;       // window in 4h, default 8
  exposureMultiplier: number;       // % above normal, default 130
  fatigueWarningEnabled: boolean;   // default true
  revengeTradingAlertEnabled: boolean; // default true
  emotionalInstabilityThreshold: number; // trades count, default 5
}
```

### Database Schema
```sql
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

CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_triggered_at ON alerts(triggered_at);
```

### Dashboard Integration (DASH-08)
Quick action buttons:
- **Pause Trading Mode**: Sets a temporary lock on trade entry (configurable duration)
- **Upload Trade**: Opens trade entry form
- **Journal**: Opens journal timeline
- **Simulation**: Opens strategy lab

Pause mode implementation:
```typescript
interface PauseMode {
  active: boolean;
  startedAt?: Date;
  durationMinutes?: number;  // 15, 30, 60, or null (manual resume)
  reason?: string;           // 'user_initiated' | 'system_suggested'
}
```

### API Endpoints
```typescript
// GET /api/alerts - List alerts for user
// Query: ?acknowledged=false&limit=10&type=revenge_trading

// PATCH /api/alerts/:id/acknowledge - Mark alert as seen

// GET /api/alerts/check - Trigger real-time alert check
// Body: { recentTrades: Trade[], currentExposure: number }

// GET /api/guardian/settings - Get user's guardian settings
// PATCH /api/guardian/settings - Update settings

// POST /api/guardian/pause - Activate pause mode
// POST /api/guardian/resume - Deactivate pause mode
```

### Integration Points
- **Phase 3:** Trade Journal (trade data for pattern detection)
- **Phase 4:** AI Trade Intelligence (behavioral analysis results)
- **Phase 2:** Trader DNA (profile affects alert thresholds and sensitivity)
- **Phase 6:** Edge Score (alert frequency affects emotional stability score)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `RESEURCES/modules.md` — Module 3 Risk Guardian overview
- `RESEURCES/dashboard.md` — Dashboard quick actions specs (DASH-08)
- `.planning/REQUIREMENTS.md` — Phase 5 requirements (GRDN-01 to GRDN-09, DASH-08)
- `.planning/ROADMAP.md` — Phase 5 success criteria
- `.planning/phases/03-trade-journal/03-CONTEXT.md` — Trade data model (Phase 3)
- `.planning/phases/04-ai-trade-intelligence/04-CONTEXT.md` — Behavioral patterns (Phase 4)
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Phase 1 context (auth, DB schema)

### Tech Decisions from Prior Phases
- Next.js App Router with TypeScript
- Supabase for database, storage, and Edge Functions
- Tailwind CSS for styling
- Brand colors: Red #E53935, Green #2E7D32, Black #0B0B0B
- Alerts use Supabase Realtime for real-time notification delivery

</canonical_refs>

<specifics>
## Specific Ideas

### Alert Check Flow
1. User enters/trades trigger webhook or scheduled function
2. Risk Guardian analyzes recent trade data (last 50 trades)
3. Detection rules evaluated against current state
4. If threshold exceeded: create Alert record in Supabase
5. Real-time subscription pushes alert to connected clients
6. Dashboard shows alert banner (non-blocking)
7. User can acknowledge or dismiss

### Pause Mode Behavior
- When activated: displays overlay on all trading screens
- Blocks trade entry forms (read-only mode)
- Shows countdown timer if duration set
- User can manually resume before timer ends
- System can suggest pause (after fatigue alert) but user decides

### Alert UI Components
1. **AlertBanner**: Top-of-screen dismissible notification
2. **AlertBadge**: Red dot on nav icon with count
3. **AlertHistory**: Full list of past alerts (filterable)
4. **AlertSettings**: User preference configuration

### Supabase Realtime for Alerts
```typescript
// Subscribe to new alerts
supabase
  .channel('alerts')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'alerts',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    showAlertNotification(payload.new);
  })
  .subscribe();
```

### Threshold Defaults by Trader Profile
- **Sniper** (aggressive): Higher thresholds (more trades allowed, longer sessions)
- **Analyst** (conservative): Lower thresholds (quick alerts, short sessions)
- **Warrior** (balanced): Default thresholds
- Profile influences default values in `risk_guardian_settings` table

</specifics>

<deferred>
## Deferred Ideas

- Push notifications (v2 feature NOTF-01)
- Coach console for reviewing alerts (v2/Enterprise)
- SMS alert integration (v2)
- Custom alert rules per market condition (v2)

None — Phase 5 is self-contained for Risk Guardian delivery.

</deferred>

---

*Phase: 05-risk-guardian*
*Context gathered: 2026-05-08 via YOLO mode*