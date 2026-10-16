import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { postGroup } from '../lib/postGroups'

// "From our channel" block: published channel posts belonging to one site
// section (Scholarships / Jobs / Education), linking to the post detail
// pages. Renders nothing when the section has no classified posts.
export default function PostGuidesBlock({ group, title, description }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    supabase
      .from('channel_posts')
      .select('id, title, category, description, image_url, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => setPosts((data ?? []).filter((p) => postGroup(p) === group)))
  }, [group])

  if (posts.length === 0) return null
  const shown = posts.slice(0, 6)

  return (
    <section className="mt-14">
      <h2 className="section-title !text-xl">{title}</h2>
      {description && <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <article key={p.id} className="card lift flex h-full flex-col overflow-hidden">
            {p.image_url && (
              <Link to={`/posts/${p.id}`} className="block aspect-[4/3] overflow-hidden bg-brand-navySoft">
                <img
                  src={p.image_url}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </Link>
            )}
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">{p.category}</p>
              <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-brand-navy">
                <Link to={`/posts/${p.id}`} className="hover:underline">
                  {p.title}
                </Link>
              </h3>
              {p.description && (
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {p.description.split('📖 Detailed Guide')[0].trim()}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar size={13} /> {new Date(p.published_at).toLocaleDateString()}
                </span>
                <Link
                  to={`/posts/${p.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy hover:underline"
                >
                  Read full post <ExternalLink size={13} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
