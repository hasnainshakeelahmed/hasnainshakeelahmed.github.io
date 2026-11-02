-- Fix: the `volunteers` table already existed from an earlier experiment
-- with only a few columns (email, status). This adds every column the
-- volunteer application form and the admin Volunteers page need,
-- without touching existing rows.
--
-- Run in Supabase Dashboard -> SQL editor.

ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS assigned_role TEXT;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- New applications should default to 'pending' when the form doesn't send a status.
ALTER TABLE volunteers ALTER COLUMN status SET DEFAULT 'pending';

-- Make sure the public-insert and admin policies exist (idempotent).
DROP POLICY IF EXISTS "volunteers_public_insert" ON volunteers;
CREATE POLICY "volunteers_public_insert" ON volunteers FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "volunteers_admin_all" ON volunteers;
CREATE POLICY "volunteers_admin_all" ON volunteers FOR ALL
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

GRANT INSERT ON public.volunteers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteers TO service_role;

-- The leftover table used full_name (NOT NULL) instead of name; the form
-- sends name, so submissions violated the constraint. Relax it and carry
-- any old full_name values into name.
ALTER TABLE volunteers ALTER COLUMN full_name DROP NOT NULL;
UPDATE volunteers SET name = full_name WHERE name IS NULL AND full_name IS NOT NULL;
