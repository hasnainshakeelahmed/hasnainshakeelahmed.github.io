import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase, GraduationCap, Users, ArrowRight, Megaphone, HeartHandshake,
  Plus, Award, AlertCircle, Clock,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

const CHANNEL_LABEL = { scholarships: 'S&I', main: 'Main' }

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [attention, setAttention] = useState([])

  useEffect(() => {
    const run = async () => {
      const s = {}
      const safe = async (fn, key) => {
        try {
          const { count } = await fn()
          s[key] = count ?? 0
        } catch {
          s[key] = null
        }
      }
      await Promise.all([
        safe(() => supabase.from('jobs').select('id', { count: 'exact', head: true }), 'jobs'),
        safe(() => supabase.from('scholarships').select('id', { count: 'exact', head: true }), 'scholarships'),
        safe(() => supabase.from('channel_posts').select('id', { count: 'exact', head: true }).eq('is_published', true), 'posts'),
        safe(() => supabase.from('public_users').select('id', { count: 'exact', head: true }), 'members'),
        safe(() => supabase.from('volunteers').select('id', { count: 'exact', head: true }).eq('status', 'pending'), 'volunteersPending'),
        safe(() => supabase.from('donations').select('id', { count: 'exact', head: true }).eq('status', 'pending'), 'donationsPending'),
      ])
      setStats(s)

      try {
        const { data } = await supabase
          .from('channel_posts')
          .select('id, title, channel, published_at')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(5)
        setRecentPosts(data ?? [])
      } catch { /* ignore */ }

      const items = []
      try {
        const { data } = await supabase.from('volunteers').select('id, full_name, email').eq('status', 'pending').limit(4)
        for (const v of data ?? []) items.push({ label: `Volunteer application: ${v.full_name || v.email}`, to: '/admin/volunteers' })
      } catch { /* ignore */ }
      try {
        const { data } = await supabase.from('team_applications').select('id, name').eq('status', 'pending').limit(4)
        for (const a of data ?? []) items.push({ label: `Team application: ${a.name}`, to: '/admin/team' })
      } catch { /* ignore */ }
      try {
        const { count } = await supabase.from('team_tasks').select('id', { count: 'exact', head: true }).eq('status', 'in_review')
        if (count) items.push({ label: `${count} team task${count === 1 ? '' : 's'} waiting for review`, to: '/admin/team' })
      } catch { /* ignore */ }
      setAttention(items)
    }
    run()
  }, [])

  const cards = [
    { icon: Megaphone, label: 'Channel posts', value: stats?.posts, to: '/admin/posts' },
    { icon: Briefcase, label: 'Jobs', value: stats?.jobs, to: '/admin/jobs' },
    { icon: GraduationCap, label: 'Scholarships', value: stats?.scholarships, to: '/admin/scholarships' },
    { icon: Users, label: 'Members', value: stats?.members, to: '/admin/users' },
    { icon: HeartHandshake, label: 'Pending donations', value: stats?.donationsPending, to: '/admin/donations' },
    { icon: Award, label: 'Certificates', value: 'Manage', to: '/admin/certificates' },
  ]

  const quickActions = [
    { icon: Plus, label: 'New channel post', to: '/admin/posts' },
    { icon: Plus, label: 'Add job', to: '/admin/jobs' },
    { icon: Plus, label: 'Add scholarship', to: '/admin/scholarships' },
    { icon: Award, label: 'Issue certificate', to: '/admin/certificates/issue' },
    { icon: Users, label: 'Review volunteers', to: '/admin/volunteers' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Everything that needs you, at a glance.</p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card card-hover p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-goldDark">
              <c.icon size={20} />
            </span>
            <p className="mt-3 font-display text-2xl font-extrabold text-brand-navy">
              {c.value === null || c.value === undefined ? '—' : c.value}
            </p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card mt-6 p-5">
        <h2 className="font-display text-base font-bold text-brand-navy">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to} className="btn-outline !px-4 !py-2 text-sm">
              <a.icon size={15} /> {a.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Needs attention */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
            <AlertCircle size={17} className="text-brand-goldDark" /> Needs attention
          </h2>
          {attention.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">All clear — nothing waiting for review.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {attention.map((a, i) => (
                <li key={i}>
                  <Link to={a.to} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-brand-navy">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <Clock size={14} className="shrink-0 text-brand-goldDark" /> {a.label}
                    </span>
                    <ArrowRight size={14} className="shrink-0 text-slate-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent posts */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-brand-navy">Latest channel posts</h2>
            <Link to="/admin/posts" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
              Manage all <ArrowRight size={14} />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No posts yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {recentPosts.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-navy">{p.title}</p>
                    <p className="text-xs text-slate-500">
                      {p.published_at ? new Date(p.published_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <span className="badge badge-navy shrink-0">{CHANNEL_LABEL[p.channel] || p.channel}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
