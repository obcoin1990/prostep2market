-- 005_add_alerts.sql
-- Risk Guardian: Alerts, Settings, and Pause Mode tables

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'revenge_trading', 'fatigue', 'risk_escalation',
    'emotional_instability', 'exposure_warning', 'overtrading', 'session_duration'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  suggested_action TEXT,
  trade_ids UUID[],
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Guardian Settings table
CREATE TABLE IF NOT EXISTS risk_guardian_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  max_session_duration INT DEFAULT 120,
  max_trades_per_session INT DEFAULT 50,
  max_trades_per_window INT DEFAULT 8,
  exposure_multiplier DECIMAL DEFAULT 1.30,
  fatigue_warning_enabled BOOLEAN DEFAULT TRUE,
  revenge_trading_alert_enabled BOOLEAN DEFAULT TRUE,
  emotional_instability_threshold INT DEFAULT 5,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pause Mode table
CREATE TABLE IF NOT EXISTS pause_mode (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT TRUE,
  duration_minutes INT,
  reason TEXT DEFAULT 'user_initiated',
  started_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trading Sessions table
CREATE TABLE IF NOT EXISTS trading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ NOT NULL,
  last_trade_at TIMESTAMPTZ NOT NULL,
  trade_count INT DEFAULT 1,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for alerts
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at ON alerts(triggered_at);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON alerts(acknowledged);

-- Indexes for risk_guardian_settings
CREATE INDEX IF NOT EXISTS idx_risk_guardian_settings_user_id ON risk_guardian_settings(user_id);

-- Indexes for pause_mode
CREATE INDEX IF NOT EXISTS idx_pause_mode_user_active ON pause_mode(user_id, active);

-- Indexes for trading_sessions
CREATE INDEX IF NOT EXISTS idx_trading_sessions_user_id ON trading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_sessions_active ON trading_sessions(user_id, active);

-- Enable Row Level Security
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_guardian_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pause_mode ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts
CREATE POLICY "alerts_select" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "alerts_insert" ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "alerts_update" ON alerts FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for risk_guardian_settings
CREATE POLICY "settings_select" ON risk_guardian_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "settings_upsert" ON risk_guardian_settings FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for pause_mode
CREATE POLICY "pause_mode_select" ON pause_mode FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pause_mode_insert" ON pause_mode FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pause_mode_update" ON pause_mode FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for trading_sessions
CREATE POLICY "trading_sessions_select" ON trading_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trading_sessions_insert" ON trading_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trading_sessions_update" ON trading_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Enable Supabase Realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;