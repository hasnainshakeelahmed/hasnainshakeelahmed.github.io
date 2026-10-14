import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Briefcase, GraduationCap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { JobCard, ScholarshipCard } from '../../components/ListingCard'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [jobs, setJobs] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const runSearch = async (q) => {
    const term = q.trim()
    if (!term) {
      setJobs([])
      setScholarships([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    const pattern = `%${term}%`
    const [jRes, sRes] = await Promise.all([
      supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .or(`title.ilike.${pattern},company.ilike.${pattern},description.ilike.${pattern},location.ilike.${pattern}`)
        .order('created_at', { ascending: false })
        .limit(12),
      supabase
        .from('scholarships')
        .select('*')
        .or(`title.ilike.${pattern},provider.ilike.${pattern},country.ilike.${pattern},description.ilike.${pattern}`)
        .order('deadline', { ascending: true, nullsLast: true })
        .limit(12),
    ])
    setJobs(jRes.data ?? [])
    setScholarships((sRes.data ?? []).filter((s) => s.is_active !== false))
    setLoading(false)
  }

  useEffect(() => {
    if (params.get('q')) runSearch(params.get('q'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setParams(query.trim() ? { q: query.trim() } : {})
    runSearch(query)
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Search</h1>
      <p className="mt-1 text-sm text-slate-500">One search across jobs, scholarships and resources.</p>

      <form onSubmit={submit} className="mt-6 flex max-w-2xl items-center gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “fully funded”, “remote”, “engineering”…"
            className="input !pl-11 !py-3"
            autoFocus
          />
        </div>
        <button type="submit" className="btn-primary !px-6 !py-3">
          Search
        </button>
      </form>

      {loading && <p className="mt-8 text-sm text-slate-500">Searching…</p>}

      {!loading && searched && (
        <>
          <div className="mt-10 flex items-center gap-2">
            <Briefcase size={18} className="text-brand-goldDark" />
            <h2 className="font-display text-lg font-bold text-brand-navy">Jobs ({jobs.length})</h2>
          </div>
          {jobs.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No jobs matched. <Link to="/jobs" className="font-semibold text-brand-navy">Browse all jobs →</Link>
            </p>
          ) : (
            <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center gap-2">
            <GraduationCap size={18} className="text-brand-goldDark" />
            <h2 className="font-display text-lg font-bold text-brand-navy">Scholarships ({scholarships.length})</h2>
          </div>
          {scholarships.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No scholarships matched. <Link to="/scholarships" className="font-semibold text-brand-navy">Browse all scholarships →</Link>
            </p>
          ) : (
            <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {scholarships.map((s) => (
                <ScholarshipCard key={s.id} item={s} />
              ))}
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="mt-10 flex flex-wrap gap-2">
          {['Fully funded', 'Remote', 'Internship', 'Engineering', 'Masters', 'Freelance'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag)
                setParams({ q: tag })
                runSearch(tag)
              }}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-brand-navySoft hover:text-brand-navy"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
