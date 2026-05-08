-- 008_add_strategies.sql
-- Strategy Lab: Strategies table

-- Strategies table
CREATE TABLE IF NOT EXISTS strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  entry_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  exit_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_tested_at TIMESTAMPTZ
);

-- Indexes for strategies
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategies_created_at ON strategies(created_at);

-- Enable Row Level Security
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for strategies
CREATE POLICY "strategies_select" ON strategies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "strategies_insert" ON strategies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "strategies_update" ON strategies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "strategies_delete" ON strategies FOR DELETE USING (auth.uid() = user_id);

-- Seed sample strategies for testing
-- (Will be created by users in the app)