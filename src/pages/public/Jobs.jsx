import { useEffect, useMemo, useState } from 'react'
import { Search, Briefcase, ArrowDownWideNarrow } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { JobCard } from '../../components/ListingCard'
import PostGuidesBlock from '../../components/PostGuidesBlock'
import Seo from '../../components/Seo'

const TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Freelance', 'Remote']

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setJobs(data ?? [])
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = jobs.filter((j) => {
      if (type !== 'All' && j.type !== type) return false
      if (!q) return true
      return [j.title, j.company, j.location, j.description]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    })
    if (sort === 'deadline') {
      list = [...list].sort((a, b) => (a.deadline || '9999') .localeCompare(b.deadline || '9999'))
    }
    return list
  }, [jobs, query, type, sort])

  return (
    <div className="container-x py-10">
      <Seo
        title="Verified Jobs & Internships for Students"
        description="Browse verified jobs, internships, freelance and remote roles for students and fresh graduates — updated daily by Career Radar."
        keywords="jobs for students, internships, remote jobs, freelance jobs, verified jobs"
      />
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
          <Briefcase size={22} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-brand-navy">Jobs</h1>
          <p className="text-sm text-slate-500">Verified openings from real employers — remote and on-site.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, company, location…"
            className="input !pl-11"
          />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className="select !w-auto">
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <ArrowDownWideNarrow size={16} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="select !w-auto !py-2">
            <option value="newest">Newest first</option>
            <option value="deadline">Deadline soonest</option>
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {loading ? 'Loading opportunities…' : `${filtered.length} open position${filtered.length === 1 ? '' : 's'}`}
      </p>

      {loading ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card h-56 p-5">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton mt-3 h-4 w-1/3" />
              <div className="skeleton mt-4 h-16 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card mt-5 p-10 text-center">
          <p className="font-display text-lg font-bold text-brand-navy">Nothing matches yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different search or type. New opportunities land here daily.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      <PostGuidesBlock
        group="jobs"
        title="Job & internship guides from our channel"
        description="Step-by-step guides for the openings our WhatsApp channel shares — how to apply, who can apply, and what to watch out for."
      />
    </div>
  )
}
