-- Migration: add is_active to scholarships + one-time cleanup of stale listings
-- The scholarships table had no active flag, so expired scholarships stayed
-- visible forever. This adds the flag, backfills it, and deactivates every
-- listing (jobs + scholarships) whose deadline already passed.
--
-- Apply: supabase db push   (or paste into Dashboard → SQL editor)

ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_scholarships_active_deadline
  ON scholarships(is_active, deadline);

-- One-time cleanup: hide everything already past deadline
UPDATE scholarships
SET is_active = FALSE
WHERE deadline < CURRENT_DATE AND is_active IS NOT FALSE;

UPDATE jobs
SET is_active = FALSE
WHERE deadline < CURRENT_DATE AND is_active = TRUE;
