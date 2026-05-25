-- ─── Abuse Detection: Behavioral Flags ──────────────────────────────────────
-- Run this in the Supabase SQL Editor.
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

-- 1. Abuse flags table — one row per detection event per user per flag type
CREATE TABLE IF NOT EXISTS abuse_flags (
  id            UUID          NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       TEXT          NOT NULL,
  flag_type     TEXT          NOT NULL
                CHECK (flag_type IN ('abusive_scalping', 'arbitrage_behavior', 'hedging_behavior')),
  detected_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  details       JSONB         NOT NULL DEFAULT '{}',
  trade_ids     TEXT[]        NOT NULL DEFAULT '{}',
  is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
  cleared_at    TIMESTAMPTZ,
  cleared_by    TEXT
);

CREATE INDEX IF NOT EXISTS abuse_flags_user_id_idx   ON abuse_flags (user_id);
CREATE INDEX IF NOT EXISTS abuse_flags_flag_type_idx ON abuse_flags (flag_type);
CREATE INDEX IF NOT EXISTS abuse_flags_active_idx    ON abuse_flags (is_active) WHERE is_active = TRUE;

-- 2. Extend risk_guardian_settings with abuse-detection thresholds
--    (all nullable — code falls back to PROFILE_DEFAULTS when NULL)

-- Scalping
ALTER TABLE risk_guardian_settings
  ADD COLUMN IF NOT EXISTS scalping_enabled               BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS scalping_min_duration_seconds  INTEGER DEFAULT 60,
  ADD COLUMN IF NOT EXISTS scalping_max_trades_per_day    INTEGER DEFAULT 10;

-- Arbitrage
ALTER TABLE risk_guardian_settings
  ADD COLUMN IF NOT EXISTS arbitrage_enabled                    BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS arbitrage_max_avg_duration_seconds   INTEGER DEFAULT 60,
  ADD COLUMN IF NOT EXISTS arbitrage_min_win_rate               NUMERIC DEFAULT 80,
  ADD COLUMN IF NOT EXISTS arbitrage_max_rr                     NUMERIC DEFAULT 0.5;

-- Hedging
ALTER TABLE risk_guardian_settings
  ADD COLUMN IF NOT EXISTS hedging_enabled                BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS hedging_time_window_seconds    INTEGER DEFAULT 300,
  ADD COLUMN IF NOT EXISTS hedging_lot_size_tolerance     NUMERIC DEFAULT 0.1;
