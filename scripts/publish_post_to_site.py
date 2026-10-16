#!/usr/bin/env python3
"""Publish one WhatsApp channel post to the Career Radar website.

Called by the daily posting pipeline AFTER a post is generated AND delivered
to WhatsApp. Sends the post to the `ingest-channel-post` Edge Function, which
idempotently inserts it into `channel_posts` (duplicates are skipped).

Env (required unless --dry-run):
  SUPABASE_URL          e.g. https://<project-ref>.supabase.co
  CHANNEL_POST_SECRET   the secret set on the Edge Function (never commit it)

Usage:
  python3 scripts/publish_post_to_site.py --channel scholarships \
      --title "University of Miami Stamps Scholarship 2027" \
      --description "...full caption..." --category "Scholarship" \
      --published-at 2026-10-16 \
      --image-url https://.../2026-10-16.png \
      --source-url https://example.edu/apply
  # or: --json-file post.json   (keys: channel, title, description, category,
  #                               published_at, image_url, source_url)
  # --dry-run prints the payload without sending anything.
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.error


def build_payload(args: argparse.Namespace) -> dict:
    data: dict = {}
    if args.json_file:
        with open(args.json_file, encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = {
            "channel": args.channel,
            "title": args.title,
            "description": args.description,
            "category": args.category,
            "published_at": args.published_at,
            "image_url": args.image_url,
            "source_url": args.source_url,
        }
    # Drop None values so the function applies its own defaults.
    return {k: v for k, v in data.items() if v is not None}


def main() -> int:
    p = argparse.ArgumentParser(description="Publish a channel post to the website.")
    p.add_argument("--channel", choices=["main", "scholarships"])
    p.add_argument("--title")
    p.add_argument("--description")
    p.add_argument("--category")
    p.add_argument("--published-at", help="YYYY-MM-DD (defaults to today server-side)")
    p.add_argument("--image-url")
    p.add_argument("--source-url", help="the post's apply / official link")
    p.add_argument("--json-file")
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    payload = build_payload(args)
    if not payload.get("channel") or not payload.get("title"):
        print("error: channel and title are required", file=sys.stderr)
        return 2

    if args.dry_run:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        print("[dry-run] payload NOT sent")
        return 0

    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    secret = os.environ.get("CHANNEL_POST_SECRET", "")
    if not supabase_url or not secret:
        print("error: SUPABASE_URL and CHANNEL_POST_SECRET env vars are required",
              file=sys.stderr)
        return 2

    url = f"{supabase_url}/functions/v1/ingest-channel-post"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-channel-post-secret": secret,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(resp.read().decode("utf-8"))
            return 0
    except urllib.error.HTTPError as e:
        print(f"error: HTTP {e.code}: {e.read().decode('utf-8', 'replace')}",
              file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
