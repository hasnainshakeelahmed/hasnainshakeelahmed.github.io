# Career Radar — Website Automation Setup (for Usman)

Goal: every daily opportunity post researched by the content pipeline is
published to the website automatically, and expired listings disappear on
their own. No more hand-entering listings, no more stale July deadlines.

## What was built

Three new files (already written, ready to deploy):

| File | Purpose |
|---|---|
| `supabase/functions/ingest-listing/index.ts` | Secure POST endpoint. Accepts `{kind:'job'\|'scholarship', ...fields}`, validates, dedupes, inserts. Auth: `X-Ingest-Secret` header. |
| `supabase/functions/expire-listings/index.ts` | Nightly janitor. Sets `is_active=false` on anything past deadline. Same secret auth. |
| `supabase/migrations/202610040002_add_scholarship_is_active.sql` | Adds `is_active` to `scholarships` (it was missing — expired scholarships showed forever) + one-time cleanup of stale rows. |

The intake endpoint also runs a **quality gate** that rejects the exact
problems on the live site today: emoji in titles, stub descriptions under
8 words, missing country/apply_url on scholarships.

## Deploy steps

```bash
# 1. From the repo root, with Supabase CLI linked to the project:
supabase functions deploy ingest-listing
supabase functions deploy expire-listings

# 2. Set the shared secret (generate a random 32+ char string):
supabase secrets set INGEST_SECRET=<paste-generated-secret>

# 3. Apply the migration:
supabase db push
# (or paste the migration SQL into Dashboard → SQL Editor → Run)
```

## Code change required (1 line)

`src/pages/public/Scholarships.jsx` — the public query has no active filter,
so expired scholarships show forever. Add it:

```js
const { data, error } = await supabase
  .from('scholarships')
  .select('*')
  .eq('is_active', true)          // ← add this line
  .order('deadline', { ascending: true, nullsLast: true })
```

(The Jobs page already filters `is_active=true`, no change needed there.)

## Schedule the nightly expiry

Supabase Dashboard → Edge Functions → `expire-listings` → Add cron trigger,
e.g. `0 2 * * *` (2 AM PKT), with header `X-Ingest-Secret: <same secret>`.
Or create a pg_cron job hitting the function URL with that header.

## Hand over to Hasnain / Muse

1. The deployed function URL, e.g.
   `https://<project-ref>.supabase.co/functions/v1/ingest-listing`
2. The `INGEST_SECRET` value — Hasnain will store it in Muse's Secure Vault
   (never in chat). Muse's daily pipeline will then POST each researched
   opportunity as structured JSON; duplicates and low-quality rows are
   rejected automatically, and the response (`inserted` / `duplicate` /
   `quality gate failed`) is logged.

## Request shapes

Job:
```json
{
  "kind": "job",
  "title": "Junior Electrical Engineer",
  "company": "National Grid Company",
  "location": "Lahore, Pakistan",
  "type": "Full-time",
  "description": "Complete sentences, 8+ words…",
  "apply_url": "https://…",
  "deadline": "2026-11-30",
  "tags": ["electrical", "engineering"]
}
```
`type` must be one of: Full-time, Part-time, Internship, Freelance, Remote.

Scholarship:
```json
{
  "kind": "scholarship",
  "title": "Lester B. Pearson International Scholarship 2027",
  "provider": "University of Toronto",
  "country": "Canada",
  "coverage": "Fully Funded",
  "deadline": "2027-01-15",
  "description": "Complete sentences, 8+ words…",
  "eligibility": "…",
  "apply_url": "https://…"
}
```
`coverage` must be one of: Fully Funded, Partial Tuition, Monthly Stipend, Other.

## Hygiene note

`.env.local` (with the anon key) is committed to this repo, which is now
public. The anon key is public-by-design (it ships in the site's JS bundle),
so this is not a live vulnerability — but remove the file from git and add
`.env.local` to `.gitignore` going forward. Never commit `service_role`.
