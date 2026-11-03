// Generates public/sitemap.xml for the live site.
// Usage:
//   SUPABASE_URL=https://xyz.supabase.co SUPABASE_ANON_KEY=<public anon key> \
//     node scripts/generate-sitemap.mjs
// The anon key is public (it ships in the client JS bundle); this only reads
// published channel_posts. Also accepts VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const SITE = 'https://hasnainshakeelahmed.github.io'
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_ equivalents).')
  process.exit(1)
}

// Public indexable routes (no auth/admin/dashboard pages).
const STATIC_ROUTES = [
  '',
  'scholarships',
  'jobs',
  'education',
  'videos',
  'guides',
  'posts',
  'community',
  'team',
  'links',
  'about',
  'services',
  'partner',
  'volunteer',
  'donate',
  'search',
]

async function main() {
  const urls = []

  for (const r of STATIC_ROUTES) {
    urls.push({
      loc: `${SITE}/${r}`,
      changefreq: r === '' ? 'daily' : 'weekly',
      priority: r === '' ? '1.0' : '0.7',
    })
  }

  // Every published channel post gets its own URL: /posts/<id>
  let from = 0
  const pageSize = 200
  for (;;) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/channel_posts?select=id,published_at,updated_at&is_published=eq.true&order=published_at.desc&limit=${pageSize}&offset=${from}`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` } },
    )
    if (!res.ok) throw new Error(`Supabase read failed: ${res.status} ${await res.text()}`)
    const rows = await res.json()
    if (!rows.length) break
    for (const p of rows) {
      const lastmod = (p.updated_at || p.published_at || '').slice(0, 10)
      urls.push({
        loc: `${SITE}/posts/${p.id}`,
        ...(lastmod ? { lastmod } : {}),
        changefreq: 'monthly',
        priority: '0.8',
      })
    }
    if (rows.length < pageSize) break
    from += pageSize
  }

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${esc(u.loc)}</loc>` +
          (u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : '') +
          `\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
      )
      .join('\n') +
    `\n</urlset>\n`

  const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml')
  writeFileSync(out, xml)
  console.log(`Wrote ${out} with ${urls.length} URLs (${urls.length - STATIC_ROUTES.length} posts).`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
