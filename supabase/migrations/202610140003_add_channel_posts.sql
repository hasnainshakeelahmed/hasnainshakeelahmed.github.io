-- Migration: channel posts (WhatsApp channel archive + admin-created posts).
-- Two channels: 'main' (CareerRadar educational) and 'scholarships'
-- (Scholarships & Internships opportunities). Public can read published
-- posts; only admins can write.
--
-- Apply: supabase db push   (or paste into Dashboard → SQL editor)

CREATE TABLE IF NOT EXISTS channel_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL CHECK (channel IN ('main', 'scholarships')),
  category TEXT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  post_url TEXT,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_channel_posts_channel ON channel_posts(channel, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_channel_posts_published ON channel_posts(is_published, published_at DESC);

ALTER TABLE channel_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "channel_posts_public_read" ON channel_posts;
CREATE POLICY "channel_posts_public_read" ON channel_posts FOR SELECT
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "channel_posts_admin_write" ON channel_posts;
CREATE POLICY "channel_posts_admin_write" ON channel_posts FOR ALL
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

-- Storage bucket for post images (uploaded from the admin panel).
INSERT INTO storage.buckets (id, name, public)
VALUES ('channel-posts', 'channel-posts', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "channel_posts_images_public_read" ON storage.objects;
CREATE POLICY "channel_posts_images_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'channel-posts');

DROP POLICY IF EXISTS "channel_posts_images_admin_write" ON storage.objects;
CREATE POLICY "channel_posts_images_admin_write" ON storage.objects FOR ALL
  USING (bucket_id = 'channel-posts' AND get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (bucket_id = 'channel-posts' AND get_my_role() IN ('super_admin', 'admin'));
