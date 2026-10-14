-- Migration: saved opportunities (bookmarking) for logged-in users.
-- A user can save jobs or scholarships and see them on their dashboard.
-- RLS: a user can only ever read/write their own saved rows.
--
-- Apply: supabase db push   (or paste into Dashboard → SQL editor)

CREATE TABLE IF NOT EXISTS saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('job', 'scholarship')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_items_user ON saved_items(user_id, created_at DESC);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_own" ON saved_items
  FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
