-- Analysis results table (one row per trade analyzed)
CREATE TABLE trade_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_timing_score INT CHECK (entry_timing_score BETWEEN 0 AND 100),
  exit_quality_score INT CHECK (exit_quality_score BETWEEN 0 AND 100),
  rr_efficiency DECIMAL(5,2),
  quality_grade TEXT CHECK (quality_grade IN ('A', 'B', 'C', 'D')),
  behavioral_patterns JSONB,
  risk_metrics JSONB,
  ai_insights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trade_id)
);

-- Daily analytics snapshot
CREATE TABLE daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_trades INT DEFAULT 0,
  win_rate DECIMAL(5,2),
  avg_rr DECIMAL(5,2),
  total_pnl DECIMAL(12,2),
  max_drawdown DECIMAL(5,2),
  lot_size_variance DECIMAL(5,2),
  behavioral_flags JSONB,
  top_insights JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes for performance
CREATE INDEX idx_trade_analyses_user ON trade_analyses(user_id);
CREATE INDEX idx_trade_analyses_trade ON trade_analyses(trade_id);
CREATE INDEX idx_daily_analytics_user_date ON daily_analytics(user_id, date);

-- RLS policies
ALTER TABLE trade_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analyses
CREATE POLICY "Users can view own trade analyses" ON trade_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trade analyses" ON trade_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own daily analytics" ON daily_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily analytics" ON daily_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily analytics" ON daily_analytics
  FOR UPDATE USING (auth.uid() = user_id);
