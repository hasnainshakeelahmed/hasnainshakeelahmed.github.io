-- Site-wide settings editable from /admin/settings.
-- Run this in the Supabase SQL editor (project oksusvhexmfhhamvupmj), then the
-- Settings page in the admin panel can manage the announcement bar and social links.

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write"
  on public.site_settings for all
  using (get_my_role() in ('super_admin', 'admin'))
  with check (get_my_role() in ('super_admin', 'admin'));

grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to authenticated;

-- Defaults (only inserted when missing, so re-running is safe)
insert into public.site_settings (key, value) values
  ('announce_enabled', 'true'),
  ('announce_text', 'Ask Questions Directly on WhatsApp here.'),
  ('announce_button_label', 'WhatsApp Broadcast Group'),
  ('announce_button_url', 'https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m'),
  ('social_youtube', 'https://www.youtube.com/@careerradarai'),
  ('social_linkedin', 'https://www.linkedin.com/company/careerradarofficial/'),
  ('social_instagram', 'https://www.instagram.com/careerradar.ai/'),
  ('social_facebook', '')
on conflict (key) do nothing;
