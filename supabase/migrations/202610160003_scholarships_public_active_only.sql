-- Migration: hide inactive (draft) scholarships from public reads.
-- The scholarships public policy is currently USING (TRUE), so a draft row
-- (is_active = FALSE, e.g. from the auto-discovery script) would still be
-- returned by the API even though the site hides it client-side. Tighten the
-- policy so public reads only see active rows. Admin policies are unchanged.
-- Existing rows are unaffected (is_active defaults TRUE).
-- Apply: paste into Dashboard -> SQL Editor, or `supabase db push`.

DROP POLICY IF EXISTS "scholarships_pub" ON scholarships;
CREATE POLICY "scholarships_pub" ON scholarships FOR SELECT
  USING (is_active IS NOT FALSE);
