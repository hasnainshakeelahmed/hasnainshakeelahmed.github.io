-- Migration v2: Team programme management (interns + volunteers) — IDEMPOTENT.
--
-- Run this in Supabase Dashboard -> SQL editor. Safe to run even if v1
-- partially ran: every statement tolerates existing tables/columns/policies.
--
-- Tables: team_members, team_tasks, team_applications (+ public_team view).

-- ── team_members (create if missing; add any missing columns) ───
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('intern', 'volunteer')),
  track TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'casual' CHECK (tier IN ('casual', 'core', 'lead')),
  level TEXT NOT NULL DEFAULT 'contributor' CHECK (level IN ('contributor', 'core', 'lead')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'alumni')),
  cohort TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- If the table already existed (e.g. from an earlier experiment), bring it
-- up to the full column set without touching existing data.
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS kind TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS track TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'casual';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'contributor';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS cohort TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_team_members_kind_status ON team_members(kind, status);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_track ON team_members(track);

-- ── team_tasks ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_review', 'done')),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_tasks_member ON team_tasks(member_id, status);
CREATE INDEX IF NOT EXISTS idx_team_tasks_status ON team_tasks(status);

-- ── team_applications ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('intern', 'volunteer')),
  track TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'casual',
  motivation TEXT,
  sample_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'trial', 'accepted', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_applications_status ON team_applications(status, created_at DESC);

-- ── RLS ─────────────────────────────────────────────────────────
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "team_members_admin_all" ON team_members;
CREATE POLICY "team_members_admin_all" ON team_members FOR ALL
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "team_tasks_admin_all" ON team_tasks;
CREATE POLICY "team_tasks_admin_all" ON team_tasks FOR ALL
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "team_applications_admin_all" ON team_applications;
CREATE POLICY "team_applications_admin_all" ON team_applications FOR ALL
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "team_members_self_read" ON team_members;
CREATE POLICY "team_members_self_read" ON team_members FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "team_tasks_self_read" ON team_tasks;
CREATE POLICY "team_tasks_self_read" ON team_tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM team_members m
    WHERE m.id = team_tasks.member_id AND m.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "team_tasks_self_submit" ON team_tasks;
CREATE POLICY "team_tasks_self_submit" ON team_tasks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM team_members m
    WHERE m.id = team_tasks.member_id AND m.user_id = auth.uid()
  ))
  WITH CHECK (
    status = 'in_review'
    AND EXISTS (
      SELECT 1 FROM team_members m
      WHERE m.id = team_tasks.member_id AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "team_applications_public_insert" ON team_applications;
CREATE POLICY "team_applications_public_insert" ON team_applications FOR INSERT
  WITH CHECK (TRUE);

-- Public can see active members (used by the public_team view below).
DROP POLICY IF EXISTS "team_members_public_active" ON team_members;
CREATE POLICY "team_members_public_active" ON team_members FOR SELECT
  USING (status = 'active');

-- ── Grants (required for new tables since 2026-10-30) ───────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_tasks TO service_role;
GRANT INSERT ON public.team_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_applications TO service_role;

-- ── Public team roster view (safe columns only) ─────────────────
CREATE OR REPLACE VIEW public_team
WITH (security_invoker = true) AS
SELECT id, name, kind, track, tier, level, cohort, joined_at
FROM team_members
WHERE status = 'active';

GRANT SELECT ON public_team TO anon;
GRANT SELECT ON public_team TO authenticated;
