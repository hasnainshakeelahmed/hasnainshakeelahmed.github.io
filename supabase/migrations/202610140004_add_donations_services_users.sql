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
