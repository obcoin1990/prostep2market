# Phase 3: Trade Journal - Research

**Researched:** 2026-05-08
**Domain:** Trade Journal - Manual entry, CSV import, screenshot uploads, emotional tracking, timeline
**Confidence:** HIGH

## Summary

Phase 3 builds the Trade Journal system enabling traders to log trades with full context (prices, emotions, screenshots) for future AI analysis. Key technical components include (1) React Hook Form with Zod validation for manual trade entry, (2) Papa Parse for CSV import with validation preview, (3) Supabase Storage for screenshot uploads with RLS policies, and (4) PostgreSQL schema with proper indexes for timeline queries. The phase addresses 8 requirements: INTL-01 (MT5 setup stub), INTL-02 (CSV import), INTL-03 (manual entry), JRNL-01 through JRNL-05 (trade form, screenshots, emotional tracking, plan adherence, timeline).

**Primary recommendation:** Use React Hook Form 7.x + Zod for all forms, Papa Parse 5.x for CSV parsing client-side with validation preview, and Supabase Storage with private bucket and RLS policies for screenshots.

---

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Manual Entry:** Full form with symbol, entry, exit, SL, TP, lot size, session time
- **CSV Import:** Standard format with validation, batch processing
- **MT5 Sync:** Read-only connection to import historical trades (stub only in Phase 3)
- **Trade Data Model:** All fields from CONTEXT.md interface (symbol, entryPrice, exitPrice, etc.)
- **CSV Format:** Required columns: symbol, entry_price, exit_price, stop_loss, take_profit, lot_size, entry_time, exit_time, session
- **Screenshot Storage:** `trade-screenshots` bucket, path pattern `{userId}/{tradeId}/{timestamp}.png`, max 5MB, allowed: png/jpg/jpeg
- **Timeline:** Chronological (newest first), filters for symbol/session/emotion/date, search by notes, 20/page pagination

### the agent's Discretion
- Form library choice (React Hook Form recommended but not forced)
- CSV validation approach (client-side vs server-side)
- Timeline UI component (custom vs library)
- Error handling UX for CSV imports

### Deferred Ideas (OUT OF SCOPE)
- MT5 read-only connection full implementation (Phase 4)
- AI-generated insights (Phase 4)
- Discipline score calculation (Phase 4)
- Action plan generation (Phase 4)

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INTL-01 | MT5 read-only connection setup | Stub only — button redirects to settings, full sync Phase 4 |
| INTL-02 | CSV trade import with standard format | Papa Parse 5.5.3 with validation preview |
| INTL-03 | Manual trade entry form | React Hook Form 7.75.0 + Zod 4.4.3 |
| JRNL-01 | Trade log entry form | Same as INTL-03 (shared form) |
| JRNL-02 | Screenshot upload with trade association | Supabase Storage with RLS |
| JRNL-03 | Emotional tracking | Form fields + database columns |
| JRNL-04 | Pre-trade plan adherence rating | 1-5 rating field in form |
| JRNL-05 | Journal timeline view with filters | PostgreSQL queries with indexes |

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Manual trade entry form | Frontend (Browser) | API (validation) | React Hook Form runs client-side; validation shared with server |
| CSV import | Frontend (Browser) | API (batch insert) | Papa Parse client-side; server validates before DB insert |
| Screenshot upload | Frontend (Browser) | Supabase Storage | Direct upload to storage bucket; URL stored in DB |
| Journal timeline | API / Database | Frontend | Paginated queries via API; renders list in browser |
| Trade data storage | Database | — | PostgreSQL with RLS enforces user isolation |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | 7.75.0 | Form state management | 16M+ weekly downloads, TypeScript support, small bundle |
| zod | 4.4.3 | Schema validation | Pairs with React Hook Form via resolver, used by many Next.js apps |
| @supabase/supabase-js | 2.105.4 | Database client | Official Supabase client, storage + auth |
| papaparse | 5.5.3 | CSV parsing | Industry standard for client-side CSV, streaming support |

