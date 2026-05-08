# Phase 2: Trader DNA - Research

**Researched:** 2026-05-08
**Domain:** Multi-step psychological assessment + profile generation + personalized dashboard
**Confidence:** HIGH

## Summary

Phase 2 implements the Trader DNA psychological assessment system that creates personalized trader profiles based on 5 assessment categories. The system analyzes risk personality, emotional stability, decision-making style, trading behavior, and learning style to generate one of 5 trader profile types (Sniper, Analyst, Warrior, Disciplinarian, Opportunist). The profile determines dashboard layout, alert sensitivity, and learning path recommendations.

**Primary recommendation:** Use React useState for multi-step form state management with Supabase for profile storage, implement weighted scoring algorithm for profile calculation, and leverage Next.js App Router's client components for the assessment wizard with server actions for profile persistence.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **5 Assessment Sections:**
  1. Risk Personality — aggression level, risk appetite, loss tolerance, recovery behavior
  2. Emotional Stability — impulsiveness, patience, frustration response, revenge tendencies
  3. Decision Making Style — analytical trader, emotional trader, reactive trader, structured trader
  4. Trading Behavior — overtrading probability, FOMO tendencies, discipline level, consistency habits
  5. Learning Style — visual learner, structured learner, practical learner

- **Profile Types:** The Sniper, The Analyst, The Warrior, The Disciplinarian, The Opportunist
- **Profile determines:** Dashboard layout, alert sensitivity, learning path recommendation

### the agent's Discretion
- Multi-step form library selection (useState vs specialized library)
- Question data structure and storage approach
- Scoring algorithm specifics
- Dashboard personalization implementation

### Deferred Ideas (OUT OF SCOPE)
- AI-generated personalized coaching messages (Phase 4 AI engine)
- Advanced profile comparison with other traders (Phase 6 leaderboard)
- Profile evolution tracking over time (future feature)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DNA-01 | Psychological assessment questionnaire (5 sections) | Multi-step form pattern with useState + progress tracking |
| DNA-02 | Risk personality assessment (aggression, risk appetite, loss tolerance, recovery) | Scenario-based questions with weighted scoring |
| DNA-03 | Emotional stability assessment (impulsiveness, patience, frustration response, revenge tendencies) | Situational judgment questions, 1-5 rating scales |
| DNA-04 | Decision-making style assessment (analytical, emotional, reactive, structured) | Scenario selection questions |
| DNA-05 | Trading behavior assessment (overtrading, FOMO, discipline, consistency) | Frequency questions (never/sometimes/often/always) |
| DNA-06 | Learning style assessment (visual, structured, practical) | Preference selection with weighted answers |
| DNA-07 | Trader profile generation (Sniper, Analyst, Warrior, etc.) | Weighted scoring algorithm mapping to 5 types |
| DNA-08 | Personalized dashboard layout based on profile | Profile-based widget arrangement stored as JSONB |
| DNA-09 | Personalized learning path recommendation | Learning style score → learning path mapping |
| DNA-10 | Trader profile summary display | Profile card with type description, scores, recommendations |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Multi-step assessment wizard | Browser / Client | — | Interactive form with progress state, no SSR needed |
| Question data management | Frontend Server (SSR) | Browser / Client | Questions loaded from static data or DB, scored client-side |
| Profile scoring algorithm | Browser / Client | — | Weighted calculation happens in React, results saved to Supabase |
| Profile persistence | Database / Storage | — | Supabase trader_profiles table with RLS |
| Dashboard personalization | Browser / Client | — | Layout determined by profile type, rendered client-side |
| Learning path recommendation | Browser / Client | — | Computed from learning style score |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.x (from Phase 1) | React framework | Phase 1 established |
| TypeScript | bundled | Type safety | Phase 1 established |
| @supabase/ssr | 0.10.3 (from Phase 1) | SSR cookie handling | Phase 1 established |
| @supabase/supabase-js | 2.105.x (from Phase 1) | Supabase client | Phase 1 established |
| Tailwind CSS | bundled | Styling | Phase 1 established |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | latest [VERIFIED: npm registry] | Form validation schemas | Validate assessment answers before submission |
| react-hook-form | latest [VERIFIED: npm registry] | Form state management | Complex multi-step forms with many inputs |
| @tanstack/react-query | latest [VERIFIED: npm registry] | Server state caching | Profile data fetching and caching |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| useState | react-hook-form | useState simpler for wizard with 40-50 questions; react-hook-form adds overhead |
| Custom scoring algorithm | Personality assessment library | Custom needed for trading-specific domains |
| JSON in DB | Separate profile tables | JSONB more flexible for evolving profile attributes |

