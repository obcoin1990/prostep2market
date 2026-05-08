-- Trade Journal Database Schema
-- Migration: Create trades table for storing trade entries

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  entry_price DECIMAL NOT NULL,
  exit_price DECIMAL,
  stop_loss DECIMAL NOT NULL,
  take_profit DECIMAL NOT NULL,
  lot_size DECIMAL NOT NULL,
  entry_time TIMESTAMPTZ NOT NULL,
  exit_time TIMESTAMPTZ,
  session TEXT CHECK (session IN ('asian', 'london', 'newyork', 'sydney')),
  result TEXT CHECK (result IN ('win', 'loss', 'breakeven')),
  pnl DECIMAL,
  screenshot_url TEXT,
  confidence_score INT CHECK (confidence_score BETWEEN 1 AND 5),
  stress_score INT CHECK (stress_score BETWEEN 1 AND 5),
  emotional_state TEXT,
  triggers TEXT[],
  pre_trade_plan_adherence INT CHECK (pre_trade_plan_adherence BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment explaining table purpose
COMMENT ON TABLE trades IS 'Stores trade journal entries with emotional tracking and screenshots';

-- Enable Row Level Security
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read their own trades
CREATE POLICY "Users can read own trades" 
  ON trades 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Users can insert their own trades
CREATE POLICY "Users can insert own trades" 
  ON trades 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own trades
CREATE POLICY "Users can update own trades" 
  ON trades 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Users can delete their own trades
CREATE POLICY "Users can delete own trades" 
  ON trades 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_entry_time ON trades(entry_time DESC);
CREATE INDEX IF NOT EXISTS idx_trades_session ON trades(session);
CREATE INDEX IF NOT EXISTS idx_trades_emotional_state ON trades(emotional_state);
CREATE INDEX IF NOT EXISTS idx_trades_result ON trades(result);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_trades_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating timestamp
CREATE TRIGGER trigger_update_trades_timestamp
  BEFORE UPDATE ON trades
  FOR EACH ROW
  EXECUTE FUNCTION update_trades_timestamp();

-- Create storage bucket for trade screenshots (run separately in Supabase Dashboard)
-- Note: This requires Supabase Storage to be enabled
-- You can create this bucket manually in Supabase Dashboard > Storage
-- Bucket name: trade-screenshots
-- Public: false
-- Allowed MIME types: image/png, image/jpeg
-- Max file size: 5242880 (5MB)