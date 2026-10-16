#!/usr/bin/env python3
"""Daily discovery of fresh global scholarships / internships / jobs.

Searches a small whitelist of TRUSTED official sources (scholarship portals,
UN / World Bank careers, established boards). For each source it fetches the
listing page to verify it is live, follows same-domain opportunity links,
fetches each detail page, and extracts title / organisation / deadline /
apply link / location with generic heuristics.

Publishing rules (never violated):
  - AUTO-PUBLISH (is_active=TRUE) ONLY when the source is on the strict
    whitelist AND the fetch verified the page live AND a deadline AND a
    real Apply anchor were both extracted from that page.
  - EVERYTHING ELSE inserts as a DRAFT (is_active=FALSE) for one-click
    admin approval in Admin -> Jobs / Scholarships (the admin forms already
    have an `is_active` checkbox).
  - NEVER insert a listing with an invented deadline, link, or detail. A
    field that cannot be extracted is left empty (NULL) and the row stays
    a draft. The apply link falls back to the opportunity's own detail-page
    URL (a real page, never invented); when even that is missing, the
    candidate is skipped.
  - Expired listings (deadline in the past) are skipped entirely.
  - Deduped by apply URL against the existing jobs + scholarships tables.

Junk filters (a listing index / nav page is NOT an opportunity):
  - generic or index-style titles are rejected
  - a title that repeats across different URLs is a site title, not an
    opportunity — all instances are dropped
  - a page with many dates is a listing index, not a detail page
  - a page with neither a deadline nor an Apply anchor is skipped

Env (required for --apply; dry-run needs none):
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (service key bypasses RLS;
  never commit it, never put it in cron text — env only)

Usage:
  python3 scripts/discover_openings.py --dry-run   # default: report only
  python3 scripts/discover_openings.py --apply     # insert into the DB
"""

import argparse
import datetime as dt
import html
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import urllib.parse

# Bot-identifying UA (standard bot format: name + contact URL).
UA = ("Mozilla/5.0 (compatible; CareerRadar-Discovery/1.0; "
      "+https://www.career-radar.space)")
FETCH_TIMEOUT = 25
MAX_CANDIDATES_PER_SOURCE = 5
MAX_DATES_ON_DETAIL_PAGE = 5  # more dates than this => listing index, not a detail page

# ---------------------------------------------------------------- whitelist
# Trusted official sources only. Global-first: programmes open to applicants
# worldwide, not Pakistan-only. Same-domain links only — the script never
# follows a link off a whitelisted domain.
SOURCES = [
    # Scholarships (official portals)
    {"name": "Commonwealth Scholarships", "url": "https://cscuk.fcdo.gov.uk/scholarships/",
     "kind": "scholarship", "org": "Commonwealth Scholarship Commission", "country": "United Kingdom"},
    {"name": "Chevening", "url": "https://www.chevening.org/scholarships/",
     "kind": "scholarship", "org": "Chevening", "country": "United Kingdom"},
    {"name": "DAAD Scholarships", "url": "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
     "kind": "scholarship", "org": "DAAD", "country": "Germany"},
    {"name": "Gates Cambridge", "url": "https://www.gatescambridge.org/",
     "kind": "scholarship", "org": "Gates Cambridge Trust", "country": "United Kingdom"},
    {"name": "Fulbright Foreign Student Program", "url": "https://foreign.fulbrightonline.org/",
     "kind": "scholarship", "org": "Fulbright", "country": "United States"},
    {"name": "Yenching Academy", "url": "https://www.yenchingacademy.org/",
     "kind": "scholarship", "org": "Yenching Academy, Peking University", "country": "China"},
    {"name": "Australia Awards", "url": "https://www.australiaawards.gov.au/",
     "kind": "scholarship", "org": "Australia Awards", "country": "Australia"},
    # Jobs / internships (official careers pages + established boards)
    {"name": "UN Careers", "url": "https://careers.un.org/",
     "kind": "job", "org": "United Nations", "country": "Global"},
    {"name": "UNICEF Careers", "url": "https://jobs.unicef.org/",
     "kind": "job", "org": "UNICEF", "country": "Global"},
    {"name": "World Bank Careers", "url": "https://www.worldbank.org/en/about/careers",
     "kind": "job", "org": "World Bank", "country": "Global"},
    {"name": "Remote OK", "url": "https://remoteok.com/",
     "kind": "job", "org": "Remote OK", "country": "Global",
     "api": "https://remoteok.com/api"},
    {"name": "Wellfound", "url": "https://wellfound.com/jobs",
     "kind": "job", "org": "Wellfound", "country": "Global"},
]

LINK_KEYWORDS = ("scholarship", "programme", "program", "fellowship",
                 "opportunity", "opportunities", "job", "career", "vacanc",
                 "position", "internship")
