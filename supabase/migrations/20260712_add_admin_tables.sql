-- ============================================================
-- Admin pages: audit_logs, compliance_frameworks, compliance_controls, content_pages
-- ============================================================

-- 1. Audit Logs — full trail of admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action      TEXT NOT NULL,
  target      TEXT,
  detail      TEXT,
  category    TEXT NOT NULL DEFAULT 'System',
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trader_profiles
      WHERE trader_profiles.id = auth.uid()
      AND trader_profiles.admin_role = 'super_admin'
    )
  );

CREATE POLICY "Admins can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trader_profiles
      WHERE trader_profiles.id = auth.uid()
      AND trader_profiles.admin_role = 'super_admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON audit_logs (category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs (actor_id);

-- 2. Compliance Frameworks
CREATE TABLE IF NOT EXISTS compliance_frameworks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'Not Started',
  expiry      TEXT,
  progress    INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE compliance_frameworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage compliance frameworks"
  ON compliance_frameworks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trader_profiles
      WHERE trader_profiles.id = auth.uid()
      AND trader_profiles.admin_role = 'super_admin'
    )
  );

-- 3. Compliance Controls
CREATE TABLE IF NOT EXISTS compliance_controls (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  category    TEXT,
  status      TEXT NOT NULL DEFAULT 'Pending',
  last_tested TIMESTAMPTZ,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE compliance_controls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage compliance controls"
  ON compliance_controls FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trader_profiles
      WHERE trader_profiles.id = auth.uid()
      AND trader_profiles.admin_role = 'super_admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_compliance_controls_framework ON compliance_controls (framework_id);

-- 4. Content Pages (CMS)
CREATE TABLE IF NOT EXISTS content_pages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE,
  type        TEXT NOT NULL DEFAULT 'Page',
  status      TEXT NOT NULL DEFAULT 'Draft',
  locale      TEXT DEFAULT 'en-US',
  author_id   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_email TEXT,
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content pages"
  ON content_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trader_profiles
      WHERE trader_profiles.id = auth.uid()
      AND trader_profiles.admin_role = 'super_admin'
    )
  );

CREATE POLICY "Public can view published content"
  ON content_pages FOR SELECT
  USING (status = 'Published');

CREATE INDEX IF NOT EXISTS idx_content_pages_status ON content_pages (status);
CREATE INDEX IF NOT EXISTS idx_content_pages_type ON content_pages (type);
