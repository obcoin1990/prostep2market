# Phase 3: Trade Journal - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Source:** YOLO mode (skipping discuss-phase per config)

<domain>
## Phase Boundary

Build the Trade Journal system with manual entry, CSV import, MT5 sync, screenshot uploads, emotional tracking, and a chronological journal timeline. This phase enables traders to log their trades with full context for AI analysis in Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Trade Entry Methods
- **Manual Entry:** Full form with symbol, entry, exit, SL, TP, lot size, session time
- **CSV Import:** Standard format with validation, batch processing
- **MT5 Sync:** Read-only connection to import historical trades with session metadata

### Trade Data Model
```typescript
interface Trade {
  id: string;
  userId: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  entryTime: Date;
  exitTime: Date;
  session: 'asian' | 'london' | 'newyork' | 'sydney';
  result: 'win' | 'loss' | 'breakeven';
  pnl: number;
  screenshotUrl?: string;
  emotions: EmotionTags;
  preTradePlanAdherence: number; // 1-5 rating
  notes?: string;
}

interface EmotionTags {
  confidence: number; // 1-5
  stress: number; // 1-5
  triggers: string[];
  state: 'calm' | 'excited' | 'frustrated' | 'fearful' | 'greedy';
}
```

### CSV Format
Required columns: symbol, entry_price, exit_price, stop_loss, take_profit, lot_size, entry_time, exit_time, session

### Screenshot Storage
- Supabase Storage bucket: `trade-screenshots`
- Path pattern: `{userId}/{tradeId}/{timestamp}.png`
- Max file size: 5MB
- Allowed types: png, jpg, jpeg

### Journal Timeline Features
- Chronological view (newest first)
- Filters: symbol, session, emotion, date range
- Search by notes content
- Pagination (20 trades per page)

### Database Schema
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  entry_price DECIMAL NOT NULL,
  exit_price DECIMAL,
  stop_loss DECIMAL NOT NULL,
  take_profit DECIMAL NOT NULL,
  lot_size DECIMAL NOT NULL,
  entry_time TIMESTAMPTZ NOT NULL,
  exit_time TIMESTAMPTZ,
  session TEXT CHECK (session IN ('asian', 'london', 'newyork', 'sydney')),
  result TEXT CHECK (result IN ('win', 'loss', 'breakeven')),
  pnl DECIMAL,
  screenshot_url TEXT,
  confidence_score INT CHECK (confidence_score BETWEEN 1 AND 5),
  stress_score INT CHECK (stress_score BETWEEN 1 AND 5),
  emotional_state TEXT,
  triggers TEXT[],
  pre_trade_plan_adherence INT CHECK (pre_trade_plan_adherence BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_entry_time ON trades(entry_time);
```

### Integration Points
- Phase 1: Auth (user authentication), Supabase setup
- Phase 2: Trader DNA (profile affects emotional tracking defaults)
- Phase 4: AI Trade Intelligence (analyzes journal entries)
- Phase 5: Risk Guardian (uses trades for behavioral monitoring)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `RESEURCES/trade-journal.md` — Trade journal feature specs
- `RESEURCES/tools.md` — API specifications for trade upload endpoint
- `.planning/REQUIREMENTS.md` — Phase 3 requirements (INTL-01 to INTL-03, JRNL-01 to JRNL-05)
- `.planning/ROADMAP.md` — Phase 3 success criteria
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Phase 1 context (auth structure)

### Tech Decisions from Prior Phases
- Next.js App Router with TypeScript
- Supabase for database and storage
- Tailwind CSS for styling
- Brand colors: Red #E53935, Green #2E7D32, Black #0B0B0B

</canonical_refs>

<specifics>
## Specific Ideas

### Manual Trade Entry Form
Fields:
- Symbol (dropdown with major pairs)
- Entry price (number input)
- Exit price (number input, optional until trade closes)
- Stop loss (number input)
- Take profit (number input)
- Lot size (number input with 0.01 increments)
- Entry time (datetime picker)
- Exit time (datetime picker, optional)
- Session (auto-detected from entry time)
- Screenshot upload (drag & drop zone)
- Emotional tracking (confidence 1-5, stress 1-5, triggers checkboxes)
- Pre-trade plan adherence (1-5 rating)
- Notes (textarea)

### CSV Import Flow
1. User uploads CSV file
2. System validates format
3. Preview table shows parsed trades
4. User confirms import
5. Batch insert to database
6. Show success/failure summary

### MT5 Import (Stub for Phase 4)
- For Phase 3: Show "MT5 Connection" button that redirects to settings
- Full MT5 sync implemented in Phase 4 (AI Trade Intelligence)

### Journal Timeline UI
- Header with filter controls
- Trade cards in chronological order
- Each card shows: symbol, result (win/loss color-coded), P&L, emotions
- Expandable details on click
- Pagination controls at bottom

### Best Practices Prompts
- Show "Log trades within 24 hours" reminder on journal page
- Prompt for screenshot when logging losing trades
- Ask for pre-trade plan adherence rating

</specifics>

<deferred>
## Deferred Ideas

- MT5 read-only connection full implementation (Phase 4 AI Trade Intelligence)
- AI-generated insights and recurring mistake detection (Phase 4)
- Discipline score calculation (Phase 4)
- Action plan generation (Phase 4)

None — Phase 3 is self-contained for basic journal functionality.

</deferred>

---

*Phase: 03-trade-journal*
*Context gathered: 2026-05-08 via YOLO mode*