**Installation:**
```bash
npm install zod react-hook-form @tanstack/react-query
```

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser / Client                              │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │              Trader DNA Assessment Page                  │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │     │
│  │  │ Step 1-8    │→ │ Step 9-16   │→ │ Step 17-24  │     │     │
│  │  │ Risk        │  │ Emotional   │  │ Decision    │     │     │
│  │  │ Personality │  │ Stability   │  │ Making      │     │     │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │     │
│  │  │ Step 25-32  │→ │ Step 33-40  │→ │ Results     │     │     │
│  │  │ Trading     │  │ Learning    │  │ Profile     │     │     │
│  │  │ Behavior    │  │ Style       │  │ Generated  │     │     │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │     │
│  │                                                              │     │
│  │  ┌─────────────────────────────────────────────────────┐   │     │
│  │  │ Scoring Algorithm (client-side)                      │   │     │
│  │  │ - Weighted answer scores → section totals            │   │     │
│  │  │ - Section totals → profile type mapping              │   │     │
│  │  │ - Learning path from learning style score            │   │     │
│  │  └─────────────────────────────────────────────────────┘   │     │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼ (Server Action: saveTraderProfile)
┌─────────────────────────────────────────────────────────────────┐
│                     Supabase Cloud                               │
│  ┌──────────────┐  ┌──────────────────────────────────────┐    │
│  │   Database   │  │  trader_profiles Table                │    │
│  │              │  │  - profile_type (sniper/analyst/etc) │    │
│  │  - RLS       │  │  - 5 section scores (INT)             │    │
│  │  - Policies  │  │  - learning_path (TEXT)              │    │
│  │              │  │  - dashboard_layout (JSONB)           │    │
│  │              │  │  - alert_thresholds (JSONB)          │    │
│  │              │  │  - completed_at (TIMESTAMPTZ)        │    │
│  └──────────────┘  └──────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Personalized Dashboard                      │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │  Layout determined by profile_type                      │     │
│  │  - Sniper: Detailed analysis widgets emphasis           │     │
│  │  - Analyst: Charts, metrics, reports emphasis            │     │
│  │  - Warrior: Quick actions, shortcuts emphasis           │     │
│  │  - Disciplinarian: Checklists, adherence metrics        │     │
│  │  - Opportunist: Multiple tools, quick switching         │     │
│  └─────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── trader-dna/
│   │   │   ├── page.tsx              # Assessment entry
│   │   │   ├── loading.tsx           # Loading state
│   │   │   └── page.client.tsx       # Client wizard component
│   │   ├── profile/
│   │   │   └── page.tsx              # Profile summary (DNA-10)
│   │   └── layout.tsx                # Dashboard layout
│   └── api/
│       └── trader-profile/
│           └── route.ts               # Profile CRUD endpoints
├── components/
│   ├── trader-dna/
│   │   ├── assessment-wizard.tsx     # Multi-step form orchestrator
│   │   ├── progress-bar.tsx          # Visual progress indicator
│   │   ├── question-card.tsx         # Reusable question renderer
│   │   ├── question-types/
│   │   │   ├── multiple-choice.tsx
│   │   │   ├── rating-scale.tsx
│   │   │   ├── scenario-selection.tsx
│   │   │   └── frequency-scale.tsx
│   │   ├── profile-summary.tsx       # DNA-10 profile display
│   │   ├── learning-path.tsx         # DNA-09 recommendations
│   │   └── profile-badge.tsx          # Profile type indicator
│   └── ui/
│       └── ... (from Phase 1)
├── data/
│   └── trader-dna/
│       ├── questions.ts              # All assessment questions
│       └── scoring.ts                # Profile calculation logic
├── lib/
│   ├── supabase/
│   │   └── ... (from Phase 1)
│   └── trader-profile.ts             # Profile server actions
├── types/
│   └── trader-dna.ts                 # TypeScript interfaces
└── app/
    └── globals.css                   # Design tokens (from Phase 1)
```

### Pattern 1: Multi-Step Assessment Wizard with useState
**What:** Client-side wizard managing assessment flow with step state and answer storage
**When to use:** DNA-01 multi-section questionnaire with progress tracking
**Example:**
```tsx
// components/trader-dna/assessment-wizard.tsx
'use client'

