-- 007_add_education.sql
-- Education Hub: Courses, Lessons, Quizzes, Progress tracking, and Certificates

-- Learning Paths (metadata, not a table - paths are enum values)
-- Paths: beginner, intermediate, advanced, psychology-first

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
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

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reading', 'video', 'interactive')),
  duration_minutes INT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  passing_score INT DEFAULT 70,
  max_attempts INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INT NOT NULL,
  explanation TEXT,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Progress table
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lessons_completed UUID[] DEFAULT '{}',
  quiz_score INT,
  quiz_attempts INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('first_course_complete', 'path_complete', 'quiz_perfect', 'streak_7_days', 'all_courses_complete')),
  name TEXT NOT NULL,
  description TEXT,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  course_id UUID REFERENCES courses(id),
  UNIQUE(user_id, type, course_id)
);

-- Indexes for courses
CREATE INDEX IF NOT EXISTS idx_courses_path ON courses(path);
CREATE INDEX IF NOT EXISTS idx_courses_order ON courses(path, order_index);

-- Indexes for lessons
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);

-- Indexes for quizzes
CREATE INDEX IF NOT EXISTS idx_quizzes_course_id ON quizzes(course_id);

-- Indexes for quiz_questions
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON quiz_questions(quiz_id, order_index);

-- Indexes for course_progress
CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_course ON course_progress(user_id, course_id);

-- Indexes for badges
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(type);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses (public read)
CREATE POLICY "courses_select" ON courses FOR SELECT USING (true);

-- RLS Policies for lessons (public read)
CREATE POLICY "lessons_select" ON lessons FOR SELECT USING (true);

-- RLS Policies for quizzes (public read)
CREATE POLICY "quizzes_select" ON quizzes FOR SELECT USING (true);

-- RLS Policies for quiz_questions (public read)
CREATE POLICY "quiz_questions_select" ON quiz_questions FOR SELECT USING (true);

-- RLS Policies for course_progress
CREATE POLICY "course_progress_select" ON course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "course_progress_insert" ON course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "course_progress_update" ON course_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for badges
CREATE POLICY "badges_select" ON badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "badges_insert" ON badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed data for Learning Paths and Courses

-- Beginner Path Courses
INSERT INTO courses (path, title, description, type, duration_minutes, order_index, certificate_eligible) VALUES
('beginner', 'Trading Psychology Fundamentals', 'Understanding the mental aspects of trading and how emotions affect decision-making', 'video', 45, 1, true),
('beginner', 'Market Basics Explained', 'Introduction to financial markets, how prices move, and basic terminology', 'reading', 30, 2, true),
('beginner', 'Introduction to Technical Analysis', 'Basic chart patterns and indicators every trader should know', 'interactive', 60, 3, true),
('beginner', 'Risk Management Essentials', 'Core principles of position sizing and risk control', 'video', 40, 4, true);

-- Intermediate Path Courses
INSERT INTO courses (path, title, description, type, duration_minutes, order_index, certificate_eligible) VALUES
('intermediate', 'Advanced Chart Patterns', 'Complex candlestick patterns and their significance', 'interactive', 75, 1, true),
('intermediate', 'Price Action Trading', 'Mastering price movement analysis and trade execution', 'video', 90, 2, true),
('intermediate', 'Support and Resistance Levels', 'Identifying and trading key market levels', 'reading', 45, 3, true),
('intermediate', 'Trend Trading Strategies', 'Following the trend and catching larger moves', 'video', 60, 4, true);

-- Advanced Path Courses
INSERT INTO courses (path, title, description, type, duration_minutes, order_index, certificate_eligible) VALUES
('advanced', 'Institutional Concepts for Retail Traders', 'Understanding how large players operate in the market', 'video', 90, 1, true),
('advanced', 'Liquidity and Market Structure', 'Analyzing order flow and market structure', 'interactive', 80, 2, true),
('advanced', 'Advanced Risk Reward Analysis', 'Optimizing trade setups for maximum efficiency', 'video', 60, 3, true),
('advanced', 'Multi-Timeframe Analysis', 'Trading across different timeframes for better accuracy', 'reading', 55, 4, true);

