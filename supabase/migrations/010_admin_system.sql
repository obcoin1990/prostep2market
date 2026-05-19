-- Migration: 010_admin_system.sql
-- Adds Super Admin Panel tables and role column
-- Created: 2026-05-19

-- ─────────────────────────────────────────────
-- 1. Add admin_role to trader_profiles
-- ─────────────────────────────────────────────
ALTER TABLE trader_profiles
  ADD COLUMN IF NOT EXISTS admin_role TEXT NOT NULL DEFAULT 'user'
  CHECK (admin_role IN ('user', 'super_admin'));

-- ─────────────────────────────────────────────
-- 2. Admin key-value settings store
--    (AI engine config, feature flags, etc.)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  UUID REFERENCES auth.users(id)
);

-- Seed default AI engine settings
INSERT INTO admin_settings (key, value) VALUES
  ('ai_engine', '{
    "openai_model": "gpt-4o-mini",
    "max_tokens": 1500,
    "temperature": 0.7,
    "analysis_enabled": true,
    "pattern_detection_enabled": true,
    "behavioral_analysis_enabled": true,
    "pdf_reports_enabled": true,
    "ai_insights_enabled": true
  }'),
  ('risk_guardian_defaults', '{
    "max_session_duration": 120,
    "max_trades_per_session": 50,
    "max_trades_per_window": 8,
    "exposure_multiplier": 1.30,
    "fatigue_warning_enabled": true,
    "revenge_trading_alert_enabled": true,
    "emotional_instability_threshold": 5
  }'),
  ('feature_flags', '{
    "leaderboard_enabled": true,
    "strategy_lab_enabled": true,
    "education_enabled": true,
    "market_intel_enabled": false,
    "csv_import_enabled": true,
    "pdf_export_enabled": true
  }')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────
-- 3. Platform branding (base / system-wide)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_branding (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_color    TEXT NOT NULL DEFAULT '#E53935',
  secondary_color  TEXT NOT NULL DEFAULT '#2E7D32',
  accent_color     TEXT NOT NULL DEFAULT '#00B4D8',
  bg_color         TEXT NOT NULL DEFAULT '#F5F7FA',
  dark_bg_color    TEXT NOT NULL DEFAULT '#0A0F1C',
  logo_url         TEXT,
  favicon_url      TEXT,
  platform_name    TEXT NOT NULL DEFAULT 'ProStep2Market',
  tagline          TEXT DEFAULT 'AI Powered Trader Development',
  custom_css       TEXT,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by       UUID REFERENCES auth.users(id)
);

INSERT INTO platform_branding DEFAULT VALUES ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 4. Enterprise tenants (per-tenant white-label)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enterprise_tenants (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  domain           TEXT UNIQUE,
  contact_email    TEXT,
  plan             TEXT NOT NULL DEFAULT 'enterprise'
                   CHECK (plan IN ('enterprise', 'white_label')),
  primary_color    TEXT,
  secondary_color  TEXT,
  accent_color     TEXT,
  logo_url         TEXT,
  platform_name    TEXT,
  custom_css       TEXT,
  max_users        INT NOT NULL DEFAULT 100,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. Email templates (for Resend sending)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  subject     TEXT NOT NULL,
  html_body   TEXT NOT NULL,
  text_body   TEXT,
  variables   JSONB NOT NULL DEFAULT '[]',
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default templates
INSERT INTO email_templates (key, name, subject, html_body, text_body, variables) VALUES
  ('welcome', 'Welcome Email', 'Welcome to ProStep2Market!',
   '<h1>Welcome {{full_name}}!</h1><p>Your account is ready. <a href="{{login_url}}">Log in now</a></p>',
   'Welcome {{full_name}}! Your account is ready. Log in at {{login_url}}',
   '["full_name", "login_url"]'),
  ('risk_alert', 'Risk Guardian Alert', 'Trading Alert: {{alert_type}}',
   '<h2>Risk Alert</h2><p>Hi {{full_name}}, our Risk Guardian detected: <strong>{{alert_message}}</strong></p><p>{{suggested_action}}</p>',
   'Hi {{full_name}}, Risk Guardian detected: {{alert_message}}. {{suggested_action}}',
   '["full_name", "alert_type", "alert_message", "suggested_action"]'),
  ('weekly_report', 'Weekly Performance Report', 'Your Weekly Trading Report',
   '<h2>Weekly Report</h2><p>Hi {{full_name}},</p><p>Edge Score: <strong>{{edge_score}}</strong><br>Trades this week: {{trade_count}}<br>Win rate: {{win_rate}}%</p>',
   'Hi {{full_name}}, your weekly Edge Score: {{edge_score}}. Trades: {{trade_count}}. Win rate: {{win_rate}}%.',
   '["full_name", "edge_score", "trade_count", "win_rate"]')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────
-- 6. Notification delivery logs
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key      TEXT NOT NULL,
  recipient_email   TEXT NOT NULL,
  recipient_user_id UUID REFERENCES auth.users(id),
  subject           TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'sent'
                    CHECK (status IN ('sent', 'failed', 'bounced', 'opened')),
  resend_id         TEXT,
  sent_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  error             TEXT
);

