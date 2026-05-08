-- Trader DNA Database Schema
-- Migration: Create trader_profiles table for storing assessment results

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trader_profiles table
CREATE TABLE IF NOT EXISTS trader_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('sniper', 'analyst', 'warrior', 'disciplinarian', 'opportunist')),
  risk_personality_score INT CHECK (risk_personality_score BETWEEN 0 AND 100),
  emotional_stability_score INT CHECK (emotional_stability_score BETWEEN 0 AND 100),
  decision_making_score INT CHECK (decision_making_score BETWEEN 0 AND 100),
  trading_behavior_score INT CHECK (trading_behavior_score BETWEEN 0 AND 100),
  learning_style_score INT CHECK (learning_style_score BETWEEN 0 AND 100),
  learning_path TEXT CHECK (learning_path IN ('visual', 'structured', 'practical')),
  dashboard_layout JSONB DEFAULT '{"primaryWidget": "performance", "widgetOrder": ["performance", "alerts", "metrics"]}'::jsonb,
  alert_thresholds JSONB DEFAULT '{"riskSensitivity": "medium", "alertFrequency": "normal"}'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment explaining table purpose
COMMENT ON TABLE trader_profiles IS 'Stores Trader DNA assessment results for personalized trading profiles';

-- Enable Row Level Security
ALTER TABLE trader_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read their own profile
CREATE POLICY "Users can read own profile" 
  ON trader_profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON trader_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON trader_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_trader_profiles_user_id ON trader_profiles(id);
CREATE INDEX IF NOT EXISTS idx_trader_profiles_profile_type ON trader_profiles(profile_type);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_trader_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating timestamp
CREATE TRIGGER trigger_update_trader_profiles_timestamp
  BEFORE UPDATE ON trader_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_trader_profiles_timestamp();