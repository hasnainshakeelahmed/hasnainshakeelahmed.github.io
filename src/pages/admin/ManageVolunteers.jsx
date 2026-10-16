import { useEffect, useMemo, useState } from 'react'
import { Search, HeartHandshake, ArrowLeft, Mail, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const ROLES = [
  'Content Research',
  'Graphic Design',
  'Video Editing',
  'Web Development',
  'Social Media',
  'Mentoring',
  'Community Management',
  'Other',
]

const STATUSES = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

const STATUS_BADGE = {
  pending: 'badge-gold',
  approved: 'badge-green',
  rejected: 'badge-red',
}

export default function ManageVolunteers() {
  const [volunteers, setVolunteers] = useState([])
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [assignedRole, setAssignedRole] = useState(ROLES[0])
  const [adminNote, setAdminNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = () =>
    supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: e }) => {
        if (e) setError(e.message)
        else setVolunteers(data ?? [])
        setLoading(false)
      })

  useEffect(() => {
    load()
  }, [])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return volunteers.filter((v) => {
      if (status !== 'all' && v.status !== status) return false
      if (!q) return true
      return [v.name, v.email, v.role, v.assigned_role, v.message].some((f) =>
        (f || '').toLowerCase().includes(q),
      )
    })
  }, [volunteers, status, query])

  const selected = useMemo(() => volunteers.find((v) => v.id === selectedId) || null, [volunteers, selectedId])

  const openDetail = (v) => {
    setSelectedId(v.id)
    setAssignedRole(v.assigned_role || v.role)
    setAdminNote(v.admin_note || '')
    setMsg('')
    setError('')
  }

  const setVolunteerStatus = async (nextStatus) => {
    if (!selected) return
    setSaving(true)
    setMsg('')
    setError('')
    const { error: e } = await supabase
      .from('volunteers')
      .update({
        status: nextStatus,
        assigned_role: nextStatus === 'approved' ? assignedRole : selected.assigned_role,
        admin_note: adminNote.trim() || null,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', selected.id)
    setSaving(false)
    if (e) {
      setError(e.message)
      return
    }
    setMsg(`Application marked ${nextStatus}.`)
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Remove this volunteer application?')) return
    const { error: e } = await supabase.from('volunteers').delete().eq('id', id)
    if (e) setError(e.message)
    else {
      if (id === selectedId) setSelectedId(null)
      load()
    }
  }

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:underline">
          <ArrowLeft size={15} /> Back to volunteers
        </button>
        <div className="card mt-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-brand-navy">{selected.name}</h1>
              <p className="mt-1 text-sm text-slate-500">
                Applied {new Date(selected.created_at).toLocaleDateString()} · interested in {selected.role}
              </p>
            </div>
            <span className={`badge ${STATUS_BADGE[selected.status]}`}>{selected.status}</span>
          </div>

          <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${selected.email}`} className="font-semibold text-brand-navy hover:underline">
                  {selected.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned team role</dt>
              <dd className="mt-1 text-slate-700">{selected.assigned_role || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Application message</dt>
              <dd className="mt-1 whitespace-pre-line text-slate-700">{selected.message || '—'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin note</dt>
              <dd className="mt-1 whitespace-pre-line text-slate-700">{selected.admin_note || '—'}</dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="font-display text-base font-bold text-brand-navy">Review application</h2>
            {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {msg && <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{msg}</p>}
            <label className="label mt-4">Assign team role (used when approving)</label>
            <select value={assignedRole} onChange={(e) => setAssignedRole(e.target.value)} className="select !w-auto">
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <label className="label mt-4">Admin note (private)</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="input min-h-[80px]"
              placeholder="Internal note — not shown to the applicant…"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => setVolunteerStatus('approved')} disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : 'Approve'}
              </button>
              <button onClick={() => setVolunteerStatus('rejected')} disabled={saving} className="btn-outline">
                Reject
              </button>
              <button onClick={() => setVolunteerStatus('pending')} disabled={saving} className="btn-ghost">
                Back to pending
              </button>
              <button onClick={() => remove(selected.id)} className="ml-auto inline-flex items-center gap-1.5 font-semibold text-red-600 hover:underline">
                <Trash2 size={15} /> Remove
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
            <HeartHandshake size={22} className="text-brand-goldDark" /> Volunteers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {volunteers.length} application{volunteers.length === 1 ? '' : 's'} · click one to review, approve, or assign a role.
          </p>
        </div>
        <label className="relative w-full sm:w-72">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, role…"
            className="input !pl-9"
          />
        </label>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatus(s.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              status === s.key ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-6 text-center text-sm text-slate-500">Loading volunteers…</p>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold">Applicant</th>
                <th className="px-5 py-3 font-semibold">Interested role</th>
                <th className="px-5 py-3 font-semibold">Assigned role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Applied</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((v) => (
                <tr key={v.id} className="border-b border-slate-100 align-top last:border-0">
                  <td className="px-5 py-3.5">
                    <button onClick={() => openDetail(v)} className="font-medium text-brand-navy hover:underline">
                      {v.name}
                    </button>
                    <p className="text-xs text-slate-500">{v.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{v.role}</td>
                  <td className="px-5 py-3.5 text-slate-600">{v.assigned_role || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${STATUS_BADGE[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{new Date(v.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <a href={`mailto:${v.email}`} className="mr-3 inline-flex items-center gap-1 font-semibold text-brand-navy hover:underline">
                      <Mail size={14} /> Email
                    </a>
                    <button onClick={() => remove(v.id)} className="font-semibold text-red-600 hover:underline">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No volunteer applications in this view yet.
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