LINK_EXCLUDE = ("/about", "/contact", "/news", "/blog", "/events", "/faq",
                "/privacy", "/terms", "/login", "/signup", "/register")
MONTHS = {m: i + 1 for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june", "july",
     "august", "september", "october", "november", "december"])}
MONTHS.update({m[:3]: i + 1 for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june", "july",
     "august", "september", "october", "november", "december"])})
DATE_KEYWORDS = ("deadline", "closing date", "apply by", "applications close",
                 "application deadline", "due date", "last date", "expires")

# Titles that are index / nav pages, not single opportunities.
GENERIC_TITLES = {
    "vacancies", "jobs", "careers", "job search", "search jobs",
    "scholarship database", "scholarships", "opportunities",
    "open positions", "current openings", "our values", "career paths",
    "hiring process", "home", "about us", "news", "events", "contact us",
    "life at", "working here", "why join us",
}
GENERIC_TITLE_RES = [
    re.compile(r"^(find|browse|search|remote|all|latest|featured)\b.*\bjobs?\b"),
    re.compile(r"^remote .*jobs?\b"),
    re.compile(r"\bjobs? in .*(programming|design|sales|marketing|support|engineering)\b"),
    re.compile(r"^find .*jobs?\b"),
]

# Titles of informational/guide pages, not single opportunities.
INFO_TITLE_RES = [
    re.compile(r"^(why|how|who|what|when|where|which)\b"),
    re.compile(r"\b(timeline|eligibility|faqs?|frequently asked|how to apply"
               r"|application process|requirements|about the|information for"
               r"|applicant guide|before you apply|who can apply)\b"),
]


def is_generic_title(title: str) -> bool:
    t = title.strip().lower()
    if t in GENERIC_TITLES:
        return True
    return any(rx.search(t) for rx in GENERIC_TITLE_RES)


def is_info_title(title: str) -> bool:
    return any(rx.search(title.strip().lower()) for rx in INFO_TITLE_RES)


# ---------------------------------------------------------------- fetching
def fetch(url: str) -> str | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=FETCH_TIMEOUT) as resp:
            if resp.status != 200:
                return None
            charset = resp.headers.get_content_charset() or "utf-8"
            return resp.read().decode(charset, "replace")
    except Exception as e:
        print(f"  fetch failed {url}: {e}", file=sys.stderr)
        return None


def strip_tags(text: str) -> str:
    text = re.sub(r"<script.*?</script>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return html.unescape(re.sub(r"\s+", " ", text)).strip()


def candidate_links(page_html: str, base_url: str) -> list[str]:
    base = urllib.parse.urlparse(base_url)
    out, seen = [], set()
    for m in re.finditer(r'href=["\']([^"\']+)["\']', page_html, flags=re.I):
        href = urllib.parse.urljoin(base_url, m.group(1).strip())
        u = urllib.parse.urlparse(href)
        if u.netloc != base.netloc or u.scheme not in ("http", "https"):
            continue
        path = u.path.lower()
        if not any(k in path for k in LINK_KEYWORDS):
            continue
        if any(x in path for x in LINK_EXCLUDE):
            continue
        if href not in seen:
            seen.add(href)
            out.append(href)
    return out


# ---------------------------------------------------------------- extraction
def extract_title(page_html: str) -> str | None:
    m = re.search(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)',
                  page_html, flags=re.I)
    if not m:
        m = re.search(r"<title>(.*?)</title>", page_html, flags=re.S | re.I)
    if not m:
        m = re.search(r"<h1[^>]*>(.*?)</h1>", page_html, flags=re.S | re.I)
    if not m:
        return None
    title = strip_tags(m.group(1)).split("|")[0].split(" - ")[0].strip()
    return title if len(title) >= 8 else None


def extract_description(page_html: str, title: str, source: str) -> str:
    m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)',
                  page_html, flags=re.I)
    desc = strip_tags(m.group(1)) if m else ""
    if len(desc) < 40:
        for pm in re.finditer(r"<p[^>]*>(.*?)</p>", page_html, flags=re.S | re.I):
            t = strip_tags(pm.group(1))
            if len(t) >= 80:
                desc = t
                break
    if len(desc) < 40:
        desc = f"{title} (via {source})."
    return desc[:500]


def _parse_date(day: str, mon: str, year: str) -> str | None:
    try:
        d = dt.date(int(year), MONTHS[mon.lower()], int(day))
    except (KeyError, ValueError):
        return None
    return d.isoformat()


