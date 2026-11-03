import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck, Youtube, Linkedin, Instagram, Facebook } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AIChatBubble from './AIChatBubble'
import AnnouncementBar from './AnnouncementBar'
import CookieConsent from './CookieConsent'
import SiteLogo from './SiteLogo'
import { getSiteSettings, SETTING_DEFAULTS } from '../lib/siteSettings'

// Social links shown as small icons in the navbar (top-right).
// URLs are editable from /admin/settings; empty URLs are hidden.
const SOCIAL_DEFS = [
  { icon: Youtube, label: 'YouTube', key: 'social_youtube' },
  { icon: Linkedin, label: 'LinkedIn', key: 'social_linkedin' },
  { icon: Instagram, label: 'Instagram', key: 'social_instagram' },
  { icon: Facebook, label: 'Facebook', key: 'social_facebook' },
]

function SocialIcons({ onClick }) {
  const [urls, setUrls] = useState(SETTING_DEFAULTS)
  useEffect(() => {
    getSiteSettings().then(setUrls)
  }, [])
  const visible = SOCIAL_DEFS.filter((s) => (urls[s.key] || '').trim() !== '')
  return (
    <>
      {visible.map((s) => (
        <a
          key={s.label}
          href={urls[s.key]}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          title={s.label}
          onClick={onClick}
          className="rounded-full p-2 text-brand-navy/70 transition-colors hover:bg-brand-navy/10 hover:text-brand-navy"
        >
          <s.icon size={16} />
        </a>
      ))}
    </>
  )
}

const NAV = [
  { to: '/jobs', label: 'Jobs' },
  { to: '/scholarships', label: 'Scholarships' },
  { to: '/education', label: 'Education' },
  { to: '/videos', label: 'Videos' },
  { to: '/services', label: 'Services' },
  { to: '/community', label: 'Community' },
  { to: '/about', label: 'About' },
  { to: '/donate', label: 'Support us' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-goldDark/50 bg-brand-gold shadow-sm">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" id="site-logo" className="flex items-center" aria-label="CareerRadar home">
          <SiteLogo variant="light" className="h-14 w-14" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-navy text-white' : 'text-brand-navy/80 hover:bg-brand-navy/10 hover:text-brand-navy'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="mr-1 flex items-center gap-0.5 border-r border-brand-navy/20 pr-2">
            <SocialIcons />
          </div>
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/10">
                  <ShieldCheck size={16} /> Admin
                </Link>
              )}
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/10">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-full border border-brand-navy/40 px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/10">
                <LogOut size={15} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy/10">
                Sign in
              </Link>
              <Link to="/register" className="inline-flex items-center rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-navyLight">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-brand-navy hover:bg-brand-navy/10 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-brand-navy/15 bg-brand-gold px-4 pb-4 pt-2 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-navy/10"
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-navy/10">
                Dashboard
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-navy/10">
                  Admin
                </Link>
              )}
              <button onClick={handleSignOut} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 hover:bg-brand-navy/10">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-navy/10">
                Sign in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/10">
                Get started
              </Link>
            </>
          )}
          <div className="mt-2 flex items-center gap-1 border-t border-brand-navy/15 px-3 pt-3">
            <SocialIcons onClick={() => setOpen(false)} />
          </div>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-brand-navy text-slate-300">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div>
          <SiteLogo variant="dark" className="h-10 w-10" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            The career GPS for students everywhere. Verified opportunities, AI
            guidance, and a global community — all in one place.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Opportunities</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/jobs" className="hover:text-brand-gold">Jobs</Link></li>
            <li><Link to="/scholarships" className="hover:text-brand-gold">Scholarships</Link></li>
            <li><Link to="/education" className="hover:text-brand-gold">Education</Link></li>
            <li><Link to="/search" className="hover:text-brand-gold">Search</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Community</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/community" className="hover:text-brand-gold">Community</Link></li>
            <li><Link to="/services" className="hover:text-brand-gold">Services</Link></li>
            <li><Link to="/volunteer" className="hover:text-brand-gold">Become a volunteer</Link></li>
            <li><Link to="/team" className="hover:text-brand-gold">Our team</Link></li>
            <li><Link to="/donate" className="hover:text-brand-gold">Support us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Company</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-brand-gold">About</Link></li>
            <li><Link to="/links" className="hover:text-brand-gold">All our links</Link></li>
            <li><Link to="/verify" className="hover:text-brand-gold">Verify certificate</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-brand-gold">Privacy policy</Link></li>
            <li><a href="https://www.career-radar.space" className="hover:text-brand-gold">career-radar.space</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-x py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Career Radar. Built for students, everywhere.
        </p>
      </div>
    </footer>
  )
}

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
      <AIChatBubble />
      <CookieConsent />
    </div>
  )
}