-- ─────────────────────────────────────────────
-- 7. Payment gateway configurations
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_gateways (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider        TEXT UNIQUE NOT NULL
                  CHECK (provider IN ('stripe', 'paypal', 'paymob')),
  active          BOOLEAN NOT NULL DEFAULT FALSE,
  test_mode       BOOLEAN NOT NULL DEFAULT TRUE,
  public_key      TEXT,
  secret_key      TEXT,    -- store encrypted in production
  webhook_url     TEXT,
  webhook_secret  TEXT,
  extra_config    JSONB NOT NULL DEFAULT '{}',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO payment_gateways (provider) VALUES ('stripe'), ('paypal'), ('paymob')
ON CONFLICT (provider) DO NOTHING;

-- ─────────────────────────────────────────────
-- 8. User subscriptions / billing
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                     TEXT NOT NULL DEFAULT 'free'
                           CHECK (plan IN ('free', 'pro', 'enterprise')),
  status                   TEXT NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing', 'paused')),
  provider                 TEXT CHECK (provider IN ('stripe', 'paypal', 'paymob')),
  provider_subscription_id TEXT,
  provider_customer_id     TEXT,
  current_period_start     TIMESTAMPTZ,
  current_period_end       TIMESTAMPTZ,
  cancel_at_period_end     BOOLEAN NOT NULL DEFAULT FALSE,
  amount_cents             INT,
  currency                 TEXT DEFAULT 'USD',
  enterprise_tenant_id     UUID REFERENCES enterprise_tenants(id),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 9. Market intelligence config
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_intel_config (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider                  TEXT NOT NULL DEFAULT 'custom'
                            CHECK (provider IN ('alpha_vantage', 'fxstreet', 'newsapi', 'custom')),
  api_key                   TEXT,
  api_endpoint              TEXT,
  refresh_interval_minutes  INT NOT NULL DEFAULT 60,
  active                    BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO market_intel_config DEFAULT VALUES ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 10. Market intelligence posts / cached items
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_intel_posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  content         TEXT NOT NULL,
  category        TEXT NOT NULL DEFAULT 'general'
                  CHECK (category IN ('general', 'forex', 'session', 'volatility', 'news', 'alert')),
  currency_pairs  TEXT[] NOT NULL DEFAULT '{}',
  impact          TEXT NOT NULL DEFAULT 'low'
                  CHECK (impact IN ('low', 'medium', 'high')),
  source          TEXT,
  external_url    TEXT,
  published       BOOLEAN NOT NULL DEFAULT TRUE,
  published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 11. SEO settings per page
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path       TEXT UNIQUE NOT NULL,
  title           TEXT,
  description     TEXT,
  keywords        TEXT,
  og_title        TEXT,
  og_description  TEXT,
  og_image        TEXT,
  canonical_url   TEXT,
  no_index        BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by      UUID REFERENCES auth.users(id)
);

INSERT INTO seo_settings (page_path, title, description) VALUES
  ('/', 'ProStep2Market — AI Powered Trader Development & Performance Intelligence',
   'AI powered trader development, behavioral analytics, and performance coaching. Improve discipline, decision quality, and consistency.'),
  ('/pricing', 'Pricing — ProStep2Market',
   'Plans for individual traders and institutions. Free, Pro, and Enterprise tiers.'),
  ('/faq', 'FAQ — ProStep2Market',
   'Frequently asked questions about ProStep2Market, the AI trader development platform.'),
  ('/legal/terms', 'Terms of Service — ProStep2Market', 'ProStep2Market terms of service agreement.'),
  ('/legal/privacy', 'Privacy Policy — ProStep2Market', 'ProStep2Market privacy policy and data handling practices.'),
  ('/legal/disclaimer', 'Risk Disclaimer — ProStep2Market', 'Risk disclaimer for ProStep2Market trading analytics platform.')
ON CONFLICT (page_path) DO NOTHING;

-- ─────────────────────────────────────────────
-- 12. Row Level Security
-- ─────────────────────────────────────────────

-- Admin tables: no direct user access (service role only from admin API)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_intel_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Subscriptions: users can read their own
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Market intel posts: authenticated users can read published posts
ALTER TABLE market_intel_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users read published market intel"
  ON market_intel_posts FOR SELECT
  TO authenticated
  USING (published = TRUE);

-- Notification logs: users can read their own
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own notification logs"
  ON notification_logs FOR SELECT
  USING (auth.uid() = recipient_user_id);