def extract_deadline(text: str) -> str | None:
    """A deadline only counts if it appears near a deadline keyword."""
    low = text.lower()
    for kw in DATE_KEYWORDS:
        idx = 0
        while True:
            i = low.find(kw, idx)
            if i == -1:
                break
            window = text[i:i + 200]
            m = re.search(r"(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})", window)
            if m:
                d = _parse_date(m.group(1), m.group(2), m.group(3))
                if d:
                    return d
            m = re.search(r"([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})", window)
            if m:
                d = _parse_date(m.group(2), m.group(1), m.group(3))
                if d:
                    return d
            m = re.search(r"(\d{4})-(\d{2})-(\d{2})", window)
            if m:
                return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
            idx = i + len(kw)
    return None


def count_dates(text: str) -> int:
    """Total date-like matches anywhere on the page (index-page signal)."""
    n = len(re.findall(r"\d{1,2}\s+[A-Za-z]+\s+\d{4}", text))
    n += len(re.findall(r"[A-Za-z]+\s+\d{1,2},\s*\d{4}", text))
    n += len(re.findall(r"\d{4}-\d{2}-\d{2}", text))
    return n


def extract_apply_link(page_html: str, base_url: str) -> str | None:
    for m in re.finditer(
            r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
            page_html, flags=re.S | re.I):
        label = strip_tags(m.group(2)).lower()
        if "apply" in label or "submit application" in label:
            href = urllib.parse.urljoin(base_url, m.group(1).strip())
            if href != base_url:
                return href
    return None


def extract_location(text: str) -> str | None:
    m = re.search(r"location\s*[:\-–]\s*([A-Za-z ,/.'-]{2,60})",
                  text, flags=re.I)
    if m:
        loc = m.group(1).strip().strip(",")
        if 2 <= len(loc) <= 60:
            return loc
    return None


# ---------------------------------------------------------------- supabase
def sb_headers() -> dict:
    return {
        "apikey": os.environ["SUPABASE_SERVICE_ROLE_KEY"],
        "Authorization": f"Bearer {os.environ['SUPABASE_SERVICE_ROLE_KEY']}",
        "Content-Type": "application/json",
    }


def sb_url() -> str:
    return os.environ["SUPABASE_URL"].rstrip("/")


def already_exists(apply_url: str) -> bool:
    for table in ("jobs", "scholarships"):
        q = urllib.parse.quote(apply_url, safe="")
        req = urllib.request.Request(
            f"{sb_url()}/rest/v1/{table}?apply_url=eq.{q}&select=id&limit=1",
            headers=sb_headers())
        try:
            with urllib.request.urlopen(req, timeout=25) as resp:
                if json.loads(resp.read().decode("utf-8")):
                    return True
        except Exception as e:
            print(f"  dedupe check failed on {table}: {e}", file=sys.stderr)
    return False


