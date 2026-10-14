// supabase/functions/ingest-listing/index.ts
// Secure intake endpoint for automated listing publishing.
// Called by the Career Radar content pipeline (Muse) after each daily
// research run. Authenticates via the X-Ingest-Secret header, validates the
// payload, rejects duplicates and low-quality rows, then inserts with the
// service_role key (bypasses RLS by design — never expose this publicly
// without the secret check).
//
// Deploy:  supabase functions deploy ingest-listing
// Secret:   supabase secrets set INGEST_SECRET=<random 32+ chars>

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: { get: (key: string) => string | undefined };
};

const INGEST_SECRET = Deno.env.get("INGEST_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Freelance", "Remote"];
const COVERAGES = ["Fully Funded", "Partial Tuition", "Monthly Stipend", "Other"];

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function cleanText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

function validDate(v: unknown): string | null {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const d = new Date(v + "T00:00:00Z");
  return isNaN(d.getTime()) ? null : v;
}

// Quality gate: blocks the exact problems on the live site today
// (emoji in titles, stub descriptions like "dd transitions motion graphics text").
function qualityIssues(title: string, description: string | null): string[] {
  const issues: string[] = [];
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(title))
    issues.push("title contains emoji");
  if (title.length < 8) issues.push("title too short");
  if (description && description.split(/\s+/).length < 8)
    issues.push("description too short (<8 words)");
  return issues;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!INGEST_SECRET || req.headers.get("x-ingest-secret") !== INGEST_SECRET)
    return json({ error: "unauthorized" }, 401);
  if (!SUPABASE_URL || !SERVICE_KEY)
    return json({ error: "server misconfigured" }, 500);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }

  const kind = body.kind;
  if (kind !== "job" && kind !== "scholarship")
    return json({ error: "kind must be 'job' or 'scholarship'" }, 400);

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  if (kind === "job") {
    const title = cleanText(body.title);
    const company = cleanText(body.company);
    const type =
      typeof body.type === "string" && JOB_TYPES.includes(body.type) ? body.type : null;
    if (!title || !company) return json({ error: "title and company required" }, 400);
    if (!type) return json({ error: `type must be one of: ${JOB_TYPES.join(", ")}` }, 400);

    const description = cleanText(body.description);
    const issues = qualityIssues(title, description);
    if (issues.length) return json({ error: "quality gate failed", issues }, 422);

    // Dedupe: same title + company posted in the last 120 days
    const since = new Date(Date.now() - 120 * 864e5).toISOString();
    const { data: dup } = await supabase
      .from("jobs")
      .select("id")
      .ilike("title", title)
      .ilike("company", company)
      .gte("created_at", since)
      .limit(1);
    if (dup && dup.length) return json({ status: "duplicate", id: dup[0].id });

    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          title,
          company,
          type,
          location: cleanText(body.location),
          description,
          apply_url: cleanText(body.apply_url),
          contact: cleanText(body.contact),
          deadline: validDate(body.deadline),
          tags: Array.isArray(body.tags)
            ? body.tags.filter((t) => typeof t === "string").slice(0, 8)
            : [],
          slug: `${slugify(title)}-${Date.now().toString(36)}`,
          is_featured: false,
          is_active: true,
        },
      ])
      .select("id")
      .single();
    if (error) return json({ error: error.message }, 500);
    return json({ status: "inserted", id: data.id });
  }

  // scholarship
  const title = cleanText(body.title);
  const provider = cleanText(body.provider);
  const country = cleanText(body.country);
  const apply_url = cleanText(body.apply_url);
  if (!title || !provider || !country || !apply_url)
    return json({ error: "title, provider, country, apply_url required" }, 400);

  const coverage =
    typeof body.coverage === "string" && COVERAGES.includes(body.coverage)
      ? body.coverage
      : "Other";
  const description = cleanText(body.description);
  const issues = qualityIssues(title, description);
  if (issues.length) return json({ error: "quality gate failed", issues }, 422);

  // Dedupe: same title + provider posted in the last 180 days
  const since = new Date(Date.now() - 180 * 864e5).toISOString();
  const { data: dup } = await supabase
    .from("scholarships")
    .select("id")
    .ilike("title", title)
    .ilike("provider", provider)
    .gte("created_at", since)
    .limit(1);
  if (dup && dup.length) return json({ status: "duplicate", id: dup[0].id });

  const { data, error } = await supabase
    .from("scholarships")
    .insert([
      {
        title,
        provider,
        country,
        apply_url,
        coverage,
        deadline: validDate(body.deadline),
        description,
        eligibility: cleanText(body.eligibility),
        image_url: cleanText(body.image_url),
        is_active: true,
      },
    ])
    .select("id")
    .single();
  if (error) return json({ error: error.message }, 500);
  return json({ status: "inserted", id: data.id });
});
