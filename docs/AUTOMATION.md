# Career Radar — Automation

Three automations keep the website current without manual copying. Global
audience throughout (never "Global South" framing). Nothing here ever
invents a listing, link, or deadline — a field that cannot be verified is
left empty and the item stays a draft.

## 1. WhatsApp posts → website (daily, automatic)

After each daily post is generated **and delivered** to WhatsApp, the same
job publishes it to the website archive (`/posts`).

**One-time setup (Hasnain):**

1. **Deploy the function.** Supabase Dashboard → Edge Functions → New
   function, name `ingest-channel-post` → paste the entire contents of
   `supabase/functions/ingest-channel-post/index.ts` → Deploy.
2. **Set the secret.** Dashboard → Settings → Edge Functions → Add secret:
   `CHANNEL_POST_SECRET` = a long random value (generate one, e.g.
   `openssl rand -hex 32`). Never commit this value.
3. **Give the posting jobs the secret.** The daily post jobs must be able
   to run `scripts/publish_post_to_site.py` with these env vars set:
   `SUPABASE_URL` (`https://<project-ref>.supabase.co`) and
   `CHANNEL_POST_SECRET` (the value from step 2). Set them once via the
   secure env setup — never paste the secret into cron text.
4. **Wire the post crons (from inside the WhatsApp side chat).** The
   WhatsApp delivery crons live in the WhatsApp side chat and lose delivery
   authority if edited from elsewhere — so paste the updated instruction
   text below into each daily post cron **from inside that side chat**.
   Do not edit those crons from the main chat.

**Updated cron instruction text** (append to the existing daily post jobs —
Main 8 PM and S&I 4 PM — after the "generate + deliver" steps):

> After the post image + caption are delivered to WhatsApp, also publish
> the post to the website by running, from `~/workspace/career-radar-v2`:
>
> ```
> SUPABASE_URL=<your Supabase URL> CHANNEL_POST_SECRET=<secret from secure env> \
>   python3 scripts/publish_post_to_site.py \
>     --channel <main | scholarships> \
>     --title "<the post's title>" \
>     --description "<the full delivered caption>" \
>     --category "<Course | Study Skill | Career Guidance | Ed-Tech Tool | EDU Update | Scholarship | Internship | Job>" \
>     --published-at <YYYY-MM-DD> \
>     --image-url "<the post graphic's public URL, if uploaded; omit otherwise>" \
>     --source-url "<the post's apply / official link>"
> ```
>
> Use `--channel main` for the 8 PM main-channel post and `--channel
> scholarships` for the 4 PM Scholarships & Internships post. If the
> script reports `{"status": "duplicate", ...}` the post is already on the
> site — do not re-send. Never invent a title, link, or deadline: pass
> exactly what was delivered to WhatsApp.

The function is idempotent (same channel + title + published date → skip),
so re-running it is safe.

## 2. YouTube videos → website (automatic)

New uploads on the Career Radar YouTube channel are added to
`src/data/videos.js` so they get a `/videos/:slug` page automatically.

**How it works:** `scripts/sync_latest_videos.py` fetches the channel's
uploads via the YouTube Data API (reusing the faceless-channel OAuth token
files), compares against `videos.js` by `videoId`, and appends missing
entries with:
- `description` = first 2 sentences of the video's own YouTube description
  (URLs, hashtags, SEO junk, and WhatsApp/website boilerplate stripped)
- `takeaways = []`, `guide = null` (the page renders no guide section)
- no `officialLink` (never invented — a human adds it when known)
- `category` from a small documented keyword heuristic, else `General`
- **only PUBLIC videos** (unlisted / private / test uploads are skipped)

**Channel resolution:** the script uses `channels.list?mine=true` — the
upload account's own channel (`@careerradarai`). Do NOT switch it to
`forHandle=@CareerRadar`: that handle resolves to a different, empty
channel. (Side note: the site's `YOUTUBE_CHANNEL_URL` in `videos.js`
still points at `@CareerRadar` — that link leads to the empty channel,
not the real one. Fix the site link separately if wanted.)

