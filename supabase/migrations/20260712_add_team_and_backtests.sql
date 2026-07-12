-- 20260712_add_team_and_backtests.sql
-- Adds team_members table and strategy_backtests for dashboard conversion

-- Team members — team dashboard page
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  avatar_url TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_owner ON team_members (owner_id);

-- Strategy backtests — strategy lab page (performance stats per strategy)
CREATE TABLE IF NOT EXISTS strategy_backtests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  period TEXT,
  total_trades INT DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  net_pnl_r DECIMAL(8,2) DEFAULT 0,
  max_drawdown_pct DECIMAL(5,2) DEFAULT 0,
  sharpe_ratio DECIMAL(5,2) DEFAULT 0,
  status TEXT DEFAULT 'completed' CHECK (status IN ('running', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strategy_backtests_user ON strategy_backtests (user_id, created_at DESC);

-- ============================================================
-- RLS policies
-- ============================================================

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_backtests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_members_owner" ON team_members FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "strategy_backtests_own" ON strategy_backtests FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- Add missing columns to strategies table for dashboard stats
-- ============================================================

ALTER TABLE strategies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'stopped'));
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS strategy_type TEXT;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS total_trades INT DEFAULT 0;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS win_rate DECIMAL(5,2) DEFAULT 0;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS net_pnl_r DECIMAL(8,2) DEFAULT 0;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS sharpe_ratio DECIMAL(5,2) DEFAULT 0;
ALTER TABLE strategies ADD COLUMN IF NOT EXISTS color TEXT;
