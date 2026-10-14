// supabase/functions/expire-listings/index.ts
// Nightly janitor: deactivates jobs/scholarships whose deadline has passed.
// This is what stops stale listings (e.g. July deadlines visible in October)
// from ever appearing again. The public Jobs page already filters
// is_active=true; the Scholarships page must add that filter (see
// AUTOMATION_SETUP.md).
//
// Deploy:   supabase functions deploy expire-listings
// Schedule: Supabase Dashboard → Edge Functions → Cron → nightly, or pg_cron.
// Secret:   same INGEST_SECRET as ingest-listing (supabase secrets set).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: { get: (key: string) => string | undefined };
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  const secret = Deno.env.get("INGEST_SECRET");
  if (!secret || req.headers.get("x-ingest-secret") !== secret)
    return json({ error: "unauthorized" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return json({ error: "server misconfigured" }, 500);

  const supabase = createClient(url, key);
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const { data: jobs, error: e1 } = await supabase
    .from("jobs")
    .update({ is_active: false })
    .eq("is_active", true)
    .lt("deadline", today)
    .select("id");
  if (e1) return json({ error: e1.message }, 500);

  const { data: sch, error: e2 } = await supabase
    .from("scholarships")
    .update({ is_active: false })
    .eq("is_active", true)
    .lt("deadline", today)
    .select("id");
  if (e2) return json({ error: e2.message }, 500);

  return json({
    date: today,
    expired_jobs: jobs?.length ?? 0,
    expired_scholarships: sch?.length ?? 0,
  });
});
