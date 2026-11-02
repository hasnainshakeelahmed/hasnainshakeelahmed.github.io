import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, CheckCircle2, Clock, Award, Send, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { kindLabel, tierLabel, levelLabel, taskStatusLabel, STATUS_BADGE } from '../../lib/team'

export default function MyProgramme() {
  const { user } = useAuth()
  const [member, setMember] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setLoading(true)
      const { data: m } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      setMember(m || null)
      if (m) {
        const { data: t } = await supabase
          .from('team_tasks')
          .select('*')
          .eq('member_id', m.id)
          .order('created_at', { ascending: false })
        setTasks(t ?? [])
      }
      setLoading(false)
    })()
  }, [user])

  const groups = useMemo(() => ({
    todo: tasks.filter((t) => t.status === 'todo'),
    in_review: tasks.filter((t) => t.status === 'in_review'),
    done: tasks.filter((t) => t.status === 'done'),
  }), [tasks])

  const completion = tasks.length === 0 ? 0 : Math.round((groups.done.length / tasks.length) * 100)

  const submitForReview = async (t) => {
    const { error } = await supabase.from('team_tasks').update({ status: 'in_review' }).eq('id', t.id)
    if (error) setMsg('Error: ' + error.message)
    else {
      setMsg('Submitted for review — your lead will check it soon.')
      setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, status: 'in_review' } : x)))
      setTimeout(() => setMsg(''), 4000)
    }
  }

  if (loading) return <div className="container-x py-24 text-center text-sm text-slate-500">Loading…</div>

  if (!member) {
    return (
      <div className="container-x py-24 text-center">
        <User size={40} className="mx-auto text-slate-300" />
        <h1 className="mt-4 font-display text-2xl font-extrabold text-brand-navy">You're not in the programme yet</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          The Team Programme is where interns and volunteers get structured tasks, clear goals and feedback from their leads.
        </p>
        <Link to="/volunteer" className="btn-primary mt-6">Apply as a volunteer</Link>
      </div>
    )
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-2xl font-extrabold text-brand-navy">My Programme</h1>
      <p className="mt-1 text-sm text-slate-500">
        {kindLabel(member.kind)} · {member.track} · {tierLabel(member.tier).split(' (')[0]} · <span className="capitalize">{member.level}</span>
        {member.cohort && ` · Cohort ${member.cohort}`}
      </p>

      {msg && <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{msg}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'To do', value: groups.todo.length, icon: ClipboardList },
          { label: 'In review', value: groups.in_review.length, icon: Clock },
          { label: 'Done', value: groups.done.length, icon: CheckCircle2 },
          { label: 'Completion', value: `${completion}%`, icon: Award },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 shadow-card">
            <c.icon size={18} className="text-brand-goldDark" />
            <p className="mt-2 font-display text-2xl font-extrabold text-brand-navy">{c.value}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        <TaskGroup title="To do" tasks={groups.todo} empty="Nothing assigned right now — check back soon.">
          {(t) => (
            <button onClick={() => submitForReview(t)} className="btn-primary !px-4 !py-1.5 text-sm">
              <Send size={14} /> Submit for review
            </button>
          )}
        </TaskGroup>
        <TaskGroup title="In review" tasks={groups.in_review} empty="Nothing waiting for review.">
          {() => <span className="text-xs font-medium text-slate-400">Your lead is checking this.</span>}
        </TaskGroup>
        <TaskGroup title="Done" tasks={groups.done} empty="No completed tasks yet — your first win is coming.">
          {() => null}
        </TaskGroup>
      </div>
    </div>
  )
}

function TaskGroup({ title, tasks, empty, children }) {
  return (
    <section>
      <h2 className="font-display text-base font-bold text-brand-navy">
        {title} <span className="ml-1 rounded-full bg-brand-navy/10 px-2 py-0.5 text-xs font-bold">{tasks.length}</span>
      </h2>
      <div className="mt-3 space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-brand-navy">{t.title}</p>
                {t.due_date && <p className="mt-0.5 text-xs text-slate-400">Due {t.due_date}</p>}
                {t.description && <p className="mt-2 text-sm text-slate-600">{t.description}</p>}
                {t.feedback && (
                  <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    <span className="font-semibold">Lead feedback:</span> {t.feedback}
                  </p>
                )}
              </div>
              <span className={`badge ${STATUS_BADGE[t.status]}`}>{taskStatusLabel(t.status)}</span>
            </div>
            <div className="mt-3">{children(t)}</div>
          </div>
        ))}
        {tasks.length === 0 && <p className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-slate-400 shadow-card">{empty}</p>}
      </div>
    </section>
  )
}
