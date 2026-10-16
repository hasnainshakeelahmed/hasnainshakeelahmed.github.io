-- Migration: volunteer applications.
--
-- The public Volunteer page submits applications here (anon INSERT).
-- Only admins can read/update/delete. Approved volunteers get an
-- assigned_role (their team role); rejected ones stay in the table
-- for the record. No public read: the public Team page is static.
--
-- Apply: supabase db push   (or paste into Dashboard → SQL editor)

CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  assigned_role TEXT,
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status, created_at DESC);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "volunteers_public_insert" ON volunteers;
CREATE POLICY "volunteers_public_insert" ON volunteers FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "volunteers_admin_all" ON volunteers;
CREATE POLICY "volunteers_admin_all" ON volunteers FOR ALL
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
