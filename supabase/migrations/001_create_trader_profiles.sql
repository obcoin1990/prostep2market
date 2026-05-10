-- Migration: Create trader_profiles table
-- Run this in Supabase SQL Editor: https://app.supabase.com → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS public.trader_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type text NOT NULL CHECK (profile_type IN ('sniper', 'analyst', 'warrior', 'disciplinarian', 'opportunist')),
  risk_personality_score integer DEFAULT 75,
  emotional_stability_score integer DEFAULT 78,
  decision_making_score integer DEFAULT 76,
  trading_behavior_score integer DEFAULT 80,
  learning_style_score integer DEFAULT 77,
  learning_path text DEFAULT 'beginner',
  dashboard_layout jsonb,
  alert_thresholds jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trader_profiles_profile_type ON public.trader_profiles(profile_type);

ALTER TABLE public.trader_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can read their own profile"
  ON public.trader_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Service role can manage all profiles"
  ON public.trader_profiles
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.trader_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trader_profiles TO service_role;
