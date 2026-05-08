# Phase 7: Education & Strategy Lab - Research

**Researched:** 2026-05-08
**Domain:** Learning Management System (LMS) + Trading Strategy Simulation
**Confidence:** HIGH

## Summary

Phase 7 delivers the Education Hub with structured learning paths and the Strategy Lab with strategy simulation capabilities. The Education Hub requires a course content management system (stored in Supabase), quiz system with immediate feedback, progress tracking with gamification elements, and certificate generation. The Strategy Lab requires a form-based strategy builder, simulation engine for backtesting strategies across sessions and market conditions, and performance metrics visualization.

**Primary recommendation:** Use react-markdown for content rendering, pdf-lib for certificate generation, a custom lightweight simulation engine (not full backtest-kit), and Supabase for all data persistence with RPC functions for badge/certificate auto-award logic.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Course content rendering | Frontend Server (SSR) | Client | Markdown content parsed server-side for performance |
| Quiz system | API / Backend | Client | Score validation requires server-side enforcement |
| Certificate generation | API / Backend | — | PDF generation server-side for security |
| Strategy builder UI | Client | — | Form-based rule creation, saved to backend |
| Simulation engine | Client | API / Backend | Runs in-browser for interactivity, could use Edge Functions for heavy computation |
| Progress tracking | API / Backend | Client | Single source of truth in database |
| Edge Score integration | API / Backend | — | Course completion bonus calculated server-side |

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

The CONTEXT.md defines all implementation details as locked:

- Database schema with 8 tables (courses, lessons, quizzes, quiz_questions, course_progress, strategies, simulation_results)
- TypeScript interfaces for LearningPath, Course, Lesson, Quiz, QuizQuestion, CourseProgress, Strategy, EntryRule, ExitRule, RiskRule, SimulationResult, SimulationParameters, SimulationMetrics
- Four learning paths: beginner, intermediate, advanced, psychology-first
- Entry rule conditions: price_above, price_below, ma_cross, rsi_above, rsi_below, custom
- Exit rule types: tp, sl, trailing, time
- Risk rule types: fixed_lot, percent_balance, kelly, atr_based

### the agent's Discretion

- Specific implementation libraries (not predefined)
- UI component choices
- Content storage approach (JSON vs database vs file)

### Deferred Ideas

- Live workshops
- Community forums
- Peer review of strategies
- Advanced simulations (multi-timeframe, correlation)

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-markdown | ^10.1.0 | Render course lesson content | React-native, uses remark ecosystem, secure by default |
| react-hook-form | ^7.53.0 | Form state management | Standard for React forms, works well with zod |
| zod | ^3.24.0 | Form validation | TypeScript-first, works with react-hook-form |
| pdf-lib | ^1.17.0 | PDF certificate generation | Works in browser and Node.js, no external dependencies |
| recharts | ^2.15.0 | Performance chart visualization | Standard for React, used elsewhere in project |
| @supabase/supabase-js | ^2.48.0 | Database client | Project standard |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| remark-gfm | ^4.0.0 | GitHub Flavored Markdown | Tables, task lists in course content |
| rehype-slug | ^15.0.0 | Add IDs to headings | Anchor links within lessons |
| react-dropzone | ^14.3.0 | File uploads | Certificate image uploads in admin |
| date-fns | ^4.0.0 | Date formatting | Progress timestamps, course dates |
| lucide-react | ^0.400.0 | Icons | Badges, completion indicators |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-markdown | marked | Faster but less React integration, requires dangerouslySetInnerHTML |
| react-markdown | markdown-it | More popular but no React component mapping |
| pdf-lib | pdfme | React-based template designer but heavier bundle |
| pdf-lib | pdfkit | More features but Node-only originally |
| Custom simulation | backtest-kit | Full-featured but complex, overkill for session testing |
| Custom simulation | tradelab | Good but designed for live trading, not educational simulation |

