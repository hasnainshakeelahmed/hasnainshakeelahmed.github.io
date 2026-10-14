import { useEffect, useMemo, useState } from 'react'
import { Search, Mail, Copy, Check, Users } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Full member directory: every account that signed up.
// Data comes from public_users (name, email, country, onboarding) merged
// with profiles (public bio/links) and user_roles. Admins can see all rows
// per the pub_users_admin_select policy; member emails stay invisible to
// the public — only signed-in admins see this page.
export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [profiles, setProfiles] = useState({})
  const [roles, setRoles] = useState({})
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('public_users').select('id, full_name, email, country, onboarding_complete, created_at').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, role_title, bio, linkedin_url, twitter_url'),
      supabase.from('user_roles').select('user_id, role'),
    ]).then(([u, p, r]) => {
      if (u.error) setError(u.error.message)
      else setUsers(u.data ?? [])
      if (!p.error) {
        const map = {}
        ;(p.data ?? []).forEach((row) => {
          map[row.id] = row
        })
        setProfiles(map)
      }
      if (!r.error) {
        const map = {}
        ;(r.data ?? []).forEach((row) => {
          map[row.user_id] = row.role
        })
        setRoles(map)
      }
      setLoading(false)
    })
  }, [])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) =>
      [u.full_name, u.email, u.country, roles[u.id]].some((f) => (f || '').toLowerCase().includes(q)),
    )
  }, [users, query, roles])

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(email)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      // clipboard unavailable — mailto still works
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-brand-navy">
            <Users size={22} className="text-brand-goldDark" /> Members
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {users.length} signed-up {users.length === 1 ? 'account' : 'accounts'} · names, emails, countries, roles.
          </p>
        </div>
        <label className="relative w-full sm:w-72">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, country…"
            className="input !pl-9"
          />
        </label>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading ? (
        <p className="mt-6 text-center text-sm text-slate-500">Loading members…</p>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold">Member</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Country</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => {
                const profile = profiles[u.id]
                return (
                  <tr key={u.id} className="border-b border-slate-100 align-top last:border-0">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-brand-navy">{u.full_name || '—'}</p>
                      {profile?.role_title && <p className="text-xs text-slate-500">{profile.role_title}</p>}
                      {profile?.bio && <p className="mt-1 line-clamp-2 max-w-[220px] text-xs text-slate-500">{profile.bio}</p>}
                    </td>
                    <td className="max-w-[200px] truncate px-5 py-3.5 text-slate-600">{u.email || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600">{u.country || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${roles[u.id] === 'super_admin' ? 'badge-gold' : roles[u.id] === 'admin' ? 'badge-navy' : 'badge-slate'}`}>
                        {roles[u.id] || 'user'}
                      </span>
                      {u.onboarding_complete && <span className="badge badge-green ml-1.5">Onboarded</span>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      {u.email && (
                        <span className="flex items-center gap-2">
                          <a
                            href={`mailto:${u.email}?subject=${encodeURIComponent('Hello from Career Radar')}`}
                            className="inline-flex items-center gap-1 font-semibold text-brand-navy hover:underline"
                          >
                            <Mail size={14} /> Email
                          </a>
                          <button
                            onClick={() => copyEmail(u.email)}
                            className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-brand-navy"
                            title="Copy email"
                          >
                            {copied === u.email ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            {copied === u.email ? 'Copied' : 'Copy'}
                          </button>
                        </span>
                      )}
                      {profile?.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block text-xs font-semibold text-brand-navy hover:underline"
                        >
                          LinkedIn →
                        </a>
                      )}
                    </td>
                  </tr>
                )
              })}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