**Installation:**
```bash
npm install react-hook-form zod @hookform/resolvers papaparse @supabase/supabase-js
```

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @supabase/ssr | latest | Next.js + Supabase | Server components, Server Actions |
| date-fns | 4.x | Date formatting | Timeline date display |
| react dropzone | latest | File upload UX | Screenshot drag-and-drop |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React Hook Form | TanStack Form | Both excellent; RHF has larger ecosystem |
| Papa Parse | csv-parse (streaming) | CSVBox for enterprise; Papa Parse sufficient for standard import |
| Custom timeline | react-chrono, vertical-timeline | Custom for full control; libraries add constraints |

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Trade Entry   │     │   CSV Import    │     │  Screenshot     │
│      Form       │     │     Flow        │     │     Upload      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                                 │
│  POST /api/trades          POST /api/trades/batch    (screenshot)   │
└─────────────────────────────────────────────────────────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    PostgreSQL   │     │    PostgreSQL   │     │  Supabase       │
│  trades table   │     │  trades table    │     │  Storage        │
│                 │     │  (batch insert) │     │  trade-screens  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Journal Timeline                                  │
│  GET /api/trades?page=X&filters=... → Paginated list                  │
└──────────────────────────────────────────────────────────────��──────┘
```

### Recommended Project Structure

```
src/
├── app/
│   ├── journal/
│   │   ├── page.tsx           # Main journal page
│   │   ├── entry/
│   │   │   └── page.tsx       # New trade entry form
│   │   ├── import/
│   │   │   └── page.tsx       # CSV import flow
│   │   └── [id]/
│   │       └── page.tsx      # Trade detail view
│   └── api/
│       ├── trades/
│       │   ├── route.ts       # POST /api/trades
│       │   └── batch/
│       │       └── route.ts  # POST /api/trades/batch
├── components/
│   ├── journal/
│   │   ├── TradeForm.tsx     # Manual entry form
│   │   ├── CsvImporter.tsx  # CSV import component
│   │   ├── ScreenshotUpload.tsx
│   │   ├── Timeline.tsx     # Journal timeline
│   │   └── TradeCard.tsx    # Individual trade card
│   └── ui/
│       └── (shared from Phase 1)
├── lib/
│   ├── supabase.ts          # Client
│   ├── trades.ts             # API helpers
│   └── validation.ts        # Zod schemas
├── types/
│   └── trade.ts             # Trade type definitions
└── db/
    └── migrations/          # SQL for trades table
```

### Pattern 1: Trade Entry Form with React Hook Form + Zod

**What:** Form with validation, emotional tracking, screenshot upload
**When to use:** Manual trade entry (JRNL-01, INTL-03)

**Example:**
```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const tradeSchema = z.object({
  symbol: z.string().min(1).max(10),
  entryPrice: z.number().positive(),
  exitPrice: z.number().positive().optional(),
  stopLoss: z.number().positive(),
  takeProfit: z.number().positive(),
  lotSize: z.number().positive().min(0.01),
  entryTime: z.string().datetime(),
  exitTime: z.string().datetime().optional(),
  session: z.enum(['asian', 'london', 'newyork', 'sydney']),
  confidenceScore: z.number().min(1).max(5).optional(),
  stressScore: z.number().min(1).max(5).optional(),
  emotionalState: z.string().optional(),
  triggers: z.array(z.string()).optional(),
  preTradePlanAdherence: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
});

export type TradeInput = z.infer<typeof tradeSchema>;
```

```typescript
// src/components/journal/TradeForm.tsx
"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tradeSchema, type TradeInput } from '@/lib/validation';

