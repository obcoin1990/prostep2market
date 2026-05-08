# Phase 2: Trader DNA - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning
**Source:** YOLO mode (skipping discuss-phase per config)

<domain>
## Phase Boundary

Build the Trader DNA psychological assessment system that creates personalized trader profiles based on 5 assessment categories. The system analyzes risk personality, emotional stability, decision-making style, trading behavior, and learning style to generate a trader profile type.

</domain>

<decisions>
## Implementation Decisions

### Assessment Structure
- **5 Assessment Sections:**
  1. Risk Personality — aggression level, risk appetite, loss tolerance, recovery behavior
  2. Emotional Stability — impulsiveness, patience, frustration response, revenge tendencies
  3. Decision Making Style — analytical trader, emotional trader, reactive trader, structured trader
  4. Trading Behavior — overtrading probability, FOMO tendencies, discipline level, consistency habits
  5. Learning Style — visual learner, structured learner, practical learner

### Assessment Questions
- Risk Personality: multiple choice with behavioral scenarios
- Emotional Stability: situational judgment questions
- Decision Making Style: scenario-based choices revealing trading approach
- Trading Behavior: habit and frequency questions
- Learning Style: preference selection

### Profile Generation Algorithm
- Scoring based on weighted answers
- Profile types: The Sniper, The Analyst, The Warrior, The Disciplinarian, The Opportunist
- Profile determines dashboard layout, coaching approach, alert sensitivity

### Profile Types
| Type | Characteristics | Dashboard Emphasis | Alert Sensitivity |
|------|-----------------|-------------------|-------------------|
| The Sniper | Patient, high conviction | Detailed analysis, waiting signals | Medium |
| The Analyst | Data-driven, systematic | Charts, metrics, reports | High |
| The Warrior | Aggressive, confident | Quick actions, shortcuts | Low |
| The Disciplinarian | Strict rules, consistent | Checklists, adherence metrics | High |
| The Opportunist | Adaptive, flexible | Multiple tools, quick switching | Medium |

### Dashboard Personalization
- Profile type determines default widget arrangement
- Alert thresholds adjusted per profile type
- Learning path recommendation based on learning style

### Integration Points
- Depends on Phase 1 auth and dashboard (ONBD-01)
- Profile stored in Supabase (extend profiles table)
- Profile affects Risk Guardian thresholds (Phase 5)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `RESEURCES/modules.md` — Module 1 Trader DNA System specification
- `RESEURCES/onboarding.md` — Step 2 Trader DNA Assessment flow
- `.planning/REQUIREMENTS.md` — Phase 2 requirements (DNA-01 to DNA-10)
- `.planning/ROADMAP.md` — Phase 2 success criteria
- `.planning/phases/01-foundation-auth/01-CONTEXT.md` — Phase 1 context (auth structure)

### Tech Decisions from Phase 1
- Next.js App Router with TypeScript
- Supabase for database
- Tailwind CSS for styling
- Brand colors: Red #E53935, Green #2E7D32, Black #0B0B0B

</canonical_refs>

<specifics>
## Specific Ideas

### Assessment Flow
1. User completes 5 sections with 8-10 questions each
2. Answers scored with weighted algorithm
3. Profile type calculated from scores
4. Profile summary displayed with type description
5. Learning path recommendation generated

### Question Types
- Multiple choice (single answer)
- Rating scales (1-5)
- Scenario selection (which would you do)
- Frequency questions (never/sometimes/often/always)

### Profile Calculation
```typescript
interface TraderProfile {
  type: 'sniper' | 'analyst' | 'warrior' | 'disciplinarian' | 'opportunist';
  scores: {
    riskPersonality: number;
    emotionalStability: number;
    decisionMaking: number;
    tradingBehavior: number;
    learningStyle: number;
  };
  recommendations: string[];
  dashboardLayout: string;
  alertThresholds: AlertThresholds;
}
```

### Database Schema
```sql
CREATE TABLE trader_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  profile_type TEXT NOT NULL,
  risk_personality_score INT,
  emotional_stability_score INT,
  decision_making_score INT,
  trading_behavior_score INT,
  learning_style_score INT,
  learning_path TEXT,
  dashboard_layout JSONB,
  alert_thresholds JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### UI Components
- Assessment progress bar
- Question card with options
- Profile summary card
- Learning path display
- Dashboard layout preview

### Question Data Structure
```typescript
interface AssessmentQuestion {
  id: string;
  section: 'risk_personality' | 'emotional_stability' | 'decision_making' | 'trading_behavior' | 'learning_style';
  type: 'multiple_choice' | 'rating' | 'scenario' | 'frequency';
  question: string;
  options: QuestionOption[];
  weight: number;
}
```

</specifics>

<deferred>
## Deferred Ideas

- AI-generated personalized coaching messages (Phase 4 AI engine)
- Advanced profile comparison with other traders (Phase 6 leaderboard)
- Profile evolution tracking over time (future feature)

None — Phase 2 is self-contained.

</deferred>

---

*Phase: 02-trader-dna*
*Context gathered: 2026-05-08 via YOLO mode*