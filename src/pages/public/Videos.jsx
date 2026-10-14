import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock, Youtube, Search } from 'lucide-react'
import Seo from '../../components/Seo'
import Reveal from '../../components/Reveal'
import { VIDEOS, thumbnailUrl, YOUTUBE_CHANNEL_URL } from '../../data/videos'

const FILTERS = [
  { key: 'all', label: 'All videos' },
  { key: 'long', label: 'Long videos' },
  { key: 'short', label: 'Shorts' },
]

export default function Videos() {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    return VIDEOS.filter((v) => (filter === 'all' || v.type === filter)).filter((v) =>
      query ? (v.title + ' ' + v.category).toLowerCase().includes(query.toLowerCase()) : true,
    )
  }, [filter, query])

  return (
    <div className="container-x py-10">
      <Seo
        title="Videos — Career Radar"
        description="Watch every Career Radar video: fully funded scholarships, career guidance, study tools, and the complete University of the People guide — each with a written blog breakdown."
        keywords="career radar videos, scholarships youtube, uopeople guide videos, career guidance videos"
      />
      <div className="hero-enter flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Watch & read</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">Videos</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Every video from the Career Radar channel — each one with a written blog breakdown, an embedded
            player, and the key takeaways.
          </p>
        </div>
        <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" className="btn-primary">
          <Youtube size={17} /> Subscribe on YouTube
        </a>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === f.key ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
        <label className="relative ml-auto w-full sm:w-64">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos…"
            className="input !pl-9"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v, i) => (
          <Reveal key={v.slug} delay={i % 3}>
            <Link to={`/videos/${v.slug}`} className="card lift group block overflow-hidden">
              <div className="relative aspect-video overflow-hidden bg-brand-navy">
                <img
                  src={thumbnailUrl(v)}
                  alt={v.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-brand-navy shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play size={22} className="ml-1" />
                  </span>
                </span>
                <span className="absolute left-3 top-3 rounded-full bg-brand-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-navy">
                  {v.type === 'long' ? 'Video' : 'Short'}
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">{v.category}</p>
                <h2 className="mt-1.5 line-clamp-2 font-display text-base font-bold leading-snug text-brand-navy">
                  {v.title}
                </h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={13} /> {new Date(v.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{v.description[0]}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
                  Read & watch <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-10 rounded-2xl bg-slate-50 py-10 text-center text-sm text-slate-500">
          No videos match that search.
        </p>
      )}

      <p className="mt-8 text-center text-sm text-slate-500">
        Prefer YouTube? Every video is on the channel:{' '}
        <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" className="font-semibold text-brand-navy underline">
          youtube.com/@CareerRadar
        </a>
      </p>
    </div>
  )
}