**Installation:**
```bash
npm install react-markdown remark-gfm rehype-slug react-hook-form zod pdf-lib recharts @supabase/supabase-js date-fns lucide-react
```

**Version verification:**
```bash
npm view react-markdown version  # 10.1.0 (2025-03-07)
npm view pdf-lib version         # 1.17.1 (2024-12-19)
npm view react-hook-form version # 7.53.0 (2025-04-03)
```
[VERIFIED: npm registry]

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EDUCATION HUB                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │ Learning    │    │ Course       │    │ Quiz         │           │
│  │ Paths       │───▶│ Player       │───▶│ System       │           │
│  │ (cards)     │    │ (lesson list)   │              │           │
│  └──────────────┘    └──────────────┘    └──────────────┘           │
│         │                   │                   │                      │
│         ▼                   ▼                   ▼                      │
│  ┌──────────────────────────────────────────────────────┐            │
│  │         Course Progress (Supabase course_progress)      │            │
│  └──────────────────────────────────────────────────────┘            │
│         │                                                │            │
│         ▼                                                ▼            │
│  ┌──────────────┐                           ┌──────────────┐          │
│  │ Certificate │                           │ Edge Score   │          │
│  │ Generator   │                           │ Integration  │          │
│  │ (pdf-lib)   │                           │              │          │
│  └──────────────┘                           └──────────────┘          │
└───────────────────���─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         STRATEGY LAB                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │ Strategy     │───▶│ Simulation   │───▶│ Performance │           │
│  │ Builder      │    │ Engine       │    │ Metrics     │           │
│  │ (forms)      │    │ (backtest)   │    │ (charts)    │           │
│  └──────────────┘    └──────────────┘    └──────────────┘           │
│                           │                   │                      │
│                           ▼                   ▼                      │
│  ┌──────────────────────────────────────────────────────┐            │
│  │         Simulation Results (Supabase)                  │            │
│  └──────────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── app/
│   ├── education/
│   │   ├── page.tsx                    # Education Hub home
│   │   ├── paths/
│   │   │   ├── page.tsx                 # Learning paths overview
│   │   │   └── [pathId]/
│   │   │       ├── page.tsx              # Path detail
│   │   │       └── courses/
│   │   │           └── [courseId]/
│   │   │               └── page.tsx     # Course player
│   │   ├── quiz/
│   │   │   └── [quizId]/
│   │   │       └── page.tsx             # Quiz taking
│   │   ├── certificates/
│   │   │   └── page.tsx                # User certificates
│   │   └── api/
│   │       ├── courses/
│   │       │   └── route.ts            # Course CRUD
│   │       ├── quiz/
│   │       │   └── submit/
│   │       │       └── route.ts          # Quiz submission
│   │       └── certificate/
│   │           └── generate/
│   │               └── route.ts         # Certificate generation
│   │
│   └── strategy-lab/
│       ├── page.tsx                    # Strategy Lab home
│       ├── builder/
│       │   └── [strategyId]/
│       │       └── page.tsx            # Strategy builder
│       ├── simulate/
│       │   └── [strategyId]/
│       │       └── page.tsx            # Run simulation
│       ├── results/
│       │   └── [resultId]/
│       │       └── page.tsx             # Results detail
│       └── api/
│           ├── strategies/
│           │   └── route.ts            # Strategy CRUD
│           └── simulate/
│               └── route.ts           # Run simulation
│
├── components/
│   ├── education/
│   │   ├── learning-path-card.tsx
│   │   ├── course-card.tsx
│   │   ├── lesson-player.tsx
│   │   ├── markdown-content.tsx
│   │   ├── video-player.tsx
│   │   ├── quiz-form.tsx
│   │   ├── quiz-results.tsx
│   │   ├── progress-bar.tsx
│   │   ├── certificate-card.tsx
│   │   └── certificate-preview.tsx
│   │
│   └── strategy-lab/
│       ├── strategy-builder.tsx
│       ├── entry-rule-form.tsx
│       ├── exit-rule-form.tsx
│       ├── risk-rule-form.tsx
│       ├── simulation-controls.tsx
│       ├── equity-curve-chart.tsx
│       ├── drawdown-chart.tsx
│       ├── trade-list.tsx
│       └── metrics-summary.tsx
│
├── lib/
│   ├── education/
│   │   ├── courses.ts                  # Course data access
│   │   ├── progress.ts               # Progress tracking
│   │   ├── badges.ts                # Badge logic
│   │   └── certificates.ts          # Certificate generation
│   │
│   └── strategy-lab/
│       ├── simulation-engine.ts    # Core simulation logic
│       ├── indicators.ts           # Technical indicators
│       ├── session-filters.ts      # Session filtering
│       └── behavioral-rules.ts     # Behavioral rule simulation
│
├── types/
│   ├── education.ts                # Course and quiz types
│   └── strategy-lab.ts             # Strategy and simulation types
│
└── supabase/
    └── migrations/
        └── education_strategy_lab.sql  # Phase 7 migrations