import { useState } from 'react'
import { questions, sections } from '@/data/trader-dna/questions'
import { calculateProfile } from '@/data/trader-dna/scoring'
import { saveTraderProfile } from '@/lib/trader-profile'
import { ProgressBar } from './progress-bar'
import { QuestionCard } from './question-card'
import { ProfileSummary } from './profile-summary'

interface AnswerMap {
  [questionId: string]: number | string
}

export function AssessmentWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [isComplete, setIsComplete] = useState(false)
  const [profile, setProfile] = useState<TraderProfile | null>(null)

  const sectionKeys = Object.keys(sections) as SectionKey[]
  const currentSection = sectionKeys[currentStep]
  const sectionQuestions = questions.filter(q => q.section === currentSection)

  const handleAnswer = (questionId: string, value: number | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = async () => {
    if (currentStep < sectionKeys.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Calculate profile on final step
      const calculatedProfile = calculateProfile(answers)
      setProfile(calculatedProfile)
      setIsComplete(true)

      // Save to Supabase
      await saveTraderProfile(calculatedProfile)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const isSectionComplete = () => {
    return sectionQuestions.every(q => answers[q.id] !== undefined)
  }

  if (isComplete && profile) {
    return <ProfileSummary profile={profile} />
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProgressBar
        current={currentStep + 1}
        total={sectionKeys.length}
        sectionName={sections[currentSection].title}
      />

      <div className="mt-8 space-y-6">
        {sectionQuestions.map(question => (
          <QuestionCard
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => handleAnswer(question.id, value)}
          />
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isSectionComplete()}
          className="px-4 py-2 bg-brand-red text-white rounded-md disabled:opacity-50"
        >
          {currentStep === sectionKeys.length - 1 ? 'Generate Profile' : 'Next'}
        </button>
      </div>
    </div>
  )
}
```
Source: [CITED: nextjs.org/docs/app/guides/preserving-ui-state]

### Pattern 2: Weighted Scoring Algorithm
**What:** Calculate trader profile type from answer scores across 5 sections
**When to use:** DNA-07 profile generation from assessment answers
**Example:**
```typescript
// data/trader-dna/scoring.ts

type ProfileType = 'sniper' | 'analyst' | 'warrior' | 'disciplinarian' | 'opportunist'

interface TraderProfile {
  type: ProfileType
  scores: {
    riskPersonality: number       // 0-100
    emotionalStability: number    // 0-100
    decisionMaking: number        // 0-100
    tradingBehavior: number       // 0-100
    learningStyle: number         // 0-100
  }
  learningPath: string
  dashboardLayout: DashboardLayout
  alertThresholds: AlertThresholds
}

interface AnswerMap {
  [questionId: string]: number | string
}

const WEIGHTED_SCORES: Record<ProfileType, { min: number; max: number; primary: SectionKey }> = {
  sniper: { min: 0, max: 20, primary: 'riskPersonality' },
  analyst: { min: 21, max: 40, primary: 'decisionMaking' },
  warrior: { min: 41, max: 60, primary: 'riskPersonality' },
  disciplinarian: { min: 61, max: 80, primary: 'tradingBehavior' },
  opportunist: { min: 81, max: 100, primary: 'emotionalStability' },
}

export function calculateProfile(answers: AnswerMap): TraderProfile {
  // Calculate section scores (0-100 each)
  const scores = calculateSectionScores(answers)

  // Determine primary profile type based on dominant section
  const profileType = determineProfileType(scores)

  // Generate recommendations based on scores
  const recommendations = generateRecommendations(scores, profileType)

  // Determine learning path from learning style score
  const learningPath = determineLearningPath(scores.learningStyle)

  // Determine dashboard layout from profile type
  const dashboardLayout = getDashboardLayout(profileType)

  // Determine alert thresholds from profile type
  const alertThresholds = getAlertThresholds(profileType)

  return {
    type: profileType,
    scores,
    learningPath,
    dashboardLayout,
    alertThresholds
  }
}

function calculateSectionScores(answers: AnswerMap): Record<SectionKey, number> {
  const sectionTotals: Record<string, { total: number; max: number }> = {}

  for (const [questionId, answer] of Object.entries(answers)) {
    const question = questions.find(q => q.id === questionId)
    if (!question) continue

    if (!sectionTotals[question.section]) {
      sectionTotals[question.section] = { total: 0, max: 0 }
    }

    const numericAnswer = typeof answer === 'number' ? answer : parseInt(answer as string)
    sectionTotals[question.section].total += numericAnswer * question.weight
    sectionTotals[question.section].max += 5 * question.weight // Assuming max is 5
  }

  // Convert to 0-100 scale
  const result: Record<SectionKey, number> = {
    riskPersonality: 0,
    emotionalStability: 0,
    decisionMaking: 0,
    tradingBehavior: 0,
    learningStyle: 0
  }

  for (const [section, { total, max }] of Object.entries(sectionTotals)) {
    result[section as SectionKey] = max > 0 ? Math.round((total / max) * 100) : 0
  }

  return result
}

function determineProfileType(scores: Record<SectionKey, number>): ProfileType {
  // Find highest-scoring section
  const entries = Object.entries(scores) as [SectionKey, number][]
  const sorted = entries.sort((a, b) => b[1] - a[1])
  const [primarySection, primaryScore] = sorted[0]

  // Map section + score range to profile type
  if (primarySection === 'riskPersonality' && primaryScore > 70) {
    return 'warrior'
  }
  if (primarySection === 'riskPersonality' && primaryScore <= 70) {
    return 'sniper'
  }
  if (primarySection === 'decisionMaking' && primaryScore > 60) {
    return 'analyst'
  }
  if (primarySection === 'tradingBehavior' && primaryScore > 70) {
    return 'disciplinarian'
  }
  if (primarySection === 'emotionalStability' && primaryScore < 50) {
    return 'opportunist'
  }

  // Default fallback
  return 'analyst'
}

function determineLearningPath(learningStyleScore: number): string {
  if (learningStyleScore <= 33) return 'visual'
  if (learningStyleScore <= 66) return 'structured'
  return 'practical'
}

function getDashboardLayout(profileType: ProfileType): DashboardLayout {
  const layouts: Record<ProfileType, DashboardLayout> = {
    sniper: { primaryWidget: 'analysis', widgetOrder: ['analysis', 'performance', 'alerts', 'risk'] },
    analyst: { primaryWidget: 'metrics', widgetOrder: ['metrics', 'charts', 'performance', 'alerts'] },
    warrior: { primaryWidget: 'quickActions', widgetOrder: ['quickActions', 'alerts', 'journal', 'performance'] },
    disciplinarian: { primaryWidget: 'checklists', widgetOrder: ['checklists', 'adherence', 'performance', 'metrics'] },
    opportunist: { primaryWidget: 'tools', widgetOrder: ['tools', 'alerts', 'journal', 'performance'] }
  }
  return layouts[profileType]
}

function getAlertThresholds(profileType: ProfileType): AlertThresholds {
  const thresholds: Record<ProfileType, AlertThresholds> = {
    sniper: { riskSensitivity: 'medium', alertFrequency: 'normal' },
    analyst: { riskSensitivity: 'high', alertFrequency: 'detailed' },
    warrior: { riskSensitivity: 'low', alertFrequency: 'minimal' },
    disciplinarian: { riskSensitivity: 'high', alertFrequency: 'normal' },
    opportunist: { riskSensitivity: 'medium', alertFrequency: 'normal' }
  }
  return thresholds[profileType]
}
```
Source: [ASSUMED] - Custom algorithm based on standard psychometric practices

### Pattern 3: Supabase Profile Storage with RLS
**What:** Store trader profiles in Supabase with row-level security
**When to use:** DNA-07 profile persistence, DNA-10 profile display
**Example:**
```sql
-- Database schema for trader profiles
CREATE TABLE trader_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('sniper', 'analyst', 'warrior', 'disciplinarian', 'opportunist')),
  risk_personality_score INT CHECK (risk_personality_score BETWEEN 0 AND 100),
  emotional_stability_score INT CHECK (emotional_stability_score BETWEEN 0 AND 100),
  decision_making_score INT CHECK (decision_making_score BETWEEN 0 AND 100),
  trading_behavior_score INT CHECK (trading_behavior_score BETWEEN 0 AND 100),
  learning_style_score INT CHECK (learning_style_score BETWEEN 0 AND 100),
  learning_path TEXT CHECK (learning_path IN ('visual', 'structured', 'practical')),
  dashboard_layout JSONB DEFAULT '{"widgetOrder": ["performance", "alerts", "metrics"]}',
  alert_thresholds JSONB DEFAULT '{"riskSensitivity": "medium", "alertFrequency": "normal"}',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trader_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own profile
CREATE POLICY "Users can read own profile"
ON trader_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Users can only insert their own profile
CREATE POLICY "Users can create own profile"
ON trader_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON trader_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);
```
Source: [VERIFIED: Context7 /websites/supabase database RLS documentation]

### Pattern 4: Question Data Structure
**What:** TypeScript interface for assessment questions with multiple question types
**When to use:** DNA-01 through DNA-06 question rendering
**Example:**
```typescript
// types/trader-dna.ts

type SectionKey = 'riskPersonality' | 'emotionalStability' | 'decisionMaking' | 'tradingBehavior' | 'learningStyle'

type QuestionType = 'multiple_choice' | 'rating' | 'scenario' | 'frequency'

interface QuestionOption {
  value: number | string
  label: string
  description?: string
}

interface AssessmentQuestion {
  id: string
  section: SectionKey
  type: QuestionType
  question: string
  options: QuestionOption[]
  weight: number // Multiplier for scoring (e.g., 1.0, 1.5, 2.0)
  category?: string // For grouping questions within section
}

interface Section {
  title: string
  description: string
  questionCount: number
}

const sections: Record<SectionKey, Section> = {
  riskPersonality: {
    title: 'Risk Personality',
    description: 'How you handle risk, losses, and recovery',
    questionCount: 8
  },
  emotionalStability: {
    title: 'Emotional Stability',
    description: 'Your emotional responses during trading',
    questionCount: 8
  },
  decisionMaking: {
    title: 'Decision Making Style',
    description: 'How you analyze and execute trades',
    questionCount: 8
  },
  tradingBehavior: {
    title: 'Trading Behavior',
    description: 'Your habits and patterns',
    questionCount: 8
  },
  learningStyle: {
    title: 'Learning Style',
    description: 'How you prefer to learn and improve',
    questionCount: 8
  }
}
```
Source: [ASSUMED] - Standard question data structure pattern

### Anti-Patterns to Avoid

- **Anti-pattern: Storing all assessment answers in localStorage** — If user leaves and returns, they lose progress. Store partially completed assessments in Supabase with a "in_progress" status, or use URL state for section navigation.

- **Anti-pattern: Calculating profile on server for every answer** — Unnecessary round-trips. Calculate on client when assessment completes, send final profile to server.

- **Anti-pattern: Hardcoding questions in component JSX** — Questions should be data (constant file or database) not code. This allows easier updates and A/B testing of questions.

- **Anti-pattern: No validation before profile generation** — Ensure all required questions are answered. Partial profiles cause issues in downstream phases.

- **Anti-pattern: Storing profile type as enum in multiple places** — Use the database CHECK constraint to enforce valid types, single source of truth.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom validation logic | zod | Type-safe schema validation, easy to compose |
| Progress persistence | Custom localStorage sync | URL state or Supabase draft | Simple state management, no sync issues |
| Profile type mapping | Complex switch statements | Lookup table object | Cleaner, easier to maintain |
| Responsive wizard | Custom CSS breakpoints | Tailwind responsive classes | Consistent with Phase 1 |

**Key insight:** The profile scoring algorithm is trading-domain specific but follows standard psychometric patterns. Use weighted sums per section mapped to profile types — avoid over-engineering with complex ML or statistical models that lack interpretability.

---

## Runtime State Inventory

> This section is not applicable for Phase 2 — this is a greenfield feature, no existing runtime state to migrate.

**Step 2.5: SKIPPED (no rename/refactor/migration — greenfield feature)**

---

## Common Pitfalls

### Pitfall 1: Assessment Abandonment Without Progress Save
**What goes wrong:** User starts assessment, closes browser, loses all progress
**Why it happens:** No intermediate save, localStorage alone is unreliable
**How to avoid:** Save draft to Supabase after each section completion, restore on return
**Warning signs:** High drop-off at section boundaries, users restarting assessment

### Pitfall 2: Questions Not Balanced Across Sections
**What goes wrong:** Some sections have more questions, skewing scores
**Why it happens:** Each section should have equal number of weighted questions
**How to avoid:** Normalize scores to 0-100 scale regardless of question count per section
**Warning signs:** Certain profile types never get selected, score distribution is skewed

### Pitfall 3: Profile Type Edge Cases Not Handled
**What goes wrong:** User gets "average" scores, doesn't clearly map to any type
**Why it happens:** Deterministic mapping without fallback for ambiguous profiles
**How to avoid:** Add "balanced" profile type or default to most common type (Analyst) for edge cases
**Warning signs:** Users with mid-range scores get inconsistent profiles

### Pitfall 4: Dashboard Layout Not Adapting to Profile
**What goes wrong:** DNA-08 personalized dashboard never renders differently
**Why it happens:** Layout component not reading profile_type or dashboard_layout from DB
**How to avoid:** Query profile on dashboard load, pass layout config to dashboard components
**Warning signs:** All users see identical dashboard regardless of their trader type

### Pitfall 5: Learning Path Not Integrated with Education
**What goes wrong:** DNA-09 recommends learning path but Phase 7 (Education) doesn't use it
**Why it happens:** Phases built in isolation, no shared config
**How to avoid:** Store learning_path in profile, read in Phase 7 to filter/prioritize courses
**Warning signs:** Users see "recommended for you" but see same content as everyone else

---

## Code Examples

### Question Data Structure with All 5 Sections
```typescript
// data/trader-dna/questions.ts

import { AssessmentQuestion } from '@/types/trader-dna'

export const questions: AssessmentQuestion[] = [
  // Section 1: Risk Personality (DNA-02)
  {
    id: 'risk-1',
    section: 'riskPersonality',
    type: 'scenario',
    question: 'After a significant losing trade, what is your typical response?',
    options: [
      { value: 1, label: 'Take a break and analyze what went wrong' },
      { value: 2, label: 'Immediately look for another opportunity to recover' },
      { value: 3, label: 'Reduce position size and wait for clear signals' },
      { value: 4, label: 'Double down to recover losses quickly' }
    ],
    weight: 1.5
  },
  {
    id: 'risk-2',
    section: 'riskPersonality',
    type: 'rating',
    question: 'How would you rate your risk tolerance on a scale of 1-5?',
    options: [
      { value: 1, label: '1 - Very conservative' },
      { value: 2, label: '2 - Conservative' },
      { value: 3, label: '3 - Moderate' },
      { value: 4, label: '4 - Aggressive' },
      { value: 5, label: '5 - Very aggressive' }
    ],
    weight: 1.0
  },
  // ... 6 more risk personality questions

  // Section 2: Emotional Stability (DNA-03)
  {
    id: 'emot-1',
    section: 'emotionalStability',
    type: 'scenario',
    question: 'When a trade goes against you immediately after entry:',
    options: [
      { value: 1, label: 'Stay calm and wait for the plan to play out' },
      { value: 2, label: 'Feel anxious and consider closing early' },
      { value: 3, label: 'Adjust stop loss to give more room' },
      { value: 4, label: 'Panic and close immediately' }
    ],
    weight: 1.5
  },
  // ... 7 more emotional stability questions

  // Section 3: Decision Making (DNA-04)
  {
    id: 'dec-1',
    section: 'decisionMaking',
    type: 'scenario',
    question: 'Before entering a trade, how do you typically decide?',
    options: [
      { value: 1, label: 'Follow a detailed checklist and rules' },
      { value: 2, label: 'Analyze multiple indicators and data points' },
      { value: 3, label: 'Trust my gut feeling and intuition' },
      { value: 4, label: 'React to price action and market movement' }
    ],
    weight: 1.5
  },
  // ... 7 more decision making questions

  // Section 4: Trading Behavior (DNA-05)
  {
    id: 'beh-1',
    section: 'tradingBehavior',
    type: 'frequency',
    question: 'How often do you overtrade (take more trades than planned)?',
    options: [
      { value: 1, label: 'Never' },
      { value: 2, label: 'Rarely' },
      { value: 3, label: 'Sometimes' },
      { value: 4, label: 'Often' },
      { value: 5, label: 'Always' }
    ],
    weight: 1.5
  },
  // ... 7 more trading behavior questions

  // Section 5: Learning Style (DNA-06)
  {
    id: 'learn-1',
    section: 'learningStyle',
    type: 'multiple_choice',
    question: 'How do you prefer to learn new trading concepts?',
    options: [
      { value: 1, label: 'Watching videos and visual demonstrations' },
      { value: 2, label: 'Reading detailed articles and documentation' },
      { value: 3, label: 'Practicing with real examples and simulations' }
    ],
    weight: 1.0
  },
  // ... 7 more learning style questions
]

export const sections = {
  riskPersonality: { title: 'Risk Personality', description: 'How you handle risk, losses, and recovery', questionCount: 8 },
  emotionalStability: { title: 'Emotional Stability', description: 'Your emotional responses during trading', questionCount: 8 },
  decisionMaking: { title: 'Decision Making Style', description: 'How you analyze and execute trades', questionCount: 8 },
  tradingBehavior: { title: 'Trading Behavior', description: 'Your habits and patterns', questionCount: 8 },
  learningStyle: { title: 'Learning Style', description: 'How you prefer to learn and improve', questionCount: 8 }
}
```
Source: [ASSUMED] - Standard question data structure based on CONTEXT.md specifications

### Server Action: Save Trader Profile
```typescript
// lib/trader-profile.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { TraderProfile } from '@/types/trader-dna'

export async function saveTraderProfile(profile: TraderProfile) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('trader_profiles')
    .upsert({
      id: user.id,
      profile_type: profile.type,
      risk_personality_score: profile.scores.riskPersonality,
      emotional_stability_score: profile.scores.emotionalStability,
      decision_making_score: profile.scores.decisionMaking,
      trading_behavior_score: profile.scores.tradingBehavior,
      learning_style_score: profile.scores.learningStyle,
      learning_path: profile.learningPath,
      dashboard_layout: profile.dashboardLayout,
      alert_thresholds: profile.alertThresholds,
      completed_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    })

  if (error) {
    throw new Error(`Failed to save profile: ${error.message}`)
  }

  return { success: true }
}

