import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, Users, ClipboardList, Inbox, Search, Plus, X,
  CheckCircle2, RotateCcw, Trash2, Eye, UserPlus, UserMinus,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import {
  KINDS, TRACKS, TIERS, LEVELS, MEMBER_STATUSES, TASK_STATUSES,
  APPLICATION_STATUSES, kindLabel, tierLabel, levelLabel, taskStatusLabel,
  STATUS_BADGE,
} from '../../lib/team'

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'members', label: 'Members', icon: Users },
  { key: 'tasks', label: 'Tasks', icon: ClipboardList },
  { key: 'applications', label: 'Applications', icon: Inbox },
]

const currentCohort = () => {
  const d = new Date()
  return `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`
}

const emptyMember = {
  name: '', email: '', kind: 'volunteer', track: TRACKS[0],
  tier: 'casual', level: 'contributor', status: 'active',
  cohort: currentCohort(), notes: '',
}

export default function ManageTeam() {
  const [tab, setTab] = useState('overview')
  const [members, setMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    const [m, t, a] = await Promise.all([
      supabase.from('team_members').select('*').order('created_at', { ascending: false }),
      supabase.from('team_tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('team_applications').select('*').order('created_at', { ascending: false }),
    ])
    if (m.error) setError(m.error.message)
    else setMembers(m.data ?? [])
    if (!t.error) setTasks(t.data ?? [])
    if (!a.error) setApplications(a.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const memberById = useMemo(() => {
    const map = {}
    members.forEach((m) => { map[m.id] = m })
    return map
  }, [members])

  // ── Overview stats ────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = members.filter((m) => m.status === 'active')
    return {
      interns: active.filter((m) => m.kind === 'intern').length,
      volunteers: active.filter((m) => m.kind === 'volunteer').length,
      inReview: tasks.filter((t) => t.status === 'in_review').length,
      pendingApps: applications.filter((a) => a.status === 'pending' || a.status === 'trial').length,
      trackCounts: TRACKS.map((tr) => ({
        track: tr,
        count: active.filter((m) => m.track === tr).length,
      })).filter((x) => x.count > 0),
    }
  }, [members, tasks, applications])

  const flash = (text) => {
    setMsg(text)
    setTimeout(() => setMsg(''), 4000)
  }

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading team data…</div>
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">Team Programme</h1>
          <p className="mt-1 text-sm text-slate-500">Manage interns, volunteers, tasks and applications in one place.</p>
        </div>
        <button onClick={load} className="btn-secondary !px-4 !py-2 text-sm">
          <RotateCcw size={15} /> Refresh
        </button>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {msg && <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{msg}</p>}

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-card">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.key ? 'bg-brand-navy text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <t.icon size={16} /> {t.label}
            {t.key === 'tasks' && stats.inReview > 0 && (
              <span className="rounded-full bg-brand-gold px-2 py-0.5 text-xs font-bold text-brand-navy">{stats.inReview}</span>
            )}
            {t.key === 'applications' && stats.pendingApps > 0 && (
              <span className="rounded-full bg-brand-gold px-2 py-0.5 text-xs font-bold text-brand-navy">{stats.pendingApps}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'overview' && <Overview stats={stats} tasks={tasks} memberById={memberById} />}
      {tab === 'members' && (
        <MembersTab members={members} onChange={load} flash={flash} />
      )}
      {tab === 'tasks' && (
        <TasksTab tasks={tasks} members={members} memberById={memberById} onChange={load} flash={flash} />
      )}
      {tab === 'applications' && (
        <ApplicationsTab applications={applications} onChange={load} flash={flash} />
      )}
    </div>
  )
}

/* ── Overview ─────────────────────────────────────────────────── */
function Overview({ stats, tasks, memberById }) {
  const cards = [
    { label: 'Active interns', value: stats.interns },
    { label: 'Active volunteers', value: stats.volunteers },
    { label: 'Tasks in review', value: stats.inReview },
    { label: 'Pending applications', value: stats.pendingApps },
  ]
  const recent = tasks.slice(0, 8)
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 shadow-card">
            <p className="font-display text-3xl font-extrabold text-brand-navy">{c.value}</p>
            <p className="mt-1 text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-brand-navy">Active members by department</h3>
          <div className="mt-4 space-y-2.5">
            {stats.trackCounts.length === 0 && <p className="text-sm text-slate-400">No members yet.</p>}
            {stats.trackCounts.map((t) => (
              <div key={t.track} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{t.track}</span>
                <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 font-bold text-brand-navy">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-brand-navy">Latest tasks</h3>
          <div className="mt-4 space-y-2.5">
            {recent.length === 0 && <p className="text-sm text-slate-400">No tasks yet.</p>}
            {recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-slate-600">
                  {t.title}
                  <span className="text-slate-400"> · {memberById[t.member_id]?.name || '—'}</span>
                </span>
                <span className={`badge ${STATUS_BADGE[t.status]}`}>{taskStatusLabel(t.status)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Members ──────────────────────────────────────────────────── */
function MembersTab({ members, onChange, flash }) {
  const [kind, setKind] = useState('all')
  const [track, setTrack] = useState('all')
  const [status, setStatus] = useState('active')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null) // null | {mode:'add'} | {mode:'edit', member}
  const [form, setForm] = useState(emptyMember)
  const [saving, setSaving] = useState(false)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return members.filter((m) => {
      if (kind !== 'all' && m.kind !== kind) return false
      if (track !== 'all' && m.track !== track) return false
      if (status !== 'all' && m.status !== status) return false
      if (q && ![m.name, m.email, m.cohort].some((f) => (f || '').toLowerCase().includes(q))) return false
      return true
    })
  }, [members, kind, track, status, query])

  const openAdd = () => { setForm({ ...emptyMember }); setModal({ mode: 'add' }) }
  const openEdit = (m) => {
    setForm({ name: m.name, email: m.email, kind: m.kind, track: m.track, tier: m.tier, level: m.level, status: m.status, cohort: m.cohort || '', notes: m.notes || '' })
    setModal({ mode: 'edit', member: m })
  }

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) { flash('Name and email are required.'); return }
    setSaving(true)
    const payload = { ...form, name: form.name.trim(), email: form.email.trim(), updated_at: new Date().toISOString() }
    const { error } = modal.mode === 'add'
      ? await supabase.from('team_members').insert(payload)
      : await supabase.from('team_members').update(payload).eq('id', modal.member.id)
    setSaving(false)
    if (error) { flash('Error: ' + error.message); return }
    setModal(null)
    flash(modal.mode === 'add' ? 'Member added.' : 'Member updated.')
    onChange()
  }

  const remove = async (m) => {
    if (!window.confirm(`Remove ${m.name} from the programme? Their tasks will be deleted too.`)) return
    const { error } = await supabase.from('team_members').delete().eq('id', m.id)
    if (error) flash('Error: ' + error.message)
    else { flash('Member removed.'); onChange() }
  }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email…"
            className="rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-gold" />
        </div>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="all">All kinds</option>
          {KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}s</option>)}
        </select>
        <select value={track} onChange={(e) => setTrack(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="all">All departments</option>
          {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          {MEMBER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <button onClick={openAdd} className="btn-primary ml-auto !px-4 !py-2 text-sm"><Plus size={15} /> Add member</button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Name</th><th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Department</th><th className="px-4 py-3">Tier / Level</th>
              <th className="px-4 py-3">Status</th><th className="px-4 py-3">Cohort</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => (
              <tr key={m.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-4 py-3"><p className="font-semibold text-brand-navy">{m.name}</p><p className="text-xs text-slate-400">{m.email}</p></td>
                <td className="px-4 py-3">{kindLabel(m.kind)}</td>
                <td className="px-4 py-3">{m.track}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{tierLabel(m.tier).split(' (')[0]} · <span className="capitalize">{m.level}</span></td>
                <td className="px-4 py-3"><span className={`badge ${STATUS_BADGE[m.status]} capitalize`}>{m.status}</span></td>
                <td className="px-4 py-3 text-slate-500">{m.cohort || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(m)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-navy" title="Edit"><Eye size={15} /></button>
                    <button onClick={() => remove(m)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Remove"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">No members match these filters.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4" onClick={() => setModal(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-brand-navy">{modal.mode === 'add' ? 'Add member' : 'Edit member'}</h3>
              <button onClick={() => setModal(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">Name*<input value={form.name} onChange={(e) => setField('name', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-gold" /></label>
              <label className="text-sm">Email*<input value={form.email} onChange={(e) => setField('email', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-gold" /></label>
              <label className="text-sm">Kind<select value={form.kind} onChange={(e) => setField('kind', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">{KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}</select></label>
              <label className="text-sm">Department<select value={form.track} onChange={(e) => setField('track', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">{TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
              <label className="text-sm">Tier<select value={form.tier} onChange={(e) => setField('tier', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">{TIERS.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}</select></label>
              <label className="text-sm">Level<select value={form.level} onChange={(e) => setField('level', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">{LEVELS.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}</select></label>
              <label className="text-sm">Status<select value={form.status} onChange={(e) => setField('status', e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">{MEMBER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}</select></label>
              <label className="text-sm">Cohort<input value={form.cohort} onChange={(e) => setField('cohort', e.target.value)} placeholder="2026-Q4" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-gold" /></label>
              <label className="text-sm sm:col-span-2">Notes<textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-gold" /></label>
            </div>
            <button onClick={save} disabled={saving} className="btn-primary mt-5 w-full disabled:opacity-50">
              {saving ? 'Saving…' : modal.mode === 'add' ? 'Add member' : 'Save changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Tasks ────────────────────────────────────────────────────── */
function TasksTab({ tasks, members, memberById, onChange, flash }) {
  const [status, setStatus] = useState('all')
  const [memberId, setMemberId] = useState('all')
  const [showAssign, setShowAssign] = useState(false)
  const [form, setForm] = useState({ member_id: '', title: '', description: '', due_date: '' })
  const [saving, setSaving] = useState(false)
  const [reviewing, setReviewing] = useState(null) // task being reviewed
  const [feedback, setFeedback] = useState('')

  const activeMembers = members.filter((m) => m.status === 'active')

  const list = useMemo(() => tasks.filter((t) => {
    if (status !== 'all' && t.status !== status) return false
    if (memberId !== 'all' && t.member_id !== memberId) return false
    return true
  }), [tasks, status, memberId])

  const assign = async () => {
    if (!form.member_id || !form.title.trim()) { flash('Pick a member and add a title.'); return }
    setSaving(true)
    const { error } = await supabase.from('team_tasks').insert({
      member_id: form.member_id, title: form.title.trim(),
      description: form.description.trim() || null, due_date: form.due_date || null,
    })
    setSaving(false)
    if (error) { flash('Error: ' + error.message); return }
    setForm({ member_id: '', title: '', description: '', due_date: '' })
    setShowAssign(false)
    flash('Task assigned.')
    onChange()
  }

  const setTaskStatus = async (t, next, fb = null) => {
    const payload = { status: next, updated_at: new Date().toISOString() }
    if (fb !== null) payload.feedback = fb
    const { error } = await supabase.from('team_tasks').update(payload).eq('id', t.id)
    if (error) flash('Error: ' + error.message)
    else { flash(next === 'done' ? 'Task approved.' : 'Sent back for changes.'); setReviewing(null); setFeedback(''); onChange() }
  }

  const remove = async (t) => {
    if (!window.confirm(`Delete task "${t.title}"?`)) return
    const { error } = await supabase.from('team_tasks').delete().eq('id', t.id)
    if (error) flash('Error: ' + error.message)
    else { flash('Task deleted.'); onChange() }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          {TASK_STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="all">All members</option>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name} ({kindLabel(m.kind)})</option>)}
        </select>
        <button onClick={() => setShowAssign((v) => !v)} className="btn-primary ml-auto !px-4 !py-2 text-sm"><Plus size={15} /> Assign task</button>
      </div>

      {showAssign && (
        <div className="mb-4 rounded-2xl bg-white p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-brand-navy">Assign a new task</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Member*
              <select value={form.member_id} onChange={(e) => setForm((f) => ({ ...f, member_id: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Select…</option>
                {activeMembers.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.track}</option>)}
              </select>
            </label>
            <label className="text-sm">Due date<input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></label>
            <label className="text-sm sm:col-span-2">Title*<input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Verify 5 scholarships for the S&I channel" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-gold" /></label>
            <label className="text-sm sm:col-span-2">Description<textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="What exactly should be done, and what good looks like…" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-gold" /></label>
          </div>
          <button onClick={assign} disabled={saving} className="btn-primary mt-4 !px-5 !py-2 text-sm disabled:opacity-50">{saving ? 'Assigning…' : 'Assign task'}</button>
        </div>
      )}

      <div className="space-y-3">
        {list.map((t) => {
          const m = memberById[t.member_id]
          return (
            <div key={t.id} className="rounded-2xl bg-white p-4 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-brand-navy">{t.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {m ? `${m.name} · ${m.track}` : 'Unknown member'}
                    {t.due_date && ` · due ${t.due_date}`}
                  </p>
                  {t.description && <p className="mt-2 text-sm text-slate-600">{t.description}</p>}
                  {t.feedback && (
                    <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800"><span className="font-semibold">Feedback:</span> {t.feedback}</p>
                  )}
                </div>
                <span className={`badge ${STATUS_BADGE[t.status]}`}>{taskStatusLabel(t.status)}</span>
              </div>
              {reviewing === t.id ? (
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={2} placeholder="Feedback for the member (optional for approval, required for changes)…"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-gold" />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setTaskStatus(t, 'done', feedback.trim() || null)} className="btn-primary !px-4 !py-1.5 text-sm"><CheckCircle2 size={14} /> Approve</button>
                    <button onClick={() => { if (!feedback.trim()) { flash('Add feedback explaining what to change.'); return } setTaskStatus(t, 'todo', feedback.trim()) }} className="btn-secondary !px-4 !py-1.5 text-sm">Request changes</button>
                    <button onClick={() => { setReviewing(null); setFeedback('') }} className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  {t.status === 'in_review' && (
                    <button onClick={() => { setReviewing(t.id); setFeedback(t.feedback || '') }} className="btn-primary !px-4 !py-1.5 text-sm">Review</button>
                  )}
                  {t.status === 'todo' && (
                    <button onClick={() => setTaskStatus(t, 'done')} className="btn-secondary !px-4 !py-1.5 text-sm">Mark done</button>
                  )}
                  <button onClick={() => remove(t)} className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>
                </div>
              )}
            </div>
          )
        })}
        {list.length === 0 && <p className="rounded-2xl bg-white py-10 text-center text-sm text-slate-400 shadow-card">No tasks match these filters.</p>}
      </div>
    </div>
  )
}

/* ── Applications ─────────────────────────────────────────────── */
function ApplicationsTab({ applications, onChange, flash }) {
  const [status, setStatus] = useState('pending')
  const [selectedId, setSelectedId] = useState(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const list = useMemo(() => applications.filter((a) => status === 'all' || a.status === status), [applications, status])
  const selected = useMemo(() => applications.find((a) => a.id === selectedId) || null, [applications, selectedId])

  const openDetail = (a) => { setSelectedId(a.id); setNotes(a.notes || '') }

  const setStatusFor = async (a, next) => {
    setSaving(true)
    // Accepting creates a team member record.
    if (next === 'accepted') {
      const { error: mErr } = await supabase.from('team_members').insert({
        name: a.name, email: a.email, kind: a.kind, track: a.track,
        tier: a.tier || 'casual', level: 'contributor', status: 'active',
        cohort: currentCohort(), notes: `Accepted from application ${a.id.slice(0, 8)}`,
      })
      if (mErr) { setSaving(false); flash('Error creating member: ' + mErr.message); return }
    }
    const { error } = await supabase.from('team_applications')
      .update({ status: next, notes: notes.trim() || null, updated_at: new Date().toISOString() })
      .eq('id', a.id)
    setSaving(false)
    if (error) { flash('Error: ' + error.message); return }
    setSelectedId(null)
    flash(next === 'accepted' ? `${a.name} accepted and added as a team member.` : `Application ${next}.`)
    onChange()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          {APPLICATION_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <div className="space-y-2">
          {list.map((a) => (
            <button key={a.id} onClick={() => openDetail(a)}
              className={`w-full rounded-2xl bg-white p-4 text-left shadow-card transition-shadow hover:shadow-lg ${selectedId === a.id ? 'ring-2 ring-brand-gold' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-brand-navy">{a.name}</p>
                <span className={`badge ${STATUS_BADGE[a.status]} capitalize`}>{a.status}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">{kindLabel(a.kind)} · {a.track}</p>
            </button>
          ))}
          {list.length === 0 && <p className="rounded-2xl bg-white py-10 text-center text-sm text-slate-400 shadow-card">No applications here.</p>}
        </div>
      </div>
      <div className="lg:col-span-3">
        {!selected && <p className="rounded-2xl bg-white py-16 text-center text-sm text-slate-400 shadow-card">Select an application to review it.</p>}
        {selected && (
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-bold text-brand-navy">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.email}</p>
              </div>
              <span className={`badge ${STATUS_BADGE[selected.status]} capitalize`}>{selected.status}</span>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2"><dt className="w-24 shrink-0 font-semibold text-slate-500">Applying as</dt><dd>{kindLabel(selected.kind)} · {tierLabel(selected.tier).split(' (')[0]}</dd></div>
              <div className="flex gap-2"><dt className="w-24 shrink-0 font-semibold text-slate-500">Department</dt><dd>{selected.track}</dd></div>
              {selected.sample_url && <div className="flex gap-2"><dt className="w-24 shrink-0 font-semibold text-slate-500">Work sample</dt><dd><a href={selected.sample_url} target="_blank" rel="noreferrer" className="text-brand-goldDark hover:underline">Open link</a></dd></div>}
              {selected.motivation && <div><dt className="font-semibold text-slate-500">Motivation</dt><dd className="mt-1 rounded-xl bg-slate-50 p-3 text-slate-600">{selected.motivation}</dd></div>}
            </dl>
            <label className="mt-4 block text-sm font-semibold text-slate-500">Admin notes
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-brand-gold" />
            </label>
            {(selected.status === 'pending' || selected.status === 'trial') && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.status === 'pending' && (
                  <button onClick={() => setStatusFor(selected, 'trial')} disabled={saving} className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-50">Move to trial task</button>
                )}
                <button onClick={() => setStatusFor(selected, 'accepted')} disabled={saving} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50"><UserPlus size={15} /> Accept & add to team</button>
                <button onClick={() => setStatusFor(selected, 'rejected')} disabled={saving} className="rounded-xl px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><UserMinus size={15} className="mr-1 inline" /> Reject</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
