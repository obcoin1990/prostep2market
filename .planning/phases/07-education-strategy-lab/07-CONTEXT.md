# Phase 7: Education & Strategy Lab - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Source:** YOLO mode (skipping discuss-phase per config)

<domain>
## Phase Boundary

Build the structured learning platform and strategy simulation environment. This phase delivers the Education Hub with courses, quizzes, certifications, and the Strategy Lab with strategy building, session testing, RR optimization, and behavioral comparison features.

</domain>

<decisions>
## Implementation Decisions

### Learning Paths
```typescript
type LearningPath = 'beginner' | 'intermediate' | 'advanced' | 'psychology-first';

interface LearningPathConfig {
  id: LearningPath;
  name: string;
  description: string;
  courses: Course[];
  recommendedFor: string[];
}
```

### Content Structure
```typescript
interface Course {
  id: string;
  path: LearningPath;
  title: string;
  description: string;
  type: 'video' | 'interactive' | 'case-study' | 'workshop';
  durationMinutes: number;
  lessons: Lesson[];
  quiz?: Quiz;
  certificateEligible: boolean;
}

interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  content: string;        // Markdown content or video URL
  type: 'reading' | 'video' | 'interactive';
  durationMinutes: number;
}

interface Quiz {
  id: string;
  courseId: string;
  questions: QuizQuestion[];
  passingScore: number;   // percentage, e.g., 70
  maxAttempts: number;
}

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}
```

### Progress Tracking
```typescript
interface CourseProgress {
  odellId: string;
  userId: string;
  courseId: string;
  lessonsCompleted: string[];  // lesson IDs
  quizScore?: number;
  quizAttempts: number;
  completedAt?: Date;
  certificateIssued: boolean;
  certificateUrl?: string;
}
```

### Strategy Lab
```typescript
interface Strategy {
  id: string;
  userId: string;
  name: string;
  entryRules: EntryRule[];
  exitRules: ExitRule[];
  riskRules: RiskRule[];
  createdAt: Date;
  lastTestedAt?: Date;
}

interface EntryRule {
  condition: 'price_above' | 'price_below' | 'ma_cross' | 'rsi_above' | 'rsi_below' | 'custom';
  value: string;
  timeframes: ('M5' | 'M15' | 'H1' | 'H4' | 'D1')[];
}

interface ExitRule {
  type: 'tp' | 'sl' | 'trailing' | 'time';
  value: number;
  unit: 'pips' | 'percent' | 'atr';
}

interface RiskRule {
  type: 'fixed_lot' | 'percent_balance' | 'kelly' | 'atr_based';
  value: number;
  maxDrawdownPercent: number;
}
```

### Session Testing
```typescript
interface SimulationResult {
  id: string;
  userId: string;
  strategyId: string;
  startDate: Date;
  endDate: Date;
  parameters: SimulationParameters;
  results: SimulationMetrics;
}

interface SimulationParameters {
  pair: string;
  sessionFilter?: string[];   // 'london', 'newyork', etc.
  includeNewsEvents: boolean;
  behaviorRules: BehaviorRule[];
}

interface SimulationMetrics {
  totalTrades: number;
  winRate: number;
  avgRR: number;
  totalPnl: number;
  maxDrawdown: number;
  consistencyScore: number;
  behavioralImpact: BehavioralImpact[];
}
```

### Database Schema
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL CHECK (path IN ('beginner', 'intermediate', 'advanced', 'psychology-first')),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('video', 'interactive', 'case-study', 'workshop')),
  duration_minutes INT NOT NULL,
  order_index INT NOT NULL,
  certificate_eligible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reading', 'video', 'interactive')),
  duration_minutes INT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  passing_score INT DEFAULT 70,
  max_attempts INT DEFAULT 3
);

CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INT NOT NULL,
  explanation TEXT,
  order_index INT NOT NULL
);

CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lessons_completed UUID[] DEFAULT '{}',
  quiz_score INT,
  quiz_attempts INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  UNIQUE(user_id, course_id)
);

CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  entry_rules JSONB NOT NULL,
  exit_rules JSONB NOT NULL,
  risk_rules JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_tested_at TIMESTAMPTZ
);

CREATE TABLE simulation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  parameters JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Integration Points
- **Phase 2:** Trader DNA (learning path recommendation based on profile)
- **Phase 6:** Edge Score (course completion bonus to score, progress visible on dashboard)
- **Phase 3:** Trade Journal (strategy lab uses historical trade data for simulation)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `RESEURCES/education-hub.md` — Education Hub specs
- `RESEURCES/strategy-lab.md` — Strategy Lab specs
- `RESEURCES/modules.md` — Module 6 Education and Strategy Lab overview
- `.planning/REQUIREMENTS.md` — Phase 7 requirements (EDU-01 to EDU-11)
- `.planning/ROADMAP.md` — Phase 7 success criteria
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Phase 1 context (auth, DB schema)
- `.planning/phases/02-trader-dna/02-CONTEXT.md` — Trader profile for path recommendations
- `.planning/phases/06-edge-score/06-CONTEXT.md` — Edge Score for progress integration

### Tech Decisions from Prior Phases
- Next.js App Router with TypeScript
- Supabase for database and Edge Functions
- Tailwind CSS for styling
- Recharts for performance visualization

</canonical_refs>

<specifics>
## Specific Ideas

### Learning Path UI
- Card-based layout showing 4 paths
- Progress bar for each path
- Course cards within paths
- Lesson list with checkmarks for completed

### Course Content Rendering
- Markdown rendering for reading content
- Video player component for video lessons
- Interactive elements (simulations, tools) for interactive type

### Quiz System
- Multiple choice questions
- Immediate feedback on answer submission
- Score display after completion
- Retry option if failed
- Certificate issuance on passing

### Strategy Builder UI
- Form-based rule builder
- Drag-and-drop rule ordering
- Preview of strategy conditions
- Save/load strategies

### Simulation Engine
- Historical data backtesting
- Session filtering
- News event handling
- Behavioral rule simulation
- Results visualization with charts

### Progress Tracking
- Dashboard integration
- Edge Score bonus calculation
- Achievement notifications

</specifics>

<deferred>
## Deferred Ideas

- Live workshops (scheduling and video integration)
- Community forums (per course discussion)
- Peer review of strategies
- Advanced simulations (multi-timeframe, correlation)

None — Phase 7 is self-contained for Education & Strategy Lab delivery.

</deferred>

---

*Phase: 07-education-strategy-lab*
*Context gathered: 2026-05-08 via YOLO mode*