export async function getTraderProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('trader_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return null
  }

  return data
}
```
Source: [VERIFIED: Context7 /websites/supabase documentation patterns]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single-page long form | Multi-step wizard | Modern UX | Better completion rates, progress visibility |
| Server-side scoring | Client-side calculate + server save | SPA era | Faster user feedback, less server load |
| Hardcoded profile types | Configurable type definitions | Dynamic apps | Easier to add/modify types |
| localStorage for progress | Database draft state | Persistence needs | Works across devices, survives browser close |

**Deprecated/outdated:**
- Multi-page form with server round-trips per step — replaced by client-state wizard
- Server-side profile calculation — client calculation is faster, server only persists

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Questions use 5-option scale (1-5) | Question Data | LOW - Standard psychometric scale |
| A2 | Profile type can be deterministically mapped | Scoring Algorithm | MEDIUM - May need refinement based on user testing |
| A3 | Dashboard layout JSONB is sufficient | Database Schema | LOW - JSONB flexible for layout config |
| A4 | 8 questions per section is appropriate | Question Count | MEDIUM - May need adjustment based on completion data |

---

## Open Questions

1. **Question Count per Section**
   - What we know: CONTEXT.md specifies 5 sections with 8-10 questions each
   - What's unclear: Exact distribution, whether all sections need same count
   - Recommendation: Start with 8 per section (40 total), adjust based on completion rates

2. **Scoring Algorithm Refinement**
   - What we know: Weighted sum mapped to 5 profile types
   - What's unclear: Whether equal weights per question or variable weights per importance
   - Recommendation: Use variable weights (higher for scenario questions than rating questions)

3. **Profile Versioning**
   - What we know: Single profile per user currently
   - What's unclear: Whether to allow re-assessment or version history later
   - Recommendation: Store only latest profile, add re-assessment as Phase 7+ future feature

4. **Completion Tracking**
   - What we know: Track completed_at timestamp
   - What's unclear: Whether to track partial progress or just completed profiles
   - Recommendation: Store draft state in progress field, save full on completion

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/development | Check on machine | — | — |
| npm/pnpm | Package management | Check on machine | — | — |
| Supabase | Database/Auth | Already configured (Phase 1) | — | — |
| Next.js | Framework | Already in project (Phase 1) | — | — |

**Missing dependencies with no fallback:**
- None identified — Phase 2 uses same stack as Phase 1

**Step 2.6: SKIPPED (no external dependencies beyond Phase 1 stack)**

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (bundled with Next.js) |
| Config file | `vitest.config.ts` (create if needed) |
| Quick run command | `npm run lint` |
| Full suite command | `npm run build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DNA-01 | Assessment questionnaire renders | smoke | `npm run build` | ✅ |
| DNA-02 | Risk personality questions work | unit | Component test | ❌ Wave 0 |
| DNA-03 | Emotional stability scenarios work | unit | Component test | ❌ Wave 0 |
| DNA-04 | Decision-making questions work | unit | Component test | ❌ Wave 0 |
| DNA-05 | Trading behavior questions work | unit | Component test | ❌ Wave 0 |
| DNA-06 | Learning style works | unit | Component test | ❌ Wave 0 |
| DNA-07 | Profile generation calculates correctly | unit | `npm run test` | ❌ Wave 0 |
| DNA-08 | Dashboard layout applies | integration | Browser test | ❌ Wave 0 |
| DNA-09 | Learning path recommendation displays | unit | Component test | ❌ Wave 0 |
| DNA-10 | Profile summary renders correctly | smoke | Visual test | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run lint`
- **Per wave merge:** `npm run build`
- **Phase gate:** Full build + manual test of assessment flow

### Wave 0 Gaps
- [ ] `src/data/trader-dna/questions.ts` — All 40 assessment questions
- [ ] `src/data/trader-dna/scoring.ts` — Profile calculation algorithm
- [ ] `src/types/trader-dna.ts` — TypeScript interfaces
- [ ] `src/components/trader-dna/assessment-wizard.tsx` — Multi-step form
- [ ] `src/components/trader-dna/question-card.tsx` — Question renderer
- [ ] `src/components/trader-dna/progress-bar.tsx` — Visual progress
- [ ] `src/components/trader-dna/profile-summary.tsx` — DNA-10 display
- [ ] `src/lib/trader-profile.ts` — Server actions for profile CRUD
- [ ] Database migration for `trader_profiles` table
- [ ] RLS policies for trader_profiles table

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Supabase Auth (already in Phase 1) |
| V3 Session Management | yes | @supabase/ssr cookies (already in Phase 1) |
| V4 Access Control | yes | RLS policies on trader_profiles table |
| V5 Input Validation | yes | zod schemas for answer validation |
| V6 Cryptography | yes | Supabase handles at rest (PostgreSQL encryption) |

### Known Threat Patterns for Trader DNA System

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Profile tampering via API | Tampering | RLS policy ensures user can only modify own profile |
| Score manipulation | Tampering | Client calculates, server trusts but can re-validate |
| Accessing other users' profiles | Information Disclosure | RLS SELECT policy restricts to auth.uid() = id |
| Invalid profile_type injection | Tampering | CHECK constraint on profile_type column |
| Question answer injection | Tampering | Validate answer values against question options |

---

## Sources

### Primary (HIGH confidence)
- [Context7 /websites/nextjs] - Multi-step form patterns, useActionState for form management
- [Context7 /websites/supabase] - Database schema, RLS policies, row-level security
- [VERIFIED: npm registry] - Package versions: zod, react-hook-form, @tanstack/react-query

### Secondary (MEDIUM confidence)
- [nextjs.org/docs/app/guides/preserving-ui-state] - Multi-step wizard state preservation
- [supabase.com/docs/guides/database/postgres/row-level-security] - RLS policy patterns

### Tertiary (LOW confidence)
- [WebSearch] - Psychological assessment scoring algorithms - requires verification against business requirements

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH - Uses Phase 1 stack + standard React form libraries
- Architecture: HIGH - Patterns verified via Context7 and standard React patterns
- Pitfalls: MEDIUM - Based on common multi-step form issues, not Phase 2 specific

**Research date:** 2026-05-08
**Valid until:** 2026-06-08 (30 days for stable tech)

---

## RESEARCH COMPLETE

**Phase:** 2 - Trader DNA
**Confidence:** HIGH

### Key Findings
1. Multi-step assessment wizard should use useState for step/answer management with progress bar
2. Profile scoring uses weighted answer values mapped to 5 profile types via dominant section
3. Database schema stores all 5 section scores + learning_path + dashboard_layout as JSONB
4. Dashboard personalization reads profile_type to determine widget order and emphasis
5. Learning path recommendation derives from learning_style_score (visual/structured/practical)

### File Created
`.planning/phases/02-trader-dna/02-RESEARCH.md`

### Confidence Assessment
| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | Uses Phase 1 stack + standard libraries verified via npm |
| Architecture | HIGH | Patterns from Context7 for Next.js and Supabase |
| Pitfalls | MEDIUM | Common multi-step form issues documented |

### Open Questions
- Exact question count per section (40 total recommended)
- Whether scoring weights should vary by question importance
- Whether to support re-assessment or profile versioning in future

### Ready for Planning
Research complete. Planner can now create PLAN.md files for Phase 2.