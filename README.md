# Career Radar — Live Site

Career Radar v2 — the career GPS for students everywhere. Verified scholarships, internships and jobs, AI career guidance, certificates, video blogs, channel posts, services, and donations.

**Live at:** https://hasnainshakeelahmed.github.io/

## How this repo works

- `main` holds the full source (React 18 + Vite + Tailwind).
- Every push to `main` triggers GitHub Actions: install → build → deploy to GitHub Pages.
- The backend is the existing Supabase project (same one as career-radar.space).

## One-time setup (repo owner)

The build needs two repository secrets (Repo Settings → Secrets and variables → Actions):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase **anon public** key (the publishable one, never the `service_role` key)

Copy both from Supabase Dashboard → Project Settings → API. The workflow fails with a clear message until they are set; re-run it after adding them.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the two values above
npm run dev
```

## Automation

`supabase/` holds the content-automation edge functions (`ingest-listing`, `expire-listings`) and migrations. See `AUTOMATION_SETUP.md` for the deploy steps.