-- Psychology-First Path Courses
INSERT INTO courses (path, title, description, type, duration_minutes, order_index, certificate_eligible) VALUES
('psychology-first', 'Emotional Control in Trading', 'Managing emotions during live market conditions', 'video', 50, 1, true),
('psychology-first', 'Building Trading Discipline', 'Developing consistent habits and routines', 'reading', 35, 2, true),
('psychology-first', 'Trading Journal Mastery', 'Using journaling to improve performance', 'interactive', 45, 3, true),
('psychology-first', 'Recovery Strategies After Losses', 'Bounce back techniques after losing trades', 'video', 40, 4, true);

-- Seed lessons for "Trading Psychology Fundamentals" (first course)
INSERT INTO lessons (course_id, title, content, type, duration_minutes, order_index)
SELECT id, 'Introduction to Trading Psychology', '## Why Psychology Matters in Trading

Trading is often described as 90% psychological and 10% technical. The ability to manage emotions, maintain discipline, and stick to a trading plan is what separates successful traders from the majority who lose money.

### Key Psychological Challenges

- **Fear of missing out (FOMO)** - Chasing trades after they have already moved
- **Fear of losing** - Avoiding valid trade setups
- **Overconfidence** - Taking excessive risk after a winning streak
- **Revenge trading** - Trying to recover losses immediately

### The Trading Mindset

A professional trader views trading as a business, not a gamble. Every trade is a probability calculation, and losses are simply the cost of doing business.

## Understanding Your Emotions

Emotions are not the enemy. They are information. Learning to recognize and regulate your emotional state is the first step to becoming a consistent trader.', 'reading', 10, 1
FROM courses WHERE title = 'Trading Psychology Fundamentals';

INSERT INTO lessons (course_id, title, content, type, duration_minutes, order_index)
SELECT id, 'Identifying Emotional Triggers', '## What Triggers Your Trading Emotions?

Every trader has specific situations that trigger emotional responses. Common triggers include:

### External Triggers
- Major news events
- Sudden price movements
- Social media trading groups
- Comments from other traders

### Internal Triggers
- Consecutive losses
- Missing a trade
- Large open positions
- Boredom or fatigue

## Building Awareness

Start a trading journal that tracks not just your trades, but your emotional state before, during, and after each trade. Over time, patterns will emerge that help you identify your personal triggers.', 'reading', 12, 2
FROM courses WHERE title = 'Trading Psychology Fundamentals';

INSERT INTO lessons (course_id, title, content, type, duration_minutes, order_index)
SELECT id, 'Practical Emotional Regulation Techniques', '## Techniques for Managing Emotions

### 1. The Pause Method
When you feel emotions rising, pause for 30 seconds before making any trading decision. Take three deep breaths.

### 2. The 5-5-5 Rule
Ask yourself: "Will this matter in 5 minutes? 5 hours? 5 days?" If not, let it go.

### 3. Physical Reset
- Step away from the screen
- Do some light stretching
- Splash cold water on your face

### 4. Pre-Trading Routine
Establish a consistent routine before each trading session to put yourself in the right mental state.

## Practice Exercise

For the next week, practice identifying and labeling your emotions during trading. Simply notice "I am feeling anxious" without trying to change it.', 'reading', 15, 3
FROM courses WHERE title = 'Trading Psychology Fundamentals';

-- Seed lessons for "Risk Management Essentials"
INSERT INTO lessons (course_id, title, content, type, duration_minutes, order_index)
SELECT id, 'Position Sizing Fundamentals', '## Why Position Sizing Matters

Position sizing determines how much capital you risk on any single trade. It is the most important aspect of risk management.

### The 1% Rule
Most professional traders risk no more than 1-2% of their trading capital on any single trade.

### Calculating Position Size
```
Position Size = (Account Balance × Risk %) / Stop Loss in Pips
```

