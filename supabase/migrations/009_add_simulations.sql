-- 009_add_simulations.sql
-- Strategy Lab: Simulation results table

-- Simulation results table
CREATE TABLE IF NOT EXISTS simulation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
  parameters JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for simulation_results
CREATE INDEX IF NOT EXISTS idx_simulation_results_user_id ON simulation_results(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_results_strategy_id ON simulation_results(strategy_id);
CREATE INDEX IF NOT EXISTS idx_simulation_results_created_at ON simulation_results(created_at);

-- Enable Row Level Security
ALTER TABLE simulation_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for simulation_results
CREATE POLICY "simulation_results_select" ON simulation_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "simulation_results_insert" ON simulation_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "simulation_results_delete" ON simulation_results FOR DELETE USING (auth.uid() = user_id);