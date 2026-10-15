-- ================================================================
-- Career Radar v2 — FRESH database setup (run ONCE, in order)
-- Target: brand-new empty Supabase project (Hasnain's own org).
-- Run: Supabase Dashboard -> SQL Editor -> New query -> paste all -> Run.
--
-- Contents:
--   1. Storage bucket creation (public/private flags)
--   2. v1 base schema (schema.sql: all core tables, RLS, triggers)
--   3. v1 incremental migrations (certificates, volunteers, etc.)
--   4. v2 migrations (saved_items, channel_posts, donations, services)
-- Excluded on purpose:
--   - 20260705004 / 20260705006 stat defaults (old site's claimed numbers;
--     a fresh site starts at honest zeros)
--   - 20260705061150_remote_schema.sql (old remote dump, conflicts)
--   - 202607110002 bucket flag updates (superseded by bucket block below)
--   - 202607200001 RLS performance fix (optional optimization, own txn block)
--   - v2 duplicate of 202610040002 (v1 copy included once)
-- ================================================================

-- 1. Storage buckets ------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES
  ('team-avatars', 'team-avatars', true),
  ('avatars', 'avatars', true),
  ('collaborator-logos', 'collaborator-logos', true),
  ('product-thumbnails', 'product-thumbnails', true),
  ('product-files', 'product-files', false),
  ('education-thumbnails', 'education-thumbnails', true),
  ('content-files', 'content-files', true),
  ('scholarship-logos', 'scholarship-logos', true),
  ('channel-posts', 'channel-posts', true)
ON CONFLICT (id) DO NOTHING;


-- ============ FROM: /home/hatch/workspace/career-radar/supabase/schema.sql ============
-- Career Radar - Complete Database Schema

-- Foundation:
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- Admin Tables (user_roles + profiles):
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin','admin','collaborator')),
  role_label TEXT DEFAULT '',
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the function BEFORE using it in policies
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM user_roles WHERE user_id = (SELECT auth.uid())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Now we can use the function in RLS policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles_founder_insert" ON user_roles FOR INSERT WITH CHECK (get_my_role()='super_admin');
CREATE POLICY "roles_founder_update" ON user_roles FOR UPDATE USING (get_my_role()='super_admin') WITH CHECK (get_my_role()='super_admin');
CREATE POLICY "roles_founder_delete" ON user_roles FOR DELETE USING (get_my_role()='super_admin');
CREATE POLICY "roles_founder_select" ON user_roles FOR SELECT USING (get_my_role()='super_admin');
CREATE POLICY "roles_own_read" ON user_roles FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, role_title TEXT, bio TEXT,
  avatar_url TEXT, linkedin_url TEXT, twitter_url TEXT,
  is_founder BOOLEAN DEFAULT FALSE,
  is_visible_on_team_page BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING ((SELECT auth.uid())=id) WITH CHECK ((SELECT auth.uid())=id);
CREATE POLICY "profiles_founder_insert" ON profiles FOR INSERT WITH CHECK ((SELECT get_my_role())='super_admin');
CREATE POLICY "profiles_founder_delete" ON profiles FOR DELETE USING ((SELECT get_my_role())='super_admin');
CREATE TRIGGER profiles_upd BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN INSERT INTO profiles(id,full_name) VALUES(NEW.id,NEW.raw_user_meta_data->>'full_name') ON CONFLICT(id) DO NOTHING; RETURN NEW; END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Public User Tables:
CREATE TABLE public_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, email TEXT, avatar_url TEXT, country TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pub_users_own_insert" ON public_users FOR INSERT WITH CHECK ((SELECT auth.uid())=id);
CREATE POLICY "pub_users_own_update" ON public_users FOR UPDATE USING ((SELECT auth.uid())=id) WITH CHECK ((SELECT auth.uid())=id);
CREATE POLICY "pub_users_own_delete" ON public_users FOR DELETE USING ((SELECT auth.uid())=id);
CREATE POLICY "pub_users_select" ON public_users FOR SELECT USING ((SELECT auth.uid())=id OR get_my_role()='super_admin');

CREATE TABLE onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  degree TEXT, study_year TEXT, skills TEXT[], country TEXT, city TEXT,
  career_goal TEXT, experience TEXT CHECK (experience IN ('Student','Fresh Graduate','1-2 Years','3+ Years')),
  interests TEXT[], created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "onboarding_own_insert" ON onboarding_data FOR INSERT WITH CHECK ((SELECT auth.uid())=user_id);
CREATE POLICY "onboarding_own_update" ON onboarding_data FOR UPDATE USING ((SELECT auth.uid())=user_id) WITH CHECK ((SELECT auth.uid())=user_id);
CREATE POLICY "onboarding_own_delete" ON onboarding_data FOR DELETE USING ((SELECT auth.uid())=user_id);
CREATE POLICY "onboarding_select" ON onboarding_data FOR SELECT USING ((SELECT auth.uid())=user_id OR get_my_role()='super_admin');

CREATE TABLE career_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT, summary TEXT,
  recommended_skills JSONB DEFAULT '[]',
  recommended_jobs JSONB DEFAULT '[]',
  recommended_courses JSONB DEFAULT '[]',
  action_steps JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  generated_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE career_blueprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blueprints_own" ON career_blueprints FOR ALL USING ((SELECT auth.uid())=user_id) WITH CHECK ((SELECT auth.uid())=user_id);

CREATE TABLE career_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0 CHECK (total_score BETWEEN 0 AND 100),
  skills_score INTEGER DEFAULT 0,   -- max 25
  profile_score INTEGER DEFAULT 0,  -- max 20
  activity_score INTEGER DEFAULT 0, -- max 20
  education_score INTEGER DEFAULT 0,-- max 20
  experience_score INTEGER DEFAULT 0,-- max 15
  missing_items JSONB DEFAULT '[]',
  score_history JSONB DEFAULT '[]',
  last_calculated TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE career_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scores_own" ON career_scores FOR ALL USING ((SELECT auth.uid())=user_id) WITH CHECK ((SELECT auth.uid())=user_id);

-- Resumes
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resumes_own" ON resumes FOR ALL USING ((SELECT auth.uid())=user_id) WITH CHECK ((SELECT auth.uid())=user_id);

-- Content Tables (Jobs, Weekly Content, Products, Education):
-- site_stats SINGLETON
CREATE TABLE site_stats (id INT PRIMARY KEY DEFAULT 1 CHECK(id=1),
  community_members INTEGER DEFAULT 0, jobs_posted INTEGER DEFAULT 0,
  resources_shared INTEGER DEFAULT 0, total_products INTEGER DEFAULT 0,
  countries INTEGER DEFAULT 0, whatsapp_groups INTEGER DEFAULT 0,
  main_channel_followers INTEGER DEFAULT 0, scholarship_channel_followers INTEGER DEFAULT 0,
  ai_channel_followers INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO site_stats(id) VALUES(1);

-- Migration for existing DBs: ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS countries INTEGER DEFAULT 0, ADD COLUMN IF NOT EXISTS whatsapp_groups INTEGER DEFAULT 0, ADD COLUMN IF NOT EXISTS main_channel_followers INTEGER DEFAULT 0, ADD COLUMN IF NOT EXISTS scholarship_channel_followers INTEGER DEFAULT 0, ADD COLUMN IF NOT EXISTS ai_channel_followers INTEGER DEFAULT 0;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stats_read" ON site_stats FOR SELECT USING(TRUE);
CREATE POLICY "stats_update" ON site_stats FOR UPDATE USING((SELECT get_my_role())='super_admin');

CREATE OR REPLACE FUNCTION increment_jobs_posted()
RETURNS void LANGUAGE sql SECURITY DEFINER
AS $$ UPDATE site_stats SET jobs_posted = jobs_posted + 1, updated_at = NOW() WHERE id = 1; $$;

CREATE OR REPLACE FUNCTION increment_total_products()
RETURNS void LANGUAGE sql SECURITY DEFINER
AS $$ UPDATE site_stats SET total_products = total_products + 1, updated_at = NOW() WHERE id = 1; $$;

CREATE OR REPLACE FUNCTION increment_community_members()
RETURNS void LANGUAGE sql SECURITY DEFINER
AS $$ UPDATE site_stats SET community_members = community_members + 1, updated_at = NOW() WHERE id = 1; $$;

CREATE OR REPLACE FUNCTION increment_resources_shared()
RETURNS void LANGUAGE sql SECURITY DEFINER
AS $$ UPDATE site_stats SET resources_shared = resources_shared + 1, updated_at = NOW() WHERE id = 1; $$;

-- jobs
CREATE TABLE jobs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, company TEXT NOT NULL, location TEXT,
  type TEXT CHECK(type IN('Full-time','Part-time','Internship','Freelance','Remote')),
  description TEXT, apply_url TEXT, contact TEXT, deadline DATE,
  tags TEXT[] DEFAULT '{}', slug TEXT UNIQUE,
  is_featured BOOLEAN DEFAULT FALSE, is_active BOOLEAN DEFAULT TRUE,
  posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_jobs ON jobs(is_active,created_at DESC);
CREATE INDEX idx_jobs_tags ON jobs USING GIN(tags);
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs_pub" ON jobs FOR SELECT USING(is_active=TRUE);
CREATE POLICY "jobs_admin_insert" ON jobs FOR INSERT WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "jobs_admin_update" ON jobs FOR UPDATE USING (get_my_role() IN ('super_admin', 'admin')) WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "jobs_admin_delete" ON jobs FOR DELETE USING (get_my_role() IN ('super_admin', 'admin'));
CREATE TRIGGER jobs_upd BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- weekly_content
CREATE TABLE weekly_content (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  category TEXT CHECK(category IN('Roadmap','Guide','AI Tools','Resource Pack','Workshop','Other')),
  thumbnail_url TEXT, file_url TEXT, external_link TEXT, week_label TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE weekly_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content_pub" ON weekly_content FOR SELECT USING(is_published=TRUE);
CREATE POLICY "content_admin_insert" ON weekly_content FOR INSERT WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "content_admin_update" ON weekly_content FOR UPDATE USING (get_my_role() IN ('super_admin', 'admin')) WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "content_admin_delete" ON weekly_content FOR DELETE USING (get_my_role() IN ('super_admin', 'admin'));
CREATE TRIGGER content_upd BEFORE UPDATE ON weekly_content FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- products
CREATE TABLE products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  category TEXT CHECK(category IN('File','Course','Template','eBook','Bundle','Physical')),
  thumbnail_url TEXT, file_url TEXT, preview_url TEXT,
  price_pkr INTEGER DEFAULT 0, is_free BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE, external_link TEXT,
  whatsapp_number TEXT, bank_details TEXT,
  posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_pub" ON products FOR SELECT USING(is_active=TRUE);
CREATE POLICY "products_admin_insert" ON products FOR INSERT WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "products_admin_update" ON products FOR UPDATE USING (get_my_role() IN ('super_admin', 'admin')) WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "products_admin_delete" ON products FOR DELETE USING (get_my_role() IN ('super_admin', 'admin'));
CREATE TRIGGER products_upd BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- delivered_orders (manual payment tracking)
CREATE TABLE delivered_orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL, buyer_name TEXT, buyer_whatsapp TEXT,
  amount_pkr INTEGER, payment_method TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN('pending','confirmed','delivered','rejected')),
  notes TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE delivered_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_founder" ON delivered_orders FOR ALL USING(get_my_role()='super_admin');

-- education_items
CREATE TABLE education_items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT,
  type TEXT CHECK(type IN('Course','Book','Guide','Workshop')),
  level TEXT CHECK(level IN('Beginner','Intermediate','Advanced')),
  thumbnail_url TEXT, is_free BOOLEAN DEFAULT TRUE,
  free_access_url TEXT, product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  duration_label TEXT, topics_covered TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT TRUE, sort_order INTEGER DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE education_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "edu_pub" ON education_items FOR SELECT USING(is_published=TRUE);
CREATE POLICY "edu_admin_insert" ON education_items FOR INSERT WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "edu_admin_update" ON education_items FOR UPDATE USING (get_my_role() IN ('super_admin', 'admin')) WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "edu_admin_delete" ON education_items FOR DELETE USING (get_my_role() IN ('super_admin', 'admin'));

-- Community + AI Tables:
-- structure_page SINGLETON
CREATE TABLE structure_page (id INT PRIMARY KEY DEFAULT 1 CHECK(id=1),
  aim TEXT, mission TEXT, vision TEXT,
  core_values JSONB DEFAULT '[]', goals JSONB DEFAULT '[]', milestones JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO structure_page(id) VALUES(1);
ALTER TABLE structure_page ENABLE ROW LEVEL SECURITY;
CREATE POLICY "struct_pub" ON structure_page FOR SELECT USING(TRUE);
CREATE POLICY "struct_admin" ON structure_page FOR UPDATE USING(get_my_role() IN('super_admin','admin'));

-- about_page SINGLETON
CREATE TABLE about_page (id INT PRIMARY KEY DEFAULT 1 CHECK(id=1),
  story_heading TEXT DEFAULT 'Our Story', story_text TEXT,
  founded_date TEXT, contact_email TEXT, contact_whatsapp TEXT,
  community_link TEXT, tagline TEXT, founder_message TEXT,
  mission_text TEXT DEFAULT '',
  core_values JSONB DEFAULT '[]',
  what_we_do TEXT DEFAULT '',
  who_can_join TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO about_page(id) VALUES(1);
-- Migration for existing DBs: ALTER TABLE about_page ADD COLUMN IF NOT EXISTS mission_text TEXT DEFAULT '', ADD COLUMN IF NOT EXISTS core_values JSONB DEFAULT '[]', ADD COLUMN IF NOT EXISTS what_we_do TEXT DEFAULT '', ADD COLUMN IF NOT EXISTS who_can_join TEXT DEFAULT '';
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_pub" ON about_page FOR SELECT USING(TRUE);
CREATE POLICY "about_admin" ON about_page FOR UPDATE USING(get_my_role() IN('super_admin','admin'));

-- socials
CREATE TABLE socials (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name TEXT NOT NULL,
  platform_type TEXT CHECK(platform_type IN('whatsapp','youtube','instagram','telegram','linkedin','twitter','discord','tiktok','facebook','other')),
  handle_or_name TEXT, url TEXT NOT NULL, description TEXT,
  members_count TEXT, is_active BOOLEAN DEFAULT TRUE,
  is_primary BOOLEAN DEFAULT FALSE, sort_order INTEGER DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "socials_pub" ON socials FOR SELECT USING(is_active=TRUE);
CREATE POLICY "socials_admin_insert" ON socials FOR INSERT WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "socials_admin_update" ON socials FOR UPDATE USING (get_my_role() IN ('super_admin', 'admin')) WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "socials_admin_delete" ON socials FOR DELETE USING (get_my_role() IN ('super_admin', 'admin'));

-- collaborators
CREATE TABLE collaborators (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, description TEXT, logo_url TEXT,
  website_url TEXT, youtube_url TEXT, whatsapp_url TEXT, instagram_url TEXT,
  collaboration_type TEXT CHECK(collaboration_type IN('Partner','Sponsor','Affiliate','Friend')),
  is_featured BOOLEAN DEFAULT FALSE, is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 99, created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "collab_pub" ON collaborators FOR SELECT USING(is_active=TRUE);
CREATE POLICY "collab_admin_insert" ON collaborators FOR INSERT WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "collab_admin_update" ON collaborators FOR UPDATE USING (get_my_role() IN ('super_admin', 'admin')) WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "collab_admin_delete" ON collaborators FOR DELETE USING (get_my_role() IN ('super_admin', 'admin'));

-- team_members (dedicated table — only super admin populates)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  role TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  age INTEGER,
  education TEXT,
  goal TEXT,
  social_links JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 99,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team_members_pub" ON team_members FOR SELECT USING (is_active = TRUE);
CREATE POLICY "team_members_admin_insert" ON team_members FOR INSERT WITH CHECK (get_my_role() = 'super_admin');
CREATE POLICY "team_members_admin_update" ON team_members FOR UPDATE USING (get_my_role() = 'super_admin') WITH CHECK (get_my_role() = 'super_admin');
CREATE POLICY "team_members_admin_delete" ON team_members FOR DELETE USING (get_my_role() = 'super_admin');
CREATE TRIGGER team_members_upd BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Storage RLS for team-avatars bucket
CREATE POLICY "team_avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'team-avatars');
CREATE POLICY "team_avatars_auth_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-avatars' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "team_avatars_auth_update" ON storage.objects FOR UPDATE USING (bucket_id = 'team-avatars' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "team_avatars_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'team-avatars' AND (SELECT auth.role()) = 'authenticated');

-- ai_chat_logs
CREATE TABLE ai_chat_logs (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL, user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_message TEXT NOT NULL, ai_response TEXT NOT NULL,
  mode_detected TEXT CHECK(mode_detected IN('career_coach','job_matcher','content_assistant','general')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "logs_insert" ON ai_chat_logs FOR INSERT WITH CHECK ((SELECT auth.role()) = 'authenticated');
CREATE POLICY "logs_founder_select" ON ai_chat_logs FOR SELECT USING(get_my_role()='super_admin');
CREATE POLICY "logs_founder_delete" ON ai_chat_logs FOR DELETE USING(get_my_role()='super_admin');

-- scholarships
CREATE TABLE scholarships (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, provider TEXT NOT NULL,
  coverage TEXT CHECK(coverage IN('Fully Funded','Partial Tuition','Monthly Stipend','Other')),
  country TEXT NOT NULL, deadline DATE, description TEXT,
  eligibility TEXT, apply_url TEXT NOT NULL, image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_scholarships ON scholarships(country,coverage);
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scholarships_pub" ON scholarships FOR SELECT USING(TRUE);
CREATE POLICY "scholarships_admin_insert" ON scholarships FOR INSERT WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "scholarships_admin_update" ON scholarships FOR UPDATE USING (get_my_role() IN ('super_admin', 'admin')) WITH CHECK (get_my_role() IN ('super_admin', 'admin'));
CREATE POLICY "scholarships_admin_delete" ON scholarships FOR DELETE USING (get_my_role() IN ('super_admin', 'admin'));
CREATE TRIGGER scholarships_upd BEFORE UPDATE ON scholarships FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Storage RLS for avatars bucket
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_auth_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "avatars_auth_update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "avatars_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND (SELECT auth.role()) = 'authenticated');

-- Storage RLS for collaborator-logos bucket
CREATE POLICY "collab_logos_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'collaborator-logos');
CREATE POLICY "collab_logos_auth_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'collaborator-logos' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "collab_logos_auth_update" ON storage.objects FOR UPDATE USING (bucket_id = 'collaborator-logos' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "collab_logos_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'collaborator-logos' AND (SELECT auth.role()) = 'authenticated');

-- Storage RLS for product-thumbnails bucket
CREATE POLICY "prod_thumbs_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'product-thumbnails');
CREATE POLICY "prod_thumbs_auth_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-thumbnails' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "prod_thumbs_auth_update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-thumbnails' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "prod_thumbs_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-thumbnails' AND (SELECT auth.role()) = 'authenticated');

-- Storage RLS for product-files bucket (private — super_admin only for all ops)
CREATE POLICY "prod_files_admin_read" ON storage.objects FOR SELECT USING (bucket_id = 'product-files' AND get_my_role() = 'super_admin');
CREATE POLICY "prod_files_admin_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-files' AND get_my_role() = 'super_admin');
CREATE POLICY "prod_files_admin_update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-files' AND get_my_role() = 'super_admin');
CREATE POLICY "prod_files_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-files' AND get_my_role() = 'super_admin');

-- Storage RLS for education-thumbnails bucket
CREATE POLICY "edu_thumbs_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'education-thumbnails');
CREATE POLICY "edu_thumbs_auth_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'education-thumbnails' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "edu_thumbs_auth_update" ON storage.objects FOR UPDATE USING (bucket_id = 'education-thumbnails' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "edu_thumbs_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'education-thumbnails' AND (SELECT auth.role()) = 'authenticated');

-- Storage RLS for content-files bucket
CREATE POLICY "content_files_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'content-files');
CREATE POLICY "content_files_auth_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'content-files' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "content_files_auth_update" ON storage.objects FOR UPDATE USING (bucket_id = 'content-files' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "content_files_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'content-files' AND (SELECT auth.role()) = 'authenticated');

-- community_page SINGLETON
CREATE TABLE community_page (id INT PRIMARY KEY DEFAULT 1 CHECK(id=1),
  stats JSONB DEFAULT '[]',
  roadmap_items JSONB DEFAULT '[]',
  founder_message TEXT DEFAULT '',
  testimonials_heading TEXT DEFAULT 'Testimonials',
  testimonials_text TEXT DEFAULT 'Real success stories from our community will be featured here as members achieve scholarships, internships, jobs, and career milestones.',
  cta_heading TEXT DEFAULT 'Start Your Career Journey Today',
  cta_text TEXT DEFAULT 'Join thousands of students discovering opportunities, building skills, and preparing for the future with Career Radar.',
  primary_cta_text TEXT DEFAULT 'Join Community',
  primary_cta_link TEXT DEFAULT '/social',
  secondary_cta_text TEXT DEFAULT 'Partner With Us',
  secondary_cta_link TEXT DEFAULT '/collaborators',
   explore_links JSONB DEFAULT '[]',
   community_links JSONB DEFAULT '[]',
   events JSONB DEFAULT '[]',
   volunteer_program JSONB DEFAULT '{"heading":"Volunteer Program","text":"","image_url":""}',
   success_stories JSONB DEFAULT '[]',
   updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO community_page(id) VALUES(1);
-- Migration for existing DBs: ALTER TABLE community_page ADD COLUMN IF NOT EXISTS events JSONB DEFAULT '[]', ADD COLUMN IF NOT EXISTS volunteer_program JSONB DEFAULT '{"heading":"Volunteer Program","text":"","image_url":""}', ADD COLUMN IF NOT EXISTS success_stories JSONB DEFAULT '[]';
ALTER TABLE community_page ENABLE ROW LEVEL SECURITY;
CREATE POLICY "community_pub" ON community_page FOR SELECT USING(TRUE);
CREATE POLICY "community_admin" ON community_page FOR UPDATE USING(get_my_role() IN('super_admin','admin'));

-- Storage RLS for scholarship-logos bucket
CREATE POLICY "sclogos_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'scholarship-logos');
CREATE POLICY "sclogos_auth_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'scholarship-logos' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "sclogos_auth_update" ON storage.objects FOR UPDATE USING (bucket_id = 'scholarship-logos' AND (SELECT auth.role()) = 'authenticated');
CREATE POLICY "sclogos_auth_delete" ON storage.objects FOR DELETE USING (bucket_id = 'scholarship-logos' AND (SELECT auth.role()) = 'authenticated');


-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/20260705002_add_missing_columns.sql ============
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS countries INTEGER DEFAULT 0;
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS whatsapp_groups INTEGER DEFAULT 0;
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS main_channel_followers INTEGER DEFAULT 0;
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS scholarship_channel_followers INTEGER DEFAULT 0;
ALTER TABLE site_stats ADD COLUMN IF NOT EXISTS ai_channel_followers INTEGER DEFAULT 0;

ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS role_label TEXT DEFAULT '';
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT '{}';

ALTER TABLE community_page ADD COLUMN IF NOT EXISTS events JSONB DEFAULT '[]';
ALTER TABLE community_page ADD COLUMN IF NOT EXISTS volunteer_program JSONB DEFAULT '{"heading":"Volunteer Program","text":"","image_url":""}';
ALTER TABLE community_page ADD COLUMN IF NOT EXISTS success_stories JSONB DEFAULT '[]';

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/20260705005_add_about_columns.sql ============
ALTER TABLE about_page ADD COLUMN IF NOT EXISTS mission_text TEXT DEFAULT '';
ALTER TABLE about_page ADD COLUMN IF NOT EXISTS core_values JSONB DEFAULT '[]';
ALTER TABLE about_page ADD COLUMN IF NOT EXISTS what_we_do TEXT DEFAULT '';
ALTER TABLE about_page ADD COLUMN IF NOT EXISTS who_can_join TEXT DEFAULT '';

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/20260705007_add_gap_analysis.sql ============
ALTER TABLE career_blueprints ADD COLUMN IF NOT EXISTS gap_analysis TEXT DEFAULT '';

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202607090001_add_hide_price.sql ============
ALTER TABLE products ADD COLUMN IF NOT EXISTS hide_price BOOLEAN DEFAULT FALSE;

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202607090002_add_error_logs.sql ============
CREATE TABLE IF NOT EXISTS error_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  url TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  stack TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Re-runnable: the object may already exist from an out-of-band apply.
DROP POLICY IF EXISTS "super_admin_select_error_logs" ON error_logs;
CREATE POLICY "super_admin_select_error_logs" ON error_logs
  FOR SELECT USING (get_my_role() = 'super_admin');

-- Re-runnable: the object may already exist from an out-of-band apply.
DROP POLICY IF EXISTS "insert_error_logs" ON error_logs;
CREATE POLICY "insert_error_logs" ON error_logs
  FOR INSERT WITH CHECK (true);

SELECT pg_notify('pgrst', 'reload schema');

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202607090003_add_volunteers.sql ============
CREATE TABLE IF NOT EXISTS volunteers (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  preferred_name TEXT DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT DEFAULT '',
  university TEXT DEFAULT '',
  degree TEXT DEFAULT '',
  current_year TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  portfolio TEXT DEFAULT '',
  cv_url TEXT DEFAULT '',
  departments TEXT[] DEFAULT '{}',
  reason TEXT DEFAULT '',
  about TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  volunteered_before BOOLEAN DEFAULT FALSE,
  prev_organizations TEXT DEFAULT '',
  prev_roles TEXT DEFAULT '',
  prev_duration TEXT DEFAULT '',
  hours_per_week TEXT DEFAULT '',
  preferred_time TEXT DEFAULT '',
  preferred_channel TEXT DEFAULT '',
  biggest_strength TEXT DEFAULT '',
  skill_to_develop TEXT DEFAULT '',
  proud_project TEXT DEFAULT '',
  heard_from TEXT DEFAULT '',
  agreement_volunteer BOOLEAN DEFAULT FALSE,
  agreement_hours BOOLEAN DEFAULT FALSE,
  agreement_conduct BOOLEAN DEFAULT FALSE,
  agreement_accurate BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Re-runnable: the object may already exist from an out-of-band apply.
DROP POLICY IF EXISTS "insert_volunteers" ON volunteers;
CREATE POLICY "insert_volunteers" ON volunteers FOR INSERT WITH CHECK (true);
-- Re-runnable: the object may already exist from an out-of-band apply.
DROP POLICY IF EXISTS "super_admin_select_volunteers" ON volunteers;
CREATE POLICY "super_admin_select_volunteers" ON volunteers FOR SELECT USING (get_my_role() = 'super_admin');
-- Re-runnable: the object may already exist from an out-of-band apply.
DROP POLICY IF EXISTS "super_admin_update_volunteers" ON volunteers;
CREATE POLICY "super_admin_update_volunteers" ON volunteers FOR UPDATE USING (get_my_role() = 'super_admin');

SELECT pg_notify('pgrst', 'reload schema');

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202607110001_allow_signed_urls.sql ============
-- Allow anyone to generate signed URLs for product-files (bucket stays private, no direct public access)
-- Re-runnable: the object may already exist from an out-of-band apply.
DROP POLICY IF EXISTS "prod_files_signed_url_select" ON storage.objects;
CREATE POLICY "prod_files_signed_url_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-files');

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202607110003_add_volunteer_delete_policy.sql ============
-- Allow super_admin to delete volunteer records (GDPR right to erasure)
-- Re-runnable: the object may already exist from an out-of-band apply.
DROP POLICY IF EXISTS "super_admin_delete_volunteers" ON volunteers;
CREATE POLICY "super_admin_delete_volunteers" ON volunteers
  FOR DELETE USING (get_my_role() = 'super_admin');

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202607110004_add_popup_settings.sql ============
CREATE TABLE IF NOT EXISTS popup_settings (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  link_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  show_on_entry BOOLEAN DEFAULT true,
  show_on_exit BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE popup_settings ENABLE ROW LEVEL SECURITY;

-- Re-runnable: the object may already exist from an out-of-band apply.
DROP POLICY IF EXISTS "select_popup_settings" ON popup_settings;
CREATE POLICY "select_popup_settings" ON popup_settings FOR SELECT USING (true);
-- Re-runnable: the object may already exist from an out-of-band apply.
DROP POLICY IF EXISTS "super_admin_all_popup_settings" ON popup_settings;
CREATE POLICY "super_admin_all_popup_settings" ON popup_settings FOR ALL USING (get_my_role() = 'super_admin');

SELECT pg_notify('pgrst', 'reload schema');

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202607130001_add_announcements.sql ============
CREATE TABLE IF NOT EXISTS announcements (
  id BIGSERIAL PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  show_on_entry BOOLEAN DEFAULT true,
  show_on_exit BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_announcements" ON announcements;
CREATE POLICY "select_announcements" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "super_admin_all_announcements" ON announcements;
CREATE POLICY "super_admin_all_announcements" ON announcements FOR ALL USING ((SELECT role FROM user_roles WHERE user_id = auth.uid()) = 'super_admin');

SELECT pg_notify('pgrst', 'reload schema');

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202610010001_add_certificates.sql ============
-- Career Radar — Certificate System (templates, issuance, verification, audit)
-- Conventions followed: pgcrypto, handle_updated_at() trigger fn, get_my_role() for RLS,
-- idempotent DDL (IF NOT EXISTS / DROP ... IF EXISTS) so it can be re-run safely.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helper functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM user_roles WHERE user_id = (SELECT auth.uid())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Certificate templates
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 120),
  description TEXT,
  certificate_type TEXT NOT NULL DEFAULT 'achievement'
    CHECK (certificate_type IN ('course_completion','internship','participation','achievement','appreciation','custom')),
  -- Design definition consumed by both the live preview (DOM) and the PDF renderer.
  design JSONB NOT NULL DEFAULT '{}'::jsonb,
  orientation TEXT NOT NULL DEFAULT 'landscape' CHECK (orientation IN ('landscape','portrait')),
  page_size TEXT NOT NULL DEFAULT 'A4' CHECK (page_size IN ('A4','Letter')),
  background_url TEXT,
  border_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  default_font_family TEXT NOT NULL DEFAULT 'Inter',
  default_font_color TEXT NOT NULL DEFAULT '#0F1B33',
  -- Bumped by bump_certificate_template_version() whenever the visual definition
  -- changes. Issued certificates copy this into `template_version` alongside a
  -- frozen snapshot, so a historical certificate always renders exactly as it
  -- looked when it was issued even after the template is redesigned.
  version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  usage_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cert_templates_active ON certificate_templates(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cert_templates_type ON certificate_templates(certificate_type);

DROP TRIGGER IF EXISTS certificate_templates_upd ON certificate_templates;
CREATE TRIGGER certificate_templates_upd BEFORE UPDATE ON certificate_templates
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Version bump. A certificate freezes the template design at issuance, so any
-- change to the visual definition must produce a new version number: otherwise a
-- PDF regenerated years later would claim to be "version 1" of a design that no
-- longer exists. Only design-bearing columns bump the version; renaming a
-- template or toggling it active does not, because neither changes what an
-- issued certificate looks like.
CREATE OR REPLACE FUNCTION bump_certificate_template_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.version IS DISTINCT FROM OLD.version THEN
    -- An explicit version write is respected (backfills, imports).
    RETURN NEW;
  END IF;

  IF NEW.design            IS DISTINCT FROM OLD.design
     OR NEW.orientation    IS DISTINCT FROM OLD.orientation
     OR NEW.page_size      IS DISTINCT FROM OLD.page_size
     OR NEW.background_url IS DISTINCT FROM OLD.background_url
     OR NEW.border_config  IS DISTINCT FROM OLD.border_config
     OR NEW.default_font_family IS DISTINCT FROM OLD.default_font_family
     OR NEW.default_font_color  IS DISTINCT FROM OLD.default_font_color THEN
    NEW.version := OLD.version + 1;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS certificate_templates_version ON certificate_templates;
CREATE TRIGGER certificate_templates_version BEFORE UPDATE ON certificate_templates
  FOR EACH ROW EXECUTE FUNCTION bump_certificate_template_version();

-- ---------------------------------------------------------------------------
-- 2. Issued certificates
-- ---------------------------------------------------------------------------
-- Sequence backing the human-readable public certificate number. Uniqueness is
-- additionally enforced by the UNIQUE constraint on certificate_id.
CREATE SEQUENCE IF NOT EXISTS certificate_number_seq START 1;

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Public-facing number (CR-2026-000001) and unguessable verification secret.
  certificate_id TEXT NOT NULL UNIQUE,
  verification_token TEXT NOT NULL UNIQUE,

  template_id UUID NOT NULL REFERENCES certificate_templates(id) ON DELETE RESTRICT,
  -- Frozen copy of the template at issuance time. Editing a template must never
  -- retroactively change an already-issued certificate.
  template_snapshot JSONB NOT NULL,
  template_version INTEGER NOT NULL DEFAULT 1,

  recipient_name TEXT NOT NULL CHECK (char_length(trim(recipient_name)) BETWEEN 1 AND 160),
  recipient_email TEXT,
  recipient_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  certificate_title TEXT NOT NULL CHECK (char_length(trim(certificate_title)) BETWEEN 1 AND 200),
  description TEXT,
  achievement TEXT,

  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  organization_name TEXT NOT NULL DEFAULT 'Career Radar',
  organization_logo_url TEXT,

  -- Authorized signatory blocks (frozen at issuance).
  signatory_1_name TEXT, signatory_1_title TEXT, signatory_1_image_url TEXT,
  signatory_2_name TEXT, signatory_2_title TEXT, signatory_2_image_url TEXT,

  custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb,

  status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid','revoked','superseded','expired')),
  revoked_at TIMESTAMPTZ, revoked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, revocation_reason TEXT,

  supersedes_id UUID REFERENCES certificates(id) ON DELETE SET NULL,
  superseded_by_id UUID REFERENCES certificates(id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,

  -- Written by the PDF edge function. Both columns are system-managed and are
  -- therefore excluded from the immutability guard's mutable set below.
  pdf_path TEXT, pdf_generated_at TIMESTAMPTZ,
  download_count INTEGER NOT NULL DEFAULT 0 CHECK (download_count >= 0),
  last_downloaded_at TIMESTAMPTZ,
  verification_count INTEGER NOT NULL DEFAULT 0 CHECK (verification_count >= 0),
  last_verified_at TIMESTAMPTZ,

  issued_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  -- Client-generated so a retried or double-clicked batch can be recognised and
  -- rejected instead of silently issuing a second set of certificates.
  issue_batch_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_token ON certificates(verification_token);
CREATE INDEX IF NOT EXISTS idx_certificates_template ON certificates(template_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
CREATE INDEX IF NOT EXISTS idx_certificates_issue_date ON certificates(issue_date DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_recipient_name ON certificates(lower(recipient_name));
CREATE INDEX IF NOT EXISTS idx_certificates_issued_by ON certificates(issued_by);
CREATE INDEX IF NOT EXISTS idx_certificates_recipient_user ON certificates(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_batch ON certificates(issue_batch_id);

-- At most one certificate per (batch, recipient). A retried request with the
-- same batch id therefore fails on the unique index rather than duplicating
-- awards. Certificates issued outside a bulk batch leave this NULL, which the
-- index permits any number of times.
CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_batch_recipient
  ON certificates(issue_batch_id, lower(recipient_name))
  WHERE issue_batch_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_certificates_revoked ON certificates(revoked_at DESC) WHERE status = 'revoked';

DROP TRIGGER IF EXISTS certificates_upd ON certificates;
CREATE TRIGGER certificates_upd BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ---------------------------------------------------------------------------
-- Immutability guard.
--
-- Issued awards are permanent records. Without this, any admin client able to
-- run an UPDATE (the RLS policy above permits it) could silently rewrite the
-- recipient, the frozen design, or flip `status` without leaving an audit row —
-- which would make the audit trail and the public verdict disagree.
--
-- Only presentation fields and the engagement counters are mutable, and the
-- counters are additionally pinned so they can only move through the SECURITY
-- DEFINER counter functions.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION protect_certificate_record()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF auth.uid() IS NOT NULL AND get_my_role() IS DISTINCT FROM 'super_admin' THEN
      RAISE EXCEPTION 'Only super admins may delete certificate records';
    END IF;
    RETURN OLD;
  END IF;

  IF NEW.certificate_id IS DISTINCT FROM OLD.certificate_id
     OR NEW.verification_token IS DISTINCT FROM OLD.verification_token
     OR NEW.recipient_name IS DISTINCT FROM OLD.recipient_name
     OR NEW.recipient_email IS DISTINCT FROM OLD.recipient_email
     OR NEW.recipient_user_id IS DISTINCT FROM OLD.recipient_user_id
     OR NEW.certificate_title IS DISTINCT FROM OLD.certificate_title
     OR NEW.description IS DISTINCT FROM OLD.description
     OR NEW.achievement IS DISTINCT FROM OLD.achievement
     OR NEW.issue_date IS DISTINCT FROM OLD.issue_date
     OR NEW.organization_name IS DISTINCT FROM OLD.organization_name
     OR NEW.organization_logo_url IS DISTINCT FROM OLD.organization_logo_url
     OR NEW.signatory_1_name IS DISTINCT FROM OLD.signatory_1_name
     OR NEW.signatory_1_title IS DISTINCT FROM OLD.signatory_1_title
     OR NEW.signatory_1_image_url IS DISTINCT FROM OLD.signatory_1_image_url
     OR NEW.signatory_2_name IS DISTINCT FROM OLD.signatory_2_name
     OR NEW.signatory_2_title IS DISTINCT FROM OLD.signatory_2_title
     OR NEW.signatory_2_image_url IS DISTINCT FROM OLD.signatory_2_image_url
     OR NEW.template_snapshot IS DISTINCT FROM OLD.template_snapshot
     OR NEW.template_version IS DISTINCT FROM OLD.template_version
     OR NEW.custom_fields IS DISTINCT FROM OLD.custom_fields
     OR NEW.template_id IS DISTINCT FROM OLD.template_id
     OR NEW.issued_by IS DISTINCT FROM OLD.issued_by
     OR NEW.issue_batch_id IS DISTINCT FROM OLD.issue_batch_id
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION
      'Issued certificate records are immutable. Reissue the certificate instead of editing it.';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status NOT IN ('revoked','superseded','expired') THEN
      RAISE EXCEPTION 'Use revoke_certificate() or reissue_certificate() to change certificate status';
    END IF;
    -- A revocation must always carry a public reason; a supersede (reissue) does
    -- not, because the reason lives on the audit row for the reissue instead.
    IF NEW.status = 'revoked'
       AND btrim(COALESCE(NEW.revocation_reason, '')) = '' THEN
      RAISE EXCEPTION 'A revocation reason is required to revoke a certificate';
    END IF;
    IF auth.uid() IS NOT NULL AND get_my_role() NOT IN ('super_admin','admin') THEN
      RAISE EXCEPTION 'Not authorised to change certificate status';
    END IF;
  END IF;

  -- Counters move only through record_certificate_verification/download, which
  -- set the transaction-local flag consumed here. `is_local = true` scopes the
  -- setting to the current transaction, so it cannot leak to a client statement.
  IF current_setting('certificates.system_write', true) IS DISTINCT FROM 'on' THEN
    IF NEW.verification_count IS DISTINCT FROM OLD.verification_count
       OR NEW.last_verified_at IS DISTINCT FROM OLD.last_verified_at
       OR NEW.download_count IS DISTINCT FROM OLD.download_count
       OR NEW.last_downloaded_at IS DISTINCT FROM OLD.last_downloaded_at THEN
      RAISE EXCEPTION 'Verification and download counters are system-managed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS certificates_protect_record ON certificates;
CREATE TRIGGER certificates_protect_record
  BEFORE UPDATE OR DELETE ON certificates
  FOR EACH ROW EXECUTE FUNCTION protect_certificate_record();

-- ---------------------------------------------------------------------------
-- 3. Verification events (public reads are recorded here, never trusted from client)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificate_verification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID REFERENCES certificates(id) ON DELETE CASCADE,
  -- Retained even when the certificate row is gone, so abuse is still traceable.
  looked_up_reference TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('certificate_id','verification_url','qr_code')),
  outcome TEXT NOT NULL CHECK (outcome IN ('found','not_found')),
  certificate_status TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cert_verify_events_cert ON certificate_verification_events(certificate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cert_verify_events_created ON certificate_verification_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cert_verify_events_outcome ON certificate_verification_events(outcome);

-- ---------------------------------------------------------------------------
-- 4. Audit trail for privileged certificate operations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificate_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID REFERENCES certificates(id) ON DELETE SET NULL,
  template_id UUID REFERENCES certificate_templates(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN (
    'template_created','template_updated','template_deleted','template_duplicated',
    'template_activated','template_deactivated',
    'certificate_issued','certificate_bulk_issued','certificate_revoked',
    'certificate_reissued','certificate_pdf_generated','certificate_pdf_downloaded'
  )),
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  performed_by_email TEXT,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cert_audit_cert ON certificate_audit_logs(certificate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cert_audit_template ON certificate_audit_logs(template_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cert_audit_action ON certificate_audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cert_audit_actor ON certificate_audit_logs(performed_by, created_at DESC);

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_verification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cert_templates_admin_select" ON certificate_templates;
DROP POLICY IF EXISTS "cert_templates_admin_insert" ON certificate_templates;
DROP POLICY IF EXISTS "cert_templates_admin_update" ON certificate_templates;
DROP POLICY IF EXISTS "cert_templates_admin_delete" ON certificate_templates;

-- NOTE: there is deliberately NO anonymous SELECT policy on certificate_templates.
CREATE POLICY "cert_templates_admin_select" ON certificate_templates FOR SELECT
  USING (get_my_role() IN ('super_admin','admin'));
CREATE POLICY "cert_templates_admin_insert" ON certificate_templates FOR INSERT
  WITH CHECK (get_my_role() IN ('super_admin','admin'));
CREATE POLICY "cert_templates_admin_update" ON certificate_templates FOR UPDATE
  USING (get_my_role() IN ('super_admin','admin'))
  WITH CHECK (get_my_role() IN ('super_admin','admin'));
-- Deleting a template that has issued certificates would destroy history → super_admin only.
CREATE POLICY "cert_templates_admin_delete" ON certificate_templates FOR DELETE
  USING (get_my_role() = 'super_admin');

DROP POLICY IF EXISTS "certificates_admin_select" ON certificates;
DROP POLICY IF EXISTS "certificates_admin_insert" ON certificates;
DROP POLICY IF EXISTS "certificates_admin_update" ON certificates;
DROP POLICY IF EXISTS "certificates_admin_delete" ON certificates;
DROP POLICY IF EXISTS "certificates_recipient_select" ON certificates;

CREATE POLICY "certificates_admin_select" ON certificates FOR SELECT
  USING (get_my_role() IN ('super_admin','admin'));
-- `issued_by = auth.uid()` also stops an admin issuing an award in someone
-- else's name. `set_certificate_defaults()` fills issued_by from auth.uid()
-- before this check runs, so a client cannot spoof the issuer either.
CREATE POLICY "certificates_admin_insert" ON certificates FOR INSERT
  WITH CHECK (get_my_role() IN ('super_admin','admin')
              AND issued_by = (SELECT auth.uid()));
-- UPDATE stays admin-permitted so the revoke/reissue RPCs (which perform their own
-- UPDATE as the function owner) keep working, but `protect_certificate_record()`
-- blocks any mutation of the issued fields or the system-managed counters.
CREATE POLICY "certificates_admin_update" ON certificates FOR UPDATE
  USING (get_my_role() IN ('super_admin','admin'))
  WITH CHECK (get_my_role() IN ('super_admin','admin'));
CREATE POLICY "certificates_admin_delete" ON certificates FOR DELETE
  USING (get_my_role() = 'super_admin');

-- A signed-in recipient may read their own certificates.
CREATE POLICY "certificates_recipient_select" ON certificates FOR SELECT
  USING (recipient_user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "cert_verify_events_admin_select" ON certificate_verification_events;
CREATE POLICY "cert_verify_events_admin_select" ON certificate_verification_events FOR SELECT
  USING (get_my_role() IN ('super_admin','admin'));
-- Inserts happen exclusively through the SECURITY DEFINER verification function.

DROP POLICY IF EXISTS "cert_audit_logs_admin_select" ON certificate_audit_logs;
DROP POLICY IF EXISTS "cert_audit_logs_admin_insert" ON certificate_audit_logs;
CREATE POLICY "cert_audit_logs_admin_select" ON certificate_audit_logs FOR SELECT
  USING (get_my_role() IN ('super_admin','admin'));
-- There is deliberately no INSERT policy. An admin insert policy would let any
-- admin write a row naming any actor and any action, which defeats the point of
-- an audit trail. Every insert goes through a SECURITY DEFINER function that
-- pins the actor itself:
--   - log_certificate_audit()      browser template lifecycle, actor = auth.uid()
--   - record_certificate_download() edge functions, actor supplied by service_role

-- ===========================================================================
-- Identifiers — generated server-side only, never accepted from the client
-- ===========================================================================
CREATE OR REPLACE FUNCTION generate_certificate_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_seq BIGINT;
  v_year TEXT;
  v_id TEXT;
BEGIN
  v_year := to_char(NOW(), 'YYYY');
  -- Sequence guarantees no gap/reuse under concurrency; the UNIQUE index is the
  -- final authority. Loop handles the (practically impossible) collision case.
  FOR _ IN 1..5 LOOP
    v_seq := nextval('certificate_number_seq');
    v_id := 'CR-' || v_year || '-' || lpad(v_seq::TEXT, 6, '0');
    IF NOT EXISTS (SELECT 1 FROM certificates WHERE certificate_id = v_id) THEN
      RETURN v_id;
    END IF;
  END LOOP;
  RAISE EXCEPTION 'Could not allocate a unique certificate number';
END;
$$;

CREATE OR REPLACE FUNCTION generate_verification_token()
RETURNS TEXT
LANGUAGE sql
AS $$
  -- 192 bits of entropy, URL-safe. Unpredictable so URLs cannot be enumerated.
  -- Use gen_random_uuid() which is always available in PostgreSQL 13+
  SELECT 'v_' || replace(gen_random_uuid()::text, '-', '');
$$;

DROP FUNCTION IF EXISTS set_certificate_defaults() CASCADE;
CREATE OR REPLACE FUNCTION set_certificate_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.certificate_id IS NULL OR NEW.certificate_id = '' THEN
    NEW.certificate_id := generate_certificate_id();
  END IF;
  IF NEW.verification_token IS NULL OR NEW.verification_token = '' THEN
    NEW.verification_token := generate_verification_token();
  END IF;

  -- Issuance is an admin-only action. Enforcing it here means the trigger is
  -- the single authority regardless of which code path (direct insert, RPC or
  -- reissue) produced the row.
  --
  -- `auth.uid() IS NULL` identifies a trusted server context (an edge function
  -- calling with the service-role key, or this trigger firing from inside a
  -- SECURITY DEFINER function). Interactive callers always have a uid, so an
  -- anonymous insert cannot use this branch — and anon has no INSERT policy on
  -- `certificates` in any case.
  IF NEW.issued_by IS NULL THEN
    NEW.issued_by := auth.uid();
  END IF;
  IF auth.uid() IS NOT NULL
     AND get_my_role() NOT IN ('super_admin','admin') THEN
    RAISE EXCEPTION 'Not authorised to issue certificates';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS certificates_set_defaults ON certificates;
CREATE TRIGGER certificates_set_defaults BEFORE INSERT ON certificates
  FOR EACH ROW EXECUTE FUNCTION set_certificate_defaults();

-- Audit helper. SECURITY DEFINER so the row can be written even when invoked
-- from an edge function using the service-role key (auth.uid() may be absent).
--
-- Security: this is SECURITY DEFINER, so it MUST NOT be executable by anon or by
-- collaborators — otherwise anyone could forge audit entries. The role gate below
-- is the second line of defence, after the REVOKE/GRANT pair at the end of this
-- migration. `p_performed_by` is retained for signature compatibility but is
-- deliberately IGNORED: auth.uid() is the only accepted actor, so an admin cannot
-- forge an audit trail attributed to someone else.
CREATE OR REPLACE FUNCTION log_certificate_audit(
  p_action TEXT,
  p_certificate_id UUID DEFAULT NULL,
  p_template_id UUID DEFAULT NULL,
  p_performed_by UUID DEFAULT NULL,
  p_detail JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor UUID := auth.uid();
BEGIN
  IF get_my_role() NOT IN ('super_admin','admin') THEN
    RAISE EXCEPTION 'Not authorised to write certificate audit entries';
  END IF;
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'No authenticated actor for certificate audit entry';
  END IF;

  INSERT INTO certificate_audit_logs
    (certificate_id, template_id, action, performed_by, performed_by_email, detail)
  VALUES
    (p_certificate_id, p_template_id, p_action, v_actor,
     (SELECT email FROM auth.users WHERE id = v_actor),
     COALESCE(p_detail, '{}'::jsonb));
EXCEPTION WHEN OTHERS THEN
  -- Auditing must never abort the business operation it is recording — but an
  -- authorisation failure must never be swallowed either.
  IF SQLERRM LIKE 'Not authorised%' OR SQLERRM LIKE 'No authenticated actor%' THEN
    RAISE;
  END IF;
  RAISE WARNING 'certificate audit log failed: %', SQLERRM;
END;
$$;

-- Verification / download counters. SECURITY DEFINER deliberately: these must
-- keep working when called by the public verification RPC and by the edge
-- functions, neither of which is the table owner. `set_config` raises
-- `certificates.system_write`, which `protect_certificate_record()` uses to allow
-- the counter bump while still rejecting any client-issued UPDATE that touches
-- these columns.
CREATE OR REPLACE FUNCTION record_certificate_verification(p_certificate_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM set_config('certificates.system_write', 'on', true);
  UPDATE certificates
     SET verification_count = verification_count + 1,
         last_verified_at = NOW()
   WHERE id = p_certificate_id;
END;
$$;

-- Increments the download counter and writes the matching audit row.
--
-- `p_actor` is supplied by the edge function, which has already verified the
-- caller's bearer token, so `auth.uid()` is null in that context. This function
-- is granted to `service_role` only and revoked from anon/authenticated, so the
-- actor cannot be supplied from the browser — a client that reaches this path
-- cannot reach the function at all.
CREATE OR REPLACE FUNCTION record_certificate_download(
  p_certificate_id UUID,
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_actor UUID DEFAULT NULL,
  p_channel TEXT DEFAULT 'admin'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor UUID := COALESCE(p_actor, auth.uid());
  v_cert certificates%ROWTYPE;
BEGIN
  SELECT * INTO v_cert FROM certificates WHERE id = p_certificate_id;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  PERFORM set_config('certificates.system_write', 'on', true);
  UPDATE certificates
     SET download_count = download_count + 1,
         last_downloaded_at = NOW()
   WHERE id = p_certificate_id;

  -- A public visitor has no authenticated actor, so performed_by stays null and
  -- the row is attributed through the channel instead. That is expected for the
  -- public PDF link and does not indicate a broken audit.
  INSERT INTO certificate_audit_logs
    (certificate_id, template_id, action, performed_by, performed_by_email, detail)
  VALUES
    (v_cert.id, v_cert.template_id, 'certificate_downloaded', v_actor,
     (SELECT email FROM auth.users WHERE id = v_actor),
     jsonb_build_object(
       'channel',    COALESCE(p_channel, 'unknown'),
       'ip_hash',    p_ip_hash,
       'user_agent', left(COALESCE(p_user_agent, ''), 300)
     ));
END;
$$;

-- ===========================================================================
-- Public verification — SECURITY DEFINER, column-whitelisted
-- ---------------------------------------------------------------------------
-- Row-level security cannot restrict *columns*. Exposing a SELECT policy on
-- `certificates` to anon would leak recipient_email, issued_by, custom_fields,
-- the PDF path, and would additionally hide revoked certificates (they must stay
-- publicly identifiable as revoked). This function is therefore the ONLY public
-- read path, and it returns exactly the approved fields.
--
-- It also records the verification event and bumps the counter atomically.
-- ===========================================================================
CREATE OR REPLACE FUNCTION public_verify_certificate(
  p_reference TEXT,
  p_method TEXT DEFAULT 'certificate_id',
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ref TEXT := btrim(COALESCE(p_reference, ''));
  v_method TEXT := CASE
                     WHEN p_method IN ('certificate_id','verification_url','qr_code') THEN p_method
                     ELSE 'certificate_id'
                   END;
  -- A QR code and a shared link both carry the opaque token, so both must resolve
  -- against `verification_token`. Only a typed reference resolves against the
  -- human-readable `certificate_id`. Treating `qr_code` as an ID lookup would
  -- make every scanned code report "not found".
  v_by_token BOOLEAN := v_method IN ('verification_url','qr_code');
  v_row certificates%ROWTYPE;
  v_found BOOLEAN := FALSE;
BEGIN
  IF v_ref = '' THEN
    RAISE EXCEPTION 'A certificate reference is required';
  END IF;

  -- Both branches compare a column directly to a value, so the UNIQUE indexes on
  -- `verification_token` and `certificate_id` are usable. Case is normalised on the
  -- input only: the token is lowercase hex, and generated numbers are uppercase,
  -- so upper() on the column side would be both redundant and index-defeating.
  IF v_by_token THEN
    SELECT * INTO v_row FROM certificates WHERE verification_token = lower(v_ref);
  ELSE
    SELECT * INTO v_row FROM certificates WHERE certificate_id = upper(v_ref);
  END IF;
  v_found := FOUND;

  INSERT INTO certificate_verification_events
    (certificate_id, looked_up_reference, method, outcome, certificate_status, ip_hash, user_agent)
  VALUES
    (CASE WHEN v_found THEN v_row.id END,
     left(v_ref, 120), v_method,
     CASE WHEN v_found THEN 'found' ELSE 'not_found' END,
     CASE WHEN v_found THEN v_row.status END,
     p_ip_hash, left(COALESCE(p_user_agent,''), 300));

  IF NOT v_found THEN
    RETURN json_build_object('found', false);
  END IF;

  PERFORM record_certificate_verification(v_row.id);

  RETURN json_build_object(
    'found',                 true,
    'certificate_id',        v_row.certificate_id,
    'verification_token',    v_row.verification_token,
    'recipient_name',        v_row.recipient_name,
    'certificate_title',     v_row.certificate_title,
    'description',           v_row.description,
    'achievement',           v_row.achievement,
    'certificate_type',      v_row.template_snapshot->>'certificate_type',
    'issue_date',            v_row.issue_date,
    'organization_name',     v_row.organization_name,
    'organization_logo_url', v_row.organization_logo_url,
    'status',                v_row.status,
    'revoked_at',            v_row.revoked_at,
    'revocation_reason',     v_row.revocation_reason,
    'version',               v_row.version,
    'superseded_by_id',      v_row.superseded_by_id->>'certificate_id',
    'supersedes_id',         v_row.supersedes_id->>'certificate_id',
    'verification_count',    v_row.verification_count + 1,
    'last_verified_at',      NOW()
  );
END;
$$;

REVOKE ALL ON FUNCTION public_verify_certificate(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public_verify_certificate(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- Reissue helper: creates the replacement and links both sides in one transaction
-- so history is never lost and the old certificate is never silently mutated.
CREATE OR REPLACE FUNCTION reissue_certificate(
  p_old_certificate_id UUID,
  p_reason TEXT,
  p_overrides JSONB DEFAULT '{}'::jsonb
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old certificates%ROWTYPE;
  v_new certificates%ROWTYPE;
  v_actor UUID := auth.uid();
BEGIN
  IF get_my_role() NOT IN ('super_admin','admin') THEN
    RAISE EXCEPTION 'Not authorised to reissue certificates';
  END IF;

  SELECT * INTO v_old FROM certificates WHERE id = p_old_certificate_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Certificate not found'; END IF;
  IF v_old.status = 'superseded' THEN
    RAISE EXCEPTION 'Certificate has already been reissued';
  END IF;
  -- Mirrors revoke_certificate: an unexplained reissue is an unexplained audit
  -- trail, and the reason is the only record of why the old number stopped working.
  IF btrim(COALESCE(p_reason, '')) = '' THEN
    RAISE EXCEPTION 'A reason is required to reissue a certificate';
  END IF;

  INSERT INTO certificates (
    template_id, template_snapshot, template_version,
    recipient_name, recipient_email, recipient_user_id,
    certificate_title, description, achievement,
    issue_date, organization_name, organization_logo_url,
    signatory_1_name, signatory_1_title, signatory_1_image_url,
    signatory_2_name, signatory_2_title, signatory_2_image_url,
    custom_fields, supersedes_id, version, issued_by
  ) VALUES (
    v_old.template_id, v_old.template_snapshot, v_old.template_version,
    COALESCE(p_overrides->>'recipient_name', v_old.recipient_name),
    COALESCE(p_overrides->>'recipient_email', v_old.recipient_email),
    v_old.recipient_user_id,
    COALESCE(p_overrides->>'certificate_title', v_old.certificate_title),
    COALESCE(p_overrides->>'description', v_old.description),
    COALESCE(p_overrides->>'achievement', v_old.achievement),
    COALESCE((p_overrides->>'issue_date')::DATE, v_old.issue_date),
    v_old.organization_name, v_old.organization_logo_url,
    v_old.signatory_1_name, v_old.signatory_1_title, v_old.signatory_1_image_url,
    v_old.signatory_2_name, v_old.signatory_2_title, v_old.signatory_2_image_url,
    v_old.custom_fields, v_old.id, v_old.version + 1, v_actor
  )
  RETURNING * INTO v_new;

  UPDATE certificates
     SET status = 'superseded', superseded_by_id = v_new.id
   WHERE id = v_old.id;

  PERFORM log_certificate_audit(
    'certificate_reissued', v_new.id, v_new.template_id, v_actor,
    jsonb_build_object('previous_certificate_id', v_old.certificate_id, 'reason', p_reason)
  );

  RETURN json_build_object('certificate_id', v_new.certificate_id, 'id', v_new.id,
                          'verification_token', v_new.verification_token);
END;
$$;

REVOKE ALL ON FUNCTION reissue_certificate(UUID, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION reissue_certificate(UUID, TEXT, JSONB) TO authenticated;

-- Revoke with a mandatory reason, recorded immutably in the audit trail.
CREATE OR REPLACE FUNCTION revoke_certificate(p_certificate_id UUID, p_reason TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old certificates%ROWTYPE;
  v_actor UUID := auth.uid();
BEGIN
  IF get_my_role() NOT IN ('super_admin','admin') THEN
    RAISE EXCEPTION 'Not authorised to revoke certificates';
  END IF;
  IF btrim(COALESCE(p_reason, '')) = '' THEN
    RAISE EXCEPTION 'A revocation reason is required';
  END IF;

  SELECT * INTO v_old FROM certificates WHERE id = p_certificate_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Certificate not found'; END IF;
  IF v_old.status = 'revoked' THEN
    RAISE EXCEPTION 'Certificate is already revoked';
  END IF;

  UPDATE certificates
     SET status = 'revoked', revoked_at = NOW(), revoked_by = v_actor, revocation_reason = p_reason
   WHERE id = p_certificate_id;

  PERFORM log_certificate_audit(
    'certificate_revoked', p_certificate_id, v_old.template_id, v_actor,
    jsonb_build_object('reason', p_reason, 'previous_status', v_old.status,
                       'certificate_id', v_old.certificate_id)
  );
END;
$$;

REVOKE ALL ON FUNCTION revoke_certificate(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION revoke_certificate(UUID, TEXT) TO authenticated;

-- Dashboard aggregates (admin-only via the SELECT policy below).
-- Views with security_invoker = true automatically enforce RLS from underlying tables.
CREATE OR REPLACE VIEW certificate_stats WITH (security_invoker = true) AS
SELECT
  count(*)                                                          AS total_issued,
  count(*) FILTER (WHERE status = 'valid')                           AS currently_valid,
  count(*) FILTER (WHERE status = 'revoked')                          AS revoked,
  count(*) FILTER (WHERE status = 'superseded')                       AS superseded,
  count(*) FILTER (WHERE status = 'expired')                          AS expired,
  count(*) FILTER (WHERE issue_date >= CURRENT_DATE - 30)             AS issued_last_30_days,
  COALESCE(sum(verification_count), 0)                               AS total_verifications,
  COALESCE(sum(download_count), 0)                                    AS total_downloads,
  count(DISTINCT recipient_name)                                      AS unique_recipients,
  count(DISTINCT template_id)                                         AS templates_in_use
FROM certificates;

CREATE OR REPLACE VIEW certificate_template_stats WITH (security_invoker = true) AS
SELECT
  ct.id, ct.name, ct.certificate_type, ct.is_active,
  count(c.id)                                                         AS issued_count,
  count(c.id) FILTER (WHERE c.status = 'valid')                       AS valid_count,
  count(c.id) FILTER (WHERE c.status = 'revoked')                      AS revoked_count,
  max(c.created_at)                                                   AS last_issued_at
FROM certificate_templates ct
LEFT JOIN certificates c ON c.template_id = ct.id
GROUP BY ct.id, ct.name, ct.certificate_type, ct.is_active;

-- ===========================================================================
-- Storage — private bucket for generated certificate PDFs
-- ===========================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('certificate-pdfs', 'certificate-pdfs', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "cert_pdfs_admin_read" ON storage.objects;
DROP POLICY IF EXISTS "cert_pdfs_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "cert_pdfs_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "cert_pdfs_admin_delete" ON storage.objects;

-- PDFs are private: served only through short-lived signed URLs minted by the
-- edge function after a server-side authorisation check.
CREATE POLICY "cert_pdfs_admin_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'certificate-pdfs' AND get_my_role() IN ('super_admin','admin'));
CREATE POLICY "cert_pdfs_admin_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certificate-pdfs' AND get_my_role() IN ('super_admin','admin'));
CREATE POLICY "cert_pdfs_admin_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'certificate-pdfs' AND get_my_role() IN ('super_admin','admin'));
CREATE POLICY "cert_pdfs_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'certificate-pdfs' AND get_my_role() = 'super_admin');

-- ---------------------------------------------------------------------------
-- certificate-assets — template artwork, logos and signatory images.
--
-- These objects are rendered into certificates that anyone can verify, and into
-- PDFs regenerated months later. They therefore must NOT be stored behind
-- expiring signed URLs, so this bucket is publicly readable while remaining
-- admin-writable only. Mirrors the existing `avatars` bucket convention.
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('certificate-assets', 'certificate-assets', true, 5242880,
        ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE
  SET public = EXCLUDED.public,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "cert_assets_public_read" ON storage.objects;
DROP POLICY IF EXISTS "cert_assets_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "cert_assets_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "cert_assets_admin_delete" ON storage.objects;

CREATE POLICY "cert_assets_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'certificate-assets');
CREATE POLICY "cert_assets_admin_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certificate-assets' AND get_my_role() IN ('super_admin','admin'));
CREATE POLICY "cert_assets_admin_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'certificate-assets' AND get_my_role() IN ('super_admin','admin'));
CREATE POLICY "cert_assets_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'certificate-assets' AND get_my_role() IN ('super_admin','admin'));

-- ===========================================================================
-- Function privileges.
--
-- Every function below is SECURITY DEFINER, so by default PostgreSQL would grant
-- EXECUTE to PUBLIC — meaning `anon` could forge audit rows, inflate counters or
-- burn certificate ID sequences. Revoke first, then grant the narrowest role.
-- ===========================================================================
REVOKE ALL ON FUNCTION generate_certificate_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION generate_verification_token() FROM PUBLIC;
REVOKE ALL ON FUNCTION bump_certificate_template_version() FROM PUBLIC;
REVOKE ALL ON FUNCTION set_certificate_defaults() FROM PUBLIC;
REVOKE ALL ON FUNCTION protect_certificate_record() FROM PUBLIC;

-- The audit writer is reachable from the browser (the admin UI records template
-- lifecycle events), so it stays callable by authenticated users but is
-- role-gated inside the function: collaborators and anonymous callers are
-- rejected, and `p_performed_by` is ignored so the actor can never be forged.
REVOKE ALL ON FUNCTION log_certificate_audit(TEXT, UUID, UUID, UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION log_certificate_audit(TEXT, UUID, UUID, UUID, JSONB) TO authenticated;

-- Counters are only ever called from SECURITY DEFINER functions and by the edge
-- functions using the service role, so no interactive role needs them.
--
-- `service_role` is granted EXECUTE explicitly rather than relying on a default:
-- the service role bypasses RLS, but PostgreSQL function privileges are ordinary
-- ACLs and are NOT bypassed. `anon` and `authenticated` stay excluded, so this
-- grant cannot be reached from the browser with a user JWT.
REVOKE ALL ON FUNCTION record_certificate_verification(UUID) FROM PUBLIC, anon, authenticated;
-- The 3-argument form is the pre-audit version; drop it so a re-run cannot leave
-- an unaudited twin callable.
DROP FUNCTION IF EXISTS record_certificate_download(UUID, TEXT, TEXT);
REVOKE ALL ON FUNCTION record_certificate_download(UUID, TEXT, TEXT, UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION record_certificate_verification(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION record_certificate_download(UUID, TEXT, TEXT, UUID, TEXT) TO service_role;

-- ---------------------------------------------------------------------------
-- Add manage_certificates permission to admin roles
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  -- Add to admin role
  UPDATE user_roles
  SET permissions = array_append(permissions, 'manage_certificates')
  WHERE role = 'admin' AND NOT 'manage_certificates' = ANY(permissions);

  -- Add to super_admin role (should already have all, but ensure it)
  UPDATE user_roles
  SET permissions = array_append(permissions, 'manage_certificates')
  WHERE role = 'super_admin' AND NOT 'manage_certificates' = ANY(permissions);
END $$;
-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202610020001_add_certificate_helper_functions.sql ============
-- Helper functions for certificate system
-- These are required by the certificate tables and edge functions

-- get_my_role() - Required for RLS policies
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM user_roles WHERE user_id = (SELECT auth.uid())
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- handle_updated_at() - Required for auto-updating timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202610020002_add_manage_certificates_permission.sql ============
-- Add manage_certificates permission to admin roles
DO $$
BEGIN
  -- Add to admin role
  UPDATE user_roles
  SET permissions = array_append(permissions, 'manage_certificates')
  WHERE role = 'admin' AND NOT 'manage_certificates' = ANY(permissions);

  -- Add to super_admin role (should already have all, but ensure it)
  UPDATE user_roles
  SET permissions = array_append(permissions, 'manage_certificates')
  WHERE role = 'super_admin' AND NOT 'manage_certificates' = ANY(permissions);
END $$;

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202610030001_fix_certificate_verification.sql ============
-- ===========================================================================
-- Fix certificate public verification function and add direct select policy
-- ===========================================================================

-- 1. Fix public_verify_certificate SQL error (superseded_by_id is UUID, not JSON)
CREATE OR REPLACE FUNCTION public_verify_certificate(
  p_reference TEXT,
  p_method TEXT DEFAULT 'certificate_id',
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ref TEXT := btrim(COALESCE(p_reference, ''));
  v_method TEXT := CASE
                     WHEN p_method IN ('certificate_id','verification_url','qr_code') THEN p_method
                     ELSE 'certificate_id'
                   END;
  v_by_token BOOLEAN := v_method IN ('verification_url','qr_code');
  v_row certificates%ROWTYPE;
  v_found BOOLEAN := FALSE;
  v_superseded_by_cert_id TEXT := NULL;
  v_supersedes_cert_id TEXT := NULL;
BEGIN
  IF v_ref = '' THEN
    RAISE EXCEPTION 'A certificate reference is required';
  END IF;

  IF v_by_token THEN
    SELECT * INTO v_row FROM certificates WHERE verification_token = lower(v_ref);
    IF NOT FOUND THEN
      SELECT * INTO v_row FROM certificates WHERE certificate_id = upper(v_ref);
    END IF;
  ELSE
    SELECT * INTO v_row FROM certificates WHERE certificate_id = upper(v_ref);
    IF NOT FOUND THEN
      SELECT * INTO v_row FROM certificates WHERE verification_token = lower(v_ref);
    END IF;
  END IF;
  v_found := (v_row.id IS NOT NULL);

  -- Record event (non-blocking)
  BEGIN
    INSERT INTO certificate_verification_events
      (certificate_id, looked_up_reference, method, outcome, certificate_status, ip_hash, user_agent)
    VALUES
      (CASE WHEN v_found THEN v_row.id END,
       left(v_ref, 120), v_method,
       CASE WHEN v_found THEN 'found' ELSE 'not_found' END,
       CASE WHEN v_found THEN v_row.status END,
       p_ip_hash, left(COALESCE(p_user_agent,''), 300));
  EXCEPTION WHEN OTHERS THEN
    -- Never fail verification because event logging hit an issue
    NULL;
  END;

  IF NOT v_found THEN
    RETURN json_build_object('found', false);
  END IF;

  -- Bump counter
  BEGIN
    PERFORM record_certificate_verification(v_row.id);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- Safely resolve superseded certificate_id if present
  IF v_row.superseded_by_id IS NOT NULL THEN
    SELECT certificate_id INTO v_superseded_by_cert_id FROM certificates WHERE id = v_row.superseded_by_id;
  END IF;
  IF v_row.supersedes_id IS NOT NULL THEN
    SELECT certificate_id INTO v_supersedes_cert_id FROM certificates WHERE id = v_row.supersedes_id;
  END IF;

  RETURN json_build_object(
    'found',                 true,
    'certificate_id',        v_row.certificate_id,
    'verification_token',    v_row.verification_token,
    'recipient_name',        v_row.recipient_name,
    'certificate_title',     v_row.certificate_title,
    'description',           v_row.description,
    'achievement',           v_row.achievement,
    'certificate_type',      COALESCE(v_row.template_snapshot->>'certificate_type', 'appreciation'),
    'issue_date',            v_row.issue_date,
    'organization_name',     v_row.organization_name,
    'organization_logo_url', v_row.organization_logo_url,
    'status',                v_row.status,
    'revoked_at',            v_row.revoked_at,
    'revocation_reason',     v_row.revocation_reason,
    'version',               v_row.version,
    'superseded_by_id',      v_superseded_by_cert_id,
    'supersedes_id',         v_supersedes_cert_id,
    'custom_fields',         v_row.custom_fields,
    'verification_count',    COALESCE(v_row.verification_count, 0) + 1,
    'last_verified_at',      NOW()
  );
END;
$$;

REVOKE ALL ON FUNCTION public_verify_certificate(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public_verify_certificate(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- 2. Allow public/anon to read certificates for verification fallback
DROP POLICY IF EXISTS "certificates_public_verify_select" ON certificates;
CREATE POLICY "certificates_public_verify_select" ON certificates
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202610040001_dual_lookup_verification.sql ============
-- ===========================================================================
-- Ensure dual lookup (verification_token + certificate_id) for public verification
-- ===========================================================================

CREATE OR REPLACE FUNCTION public_verify_certificate(
  p_reference TEXT,
  p_method TEXT DEFAULT 'certificate_id',
  p_ip_hash TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ref TEXT := btrim(COALESCE(p_reference, ''));
  v_method TEXT := CASE
                     WHEN p_method IN ('certificate_id','verification_url','qr_code') THEN p_method
                     ELSE 'certificate_id'
                   END;
  v_by_token BOOLEAN := v_method IN ('verification_url','qr_code');
  v_row certificates%ROWTYPE;
  v_found BOOLEAN := FALSE;
  v_superseded_by_cert_id TEXT := NULL;
  v_supersedes_cert_id TEXT := NULL;
BEGIN
  IF v_ref = '' THEN
    RAISE EXCEPTION 'A certificate reference is required';
  END IF;

  IF v_by_token THEN
    SELECT * INTO v_row FROM certificates WHERE verification_token = lower(v_ref);
    IF NOT FOUND THEN
      SELECT * INTO v_row FROM certificates WHERE certificate_id = upper(v_ref);
    END IF;
  ELSE
    SELECT * INTO v_row FROM certificates WHERE certificate_id = upper(v_ref);
    IF NOT FOUND THEN
      SELECT * INTO v_row FROM certificates WHERE verification_token = lower(v_ref);
    END IF;
  END IF;
  v_found := (v_row.id IS NOT NULL);

  -- Record event (non-blocking)
  BEGIN
    INSERT INTO certificate_verification_events
      (certificate_id, looked_up_reference, method, outcome, certificate_status, ip_hash, user_agent)
    VALUES
      (CASE WHEN v_found THEN v_row.id END,
       left(v_ref, 120), v_method,
       CASE WHEN v_found THEN 'found' ELSE 'not_found' END,
       CASE WHEN v_found THEN v_row.status END,
       p_ip_hash, left(COALESCE(p_user_agent,''), 300));
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  IF NOT v_found THEN
    RETURN json_build_object('found', false);
  END IF;

  -- Bump counter
  BEGIN
    PERFORM record_certificate_verification(v_row.id);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- Safely resolve superseded certificate_id if present
  IF v_row.superseded_by_id IS NOT NULL THEN
    SELECT certificate_id INTO v_superseded_by_cert_id FROM certificates WHERE id = v_row.superseded_by_id;
  END IF;
  IF v_row.supersedes_id IS NOT NULL THEN
    SELECT certificate_id INTO v_supersedes_cert_id FROM certificates WHERE id = v_row.supersedes_id;
  END IF;

  RETURN json_build_object(
    'found',                 true,
    'certificate_id',        v_row.certificate_id,
    'verification_token',    v_row.verification_token,
    'recipient_name',        v_row.recipient_name,
    'certificate_title',     v_row.certificate_title,
    'description',           v_row.description,
    'achievement',           v_row.achievement,
    'certificate_type',      COALESCE(v_row.template_snapshot->>'certificate_type', 'appreciation'),
    'issue_date',            v_row.issue_date,
    'organization_name',     v_row.organization_name,
    'organization_logo_url', v_row.organization_logo_url,
    'status',                v_row.status,
    'revoked_at',            v_row.revoked_at,
    'revocation_reason',     v_row.revocation_reason,
    'version',               v_row.version,
    'superseded_by_id',      v_superseded_by_cert_id,
    'supersedes_id',         v_supersedes_cert_id,
    'custom_fields',         v_row.custom_fields,
    'verification_count',    COALESCE(v_row.verification_count, 0) + 1,
    'last_verified_at',      NOW()
  );
END;
$$;

REVOKE ALL ON FUNCTION public_verify_certificate(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public_verify_certificate(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- ============ FROM: /home/hatch/workspace/career-radar/supabase/migrations/202610040002_add_scholarship_is_active.sql ============
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

-- ============ FROM: /home/hatch/workspace/career-radar-v2/supabase/migrations/202610140001_add_saved_items.sql ============
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

-- ============ FROM: /home/hatch/workspace/career-radar-v2/supabase/migrations/202610140002_certificates_email_recipient_select.sql ============
-- Migration: let a recipient read their certificates by email, not only by
-- account link. The v1 recipient policy only matched recipient_user_id, so a
-- certificate issued to an email before the person created an account was
-- invisible to them forever. This policy matches the verified email on the
-- caller's JWT (auth.jwt() ->> 'email'), which Supabase guarantees — a user
-- can only ever match their own email.
--
-- Apply: supabase db push   (or paste into Dashboard → SQL editor)

DROP POLICY IF EXISTS "certificates_recipient_email_select" ON certificates;

CREATE POLICY "certificates_recipient_email_select" ON certificates FOR SELECT
  USING (
    recipient_email IS NOT NULL
    AND recipient_email = (auth.jwt() ->> 'email')
  );

-- ============ FROM: /home/hatch/workspace/career-radar-v2/supabase/migrations/202610140003_add_channel_posts.sql ============
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

-- ============ FROM: /home/hatch/workspace/career-radar-v2/supabase/migrations/202610140004_add_donations_services_users.sql ============
-- Migration: donations, service requests, and admin access to member data.
--
-- donations: every donation pledge from the Donate page. Anyone can submit
-- (anon INSERT); only admins can read/update. The team emails the donor
-- payment details (bank transfer / JazzCash) to complete the donation.
--
-- service_requests: requests from the Services page ("get the work you
-- need"). Same access pattern: public insert, admin-only read.
--
-- public_users: the founder asked the admin panel to show ALL signed-up
-- users so the team can contact them. The v1 policy only let super_admin
-- read other users' rows; this adds admin read access too. Donor/member
-- emails stay invisible to the public — only signed-in admins see them.
--
-- Apply: supabase db push   (or paste into Dashboard → SQL editor)

-- ---------------------------------------------------------------- donations
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 100),
  currency TEXT NOT NULL DEFAULT 'PKR',
  frequency TEXT NOT NULL DEFAULT 'one-time' CHECK (frequency IN ('one-time', 'monthly')),
  message TEXT,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "donations_public_insert" ON donations;
CREATE POLICY "donations_public_insert" ON donations FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "donations_admin_all" ON donations;
CREATE POLICY "donations_admin_all" ON donations FOR ALL
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

-- ---------------------------------------------------------- service requests
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  budget TEXT,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_requests_public_insert" ON service_requests;
CREATE POLICY "service_requests_public_insert" ON service_requests FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "service_requests_admin_all" ON service_requests;
CREATE POLICY "service_requests_admin_all" ON service_requests FOR ALL
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

-- -------------------------------------------- admin read access to members
DROP POLICY IF EXISTS "pub_users_admin_select" ON public_users;
CREATE POLICY "pub_users_admin_select" ON public_users FOR SELECT
  USING (get_my_role() IN ('super_admin', 'admin'));

-- Final: reload the API schema cache so new tables are visible
NOTIFY pgrst, 'reload schema';