### Example
- Account Balance: $10,000
- Risk: 2% ($200)
- Stop Loss: 50 pips
- Position Size = $200 / 50 = 4 mini lots', 'reading', 12, 1
FROM courses WHERE title = 'Risk Management Essentials';

INSERT INTO lessons (course_id, title, content, type, duration_minutes, order_index)
SELECT id, 'Reward to Risk Ratios', '## Understanding R:R Ratios

The reward-to-risk ratio compares potential profit to potential loss.

### Why R:R Matters
Even with a 50% win rate, a positive R:R can be profitable:
- 2:1 R:R with 50% win rate = 0.5 × 2 - 0.5 = 0.5R profit per trade

### Minimum R:R Recommendation
Always aim for at least 1.5:1 or better. 2:1 is ideal for most strategies.

### Position Sizing with R:R
Once you determine your R:R target, work backwards to find your stop loss placement.', 'reading', 10, 2
FROM courses WHERE title = 'Risk Management Essentials';

-- Seed quiz for "Trading Psychology Fundamentals"
INSERT INTO quizzes (course_id, passing_score, max_attempts)
SELECT id, 70, 3
FROM courses WHERE title = 'Trading Psychology Fundamentals';

-- Seed questions for the quiz
INSERT INTO quiz_questions (quiz_id, question_text, options, correct_index, explanation, order_index)
SELECT q.id, 'What percentage of trading is psychological?',
  ARRAY['10%', '50%', '90%', '25%'], 2,
  'Trading is often described as 90% psychological and 10% technical. The mental aspect of trading is what separates successful traders from the majority.', 1
FROM quizzes q
JOIN courses c ON q.course_id = c.id
WHERE c.title = 'Trading Psychology Fundamentals';

INSERT INTO quiz_questions (quiz_id, question_text, options, correct_index, explanation, order_index)
SELECT q.id, 'What does FOMO stand for in trading?',
  ARRAY['Fear Of Making Orders', 'Fear Of Missing Out', 'Financial Opportunity Market Option', 'Following Only Market Orders'], 1,
  'FOMO (Fear Of Missing Out) is the anxiety that occurs when you see a trade moving without being in it, often leading to poor entry decisions.', 2
FROM quizzes q
JOIN courses c ON q.course_id = c.id
WHERE c.title = 'Trading Psychology Fundamentals';

INSERT INTO quiz_questions (quiz_id, question_text, options, correct_index, explanation, order_index)
SELECT q.id, 'What is the recommended maximum risk per trade?',
  ARRAY['5%', '10%', '1-2%', '20%'], 2,
  'Most professional traders risk no more than 1-2% of their trading capital on any single trade to preserve capital through losing streaks.', 3
FROM quizzes q
JOIN courses c ON q.course_id = c.id
WHERE c.title = 'Trading Psychology Fundamentals';

INSERT INTO quiz_questions (quiz_id, question_text, options, correct_index, explanation, order_index)
SELECT q.id, 'What is a good minimum reward-to-risk ratio?',
  ARRAY['0.5:1', '1:1', '1.5:1 to 2:1', '5:1'], 2,
  'A minimum of 1.5:1 is recommended, with 2:1 being ideal. This allows profitability even with a 50% win rate.', 4
FROM quizzes q
JOIN courses c ON q.course_id = c.id
WHERE c.title = 'Trading Psychology Fundamentals';

INSERT INTO quiz_questions (quiz_id, question_text, options, correct_index, explanation, order_index)
SELECT q.id, 'What technique involves pausing for 30 seconds before trading decisions?',
  ARRAY['The 5-5-5 Rule', 'The Pause Method', 'Physical Reset', 'Pre-Trading Routine'], 1,
  'The Pause Method involves taking a 30-second pause and three deep breaths when feeling emotions rising, before making any trading decision.', 5
FROM quizzes q
JOIN courses c ON q.course_id = c.id
WHERE c.title = 'Trading Psychology Fundamentals';