-- 20260712_add_ghost_and_missing_tables.sql
-- Creates tables referenced in code but missing from migrations,
-- plus user_settings, invoices, and api_keys.

-- ============================================================
-- 1. Ghost tables (referenced in code, no migration existed)
-- ============================================================

-- Activity logs — dashboard overview + activity page
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'trade', 'journal', 'alert', 'education',
    'connection', 'team', 'report', 'setting', 'system'
  )),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created
  ON activity_logs (user_id, created_at DESC);

-- Behavioral patterns — analytics behavioral page
CREATE TABLE IF NOT EXISTS behavioral_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_name TEXT NOT NULL,
  description TEXT,
  frequency INT DEFAULT 0,
  impact DECIMAL(5,2) DEFAULT 0,
  severity TEXT CHECK (severity IN ('Low', 'Medium', 'High')) DEFAULT 'Low',
  tips TEXT[] DEFAULT '{}',
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_behavioral_patterns_user
  ON behavioral_patterns (user_id, detected_at DESC);

-- Reports — analytics reports page
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  format TEXT DEFAULT 'PDF',
  size TEXT,
  status TEXT DEFAULT 'Ready' CHECK (status IN ('Ready', 'Generating', 'Failed')),
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_user_created
  ON reports (user_id, created_at DESC);

-- Scheduled reports — analytics reports page
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  delivery_type TEXT DEFAULT 'PDF',
  active BOOLEAN DEFAULT TRUE,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_reports_user
  ON scheduled_reports (user_id, active);

-- User profiles — leaderboard, quiz submit, scores API
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  account_size DECIMAL(12,2) DEFAULT 10000,
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. Missing tables (not in any migration, needed for features)
-- ============================================================

-- User settings — preferences, notifications, display
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  alert_sound_enabled BOOLEAN DEFAULT TRUE,
  default_currency TEXT DEFAULT 'USD',
  risk_per_trade_pct DECIMAL(4,2) DEFAULT 1.0,
  show_leaderboard BOOLEAN DEFAULT TRUE,
  leaderboard_visibility TEXT DEFAULT 'anonymous' CHECK (leaderboard_visibility IN ('public', 'anonymous', 'hidden')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices — billing history
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT,
  amount_cents INT NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  description TEXT,
  invoice_url TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_created
  ON invoices (user_id, created_at DESC);

-- API keys — programmatic access
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{read}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user
  ON api_keys (user_id, revoked);

-- ============================================================
-- 3. RLS policies (enable Row-Level Security)
-- ============================================================

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own rows
CREATE POLICY "activity_logs_own" ON activity_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "behavioral_patterns_own" ON behavioral_patterns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "reports_own" ON reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "scheduled_reports_own" ON scheduled_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_own" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "user_settings_own" ON user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "invoices_own" ON invoices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "api_keys_own" ON api_keys FOR ALL USING (auth.uid() = user_id);

-- User profiles are readable by all authenticated users (for leaderboard)
CREATE POLICY "user_profiles_public_read" ON user_profiles FOR SELECT USING (auth.role() = 'authenticated');
