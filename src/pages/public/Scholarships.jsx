import { useEffect, useMemo, useState } from 'react'
import { Search, GraduationCap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { ScholarshipCard } from '../../components/ListingCard'
import PostGuidesBlock from '../../components/PostGuidesBlock'
import Seo from '../../components/Seo'

const COVERAGES = ['All', 'Fully Funded', 'Partial Tuition', 'Monthly Stipend', 'Other']

export default function Scholarships() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [coverage, setCoverage] = useState('All')
  const [country, setCountry] = useState('All')

  useEffect(() => {
    supabase
      .from('scholarships')
      .select('*')
      .order('deadline', { ascending: true, nullsLast: true })
      .then(({ data, error }) => {
        if (!error) setItems(data ?? [])
        setLoading(false)
      })
  }, [])

  const countries = useMemo(() => {
    const list = [...new Set(items.map((s) => s.country).filter(Boolean))].sort()
    return ['All', ...list]
  }, [items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const today = new Date().toISOString().slice(0, 10)
    return items.filter((s) => {
      // Never show expired or deactivated scholarships (v1 bug: they showed forever)
      if (s.is_active === false) return false
      if (s.deadline && s.deadline < today) return false
      if (coverage !== 'All' && s.coverage !== coverage) return false
      if (country !== 'All' && s.country !== country) return false
      if (!q) return true
      return [s.title, s.provider, s.country, s.description, s.eligibility]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    })
  }, [items, query, coverage, country])

  return (
    <div className="container-x py-10">
      <Seo
        title="Fully Funded Scholarships Worldwide"
        description="Discover fully funded and partial scholarships from around the world — verified, with deadlines, eligibility and application links."
        keywords="fully funded scholarships, scholarships 2026, international scholarships, study abroad scholarships"
      />
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
          <GraduationCap size={22} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-brand-navy">Scholarships</h1>
          <p className="text-sm text-slate-500">Fully funded and partial awards from around the world.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scholarship, university, country…"
            className="input !pl-11"
          />
        </div>
        <select value={coverage} onChange={(e) => setCoverage(e.target.value)} className="select !w-auto">
          {COVERAGES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="select !w-auto">
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {loading ? 'Loading scholarships…' : `${filtered.length} open scholarship${filtered.length === 1 ? '' : 's'}`}
      </p>

      {loading ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card h-64 p-5">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton mt-3 h-4 w-1/3" />
              <div className="skeleton mt-4 h-20 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card mt-5 p-10 text-center">
          <p className="font-display text-lg font-bold text-brand-navy">Nothing matches yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different search or filter. New scholarships land here daily.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <ScholarshipCard key={s.id} item={s} />
          ))}
        </div>
      )}

      <PostGuidesBlock
        group="scholarships"
        title="Scholarship guides from our channel"
        description="Step-by-step guides for the scholarships our WhatsApp channel shares — eligibility, deadlines, and how to apply."
      />
    </div>
  )
}
