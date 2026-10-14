import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, Users, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ jobs: '—', scholarships: '—' })
  const [recentJobs, setRecentJobs] = useState([])

  useEffect(() => {
    supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setCounts((c) => ({ ...c, jobs: count ?? 0 })))
    supabase
      .from('scholarships')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setCounts((c) => ({ ...c, scholarships: count ?? 0 })))
    supabase
      .from('jobs')
      .select('id, title, company, created_at, is_active')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setRecentJobs(data ?? []))
  }, [])

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Live counts from the database. Automation keeps listings fresh daily.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Briefcase, label: 'Total jobs', value: counts.jobs, to: '/admin/jobs' },
          { icon: GraduationCap, label: 'Total scholarships', value: counts.scholarships, to: '/admin/scholarships' },
          { icon: Users, label: 'Volunteers', value: 'Review', to: '/admin/volunteers' },
        ].map((c) => (
          <Link key={c.label} to={c.to} className="card card-hover p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-goldDark">
              <c.icon size={20} />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-brand-navy">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-brand-navy">Recently added jobs</h2>
          <Link to="/admin/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
            Manage all <ArrowRight size={14} />
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-slate-100">
          {recentJobs.map((j) => (
            <li key={j.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-navy">{j.title}</p>
                <p className="text-xs text-slate-500">{j.company}</p>
              </div>
              <span className={`badge shrink-0 ${j.is_active ? 'badge-green' : 'badge-slate'}`}>
                {j.is_active ? 'Active' : 'Inactive'}
              </span>
            </li>
          ))}
          {recentJobs.length === 0 && <li className="py-3 text-sm text-slate-500">No jobs yet.</li>}
        </ul>
      </div>
    </div>
  )
}