export function TradeForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<TradeInput>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      session: 'london', // Default
    }
  });

  const onSubmit = async (data: TradeInput) => {
    const response = await fetch('/api/trades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle response
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Symbol */}
      <select {...register('symbol')}>
        <option value="EURUSD">EUR/USD</option>
        <option value="GBPUSD">GBP/USD</option>
        <option value="USDJPY">USD/JPY</option>
        {/* Add more pairs */}
      </select>
      
      {/* Prices */}
      <input type="number" step="0.00001" {...register('entryPrice', { valueAsNumber: true })} />
      <input type="number" step="0.00001" {...register('exitPrice', { valueAsNumber: true })} />
      <input type="number" step="0.00001" {...register('stopLoss', { valueAsNumber: true })} />
      <input type="number" step="0.00001" {...register('takeProfit', { valueAsNumber: true })} />
      
      {/* Lot size */}
      <input type="number" step="0.01" {...register('lotSize', { valueAsNumber: true })} />
      
      {/* Times */}
      <input type="datetime-local" {...register('entryTime')} />
      <input type="datetime-local" {...register('exitTime')} />
      
      {/* Session (auto-detected or manual) */}
      <select {...register('session')}>
        <option value="asian">Asian</option>
        <option value="london">London</option>
        <option value="newyork">New York</option>
        <option value="sydney">Sydney</option>
      </select>
      
      {/* Emotional tracking */}
      <input type="number" min="1" max="5" {...register('confidenceScore', { valueAsNumber: true })} />
      <input type="number" min="1" max="5" {...register('stressScore', { valueAsNumber: true })} />
      <select {...register('emotionalState')}>
        <option value="calm">Calm</option>
        <option value="excited">Excited</option>
        <option value="frustrated">Frustrated</option>
        <option value="fearful">Fearful</option>
        <option value="greedy">Greedy</option>
      </select>
      
      {/* Triggers (multi-select) */}
      <label><input type="checkbox" value="FOMO" {...register('triggers')} /> FOMO</label>
      <label><input type="checkbox" value="revenge" {...register('triggers')} /> Revenge</label>
      <label><input type="checkbox" value="overconfidence" {...register('triggers')} /> Overconfidence</label>
      
      {/* Plan adherence */}
      <input type="number" min="1" max="5" {...register('preTradePlanAdherence', { valueAsNumber: true })} />
      
      {/* Notes */}
      <textarea {...register('notes')} />
      
      <button type="submit">Save Trade</button>
    </form>
  );
}
```

### Pattern 2: CSV Import with Papa Parse

**What:** Upload, parse, validate, preview, batch insert
**When to use:** CSV trade import (INTL-02)

**Example:**
```typescript
// src/components/journal/CsvImporter.tsx
"use client";
import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { tradeSchema } from '@/lib/validation';

