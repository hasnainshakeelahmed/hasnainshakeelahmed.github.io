#!/usr/bin/env python3
"""Sync the Career Radar YouTube channel's latest uploads into src/data/videos.js.

Compares the channel's uploads (YouTube Data API v3) against videos.js by
videoId and appends missing entries. Never invents guides, links, or facts:
  - description = first 2 sentences of the video's own YouTube description
    (URLs, hashtags, and WhatsApp/website boilerplate stripped)
  - takeaways = []  (a human adds real takeaways later)
  - guide = null    (VideoBlog renders no guide section when guide is null)
  - officialLink omitted (never invented)
  - category = a small documented keyword heuristic, else 'General'
  - only PUBLIC videos are synced (unlisted/private/test uploads skipped)

Auth: reuses the faceless-channel OAuth token files
(~/workspace/faceless-channel/.youtube_client.json + .youtube_token.json),
same refresh pattern as upload_youtube.py.

Usage:
  python3 scripts/sync_latest_videos.py --dry-run     # default: report only
  python3 scripts/sync_latest_videos.py --apply      # rewrite videos.js
  python3 scripts/sync_latest_videos.py --apply --max 100
Push the updated file via the GitHub App afterwards (this script never pushes).
"""

import argparse
import json
import re
import subprocess
import sys
import urllib.request
import urllib.error
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJECT = HERE.parent
VIDEOS_JS = PROJECT / "src" / "data" / "videos.js"
FACELESS = Path.home() / "workspace" / "faceless-channel"
# NOTE: do NOT resolve the channel by handle. The "@CareerRadar" handle
# resolves to a different, empty channel (UCtBNo1a4L-lkC-aDU-BvNlA). The
# videos live on the upload account's own channel (@careerradarai,
# UC0c9j11QenoPBtRIK5R6n_w), so we use channels.list?mine=true, which
# always matches the account that uploads the videos.
YOUTUBE_API = "https://www.googleapis.com/youtube/v3"


def refresh_access_token() -> str:
    client = json.loads((FACELESS / ".youtube_client.json").read_text())
    tok = json.loads((FACELESS / ".youtube_token.json").read_text())
    r = subprocess.run(
        ["curl", "-s", "-m", "60", "-X", "POST",
         "https://oauth2.googleapis.com/token",
         "--data-urlencode", f"refresh_token={tok['refresh_token']}",
         "-d", f"client_id={client['client_id']}",
         "-d", f"client_secret={client['client_secret']}",
         "-d", "grant_type=refresh_token"],
        capture_output=True, text=True)
    d = json.loads(r.stdout or "{}")
    if "access_token" not in d:
        raise SystemExit(f"YouTube token refresh failed: {(r.stdout or '')[:200]}")
    return d["access_token"]


def api_get(access: str, path: str, params: dict) -> dict:
    qs = "&".join(f"{k}={urllib.parse.quote(str(v))}" for k, v in params.items())
    req = urllib.request.Request(
        f"{YOUTUBE_API}/{path}?{qs}",
        headers={"Authorization": f"Bearer {access}"})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise SystemExit(f"YouTube API {path} failed: HTTP {e.code}: "
                         f"{e.read().decode('utf-8', 'replace')[:300]}")


def parse_duration(iso: str) -> int:
    """ISO 8601 duration (e.g. PT12M34S) -> seconds."""
    m = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    if not m:
        return 0
    h, mn, s = (int(x) if x else 0 for x in m.groups())
    return h * 3600 + mn * 60 + s


def first_sentences(text: str, n: int = 2) -> str:
    """First n sentences of a YouTube description, minus URLs, hashtags,
    SEO junk sections, and WhatsApp/website boilerplate lines."""
    t = (text or "").strip()
    t = re.sub(r"https?://\S+", "", t)
    t = re.split(r"related searches:|hashtags:", t, flags=re.I)[0]
    t = re.sub(r"#\w+", "", t)
    t = re.sub(r"WhatsApp:.*", "", t, flags=re.I)
    t = re.sub(r"\s+", " ", t).strip()
    parts = [s.strip() for s in re.split(r"(?<=[.!?])\s+", t) if s.strip()]
    return " ".join(parts[:n]) if parts else ""


def guess_category(title: str) -> str:
    t = title.lower()
    if "uopeople" in t or "university of the people" in t:
        return "UoPeople"
    if "scholarship" in t:
        return "Scholarships"
    if "cv" in t or "resume" in t or "résumé" in t or "interview" in t:
        return "Career Guidance"
    if "cramming" in t or "anki" in t or "flashcard" in t or "memor" in t:
        return "Study Skills"
    if "data" in t:
        return "Careers"
    if "degree" in t:
        return "Career Guidance"
    if "study" in t or "learn" in t or "student" in t:
        return "Study Skills"
    if "internship" in t or "job" in t:
        return "Careers"
    return "General"


