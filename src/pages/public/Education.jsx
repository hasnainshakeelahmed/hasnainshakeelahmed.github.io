import { useMemo, useState } from 'react'
import { BookOpen, Search, ArrowUpRight, Clock } from 'lucide-react'
import Seo from '../../components/Seo'
import PostGuidesBlock from '../../components/PostGuidesBlock'
import { EDUCATION_ITEMS, WEEKLY_GUIDES } from '../../data/siteContent'

const CATEGORIES = ['All', 'Course', 'Weekly Guide']

export default function Education() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const courses = useMemo(() => {
    const q = query.trim().toLowerCase()
    return EDUCATION_ITEMS.filter((item) => {
      if (category !== 'All' && category !== 'Course') return false
      if (!q) return true
      return (item.title + ' ' + item.description).toLowerCase().includes(q)
    })
  }, [query, category])

  const guides = useMemo(() => {
    const q = query.trim().toLowerCase()
    return WEEKLY_GUIDES.filter((item) => {
      if (category !== 'All' && category !== 'Weekly Guide') return false
      if (!q) return true
      return (item.title + ' ' + item.description).toLowerCase().includes(q)
    })
  }, [query, category])

  return (
    <div className="container-x py-10">
      <Seo
        title="Free Courses, Guides & Career Resources"
        description="Free courses, guides and weekly resources from Career Radar — full-stack bootcamp, AI prompting, UNICEF courses, scholarship guides and interview prep."
        keywords="free courses, career resources, full stack bootcamp, AI prompting, UNICEF courses, scholarship guides"
      />
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
          <BookOpen size={22} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-brand-navy">Education</h1>
          <p className="text-sm text-slate-500">Free courses, guides and weekly resources that move your career forward.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, guides, resources…"
            className="input !pl-11"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === c ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <h2 className="section-title mt-10 !text-xl">Courses & learning</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((item) => (
          <article key={item.title} className="card card-hover flex flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="badge badge-gold">{item.type}</span>
              <span className="badge badge-navy">{item.level}</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold leading-snug text-brand-navy">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.topics.map((t) => (
                <span key={t} className="badge badge-slate">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock size={13} /> {item.duration} · Free
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
                Open <ArrowUpRight size={15} />
              </span>
            </div>
          </article>
        ))}
      </div>

      <h2 className="section-title mt-12 !text-xl">Weekly guides</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((item) => (
          <article key={item.title} className="card card-hover flex flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="badge badge-navy">{item.category}</span>
              {item.status === 'closed' ? (
                <span className="badge badge-red">{item.statusLabel}</span>
              ) : (
                <span className="badge badge-green">Open</span>
              )}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold leading-snug text-brand-navy">{item.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
                Read guide <ArrowUpRight size={15} />
              </span>
            </div>
          </article>
        ))}
      </div>

      {courses.length === 0 && guides.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">Nothing matches that search. Try a different keyword.</p>
      )}

      <PostGuidesBlock
        group="education"
        title="Learning guides from our channel"
        description="Courses, study skills, career guidance and ed-tech tools from our WhatsApp channel — with step-by-step guides."
      />
    </div>
  )
}
