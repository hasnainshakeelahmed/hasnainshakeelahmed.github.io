import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ArrowRight } from 'lucide-react'
import Seo from '../../components/Seo'
import { supabase } from '../../lib/supabase'
import { TEAM } from '../../data/siteContent'
import { kindLabel, tierLabel, TRACKS } from '../../lib/team'

const initialsOf = (name) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const founder = TEAM[0]

  useEffect(() => {
    supabase
      .from('public_team')
      .select('*')
      .order('joined_at', { ascending: true })
      .then(({ data }) => {
        setMembers(data ?? [])
        setLoading(false)
      })
  }, [])

  const byTrack = useMemo(() => {
    const map = {}
    members.forEach((m) => {
      if (!map[m.track]) map[m.track] = []
      map[m.track].push(m)
    })
    const ordered = TRACKS.filter((t) => map[t]).map((t) => [t, map[t]])
    Object.keys(map).forEach((t) => {
      if (!TRACKS.includes(t)) ordered.push([t, map[t]])
    })
    return ordered
  }, [members])

  return (
    <div className="container-x py-14">
      <Seo
        title="Meet the Career Radar Team"
        description="Meet the volunteers and interns behind Career Radar — the people building a global career platform for students."
        keywords="career radar team, founder, volunteers, interns, about us"
      />
      <span className="badge badge-gold">
        <Users size={14} /> Our team
      </span>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight text-brand-navy">
        The people behind the radar.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
        Career Radar is built by volunteers and interns — students and young
        professionals who give a few hours a week so thousands of others can
        move forward. Everyone below earned their place by shipping real work.
      </p>

      {/* Founder spotlight */}
      <div className="card mt-10 flex flex-col gap-5 bg-brand-navy p-6 text-white sm:flex-row sm:items-center">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-gold font-display text-xl font-extrabold text-brand-navy">
          {founder.initials}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Founder</p>
          <h2 className="mt-1 font-display text-xl font-extrabold">{founder.name}</h2>
          <p className="mt-1 text-sm text-slate-300">{founder.bio}</p>
        </div>
      </div>

      {loading && <p className="mt-10 text-center text-sm text-slate-400">Loading the team…</p>}

      {!loading && byTrack.map(([track, list]) => (
        <section key={track} className="mt-12">
          <h2 className="font-display text-xl font-extrabold text-brand-navy">
            {track}
            <span className="ml-2 rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-xs font-bold">{list.length}</span>
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((m) => (
              <article key={m.id} className="card card-hover flex flex-col p-6">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy font-display text-lg font-extrabold text-brand-gold">
                  {initialsOf(m.name)}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-brand-navy">{m.name}</h3>
                <p className="text-sm font-semibold text-brand-goldDark">
                  {kindLabel(m.kind)} · <span className="capitalize">{m.level}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="badge badge-slate">{tierLabel(m.tier).split(' (')[0]}</span>
                  {m.cohort && <span className="badge badge-slate">{m.cohort}</span>}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {!loading && members.length === 0 && (
        <p className="mt-10 rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-card">
          The team roster is being set up — check back soon.
        </p>
      )}

      <div className="card mt-12 flex flex-wrap items-center justify-between gap-4 bg-brand-navySoft p-6">
        <div>
          <h2 className="font-display text-lg font-bold text-brand-navy">Want your name here?</h2>
          <p className="mt-1 text-sm text-slate-600">
            Join as a volunteer or apply for an internship — structured work, real skills, visible credit.
          </p>
        </div>
        <Link to="/volunteer" className="btn-primary">
          Become a volunteer <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
