import { useEffect, useMemo, useState } from 'react'
import { Search, Mail, Copy, Check, Users, ArrowLeft, ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Full member directory: every account that signed up.
// The member list is the union of public_users (name, email, country,
// onboarding) and profiles (every signup gets a profile row from the
// auth trigger). Roles come from user_roles. Admins can see all rows;
// member emails stay invisible to the public — only signed-in admins
// see this page.
//
// Role model: "Member" means no elevated role (no user_roles row — the
// site treats that as a regular member). Admin / Super Admin are stored
// in user_roles. Per the database policies only super_admin can change
// roles; other admins see the error if they try.
const ROLE_OPTIONS = [
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
]

export default function ManageUsers() {
  const [members, setMembers] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [newRole, setNewRole] = useState('member')
  const [savingRole, setSavingRole] = useState(false)
  const [roleMsg, setRoleMsg] = useState('')

  const load = async () => {
    setLoading(true)
    const [u, r] = await Promise.all([
      supabase.from('public_users').select('id, full_name, email, country, onboarding_complete, created_at').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('user_id, role'),
    ])
    // profiles: full_name + created_at may not exist on older schemas —
    // retry without them if the first select fails.
    let p = await supabase.from('profiles').select('id, full_name, role_title, bio, linkedin_url, twitter_url, created_at')
    if (p.error) {
      p = await supabase.from('profiles').select('id, role_title, bio, linkedin_url, twitter_url')
    }
    if (u.error) setError(u.error.message)
    const roles = {}
    ;(r.data ?? []).forEach((row) => {
      roles[row.user_id] = row.role
    })
    const profileMap = {}
    ;(p.data ?? []).forEach((row) => {
      profileMap[row.id] = row
    })
    const byId = {}
    ;(u.data ?? []).forEach((row) => {
      byId[row.id] = { ...row, profile: profileMap[row.id] || null, role: roles[row.id] || 'member' }
    })
    // Profiles without a public_users row (e.g. signed up before that
    // table was populated) still appear, with email shown as —.
    ;(p.data ?? []).forEach((row) => {
      if (!byId[row.id]) {
        byId[row.id] = {
          id: row.id,
          full_name: row.full_name || null,
          email: null,
          country: null,
          onboarding_complete: false,
          created_at: row.created_at || null,
          profile: row,
          role: roles[row.id] || 'member',
        }
      }
    })
    setMembers(
      Object.values(byId).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')),
    )
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return members
    return members.filter((u) =>
      [u.full_name, u.email, u.country, u.role, u.profile?.role_title].some((f) =>
        (f || '').toLowerCase().includes(q),
      ),
    )
  }, [members, query])

  const selected = useMemo(() => members.find((m) => m.id === selectedId) || null, [members, selectedId])

  const openDetail = (member) => {
    setSelectedId(member.id)
    setNewRole(member.role)
    setRoleMsg('')
    setError('')
  }

  const saveRole = async () => {
    if (!selected) return
    setSavingRole(true)
    setRoleMsg('')
    setError('')
    let res
    if (newRole === 'member') {
      res = await supabase.from('user_roles').delete().eq('user_id', selected.id)
    } else {
      res = await supabase
        .from('user_roles')
        .upsert({ user_id: selected.id, role: newRole }, { onConflict: 'user_id' })
    }
    setSavingRole(false)
    if (res.error) {
      setError(`Could not change role: ${res.error.message}`)
      return
    }
    setRoleMsg(`Role updated to ${ROLE_OPTIONS.find((o) => o.value === newRole)?.label}.`)
    load()
  }

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(email)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      // clipboard unavailable — mailto still works
    }
  }

  if (selected) {
    const p = selected.profile
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:underline">
          <ArrowLeft size={15} /> Back to members
        </button>
        <div className="card mt-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-brand-navy">{selected.full_name || 'Unnamed member'}</h1>
              <p className="mt-1 text-sm text-slate-500">
                Joined {selected.created_at ? new Date(selected.created_at).toLocaleDateString() : '—'}
                {selected.country ? ` · ${selected.country}` : ''}
              </p>
            </div>
            <span className={`badge ${selected.role === 'super_admin' ? 'badge-gold' : selected.role === 'admin' ? 'badge-navy' : 'badge-slate'}`}>
              {selected.role}
            </span>
          </div>

          <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</dt>
              <dd className="mt-1 text-slate-700">{selected.email || '— (not recorded for this account)'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Country</dt>
              <dd className="mt-1 text-slate-700">{selected.country || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile title</dt>
              <dd className="mt-1 text-slate-700">{p?.role_title || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Onboarding</dt>
              <dd className="mt-1 text-slate-700">{selected.onboarding_complete ? 'Complete' : 'Not complete'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Bio</dt>
              <dd className="mt-1 whitespace-pre-line text-slate-700">{p?.bio || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn</dt>
              <dd className="mt-1">
                {p?.linkedin_url ? (
                  <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="font-semibold text-brand-navy hover:underline">
                    {p.linkedin_url}
                  </a>
                ) : (
                  <span className="text-slate-700">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">X / Twitter</dt>
              <dd className="mt-1">
                {p?.twitter_url ? (
                  <a href={p.twitter_url} target="_blank" rel="noreferrer" className="font-semibold text-brand-navy hover:underline">
                    {p.twitter_url}
                  </a>
                ) : (
                  <span className="text-slate-700">—</span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">User ID</dt>
              <dd className="mt-1 break-all font-mono text-xs text-slate-500">{selected.id}</dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
              <ShieldCheck size={17} className="text-brand-goldDark" /> Change role
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Only super admins can change roles. Removing an elevated role returns the account to Member.
            </p>
            {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {roleMsg && <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{roleMsg}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="select !w-auto">
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <button onClick={saveRole} disabled={savingRole || newRole === selected.role} className="btn-primary">
                {savingRole ? 'Saving…' : 'Save role'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-brand-navy">
            <Users size={22} className="text-brand-goldDark" /> Members
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {members.length} signed-up {members.length === 1 ? 'account' : 'accounts'} · names, emails, countries, roles.
            Click a member for full details and role changes.
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
                const profile = u.profile
                return (
                  <tr key={u.id} className="border-b border-slate-100 align-top last:border-0">
                    <td className="px-5 py-3.5">
                      <button onClick={() => openDetail(u)} className="font-medium text-brand-navy hover:underline">
                        {u.full_name || '—'}
                      </button>
                      {profile?.role_title && <p className="text-xs text-slate-500">{profile.role_title}</p>}
                      {profile?.bio && <p className="mt-1 line-clamp-2 max-w-[220px] text-xs text-slate-500">{profile.bio}</p>}
                    </td>
                    <td className="max-w-[200px] truncate px-5 py-3.5 text-slate-600">{u.email || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600">{u.country || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${u.role === 'super_admin' ? 'badge-gold' : u.role === 'admin' ? 'badge-navy' : 'badge-slate'}`}>
                        {u.role}
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
