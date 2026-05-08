-- Edge Score System Database Migration
-- Phase 6: Gamified performance scoring system
-- Creates edge_scores and leaderboard_settings tables

-- Create edge_scores table
CREATE TABLE IF NOT EXISTS edge_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  discipline_score DECIMAL(5,2) NOT NULL CHECK (discipline_score >= 0 AND discipline_score <= 100),
  risk_score DECIMAL(5,2) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  emotional_stability_score DECIMAL(5,2) NOT NULL CHECK (emotional_stability_score >= 0 AND emotional_stability_score <= 100),
  consistency_score DECIMAL(5,2) NOT NULL CHECK (consistency_score >= 0 AND consistency_score <= 100),
  strategy_adherence_score DECIMAL(5,2) NOT NULL CHECK (strategy_adherence_score >= 0 AND strategy_adherence_score <= 100),
  composite_score DECIMAL(5,2) NOT NULL CHECK (composite_score >= 0 AND composite_score <= 100),
  rank TEXT NOT NULL CHECK (rank IN ('beginner', 'developing', 'consistent', 'advanced', 'elite')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create index for efficient user score lookups
CREATE INDEX IF NOT EXISTS idx_edge_scores_user_date ON edge_scores(user_id, date DESC);

-- Create index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_edge_scores_composite ON edge_scores(composite_score DESC);

-- Create leaderboard_settings table
CREATE TABLE IF NOT EXISTS leaderboard_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'anonymous' CHECK (visibility IN ('public', 'anonymous', 'hidden')),
  show_in_leaderboard BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings for existing users (anonymous visibility)
INSERT INTO leaderboard_settings (user_id, visibility, show_in_leaderboard)
SELECT id, 'anonymous', TRUE
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Row Level Security Policies

-- Enable RLS on edge_scores
ALTER TABLE edge_scores ENABLE ROW LEVEL SECURITY;

-- Users can read all scores (for leaderboard)
CREATE POLICY "edge_scores_read_all"
  ON edge_scores
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only insert/update their own scores
CREATE POLICY "edge_scores_insert_own"
  ON edge_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "edge_scores_update_own"
  ON edge_scores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable RLS on leaderboard_settings
ALTER TABLE leaderboard_settings ENABLE ROW LEVEL SECURITY;

-- Users can read all settings (needed for leaderboard filtering)
CREATE POLICY "leaderboard_settings_read_all"
  ON leaderboard_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own settings
CREATE POLICY "leaderboard_settings_update_own"
  ON leaderboard_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "leaderboard_settings_insert_own"
  ON leaderboard_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT ON edge_scores TO authenticated;
GRANT SELECT, INSERT, UPDATE ON edge_scores TO authenticated;
GRANT SELECT, INSERT, UPDATE ON leaderboard_settings TO authenticated;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_edge_scores_updated_at ON edge_scores;
CREATE TRIGGER update_edge_scores_updated_at
  BEFORE UPDATE ON edge_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leaderboard_settings_updated_at ON leaderboard_settings;
CREATE TRIGGER update_leaderboard_settings_updated_at
  BEFORE UPDATE ON leaderboard_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();