-- ─────────────────────────────────────────────────────────────────────────────
-- MT4/MT5 account connections via MetaApi
-- Run manually in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ── mt_connections ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mt_connections (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform            TEXT        NOT NULL CHECK (platform IN ('mt4', 'mt5')),
  broker_server       TEXT        NOT NULL,          -- e.g. "ICMarkets-Demo01"
  account_number      TEXT        NOT NULL,          -- MT login
  metaapi_account_id  TEXT        UNIQUE,            -- MetaApi cloud terminal ID
  status              TEXT        NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','connecting','connected','disconnected','error')),
  sync_error          TEXT,
  last_sync_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mt_connections_user_id ON mt_connections(user_id);

-- Each user can have at most one active connection per account number + server
CREATE UNIQUE INDEX IF NOT EXISTS idx_mt_connections_unique_account
  ON mt_connections(user_id, broker_server, account_number)
  WHERE status <> 'disconnected';

-- ── mt_account_stats ──────────────────────────────────────────────────────────
-- Periodic snapshot (written on every sync)
CREATE TABLE IF NOT EXISTS mt_account_stats (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id   UUID        NOT NULL REFERENCES mt_connections(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance         NUMERIC,
  equity          NUMERIC,
  margin          NUMERIC,
  free_margin     NUMERIC,
  margin_level    NUMERIC,    -- percentage
  profit          NUMERIC,    -- floating P&L
  currency        TEXT,
  leverage        INTEGER,
  snapshot_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mt_account_stats_connection ON mt_account_stats(connection_id);
CREATE INDEX IF NOT EXISTS idx_mt_account_stats_user ON mt_account_stats(user_id);

-- ── mt_open_positions ─────────────────────────────────────────────────────────
-- Refreshed on every sync (upsert by position_id)
CREATE TABLE IF NOT EXISTS mt_open_positions (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id   UUID        NOT NULL REFERENCES mt_connections(id) ON DELETE CASCADE,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  position_id     TEXT        NOT NULL,   -- broker ticket / position ID
  symbol          TEXT        NOT NULL,
  platform        TEXT        NOT NULL,
  order_type      TEXT        NOT NULL,   -- 'buy' | 'sell'
  volume          NUMERIC     NOT NULL,   -- lot size
  open_price      NUMERIC,
  current_price   NUMERIC,
  stop_loss       NUMERIC,
  take_profit     NUMERIC,
  profit          NUMERIC,
  swap            NUMERIC,
  commission      NUMERIC,
  magic_number    INTEGER,
  comment         TEXT,
  open_time       TIMESTAMPTZ,
  last_updated    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(connection_id, position_id)
);

CREATE INDEX IF NOT EXISTS idx_mt_open_positions_connection ON mt_open_positions(connection_id);
CREATE INDEX IF NOT EXISTS idx_mt_open_positions_user ON mt_open_positions(user_id);

-- ── mt_closed_trades ──────────────────────────────────────────────────────────
-- Historical deals — inserted once, never updated
CREATE TABLE IF NOT EXISTS mt_closed_trades (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id    UUID        NOT NULL REFERENCES mt_connections(id) ON DELETE CASCADE,
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id          TEXT        NOT NULL,   -- broker deal ticket
  position_id      TEXT,                   -- parent position ticket
  symbol           TEXT        NOT NULL,
  platform         TEXT        NOT NULL,
  order_type       TEXT        NOT NULL,   -- 'buy' | 'sell'
  volume           NUMERIC,
  open_price       NUMERIC,
  close_price      NUMERIC,
  stop_loss        NUMERIC,
  take_profit      NUMERIC,
  profit           NUMERIC,
  swap             NUMERIC,
  commission       NUMERIC,
  magic_number     INTEGER,
  comment          TEXT,
  open_time        TIMESTAMPTZ,
  close_time       TIMESTAMPTZ,
  duration_seconds INTEGER,
  synced_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(connection_id, deal_id)
);

CREATE INDEX IF NOT EXISTS idx_mt_closed_trades_connection  ON mt_closed_trades(connection_id);
CREATE INDEX IF NOT EXISTS idx_mt_closed_trades_user        ON mt_closed_trades(user_id);
CREATE INDEX IF NOT EXISTS idx_mt_closed_trades_close_time  ON mt_closed_trades(close_time DESC);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE mt_connections     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mt_account_stats   ENABLE ROW LEVEL SECURITY;
ALTER TABLE mt_open_positions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE mt_closed_trades   ENABLE ROW LEVEL SECURITY;

-- Users see only their own rows
CREATE POLICY "users_own_connections"     ON mt_connections     FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_stats"           ON mt_account_stats   FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_open_positions"  ON mt_open_positions  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_closed_trades"   ON mt_closed_trades   FOR ALL USING (auth.uid() = user_id);

-- Service-role key bypasses RLS (used by our API routes)