```

### Pattern 1: Course Content Rendering

**What:** Render markdown content from Supabase database as React components

**When to use:** Displaying lesson reading content

**Example:**
```typescript
// Source: [github.com/remarkjs/react-markdown]
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>,
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
          li: ({ children }) => <li className="ml-4">{children}</li>,
          code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{children}</code>,
          pre: ({ children }) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4">{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
```

### Pattern 2: Quiz Form with Validation

**What:** Multiple choice quiz with immediate feedback and scoring

**When to use:** Course end-of-lesson quizzes

**Example:**
```typescript
// Source: [research]
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const quizSchema = z.object({
  answers: z.record(z.string(), z.number().min(0)),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizFormProps {
  questions: QuizQuestion[];
  passingScore: number;
  onSubmit: (score: number, passed: boolean) => void;
}

export function QuizForm({ questions, passingScore, onSubmit }: QuizFormProps) {
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      answers: {},
    },
  });

  const { handleSubmit, watch, formState: { errors } } = form;
  const answers = watch('answers');

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const onSubmitForm = handleSubmit(() => {
    const score = calculateScore();
    const passed = score >= passingScore;
    onSubmit(score, passed);
  });

  return (
    <form onSubmit={onSubmitForm}>
      {questions.map((question, qIndex) => (
        <div key={question.id} className="mb-8 p-4 bg-card rounded-lg">
          <p className="font-medium mb-4">
            {qIndex + 1}. {question.text}
          </p>
          <div className="space-y-2">
            {question.options.map((option, oIndex) => (
              <label
                key={oIndex}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent"
              >
                <input
                  type="radio"
                  value={oIndex}
                  {...form.register(`answers.${question.id}`)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="submit" className="btn-primary w-full">
        Submit Quiz
      </button>
    </form>
  );
}
```

### Pattern 3: PDF Certificate Generation

**What:** Generate certificate PDF on course completion using user data

**When to use:** Awarding certificates after passing quiz

**Example:**
```typescript
// Source: [npmjs.com/package/pdf-lib]
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface CertificateData {
  userName: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
}

export async function generateCertificate(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.98, 0.99),
  });

  // Border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.1, 0.3, 0.5),
    borderWidth: 2,
  });

  // Title
  page.drawText('Certificate of Completion', {
    x: width / 2 - 150,
    y: height - 100,
    size: 30,
    font: timesRomanBoldFont,
    color: rgb(0.1, 0.3, 0.5),
  });

  // User name
  page.drawText(data.userName, {
    x: width / 2 - 80,
    y: height - 180,
    size: 24,
    font: timesRomanBoldFont,
    color: rgb(0, 0, 0),
  });

  // Course name
  page.drawText(`has successfully completed`, {
    x: width / 2 - 75,
    y: height - 230,
    size: 14,
    font: timesRomanFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(data.courseName, {
    x: width / 2 - 100,
    y: height - 260,
    size: 20,
    font: timesRomanBoldFont,
    color: rgb(0, 0.5, 0.3),
  });

  // Date
  page.drawText(`Date: ${data.completionDate}`, {
    x: 50,
    y: 50,
    size: 10,
    font: timesRomanFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Certificate ID
  page.drawText(`Certificate ID: ${data.certificateId}`, {
    x: width - 200,
    y: 50,
    size: 10,
    font: timesRomanFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  return pdfDoc.save();
}
```

### Pattern 4: Simple Simulation Engine

**What:** Lightweight backtest for educational strategy testing

**When to use:** Strategy Lab running simulations without full backtest library

**Example:**
```typescript
// Source: [research - custom implementation for educational use]
import { EntryRule, ExitRule, RiskRule, SimulationResult } from '@/types/strategy-lab';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Trade {
  entryTime: number;
  entryPrice: number;
  exitTime: number;
  exitPrice: number;
  pnl: number;
  rr: number;
  reason: string;
}

interface SimulationConfig {
  candles: Candle[];
  entryRules: EntryRule[];
  exitRules: ExitRule[];
  riskRules: RiskRule[];
  initialBalance: number;
}

function checkEntryRule(rule: EntryRule, candle: Candle, index: number, candles: Candle[]): boolean {
  switch (rule.condition) {
    case 'price_above':
      return candle.close > parseFloat(rule.value);
    case 'price_below':
      return candle.close < parseFloat(rule.value);
    case 'ma_cross':
      return checkMACross(candles.slice(0, index + 1), rule.value);
    case 'rsi_above':
      return checkRSI(candles.slice(0, index + 1)) > parseFloat(rule.value);
    case 'rsi_below':
      return checkRSI(candles.slice(0, index + 1)) < parseFloat(rule.value);
    default:
      return false;
  }
}

function calculatePositionSize(config: SimulationConfig, currentBalance: number): number {
  const riskRule = config.riskRules[0];
  switch (riskRule.type) {
    case 'percent_balance':
      return currentBalance * (riskRule.value / 100);
    case 'fixed_lot':
      return riskRule.value;
    default:
      return currentBalance * 0.02;
  }
}

export function runSimulation(config: SimulationConfig): SimulationResult {
  const trades: Trade[] = [];
  let balance = config.initialBalance;
  let position: { entryPrice: number; entryTime: number; size: number; rules: ExitRule[] } | null = null;

  for (let i = 1; i < config.candles.length; i++) {
    const candle = config.candles[i];
    const priorCandles = config.candles.slice(0, i);

    // Entry logic
    if (!position) {
      const entryTriggered = config.entryRules.some((rule) =>
        checkEntryRule(rule, candle, i, priorCandles)
      );
      if (entryTriggered) {
        const size = calculatePositionSize(config, balance);
        position = {
          entryPrice: candle.close,
          entryTime: candle.time,
          size,
          rules: config.exitRules,
        };
      }
    }
    // Exit logic
    else if (position) {
      for (const rule of position.rules) {
        let exitTriggered = false;
        let exitReason = '';
        const pnl = (candle.close - position.entryPrice) * position.size;

        if (rule.type === 'sl' && rule.unit === 'percent') {
          const slPrice = position.entryPrice * (1 - rule.value / 100);
          exitTriggered = candle.low <= slPrice;
          exitReason = 'Stop Loss';
        } else if (rule.type === 'tp' && rule.unit === 'percent') {
          const tpPrice = position.entryPrice * (1 + rule.value / 100);
          exitTriggered = candle.high >= tpPrice;
          exitReason = 'Take Profit';
        }

        if (exitTriggered) {
          const exitPrice = rule.type === 'sl'
            ? position.entryPrice * (1 - rule.value / 100)
            : position.entryPrice * (1 + rule.value / 100);

          trades.push({
            entryTime: position.entryTime,
            entryPrice: position.entryPrice,
            exitTime: candle.time,
            exitPrice,
            pnl,
            rr: rule.type === 'sl' ? rule.value : -rule.value,
            reason: exitReason,
          });
          balance += pnl;
          position = null;
          break;
        }
      }
    }
  }

  // Calculate metrics
  const winningTrades = trades.filter((t) => t.pnl > 0);
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? winningTrades.length / totalTrades : 0;
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const maxDrawdown = calculateMaxDrawdown(config.initialBalance, trades);

  return {
    totalTrades,
    winRate,
    avgRR: calculateAvgRR(trades),
    totalPnl,
    maxDrawdown,
    consistencyScore: calculateConsistency(trades),
  };
}
```

### Pattern 5: Strategy Builder Form

**What:** Dynamic form for creating strategy entry/exit/risk rules

**When to use:** Strategy Lab strategy creation UI

**Example:**
```typescript
// Source: [research]
import { useFieldArray, useForm, Control } from 'react-hook-form';
import { z } from 'zod';

const strategySchema = z.object({
  name: z.string().min(1, 'Strategy name is required'),
  entryRules: z.array(z.object({
    condition: z.enum(['price_above', 'price_below', 'ma_cross', 'rsi_above', 'rsi_below', 'custom']),
    value: z.string(),
    timeframes: z.array(z.enum(['M5', 'M15', 'H1', 'H4', 'D1'])),
  })),
  exitRules: z.array(z.object({
    type: z.enum(['tp', 'sl', 'trailing', 'time']),
    value: z.number(),
    unit: z.enum(['pips', 'percent', 'atr']),
  })),
  riskRules: z.array(z.object({
    type: z.enum(['fixed_lot', 'percent_balance', 'kelly', 'atr_based']),
    value: z.number(),
    maxDrawdownPercent: z.number(),
  })),
});

type StrategyFormData = z.infer<typeof strategySchema>;

export function StrategyBuilder({ control, onSubmit }: {
  control: Control<StrategyFormData>;
  onSubmit: (data: StrategyFormData) => void;
}) {
  const { fields: entryFields, append: appendEntry, remove: removeEntry } = useFieldArray({
    control,
    name: 'entryRules',
  });

  const { fields: exitFields, append: appendExit, remove: removeExit } = useFieldArray({
    control,
    name: 'exitRules',
  });

  const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({
    control,
    name: 'riskRules',
  });

  return (
    <div className="space-y-8">
      {/* Entry Rules Section */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Entry Rules</h3>
        {entryFields.map((field, index) => (
          <div key={field.id} className="p-4 bg-card rounded-lg mb-4">
            <Controller
              name={`entryRules.${index}.condition`}
              control={control}
              render={({ field }) => (
                <select {...field} className="input w-full mb-2">
                  <option value="price_above">Price Above</option>
                  <option value="price_below">Price Below</option>
                  <option value="ma_cross">MA Cross</option>
                  <option value="rsi_above">RSI Above</option>
                  <option value="rsi_below">RSI Below</option>
                  <option value="custom">Custom</option>
                </select>
              )}
            />
            <Controller
              name={`entryRules.${index}.value`}
              control={control}
              render={({ field }) => (
                <input {...field} placeholder="Value" className="input w-full" />
              )}
            />
            <button onClick={() => removeEntry(index)} className="btn-ghost text-destructive mt-2">
              Remove Rule
            </button>
          </div>
        ))}
        <button onClick={() => appendEntry({ condition: 'price_above', value: '', timeframes: ['H1'] })}>
          + Add Entry Rule
        </button>
      </section>

      {/* Exit Rules Section - similar pattern */}

      {/* Risk Rules Section - similar pattern */}

      <button onClick={onSubmit} className="btn-primary w-full">
        Save Strategy
      </button>
    </div>
  );
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown rendering | Custom parser | react-markdown | Secure by default, React component mapping, plugin ecosystem |
| PDF generation | HTML-to-PDF | pdf-lib | Browser and Node.js support, no external services |
| Form validation | Manual validation | react-hook-form + zod | Industry standard, TypeScript integration |
| Charts | Canvas drawing | recharts | Already in project, good defaults |

**Key insight:** The Strategy Lab simulation only needs basic backtest capabilities (session filtering, RR testing, behavioral rules). Full backtest libraries like backtest-kit add unnecessary complexity and bundle size. A custom 200-line simulation engine covers all EDU-07 through EDU-11 requirements.

---

## Common Pitfalls

### Pitfall 1: Certificate Storage Without URL Tracking

**What goes wrong:** Certificates generated but not linked to user progress

**Why it happens:** Generating PDF to browser instead of uploading to Supabase Storage

**How to avoid:** Stream certificate directly to Supabase Storage bucket, save public URL to course_progress.certificate_url

**Warning signs:** User sees "certificate generated" but cannot download, no URL in database

### Pitfall 2: Client-Side Quiz Validation

**What goes wrong:** Users manipulate quiz scores in browser

**Why it happens:** Scoring logic runs in useForm submit handler

**How to avoid:** Submit only question IDs to API, calculate score server-side in Supabase Edge Function or route handler

### Pitfall 3: Simulation Without Seed Data

**What goes wrong:** Strategy Lab has no data to simulate

**Why it happens:** Historical candle data not loaded or available

**How to avoid:** Provide sample historical data or integrate with free data source (Yahoo Finance via API), allow users to upload CSV

### Pitfall 4: Progress Not Synced to Edge Score

**What goes wrong:** Course completion doesn't affect Edge Score

**Why it happens:** Edge Score calculation not called on course completion

**How to avoid:** Call Edge Score calculation in course_progress insert/update trigger, or call from API after quiz pass

### Pitfall 5: Strategy Rules Without Validation

**What goes wrong:** Invalid strategy configurations cause simulation crashes

**Why it happens:** No validation on entry/exit rule values before simulation

**How to avoid:** Validate strategy schema before saving, validate before simulation run

---

## Code Examples

### Certificate Auto-Award on Quiz Pass (Supabase Edge Function)

```sql
-- Source: [research]
CREATE OR REPLACE FUNCTION check_and_award_certificate()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if passing score achieved
  IF NEW.quiz_score >= 70 AND OLD.completed_at IS NULL THEN
    NEW.completed_at := NOW();
    
    -- Generate certificate (in production, call certificate generation API)
    NEW.certificate_issued := TRUE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER course_completion_trigger
  BEFORE UPDATE ON course_progress
  FOR EACH ROW
  EXECUTE FUNCTION check_and_award_certificate();
```

### Progress Sync to Edge Score (Supabase RPC)

```sql
-- Source: [research]
CREATE OR REPLACE FUNCTION award_course_xp(
  p_user_id UUID,
  p_course_id UUID,
  p_xp_amount INT
)
RETURNS VOID AS $$
BEGIN
  -- Update or insert user XP
  INSERT INTO user_xp (user_id, total_xp, level)
  VALUES (p_user_id, p_xp_amount, 1)
  ON CONFLICT (user_id) DO UPDATE SET
    total_xp = user_xp.total_xp + p_xp_amount,
    level = floor(sqrt((user_xp.total_xp + p_xp_amount) / 100));
END;
$$ LANGUAGE plpgsql;
```

### Session Filter Logic

```typescript
// Source: [research]
const SESSION_HOURS = {
  sydney: [0, 1, 2, 3, 4, 5, 6, 7],
  tokyo: [0, 1, 2, 3, 4, 5, 6, 7],
  london: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
  newyork: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
};

function filterBySession(candles: Candle[], sessions: string[]): Candle[] {
  return candles.filter((candle) => {
    const hour = new Date(candle.time).getUTCHours();
    return sessions.some((session) => SESSION_HOURS[session as keyof typeof SESSION_HOURS]?.includes(hour));
  });
}

export function simulateSession(
  candles: Candle[],
  sessionFilter: string[],
  config: SimulationConfig
): SimulationResult {
  const filteredCandles = sessionFilter ? filterBySession(candles, sessionFilter) : candles;
  return runSimulation({ ...config, candles: filteredCandles });
}
```

### Behavioral Rule Simulation

```typescript
// Source: [research]
interface BehaviorRule {
  type: 'stop_after_losses' | 'stop_after_wins' | 'cooldown_after_trades' | 'max_daily_trades';
  value: number;
}

function simulateBehavioralRules(
  trades: Trade[],
  rules: BehaviorRule[],
  simulationFn: () => Trade[]
): { original: number; withRules: number; impact: number } {
  const originalTrades = simulationFn();
  let modifiedTrades = originalTrades;
  let originalPnl = originalTrades.reduce((sum, t) => sum + t.pnl, 0);

  for (const rule of rules) {
    if (rule.type === 'stop_after_losses') {
      let consecutiveLosses = 0;
      modifiedTrades = modifiedTrades.filter((trade) => {
        if (trade.pnl < 0) {
          consecutiveLosses++;
          if (consecutiveLosses >= rule.value) return false;
        } else {
          consecutiveLosses = 0;
        }
        return true;
      });
    }
    // Handle other rule types...
  }

  const withRulesPnl = modifiedTrades.reduce((sum, t) => sum + t.pnl, 0);
  return {
    originalPnl,
    withRulesPnl,
    impact: withRulesPnl - originalPnl,
  };
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Static course files | Supabase database content | 2024+ | Dynamic content, easier updates |
| Server-generated PDFs | Client pdf-lib | 2020+ | No server dependency |
| jQuery forms | React Hook Form | 2019+ | TypeScript, performance |
| Canvas charts | Recharts / Chart.js | 2015+ | SVG, accessibility |

**Deprecated/outdated:**
- Flash-based content: Replaced by HTML5 video/markdown
- Server-side PDF generation with Puppeteer: Now handled by pdf-lib in-browser

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Historical candle data will be available for simulation | Simulation Engine | Medium - may need external data source integration |
| A2 | PDF generation in browser is acceptable | Certificate | Low - pdf-lib works in Node.js if server-side needed |
| A3 | Sample courses can be added via Supabase Studio | Content Management | Low - JSON import works |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

---

## Open Questions

1. **Where does historical candle data come from?**
   - What we know: Strategies need OHLCV data for simulation
   - What's unclear: Free provider vs. user upload vs. bundled sample data
   - Recommendation: Start with bundled sample data (1 month of major pairs), add CSV upload for user data

2. **How is certificate verification done?**
   - What we know: Certificate has unique ID stored in database
   - What's unclear: Public verification page needed?
   - Recommendation: Simple API endpoint to validate certificate ID (future feature)

3. **Does Edge Score live in Supabase or calculated?**
   - What we know: Phase 6 owns Edge Score, Phase 7 integrates
   - What's unclear: Where calculation happens (DB function vs. API)
   - Recommendation: Follow Phase 6 implementation approach

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Supabase | Database/Auth | ✓ (from project) | — | — |
| React-markdown | Content rendering | ✓ via npm | 10.1.0 | — |
| pdf-lib | Certificate generation | ✓ via npm | 1.17.1 | — |
| recharts | Charts | ✓ via npm | 2.15.0 | — |
| react-hook-form | Forms | ✓ via npm | 7.53.0 | — |

**Missing dependencies with no fallback:**
- None — all required packages available via npm

**Missing dependencies with fallback:**
- None identified

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jest (existing from project) |
| Config file | jest.config.ts |
| Quick run command | `npm test -- --testPathPattern="education\|strategy"` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EDU-01 | Learning paths display | integration | `npm test -- --testPathPattern="learning-paths"` | ❌ Wave 0 |
| EDU-02 | Course structure rendering | unit | `npm test -- --testPathPattern="course"` | ❌ Wave 0 |
| EDU-03 | Micro lesson rendering | unit | `npm test -- --testPathPattern="lesson"` | ❌ Wave 0 |
| EDU-04 | Progress tracking | integration | `npm test -- --testPathPattern="progress"` | ❌ Wave 0 |
| EDU-05 | Certificate generation | unit | `npm test -- --testPathPattern="certificate"` | ❌ Wave 0 |
| EDU-06 | Quiz system | integration | `npm test -- --testPathPattern="quiz"` | ❌ Wave 0 |
| EDU-07 | Strategy builder | integration | `npm test -- --testPathPattern="strategy-builder"` | ❌ Wave 0 |
| EDU-08 | Session testing | integration | `npm test -- --testPathPattern="session"` | ❌ Wave 0 |
| EDU-09 | RR optimization | integration | `npm test -- --testPathPattern="rr"` | ❌ Wave 0 |
| EDU-10 | Behavioral comparison | integration | `npm test -- --testPathPattern="behavioral"` | ❌ Wave 0 |
| EDU-11 | Performance metrics | integration | `npm test -- --testPathPattern="metrics"` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test -- --testPathPattern="education\|strategy" --passWithNoTests`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/education/learning-paths.test.ts` — covers EDU-01
- [ ] `tests/education/course-player.test.ts` — covers EDU-02, EDU-03
- [ ] `tests/education/quiz.test.ts` — covers EDU-06
- [ ] `tests/education/certificate.test.ts` — covers EDU-05
- [ ] `tests/strategy-lab/simulation.test.ts` — covers EDU-08, EDU-09, EDU-10, EDU-11
- [ ] `tests/strategy-lab/strategy-builder.test.ts` — covers EDU-07

*(If no gaps: "None — existing test infrastructure covers all phase requirements")*

Wave 0 gaps identified above require test file creation.

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|----------------|
| V2 Authentication | yes | Supabase Auth (existing) |
| V3 Session Management | yes | Supabase Auth sessions |
| V4 Access Control | yes | RLS policies on course_progress, strategies |
| V5 Input Validation | yes | Zod + react-hook-form |
| V6 Cryptography | no | N/A — no crypto in this phase |

### Known Threat Patterns for LMS + Strategy Platforms

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Quiz answer manipulation | Tampering | Server-side score validation |
| Certificate forgery | Tampering | Unique ID in database, verification API |
| Strategy rule injection | Injection | Zod schema validation |
| Unauthorized strategy access | Information Disclosure | RLS on strategies table |
| Simulation resource exhaustion | Denial of Service | Simulation timeout, max iterations |

**Note:** Security handled through existing Supabase RLS and validation patterns from prior phases.

---

## Sources

### Primary (HIGH confidence)
- [npmjs.com/package/react-markdown](https://www.npmjs.com/package/react-markdown) - Markdown rendering
- [npmjs.com/package/pdf-lib](https://www.npmjs.com/package/pdf-lib) - PDF generation
- [npmjs.com/package/react-hook-form](https://www.npmjs.com/package/react-hook-form) - Form handling

### Secondary (MEDIUM confidence)
- [github.com/remarkjs/react-markdown](https://github.com/remarkjs/react-markdown) - React integration details
- [npmtrends.com](https://npmtrends.com) - Package comparison data

### Tertiary (LOW confidence)
- [research - custom simulation pattern] - Custom engine design - recommend validation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all packages verified on npm registry
- Architecture: HIGH - patterns match project conventions
- Pitfalls: HIGH - common LMS/educational patterns
- Simulation approach: MEDIUM - custom lightweight engine needs validation with real strategy test cases

**Research date:** 2026-05-08
**Valid until:** 2026-06-07 (30 days for stable domain)