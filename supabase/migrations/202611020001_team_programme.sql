-- Migration: Team programme management (interns + volunteers).
--
-- Three tables:
--   team_members      - everyone active in the programme (interns + volunteers)
--   team_tasks        - assigned work with a review workflow
--   team_applications - application inbox (public can apply)
--
-- RLS: admins (super_admin/admin via get_my_role()) have full access.
-- Members can read their own member row and their own tasks, and move
-- their own tasks todo -> in_review. Public (anon) may only submit
-- applications.
--
-- Apply: paste into Dashboard -> SQL editor and run.

-- ── team_members ────────────────────────────────────────────────
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

-- Admins: full access on all three tables.
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

-- Members: read their own member row.
DROP POLICY IF EXISTS "team_members_self_read" ON team_members;
CREATE POLICY "team_members_self_read" ON team_members FOR SELECT
  USING (auth.uid() = user_id);

-- Members: read their own tasks; move own tasks todo -> in_review.
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

-- Public: anyone can submit an application.
DROP POLICY IF EXISTS "team_applications_public_insert" ON team_applications;
CREATE POLICY "team_applications_public_insert" ON team_applications FOR INSERT
  WITH CHECK (TRUE);

-- Explicit Data API grants (required for new tables since 2026-10-30).
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_tasks TO service_role;
GRANT INSERT ON public.team_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_applications TO service_role;

-- ── Public team roster view ─────────────────────────────────────
-- The public /team page lists active members. The view exposes only
-- safe columns (no emails, no notes). security_invoker makes the
-- underlying table's RLS apply, so only status='active' rows are visible.
DROP POLICY IF EXISTS "team_members_public_active" ON team_members;
CREATE POLICY "team_members_public_active" ON team_members FOR SELECT
  USING (status = 'active');

CREATE OR REPLACE VIEW public_team
WITH (security_invoker = true) AS
SELECT id, name, kind, track, tier, level, cohort, joined_at
FROM team_members
WHERE status = 'active';

GRANT SELECT ON public_team TO anon;
GRANT SELECT ON public_team TO authenticated;
