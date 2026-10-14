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