def sb_insert(table: str, row: dict) -> dict | None:
    req = urllib.request.Request(
        f"{sb_url()}/rest/v1/{table}",
        data=json.dumps(row).encode("utf-8"),
        headers={**sb_headers(), "Prefer": "return=representation"},
        method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data[0] if isinstance(data, list) and data else None
    except urllib.error.HTTPError as e:
        print(f"  insert into {table} failed: HTTP {e.code}: "
              f"{e.read().decode('utf-8', 'replace')[:300]}", file=sys.stderr)
        return None


def slugify(title: str, apply_url: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:50] or "opening"
    h = abs(hash(apply_url)) % (36 ** 4)
    suffix = ""
    for _ in range(4):
        suffix = "0123456789abcdefghijklmnopqrstuvwxyz"[h % 36] + suffix
        h //= 36
    return f"{base}-{suffix}"


# ---------------------------------------------------------------- main
def discover() -> list[dict]:
    today = dt.date.today().isoformat()
    raw: list[dict] = []
    for src in SOURCES:
        print(f"source: {src['name']} ({src['url']})")
        # JSON-API sources (structured listings, no HTML scraping).
        if src.get("api"):
            raw_json = fetch(src["api"])
            if raw_json is None:
                print("  skipped: API not reachable")
                continue
            try:
                items = json.loads(raw_json)
            except json.JSONDecodeError:
                print("  skipped: API returned invalid JSON")
                continue
            added = 0
            for job in items:
                if not isinstance(job, dict) or not job.get("position"):
                    continue  # first element is the API legal notice
                title = str(job["position"]).strip()
                url = str(job.get("url") or "").strip()
                if not title or not url:
                    continue
                desc = strip_tags(str(job.get("description") or ""))[:400]
                if len(desc) < 40:
                    desc = f"{title} (via Remote OK)."
                # Remote OK API terms: link back + name Remote OK as the source.
                desc = f"{desc}\nSource: Remote OK (remoteok.com)."
                raw.append({
                    "source": src["name"], "kind": src["kind"],
                    "org": str(job.get("company") or src["org"]),
                    "country": src["country"], "title": title,
                    "detail_url": url, "deadline": None,
                    "apply_anchor": url,  # the API job URL IS the apply link
                    "description": desc[:500],
                    "location": str(job.get("location") or "Remote").strip() or "Remote",
                    "date_count": 0,
                })
                added += 1
                if added >= 20:
                    break
            print(f"  API live; {added} listings")
            continue
        page = fetch(src["url"])
        if page is None:
            print("  skipped: listing page not live")
            continue
        links = candidate_links(page, src["url"])[:MAX_CANDIDATES_PER_SOURCE]
        print(f"  live; {len(links)} candidate links")
        for link in links:
            time.sleep(1)
            detail = fetch(link)
            if detail is None:
                continue
            title = extract_title(detail)
            if not title:
                continue
            text = strip_tags(detail)
            raw.append({
                "source": src["name"], "kind": src["kind"],
                "org": src["org"], "country": src["country"],
                "title": title, "detail_url": link,
                "deadline": extract_deadline(text),
                "apply_anchor": extract_apply_link(detail, link),
                "description": extract_description(detail, title, src["name"]),
                "location": extract_location(text),
                "date_count": count_dates(text),
            })

    # Junk filters.
    title_urls: dict[str, set[str]] = {}
    for c in raw:
        title_urls.setdefault(c["title"].strip().lower(), set()).add(c["detail_url"])
    results = []
    for c in raw:
        if is_generic_title(c["title"]):
            print(f"  skip generic title: {c['title']}")
            continue
        if is_info_title(c["title"]):
            print(f"  skip info/guide page: {c['title']}")
            continue
        if len(title_urls[c["title"].strip().lower()]) > 1:
            print(f"  skip site title (repeats across URLs): {c['title']}")
            continue
        if c["date_count"] > MAX_DATES_ON_DETAIL_PAGE:
            print(f"  skip index-like page ({c['date_count']} dates): {c['title']}")
            continue
        if c["deadline"] and c["deadline"] < today:
            print(f"  skip expired: {c['title']} ({c['deadline']})")
            continue
        if not c["deadline"] and not c["apply_anchor"]:
            print(f"  skip (no deadline, no Apply link): {c['title']}")
            continue
        # Publish only with BOTH a deadline and a real Apply anchor.
        publish = bool(c["deadline"] and c["apply_anchor"])
        results.append({
            **c,
            "apply_url": c["apply_anchor"] or c["detail_url"],
            "is_active": publish,
        })
        print(f"  {'PUBLISH' if publish else 'DRAFT  '} {c['title']}"
              f" | deadline={c['deadline'] or '-'}")
    return results


def main() -> int:
    p = argparse.ArgumentParser(description="Discover fresh openings.")
    p.add_argument("--dry-run", action="store_true", default=True)
    p.add_argument("--apply", action="store_true",
                   help="insert into the DB (default is dry-run)")
    args = p.parse_args()
    apply = args.apply

    if apply and (not os.environ.get("SUPABASE_URL")
                  or not os.environ.get("SUPABASE_SERVICE_ROLE_KEY")):
        print("error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required "
              "for --apply", file=sys.stderr)
        return 2

    found = discover()
    print(f"\n{len(found)} candidates")
    if not apply:
        print("[dry-run] nothing inserted (use --apply to insert)")
        return 0

    inserted = skipped = 0
    seen_urls: set[str] = set()
    for c in found:
        if c["apply_url"] in seen_urls:
            skipped += 1
            continue
        seen_urls.add(c["apply_url"])
        if already_exists(c["apply_url"]):
            print(f"  duplicate, skipped: {c['title']}")
            skipped += 1
            continue
        if c["kind"] == "job":
            row = {
                "title": c["title"], "company": c["org"],
                "location": c["location"] or c["country"],
                "type": None,  # unknown — left empty, stays a draft if unpublished
                "description": c["description"],
                "apply_url": c["apply_url"], "deadline": c["deadline"],
                "tags": ["auto-discovered"], "slug": slugify(c["title"], c["apply_url"]),
                "is_featured": False, "is_active": c["is_active"],
            }
            ok = sb_insert("jobs", row)
        else:
            row = {
                "title": c["title"], "provider": c["org"],
                "coverage": "Other",  # unknown — schema catch-all, not an invention
                "country": c["country"], "deadline": c["deadline"],
                "description": c["description"], "eligibility": None,
                "apply_url": c["apply_url"], "is_active": c["is_active"],
            }
            ok = sb_insert("scholarships", row)
        if ok:
            inserted += 1
        else:
            skipped += 1
    print(f"inserted={inserted} skipped={skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
