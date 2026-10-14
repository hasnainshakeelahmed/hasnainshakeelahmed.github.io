import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Megaphone, Search, ExternalLink, Calendar } from 'lucide-react'
import Seo from '../../components/Seo'
import Reveal from '../../components/Reveal'
import { supabase } from '../../lib/supabase'

const CHANNELS = [
  { key: 'all', label: 'All posts' },
  { key: 'scholarships', label: 'Scholarships & Internships' },
  { key: 'main', label: 'Main channel' },
]

const CHANNEL_META = {
  scholarships: {
    label: 'Scholarships & Internships',
    link: 'https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m',
  },
  main: {
    label: 'CareerRadar — Main',
    link: 'https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X',
  },
}

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [channel, setChannel] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('channel_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? [])
        setLoading(false)
      })
  }, [])

  const list = useMemo(
    () =>
      posts.filter((p) => (channel === 'all' || p.channel === channel)).filter((p) =>
        query ? (p.title + ' ' + (p.description || '')).toLowerCase().includes(query.toLowerCase()) : true,
      ),
    [posts, channel, query],
  )

  return (
    <div className="container-x py-10">
      <Seo
        title="Channel Posts — Career Radar"
        description="Every post published across the Career Radar WhatsApp channels: scholarships, internships, jobs, courses, study skills and career guidance."
        keywords="career radar posts, scholarships channel, career radar whatsapp, opportunities posts"
      />
      <div className="hero-enter">
        <p className="section-kicker">From our channels</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">Channel Posts</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Everything published across both Career Radar WhatsApp channels — scholarships and opportunities on one,
          courses and career guidance on the other.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {CHANNELS.map((c) => (
          <button
            key={c.key}
            onClick={() => setChannel(c.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              channel === c.key ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
        <label className="relative ml-auto w-full sm:w-64">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts…" className="input !pl-9" />
        </label>
      </div>

      {loading ? (
        <p className="mt-10 text-center text-sm text-slate-500">Loading posts…</p>
      ) : list.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-slate-50 px-6 py-12 text-center">
          <Megaphone size={28} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            No posts published here yet — follow the channels below to get every new post daily.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.id} delay={i % 3}>
              <article className="card lift flex h-full flex-col overflow-hidden">
                {p.image_url && (
                  <div className="aspect-[4/3] overflow-hidden bg-brand-navySoft">
                    <img src={p.image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                    <span>{CHANNEL_META[p.channel]?.label || p.channel}</span>
                    {p.category && <span className="text-slate-400">· {p.category}</span>}
                  </p>
                  <h2 className="mt-1.5 font-display text-base font-bold leading-snug text-brand-navy">{p.title}</h2>
                  {p.description && (
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{p.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={13} /> {new Date(p.published_at).toLocaleDateString()}
                    </span>
                    <a
                      href={p.post_url || CHANNEL_META[p.channel]?.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy hover:underline"
                    >
                      View post <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {['scholarships', 'main'].map((key) => (
          <a
            key={key}
            href={CHANNEL_META[key].link}
            target="_blank"
            rel="noreferrer"
            className="card lift flex items-center justify-between p-5"
          >
            <div>
              <p className="font-display text-base font-bold text-brand-navy">{CHANNEL_META[key].label}</p>
              <p className="mt-0.5 text-sm text-slate-500">Follow on WhatsApp for daily posts.</p>
            </div>
            <span className="btn-gold !px-4 !py-2">Follow →</span>
          </a>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Prefer video?{' '}
        <Link to="/videos" className="font-semibold text-brand-navy underline">
          Watch the YouTube channel
        </Link>
      </p>
    </div>
  )
}
