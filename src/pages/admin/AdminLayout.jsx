import { Link, NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Briefcase, GraduationCap, BookOpen, Users, Settings, ExternalLink, Award, Megaphone, HeartHandshake } from 'lucide-react'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/admin/scholarships', label: 'Scholarships', icon: GraduationCap },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/posts', label: 'Channel Posts', icon: Megaphone },
  { to: '/admin/users', label: 'Members', icon: Users },
  { to: '/admin/donations', label: 'Donations & Requests', icon: HeartHandshake },
  { to: '/admin/education', label: 'Education', icon: BookOpen },
  { to: '/admin/volunteers', label: 'Volunteers', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  return (
    <div className="container-x flex gap-6 py-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="card sticky top-24 p-3">
          <p className="px-2.5 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Admin</p>
          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-navy text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon size={17} /> {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/" className="mt-4 flex items-center gap-1.5 px-3 text-xs font-medium text-slate-400 hover:text-brand-navy">
            View live site <ExternalLink size={12} />
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