def slugify(title: str, video_id: str, taken: set[str]) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:60] or "video"
    slug, i = base, 2
    while slug in taken:
        slug = f"{base}-{i}"
        i += 1
    taken.add(slug)
    return slug


def js_str(value: str) -> str:
    """Serialize a string as a single-quoted JS string literal."""
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'") \
        .replace("\n", "\\n").replace("\r", "") + "'"


def entry_js(e: dict) -> str:
    desc = ",\n      ".join(js_str(p) for p in e["description"])
    return (
        "  {\n"
        f"    slug: {js_str(e['slug'])},\n"
        f"    videoId: {js_str(e['videoId'])},\n"
        f"    title: {js_str(e['title'])},\n"
        f"    type: {js_str(e['type'])},\n"
        f"    date: {js_str(e['date'])},\n"
        f"    category: {js_str(e['category'])},\n"
        f"    description: [\n      {desc},\n    ],\n"
        "    takeaways: [],\n"
        "    guide: null,\n"
        "  },\n"
    )


def fetch_uploads(access: str, max_results: int) -> list[dict]:
    ch = api_get(access, "channels",
                 {"part": "contentDetails", "mine": "true"})
    items = ch.get("items", [])
    if not items:
        raise SystemExit("authenticated YouTube account has no channel")
    uploads = items[0]["contentDetails"]["relatedPlaylists"]["uploads"]

    videos: list[dict] = []
    page_token = ""
    while len(videos) < max_results:
        pl = api_get(access, "playlistItems",
                     {"part": "snippet,contentDetails", "playlistId": uploads,
                      "maxResults": min(50, max_results - len(videos)),
                      **({"pageToken": page_token} if page_token else {})})
        ids = [it["contentDetails"]["videoId"] for it in pl.get("items", [])]
        if ids:
            det = api_get(access, "videos",
                          {"part": "snippet,contentDetails,status",
                           "id": ",".join(ids)})
            videos.extend(det.get("items", []))
        page_token = pl.get("nextPageToken", "")
        if not page_token:
            break
    return videos


def main() -> int:
    p = argparse.ArgumentParser(description="Sync latest YouTube uploads to videos.js.")
    p.add_argument("--dry-run", action="store_true", default=True)
    p.add_argument("--apply", action="store_true",
                   help="rewrite videos.js (default is dry-run)")
    p.add_argument("--max", type=int, default=50)
    args = p.parse_args()
    apply = args.apply

    text = VIDEOS_JS.read_text(encoding="utf-8")
    existing_ids = set(re.findall(r"videoId:\s*'([^']+)'", text))
    existing_slugs = set(re.findall(r"slug:\s*'([^']+)'", text))

    access = refresh_access_token()
    uploads = fetch_uploads(access, args.max)

    new_entries = []
    for v in uploads:
        vid = v["id"]
        if vid in existing_ids:
            continue
        # Only public videos belong on the website — skip unlisted/private.
        if v.get("status", {}).get("privacyStatus") != "public":
            continue
        sn = v["snippet"]
        title = sn.get("title", "").strip()
        # Strip trailing hashtag groups ("#Shorts", "#education", ...) —
        # the type/category fields already carry that info.
        title = re.sub(r"(\s+#\w+)+\s*$", "", title)
        if not title:
            continue
        desc = first_sentences(sn.get("description", ""))
        if not desc:
            desc = f"Watch {title} on the Career Radar YouTube channel."
        seconds = parse_duration(v.get("contentDetails", {}).get("duration", ""))
        new_entries.append({
            "slug": slugify(title, vid, existing_slugs),
            "videoId": vid,
            "title": title,
            "type": "short" if seconds <= 60 else "long",
            "date": (sn.get("publishedAt", "")[:10] or "1970-01-01"),
            "category": guess_category(title),
            "description": [desc],
        })

    print(f"checked {len(uploads)} uploads, {len(new_entries)} new")
    if not new_entries:
        return 0
    print(json.dumps(new_entries, indent=2, ensure_ascii=False))

    if not apply:
        print("[dry-run] videos.js NOT modified (use --apply to write)")
        return 0

    anchor = "export const videoBySlug"
    idx = text.find(anchor)
    if idx == -1:
        print("error: could not locate VIDEOS array end", file=sys.stderr)
        return 2
    close = text.rfind("\n]", 0, idx)
    if close == -1:
        print("error: could not locate VIDEOS array end", file=sys.stderr)
        return 2
    insertion = "".join(entry_js(e) for e in new_entries)
    new_text = text[:close + 2] + insertion + text[close + 2:]
    VIDEOS_JS.write_text(new_text, encoding="utf-8")
    print(f"wrote {len(new_entries)} entries to {VIDEOS_JS}")
    print("Next: push via the GitHub App (this script never pushes).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
