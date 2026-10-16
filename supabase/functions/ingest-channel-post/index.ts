// supabase/functions/ingest-channel-post/index.ts
// Secure intake endpoint for WhatsApp channel posts -> website archive.
// Called by the Career Radar posting pipeline after each daily post is
// generated AND delivered to WhatsApp. Authenticates via the
// X-Channel-Post-Secret header, validates the payload, rejects duplicates,
// then inserts with the service_role key (bypasses RLS by design — never
// expose this publicly without the secret check).
//
// Deploy (Dashboard): Supabase Dashboard -> Edge Functions -> New function
//   named `ingest-channel-post` -> paste this file -> Deploy.
// Secret: Dashboard -> Settings -> Edge Functions -> Add secret:
//   CHANNEL_POST_SECRET=<a long random value>
//   (or CLI: supabase secrets set CHANNEL_POST_SECRET=<value>)
// Function URL: https://<project-ref>.supabase.co/functions/v1/ingest-channel-post
//
// NOTE: Posts are published by definition (they were already delivered to
// WhatsApp), so inserts use is_published = TRUE. The website /posts page
// only reads is_published = TRUE rows.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: { get: (key: string) => string | undefined };
};

const CHANNEL_POST_SECRET = Deno.env.get("CHANNEL_POST_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const CHANNELS = ["main", "scholarships"];

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

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

function validUrl(v: unknown): string | null {
  const t = cleanText(v);
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return t;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!CHANNEL_POST_SECRET || req.headers.get("x-channel-post-secret") !== CHANNEL_POST_SECRET)
    return json({ error: "unauthorized" }, 401);
  if (!SUPABASE_URL || !SERVICE_KEY)
    return json({ error: "server misconfigured" }, 500);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }

  const channel = body.channel;
  if (typeof channel !== "string" || !CHANNELS.includes(channel))
    return json({ error: "channel must be 'main' or 'scholarships'" }, 400);

  const title = cleanText(body.title);
  if (!title) return json({ error: "title required" }, 400);
  if (title.length < 5) return json({ error: "title too short" }, 400);

  const description = cleanText(body.description);
  const published_at = validDate(body.published_at) ??
    new Date().toISOString().slice(0, 10);

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Idempotency: same channel + title + published date -> skip.
  const { data: dup } = await supabase
    .from("channel_posts")
    .select("id")
    .eq("channel", channel)
    .eq("title", title)
    .eq("published_at", published_at)
    .limit(1);
  if (dup && dup.length) return json({ status: "duplicate", id: dup[0].id });

  const { data, error } = await supabase
    .from("channel_posts")
    .insert([
      {
        channel,
        category: cleanText(body.category),
        title,
        description,
        image_url: validUrl(body.image_url),
        post_url: validUrl(body.source_url ?? body.post_url),
        published_at,
        is_published: true,
      },
    ])
    .select("id")
    .single();
  if (error) return json({ error: error.message }, 500);
  return json({ status: "inserted", id: data.id });
});