interface ParsedRow {
  symbol: string;
  entry_price: string;
  exit_price: string;
  stop_loss: string;
  take_profit: string;
  lot_size: string;
  entry_time: string;
  exit_time: string;
  session: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export function CsvImporter() {
  const [step, setStep] = useState<'upload' | 'preview' | 'confirm'>('upload');
  const [rawData, setRawData] = useState<ParsedRow[]>([]);
  const [validation, setValidation] = useState<{ valid: ParsedRow[]; errors: ValidationError[] }>();
  const [importing, setImporting] = useState(false);

  const handleFileAccepted = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        setRawData(results.data as ParsedRow[]);
        setStep('preview');
      },
      error: (error) => {
        console.error('Parse error:', error);
      }
    });
  }, []);

  const validateData = useCallback(() => {
    const errors: ValidationError[] = [];
    const valid: ParsedRow[] = [];

    rawData.forEach((row, index) => {
      // Map CSV row to trade object
      const trade = {
        symbol: row.symbol,
        entryPrice: parseFloat(row.entry_price),
        exitPrice: row.exit_price ? parseFloat(row.exit_price) : undefined,
        stopLoss: parseFloat(row.stop_loss),
        takeProfit: parseFloat(row.take_profit),
        lotSize: parseFloat(row.lot_size),
        entryTime: row.entry_time,
        exitTime: row.exit_time || undefined,
        session: row.session as 'asian' | 'london' | 'newyork' | 'sydney',
      };

      // Validation using Zod
      const result = tradeSchema.safeParse(trade);
      if (result.success) {
        valid.push(row);
      } else {
        result.error.errors.forEach((err) => {
          errors.push({
            row: index + 2, // +2 for 1-based and header row
            field: err.path.join('.'),
            message: err.message,
          });
        });
      }
    });

    setValidation({ valid, errors });
    setStep('confirm');
  }, [rawData]);

  const handleImport = async () => {
    setImporting(true);
    try {
      const response = await fetch('/api/trades/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation?.valid),
      });
      const result = await response.json();
      // Handle success/error summary
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      {step === 'upload' && (
        <div>
          <input type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && handleFileAccepted(e.target.files[0])} />
          <p>Expected columns: symbol, entry_price, exit_price, stop_loss, take_profit, lot_size, entry_time, exit_time, session</p>
        </div>
      )}

      {step === 'preview' && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>SL</th>
                <th>TP</th>
                <th>Lots</th>
              </tr>
            </thead>
            <tbody>
              {rawData.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  <td>{row.symbol}</td>
                  <td>{row.entry_price}</td>
                  <td>{row.exit_price}</td>
                  <td>{row.stop_loss}</td>
                  <td>{row.take_profit}</td>
                  <td>{row.lot_size}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={validateData}>Validate ({rawData.length} rows)</button>
        </div>
      )}

      {step === 'confirm' && (
        <div>
          {validation?.errors.length === 0 ? (
            <p>All {validation?.valid.length} rows valid</p>
          ) : (
            <div>
              <p>{validation?.errors.length} errors found</p>
              {validation?.errors.slice(0, 10).map((err, i) => (
                <p key={i}>Row {err.row}, {err.field}: {err.message}</p>
              ))}
            </div>
          )}
          <button 
            onClick={handleImport} 
            disabled={importing || !validation?.valid.length}
          >
            {importing ? 'Importing...' : `Import ${validation?.valid.length} trades`}
          </button>
        </div>
      )}
    </div>
  );
}
```

### Pattern 3: Screenshot Upload to Supabase Storage

**What:** Drag-and-drop upload to private bucket with URL storage
**When to use:** Trade screenshot attachment (JRNL-02)

**Example:**
```typescript
// src/components/journal/ScreenshotUpload.tsx
"use client";
import { useState, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ScreenshotUploadProps {
  tradeId?: string; // If editing existing trade
  onUploadComplete: (url: string) => void;
}

export function ScreenshotUpload({ tradeId, onUploadComplete }: ScreenshotUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setError(null);
    
    // Validation
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('File type not allowed. Use PNG, JPG, or JPEG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum 5MB.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Path: {userId}/{tradeId}/{timestamp}.{ext}
      // Note: You need userId from auth context
      const filePath = `${tradeId || 'pending'}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('trade-screenshots')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('trade-screenshots')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [tradeId]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={dragOver ? 'border-brand-red' : 'border-gray-300'}
      style={{
        border: '2px dashed',
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer',
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
        style={{ display: 'none' }}
      />
      {uploading ? (
        <p>Uploading...</p>
      ) : (
        <p>Drag screenshot here or click to upload (PNG/JPG, max 5MB)</p>
      )}
      {error && <p style={{ color: '#E53935' }}>{error}</p>}
    </div>
  );
}
```

### Pattern 4: Journal Timeline

**What:** Paginated list with filters
**When to use:** Journal timeline view (JRNL-05)

**Example:**
```typescript
// src/components/journal/Timeline.tsx
"use client";
import { useState } from 'react';
import { format } from 'date-fns';

interface Trade {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number | null;
  lotSize: number;
  session: string;
  result: 'win' | 'loss' | 'breakeven' | null;
  pnl: number | null;
  entryTime: string;
  emotionalState: string | null;
  confidenceScore: number | null;
}

interface TimelineProps {
  initialTrades: Trade[];
}

export function Timeline({ initialTrades }: TimelineProps) {
  const [filters, setFilters] = useState({
    symbol: '',
    session: '',
    emotion: '',
    dateFrom: '',
    dateTo: '',
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filters.symbol}
          onChange={(e) => setFilters(f => ({ ...f, symbol: e.target.value }))}
        >
          <option value="">All Symbols</option>
          <option value="EURUSD">EUR/USD</option>
          <option value="GBPUSD">GBP/USD</option>
        </select>

        <select
          value={filters.session}
          onChange={(e) => setFilters(f => ({ ...f, session: e.target.value }))}
        >
          <option value="">All Sessions</option>
          <option value="asian">Asian</option>
          <option value="london">London</option>
          <option value="newyork">New York</option>
        </select>

        <select
          value={filters.emotion}
          onChange={(e) => setFilters(f => ({ ...f, emotion: e.target.value }))}
        >
          <option value="">All Emotions</option>
          <option value="calm">Calm</option>
          <option value="excited">Excited</option>
          <option value="frustrated">Frustrated</option>
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
          placeholder="From"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
          placeholder="To"
        />
      </div>

      {/* Trade List */}
      <div className="space-y-4">
        {initialTrades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
      </div>

      {/* Pagination would go here */}
    </div>
  );
}

function TradeCard({ trade }: { trade: Trade }) {
  const pnlColor = trade.result === 'win' ? '#2E7D32' 
    : trade.result === 'loss' ? '#E53935' 
    : '#0B0B0B';

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold">{trade.symbol}</h3>
          <p>{trade.session} session</p>
          <p>{format(new Date(trade.entryTime), 'PPp')}</p>
        </div>
        <div>
          <p style={{ color: pnlColor, fontWeight: 'bold' }}>
            {trade.pnl ? `$${trade.pnl.toFixed(2)}` : 'Open'}
          </p>
          <p>{trade.lotSize} lots</p>
        </div>
      </div>
      {trade.emotionalState && (
        <p>Emotional state: {trade.emotionalState}</p>
      )}
      {trade.confidenceScore && (
        <p>Confidence: {trade.confidenceScore}/5</p>
      )}
    </div>
  );
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSV parsing | Custom parser with regex | Papa Parse | Handles edge cases: quotes, commas in fields, encoding |
| Form validation | Manual validation | Zod + react-hook-form | Type-safe, composable schemas |
| Screenshot storage | Custom S3/filesystem | Supabase Storage | Integrates with auth, RLS policies |
| Date utilities | Custom formatting | date-fns | Tree-shakeable, locale support |

---

## Database Schema

### PostgreSQL Table with RLS

```sql
-- Create trades table
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  entry_price DECIMAL(12, 5) NOT NULL,
  exit_price DECIMAL(12, 5),
  stop_loss DECIMAL(12, 5) NOT NULL,
  take_profit DECIMAL(12, 5) NOT NULL,
  lot_size DECIMAL(10, 2) NOT NULL,
  entry_time TIMESTAMPTZ NOT NULL,
  exit_time TIMESTAMPTZ,
  session TEXT CHECK (session IN ('asian', 'london', 'newyork', 'sydney')),
  result TEXT CHECK (result IN ('win', 'loss', 'breakeven')),
  pnl DECIMAL(12, 2),
  screenshot_url TEXT,
  confidence_score INT CHECK (confidence_score BETWEEN 1 AND 5),
  stress_score INT CHECK (stress_score BETWEEN 1 AND 5),
  emotional_state TEXT CHECK (emotional_state IN ('calm', 'excited', 'frustrated', 'fearful', 'greedy')),
  triggers TEXT[],
  pre_trade_plan_adherence INT CHECK (pre_trade_plan_adherence BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for timeline queries
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_entry_time ON trades(entry_time DESC);
CREATE INDEX idx_trades_session ON trades(session);
CREATE INDEX idx_trades_emotional_state ON trades(emotional_state);

-- RLS policies
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Users can see only their own trades
CREATE POLICY "Users can view own trades" ON trades
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own trades
CREATE POLICY "Users can insert own trades" ON trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own trades
CREATE POLICY "Users can update own trades" ON trades
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own trades
CREATE POLICY "Users can delete own trades" ON trades
  FOR DELETE USING (auth.uid() = user_id);
```

### Supabase Storage Setup

```sql
-- Create bucket for trade screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_file_extensions)
VALUES ('trade-screenshots', 'trade-screenshots', false, 5242880, ARRAY['.png', '.jpg', '.jpeg']);

-- RLS for storage (authenticated users only, own folder)
CREATE POLICY "Users can upload trade screenshots" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'trade-screenshots' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view own screenshots" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'trade-screenshots' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own screenshots" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'trade-screenshots' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## Common Pitfalls

### Pitfall 1: CSV Encoding Issues
**What goes wrong:** European characters (umlauts, accents) appear corrupted in parsed data
**Why it happens:** Default encoding not UTF-8, or source file uses ISO-8859-1
**How to avoid:** Always specify `encoding: 'UTF-8'` in Papa Parse config; offer encoding selector for edge cases
**Warning signs:** `�` characters in parsed output, parse errors on non-ASCII symbols

### Pitfall 2: Large CSV Files Block UI
**What goes wrong:** Browser freezes with 10,000+ row CSV files
**Why it happens:** Papa Parse loads entire file into memory by default
**How to avoid:** Use `step` callback for streaming, or warn users about file size limits (>10,000 rows)
**Warning signs:** Page unresponsive after file select, memory warnings in console

### Pitfall 3: Storage RLS Misconfigured
**What goes wrong:** Upload succeeds but file not accessible, or unauthorized users can access
**Why it happens:** Bucket is public, or RLS policy doesn't restrict to user folder
**How to avoid:** Set bucket to private (`public: false`), use folder prefix `{userId}/` in storage path
**Warning signs:** Upload returns success but getPublicUrl fails, files visible to other users

### Pitfall 4: Form Validation Not Mirrored on Server
**What goes wrong:** Client validation passes but server insert fails
**Why it happens:** Relying only on client-side Zod validation
**How to avoid:** Re-validate with Zod in API route before database insert; use same schema
**Warning signs:** API returns 400 after form submission

### Pitfall 5: Session Auto-Detection Conflicts
**What goes wrong:** User manually picks session, but system overwrites with auto-detected
**Why it happens:** Entry time changes and session recalculates, or priority not defined
**How to allow:** Make session optional in form; if provided use it, otherwise auto-detect
**Warning signs:** Session changes unexpectedly after edit

---

## Code Examples

### Server Action for Trade Insert

```typescript
// src/app/actions.ts
'use server';
import { createClient } from '@supabase/supabase-js';
import { tradeSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createTrade(formData: unknown) {
  // Validate
  const result = tradeSchema.safeParse(formData);
  if (!result.success) {
    return { error: result.error.errors };
  }

  const trade = result.data;
  
  // Calculate result and P&L if exit price exists
  let pnl: number | null = null;
  let resultValue: 'win' | 'loss' | 'breakeven' | null = null;
  
  if (trade.exitPrice) {
    const priceDiff = trade.exitPrice - trade.entryPrice;
    const direction = trade.takeProfit > trade.stopLoss ? 1 : -1; // Long or short
    pnl = priceDiff * trade.lotSize * 100000 * direction; // Simplified
    
    if (pnl > 0) resultValue = 'win';
    else if (pnl < 0) resultValue = 'loss';
    else resultValue = 'breakeven';
  }

  // Insert (need user_id from session - use auth-helpers in real implementation)
  const { data, error } = await supabase
    .from('trades')
    .insert({
      user_id: 'CURRENT_USER_ID', // Replace with actual auth
      symbol: trade.symbol,
      entry_price: trade.entryPrice,
      exit_price: trade.exitPrice,
      stop_loss: trade.stopLoss,
      take_profit: trade.takeProfit,
      lot_size: trade.lotSize,
      entry_time: trade.entryTime,
      exit_time: trade.exitTime,
      session: trade.session,
      result: resultValue,
      pnl: pnl,
      screenshot_url: trade.screenshotUrl,
      confidence_score: trade.confidenceScore,
      stress_score: trade.stressScore,
      emotional_state: trade.emotionalState,
      triggers: trade.triggers,
      pre_trade_plan_adherence: trade.preTradePlanAdherence,
      notes: trade.notes,
    })
    .select()
    .single();

  if (error) {
    return { error: [{ message: error.message }] };
  }

  revalidatePath('/journal');
  return { data };
}
```

### API Route for Batch CSV Import

```typescript
// src/app/api/trades/batch/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { tradeSchema } from '@/lib/validation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();
  
  const valid = [];
  const errors = [];
  
  for (let i = 0; i < body.length; i++) {
    const row = body[i];
    const result = tradeSchema.safeParse(row);
    
    if (result.success) {
      const trade = result.data;
      let pnl = null;
      let resultValue: 'win' | 'loss' | 'breakeven' | null = null;
      
      if (trade.exitPrice) {
        const priceDiff = trade.exitPrice - trade.entryPrice;
        const direction = trade.takeProfit > trade.stopLoss ? 1 : -1;
        pnl = priceDiff * trade.lotSize * 100000 * direction;
        
        if (pnl > 0) resultValue = 'win';
        else if (pnl < 0) resultValue = 'loss';
        else resultValue = 'breakeven';
      }
      
      valid.push({
        user_id: 'CURRENT_USER_ID', // Replace with auth
        symbol: trade.symbol,
        entry_price: trade.entryPrice,
        exit_price: trade.exitPrice,
        stop_loss: trade.stopLoss,
        take_profit: trade.takeProfit,
        lot_size: trade.lotSize,
        entry_time: trade.entryTime,
        exit_time: trade.exitTime,
        session: trade.session,
        result: resultValue,
        pnl: pnl,
      });
    } else {
      errors.push({ row: i + 1, errors: result.error.errors });
    }
  }
  
  if (valid.length === 0) {
    return NextResponse.json({ error: 'No valid trades', details: errors }, { status: 400 });
  }
  
  const { data, error } = await supabase
    .from('trades')
    .insert(valid)
    .select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    imported: data.length,
    failed: errors.length,
    errors: errors.slice(0, 10), // First 10 errors
  });
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom form validation | Zod schemas | 2023+ (Zod 3.x) | Type-safe, composable validation |
| Server-side CSV parsing | Client-side parsing + preview | 2024+ | Better UX, faster feedback |
| Public storage buckets | Private buckets + RLS | 2024+ (security emphasis) | Data isolation required |
| Page-based pagination | Cursor/infinite scroll | 2024+ | Better UX for large datasets |

**Deprecated/outdated:**
- `react-papaparse`: Deprecated wrapper, use Papa Parse directly
- Custom validation functions: Use Zod for consistency

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Phase 1 established Supabase connection | Standard Stack | Wrong — need Phase 1 completion first |
| A2 | User authentication available | Database Schema | Wrong — need Phase 1 AUTH-01 to AUTH-05 |
| A3 | UI components from Phase 1 available | Pattern 1-4 | Wrong — need Phase 1 completion |
| A4 | Session detection logic available | Code Examples | Wrong — will need to implement |

All assumptions can be validated by checking Phase 1 deliverables.

---

## Open Questions

1. **MT5 Connection Details**
   - What we know: MT5 read-only stub is in Phase 3 scope, full integration Phase 4
   - What's unclear: What API/library to use for MT5 connection
   - Recommendation: Implement stub UI that redirects to settings, flesh out in Phase 4 with external research

2. **Trade Result Calculation**
   - What we know: Long/short direction matters for P&L
   - What's unclear: How to handle different lot size conventions, pip values per pair
   - Recommendation: Start with simplified calculation, enhance in Phase 4 AI analysis

3. **Timeline Performance at Scale**
   - What we know: 20/page pagination, indexes on key columns
   - What's unclear: Performance with 10,000+ trades
   - Recommendation: Monitor query times, add cursor-based pagination if needed

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (from Phase 1) |
| Config file | jest.config.ts / jest.setup.ts |
| Quick run command | `npm test -- --passWithNoTests` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|----------------|-------------|
| INTL-02 | CSV parse and validate | Unit | `npm test trades/validation` | ✅ |
| INTL-02 | CSV import success | Integration | `npm test trades/batch` | ❌ Wave 0 |
| INTL-03 | Trade form submission | E2E/Integration | `npm test trades/form` | ❌ Wave 0 |
| JRNL-01 | Trade save to DB | Integration | `npm test trades/create` | ❌ Wave 0 |
| JRNL-02 | Screenshot upload | Integration | `npm test trades/upload` | ❌ Wave 0 |
| JRNL-05 | Timeline fetch with filters | Integration | `npm test trades/list` | ❌ Wave 0 |

### Wave 0 Gaps
- [ ] `tests/lib/validation.test.ts` — Zod schema validation tests
- [ ] `tests/components/CsvImporter.test.tsx` — CSV parsing component tests
- [ ] `tests/api/trades/batch.test.ts` — Batch import endpoint tests
- [ ] `tests/components/Timeline.test.tsx` — Timeline rendering tests
- [ ] Framework install: `npm install --save-dev jest @testing-library/react @testing-library/jest-dom` — if not in Phase 1

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|----------------|
| V2 Authentication | Yes | Supabase Auth (Phase 1) |
| V3 Session Management | Yes | Supabase Auth sessions |
| V4 Access Control | Yes | RLS on trades table |
| V5 Input Validation | Yes | Zod schemas, parameterized queries |
| V6 Cryptography | Yes | Supabase Storage encryption |

### Known Threat Patterns for Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| SQL injection | Tampering | Parameterized queries via Supabase client |
| File upload abuse | Tampering | File type validation, size limits, private bucket |
| Cross-user data access | Information Disclosure | RLS policies enforcement |
| Form validation bypass | Tampering | Server-side re-validation |

---

## Sources

### Primary (HIGH confidence)
- [Papa Parse npm] - Version 5.5.3, client-side CSV parsing
- [React Hook Form npm] - Version 7.75.0, form management
- [Zod npm] - Version 4.4.3, schema validation
- [Supabase Docs - Storage Quickstart] - Bucket and policy creation

### Secondary (MEDIUM confidence)
- [MakeUseOf - Supabase Storage Next.js] - Upload patterns
- [ImportCSV - React CSV Import] - Best practices
- [SecureStartKit - Secure File Uploads 2026] - RLS on storage

### Tertiary (LOW confidence)
- [WebSearch - CSV parsing best practices] - Validated via Papa Parse docs
- [WebSearch - React form libraries] - Confirmed by npm downloads

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Versions verified on npm
- Architecture: HIGH - Based on Phase 1 structure + Supabase patterns
- Pitfalls: MEDIUM - Common patterns identified from web search
- Database: HIGH - Standard PostgreSQL + Supabase RLS

**Research date:** 2026-05-08
**Valid until:** 2026-06-08 (30 days - stable phase)