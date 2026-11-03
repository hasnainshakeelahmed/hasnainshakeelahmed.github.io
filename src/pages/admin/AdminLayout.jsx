import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, GraduationCap, BookOpen, Users, Settings,
  ExternalLink, Award, Megaphone, HeartHandshake, Menu, X, UserCheck,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/posts', label: 'Channel Posts', icon: Megaphone },
      { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
      { to: '/admin/scholarships', label: 'Scholarships', icon: GraduationCap },
      { to: '/admin/education', label: 'Education', icon: BookOpen },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/admin/users', label: 'Members', icon: Users },
      { to: '/admin/volunteers', label: 'Volunteers', icon: UserCheck, badgeKey: 'volunteers' },
      { to: '/admin/team', label: 'Team', icon: Users, badgeKey: 'team' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/certificates', label: 'Certificates', icon: Award },
      { to: '/admin/donations', label: 'Donations & Requests', icon: HeartHandshake },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

function NavContent({ badges, onNavigate }) {
  return (
    <nav className="space-y-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-2.5 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{group.label}</p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-navy text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon size={17} className="shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badgeKey && badges[item.badgeKey] > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1.5 text-[11px] font-bold text-brand-navy">
                    {badges[item.badgeKey] > 99 ? '99+' : badges[item.badgeKey]}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

export default function AdminLayout() {
  const [drawer, setDrawer] = useState(false)
  const [badges, setBadges] = useState({})
  const location = useLocation()

  // Close the mobile drawer on navigation
  useEffect(() => {
    setDrawer(false)
  }, [location.pathname])

  // Pending-work badges (best effort — tables may not exist yet)
  useEffect(() => {
    const run = async () => {
      const next = {}
      try {
        const { count } = await supabase.from('volunteers').select('id', { count: 'exact', head: true }).eq('status', 'pending')
        if (count) next.volunteers = count
      } catch { /* ignore */ }
      try {
        const { count } = await supabase.from('team_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending')
        const { count: inReview } = await supabase.from('team_tasks').select('id', { count: 'exact', head: true }).eq('status', 'in_review')
        const total = (count ?? 0) + (inReview ?? 0)
        if (total) next.team = total
      } catch { /* ignore */ }
      setBadges(next)
    }
    run()
  }, [])

  return (
    <div className="container-x py-8">
      {/* Mobile admin bar */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <p className="font-display text-lg font-extrabold text-brand-navy">Admin</p>
        <button
          onClick={() => setDrawer(true)}
          className="btn-outline !px-4 !py-2 text-sm"
          aria-label="Open admin menu"
        >
          <Menu size={16} /> Menu
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="card sticky top-24 p-4">
            <NavContent badges={badges} />
            <Link to="/" className="mt-4 flex items-center gap-1.5 px-2.5 text-xs font-medium text-slate-400 hover:text-brand-navy">
              View live site <ExternalLink size={12} />
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-brand-navy/50" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-base font-extrabold text-brand-navy">Admin menu</p>
              <button onClick={() => setDrawer(false)} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close menu">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavContent badges={badges} onNavigate={() => setDrawer(false)} />
            </div>
            <Link to="/" className="mt-3 flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-brand-navy">
              View live site <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