**Schedule (daily cron, main chat):**

> Each day, run from `~/workspace/career-radar-v2`:
> `python3 scripts/sync_latest_videos.py --apply`
> Then push the updated `src/data/videos.js` via the GitHub App (the
> script writes the file; it never pushes). If the script reports 0 new
> videos, do nothing. If it fails (e.g. token refresh), report the error
> and do not hand-edit `videos.js` to fake a sync.

## 3. Auto-discover jobs / openings → website (daily)

`scripts/discover_openings.py` searches a strict whitelist of trusted
official sources (see the `SOURCES` list at the top of the script:
Commonwealth, Chevening, DAAD, Gates Cambridge, Fulbright, Yenching,
Australia Awards, UN Careers, UNICEF Careers, World Bank Careers,
Remote OK, Wellfound). For each source it fetches the listing page to
verify it is live, follows same-domain opportunity links, and extracts
title / organisation / deadline / apply link / location.

**Publishing rules:**
- **AUTO-PUBLISH** (`is_active = TRUE`) only when the source is on the
  whitelist AND the fetch verified the page live AND a deadline AND a
  real Apply anchor were both extracted from that page.
- **Everything else → DRAFT** (`is_active = FALSE`) for one-click admin
  approval in Admin → Jobs / Scholarships (both admin forms already have
  an `is_active` checkbox).
- **Junk filters:** generic / index-style titles, site titles that repeat
  across URLs, info/guide pages ("Why…", "How to apply", "Timeline"…),
  listing-index pages (many dates on one page), and pages with neither a
  deadline nor an Apply link are all skipped.
- **Sources that block automated fetching** (non-200 / bot blocks) are
  skipped and logged — they are never faked. Remote OK is fetched via
  its public JSON API (structured listings); its API terms require
  naming Remote OK as the source, which the script does in each
  description.
- A field that cannot be extracted is left empty; the row stays a draft.
  Expired listings (deadline in the past) are skipped. Deduped by apply
  URL against existing jobs + scholarships.

**One-time setup (Hasnain):**

1. **Run the scholarships RLS migration** once (SQL Editor):
   `supabase/migrations/202610160003_scholarships_public_active_only.sql`
   — hides draft scholarships (`is_active = FALSE`) from public reads.
   (Jobs already hide inactive rows via RLS.)
2. **No env secret needed for the discovery job.** It uses the stored
   `custom.supabase` credential (service role key) via the surrogate
   exchange — the script never sees a raw key.

**Schedule (daily cron, main chat):**

> Each day, run from `~/workspace/career-radar-v2`:
> `python3 scripts/discover_openings.py --apply`
> (auth uses the stored `custom.supabase` credential via the surrogate —
> no env secret needed).
> Review new drafts in Admin → Jobs / Scholarships and publish the good
> ones (tick `is_active`). The script never invents deadlines, links, or
> details — anything unverified arrives as a draft.

## Local testing (no live writes)

```bash
# Posts -> website (prints payload, sends nothing)
python3 scripts/publish_post_to_site.py --dry-run \
  --channel scholarships --title "Test Post" --description "Test caption"

# Videos -> website (reads YouTube API, writes nothing)
python3 scripts/sync_latest_videos.py --dry-run

# Discovery (fetches whitelisted pages, inserts nothing)
python3 scripts/discover_openings.py --dry-run
```

## Secrets (never commit)

| Secret | Used by | Set where |
|---|---|---|
| `CHANNEL_POST_SECRET` | Edge Function + publish script | Dashboard → Settings → Edge Functions + posting jobs' env |
| `SUPABASE_SERVICE_ROLE_KEY` | Discovery script (bypasses RLS) | Stored `custom.supabase` credential via surrogate; no env secret |
| YouTube OAuth token files | Video sync | `~/workspace/faceless-channel/.youtube_*.json` (already present) |
