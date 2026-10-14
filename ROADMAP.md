# Career Radar — Website Roadmap (for Usman)

Owner: Hasnain Shakeel Ahmed · Tech lead: Usman · AI build partner: Muse
Repo: `Usman-tech99/career-radar-real` · Hosting: Vercel · Backend: Supabase
Stack: React 18 + Vite + Tailwind CSS, Supabase (Postgres + Deno Edge Functions)

Goal: turn career-radar.space from a stale brochure into a living, automated,
modern career platform — and set up the pipeline so daily content publishes
itself.

---

## PART A — Your tasks now (Usman)

### A1. Ownership & access — do this first

The whole business currently lives in your personal accounts. Hasnain needs
to own his own assets.

- [ ] Add Hasnain as **admin collaborator** on the GitHub repo
      (Settings → Collaborators → add, role Admin)
- [ ] Add Hasnain to the **Vercel** project (Project → Settings → Members)
      — or transfer the project to his Vercel account
- [ ] Add Hasnain to the **Supabase** project (Project Settings → Team → invite,
      role Admin)
- [ ] Recommended: Hasnain forks the repo to his own GitHub account; future
      work happens on the fork, Vercel re-points to it

### A2. Hygiene fix (2 minutes)

- [ ] `.env.local` (containing the anon key) is committed to the repo, which
      is now public. The anon key is public-by-design so nothing is
      compromised — but remove the file from git and add `.env.local` to
      `.gitignore`:
      `git rm --cached .env.local && echo ".env.local" >> .gitignore && git commit`
- [ ] Never commit `SUPABASE_SERVICE_ROLE_KEY` — it already lives only in
      Edge Function secrets, keep it that way

### A3. Deploy the content automation (~30 min)

Full spec: see `AUTOMATION_SETUP.md`. Three files are already written and
waiting in the repo:

| File | What it does |
|---|---|
| `supabase/functions/ingest-listing/index.ts` | Secure POST endpoint. Accepts `{kind:'job'\|'scholarship', …fields}`, validates, dedupes, inserts. Auth via `X-Ingest-Secret` header. Includes a quality gate that rejects emoji-in-titles, stub descriptions, missing country/apply-link. |
| `supabase/functions/expire-listings/index.ts` | Nightly janitor: sets `is_active=false` on anything past deadline. |
| `supabase/migrations/202610040002_add_scholarship_is_active.sql` | Adds the missing `is_active` flag to `scholarships` + one-time cleanup of already-expired rows. |

Steps:

```bash
supabase functions deploy ingest-listing
supabase functions deploy expire-listings
supabase secrets set INGEST_SECRET=<random 32+ char string>
supabase db push        # or run the migration SQL in Dashboard → SQL Editor
```

- [ ] **One-line code fix** — `src/pages/public/Scholarships.jsx` (~line 26),
      the public query has no active filter, so expired scholarships show
      forever. Add `.eq('is_active', true)`:
      ```js
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('is_active', true)   // ← add this
        .order('deadline', { ascending: true, nullsLast: true })
      ```
      (Jobs page already filters `is_active=true` — no change needed.)
- [ ] **Schedule nightly expiry** — Dashboard → Edge Functions →
      `expire-listings` → cron `0 2 * * *` (2 AM PKT) with header
      `X-Ingest-Secret: <same secret>`
- [ ] **Hand over to Hasnain**: the deployed function URL
      (`https://<project-ref>.supabase.co/functions/v1/ingest-listing`)
      and the `INGEST_SECRET` value. He'll store the secret in Muse's Secure
      Vault (not chat). Muse's daily pipeline will then POST every researched
      opportunity as structured JSON.

### A4. Verify — done means

- [ ] POST a test job via the endpoint with the secret → `{"status":"inserted"}`
- [ ] POST the same job again → `{"status":"duplicate"}`
- [ ] POST a job with an emoji title → `422 quality gate failed`
- [ ] Run `expire-listings` once → the July-deadline jobs flip to
      `is_active=false` and vanish from the public Jobs page
- [ ] Public Scholarships page no longer shows expired entries

**When A1–A4 are done, tell Hasnain. He'll loop Muse back in, and we move to
Part B together.**

---

## PART B — Next, with Muse (after Part A)

### B1. Full front-end redesign

Keep the backend, admin panel, and Edge Functions untouched; rebuild the
public experience with a new design system.

- New visual identity pass: typography, spacing, color system (keep brand
  gold/navy), dark-mode polish
- Landing page rewrite: real product (live listings, working AI demo) above
  the fold instead of marketing copy
- Listings UX overhaul (`/jobs`, `/scholarships`, `/education`):
  filters (type / country / coverage / deadline), working search, deadline
  urgency badges, "posted X days ago", save/share buttons
- WhatsApp share buttons on every listing (distribution = Hasnain's channels)
- Mobile responsiveness audit + performance pass (the 3D/three.js hero is
  heavy — lazy-load or simplify)
- SEO: keep sitemap + prerender pipeline working after redesign

### B2. AI chatbot upgrade (`radar-ai-chat` + `RadarAIBubble.jsx`)

What exists: DeepSeek/Groq-powered chat with mode detection (job_matcher,
career_coach, content_assistant, general).

- Richer answers with listing cards pulled live from Supabase
- Suggested-prompt chips, conversation starters per page
- Chat history per logged-in user
- Guardrails: career-domain focus, no hallucinated scholarships (only cite
  listings actually in the DB)

### B3. Growth & trust features

- Testimonial/review system wired to real users (replace placeholder quotes)
- Volunteer page → application flow into `ManageVolunteers` (already exists)
- Analytics dashboard review (Vercel Analytics is installed — surface the
  numbers that matter: listing views, apply clicks, signups)
- Donate page → actual payment link when Hasnain is ready to monetize

### B4. Team workflow (so this scales beyond one volunteer)

- All work on feature branches → pull requests → Hasnain/Muse review →
  merge to main (Vercel auto-deploys)
- `ARCHITECTURE.md` kept current with every structural change

---

## Request/response reference (for Part A3)

Job — `type` ∈ Full-time, Part-time, Internship, Freelance, Remote:
```json
{ "kind": "job", "title": "Junior Electrical Engineer",
  "company": "National Grid Company", "location": "Lahore, Pakistan",
  "type": "Full-time", "description": "Complete sentences, 8+ words…",
  "apply_url": "https://…", "deadline": "2026-11-30",
  "tags": ["electrical", "engineering"] }
```

Scholarship — `coverage` ∈ Fully Funded, Partial Tuition, Monthly Stipend, Other:
```json
{ "kind": "scholarship", "title": "Lester B. Pearson Scholarship 2027",
  "provider": "University of Toronto", "country": "Canada",
  "coverage": "Fully Funded", "deadline": "2027-01-15",
  "description": "Complete sentences, 8+ words…",
  "eligibility": "…", "apply_url": "https://…" }
```

Responses: `{"status":"inserted","id":"…"}` ·
`{"status":"duplicate","id":"…"}` ·
`{"error":"quality gate failed","issues":[…]}` (HTTP 422)
