import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Crown, Linkedin } from 'lucide-react'
import Seo from '../../components/Seo'
import { supabase } from '../../lib/supabase'
import { kindLabel, tierLabel, TRACKS } from '../../lib/team'

// ── Featured people (static, full detail) ───────────────────────
// Founder LinkedIn: add the URL once confirmed.
const FOUNDER_LINKEDIN = ''

const FOUNDER = {
  name: 'Hasnain Shakeel Ahmed',
  role: 'Founder',
  img: '/images/team/hasnain.jpeg',
  bio: 'Founded Career Radar to make verified opportunities and honest career guidance available to every student.',
}

const FEATURED = [
  {
    name: 'Shaheer Ahmed',
    role: 'Core-Admin',
    img: null,
    skills: ['Digital Marketing (Certified By Gov Of KPK)'],
    socials: [],
    quote: null,
  },
  {
    name: 'Usman Shafiq',
    role: 'Developer',
    img: '/images/team/usman.jpg',
    skills: ['React', 'Python', 'Tailwind CSS', 'HTML'],
    socials: [{ icon: Linkedin, url: 'https://www.linkedin.com/in/usman-shafiq-813981379/', label: 'LinkedIn' }],
    quote: 'To build and scale secure, innovative digital product businesses while bridging the gap…',
  },
]

const initialsOf = (name) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

function Avatar({ src, name, className = 'h-36 w-36' }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <span className={`${className} flex items-center justify-center rounded-full bg-brand-navy font-display text-3xl font-extrabold text-brand-gold ring-4 ring-brand-gold/50`}>
        {initialsOf(name)}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className={`${className} rounded-full object-cover ring-4 ring-brand-gold/60 shadow-[0_0_40px_rgba(242,183,5,0.35)]`}
    />
  )
}

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

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
    <div className="bg-white">
      <div className="container-x py-14">
        <Seo
          title="Meet the Career Radar Team"
          description="Meet the volunteers and interns behind Career Radar — the people building a global career platform for students."
          keywords="career radar team, founder, volunteers, interns, about us"
        />

        {/* Founder */}
        <div className="flex flex-col items-center text-center">
          <Avatar src={FOUNDER.img} name={FOUNDER.name} className="h-40 w-40" />
          <h1 className="mt-5 font-display text-2xl font-extrabold text-brand-navy">{FOUNDER.name}</h1>
          <p className="mt-1.5 flex items-center gap-1.5 font-display text-base font-bold text-brand-goldDark">
            <Crown size={16} /> {FOUNDER.role}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">{FOUNDER.bio}</p>
          {FOUNDER_LINKEDIN && (
            <a href={FOUNDER_LINKEDIN} target="_blank" rel="noreferrer" aria-label="Founder on LinkedIn"
              className="mt-3 rounded-full p-2 text-[#0A66C2] transition-transform hover:scale-110">
              <Linkedin size={22} />
            </a>
          )}
        </div>

        {/* Featured team */}
        <h2 className="mt-16 text-center font-display text-2xl font-extrabold text-brand-navy">Team</h2>
        <div className="mx-auto mt-8 grid max-w-3xl gap-10 sm:grid-cols-2">
          {FEATURED.map((m) => (
            <div key={m.name} className="flex flex-col items-center text-center">
              <Avatar src={m.img} name={m.name} />
              <h3 className="mt-4 font-display text-xl font-extrabold text-brand-navy">{m.name}</h3>
              <p className="mt-1 font-display text-base font-bold text-brand-goldDark">{m.role}</p>
              {m.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {m.skills.map((s) => (
                    <span key={s} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">{s}</span>
                  ))}
                </div>
              )}
              {m.socials.length > 0 && (
                <div className="mt-3 flex gap-1">
                  {m.socials.map((s) => (
                    <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}
                      className="rounded-full p-2 text-[#0A66C2] transition-transform hover:scale-110">
                      <s.icon size={20} />
                    </a>
                  ))}
                </div>
              )}
              {m.quote && <p className="mt-3 max-w-xs text-sm italic leading-relaxed text-slate-500">"{m.quote}"</p>}
            </div>
          ))}
        </div>

        {/* Live roster — everyone added via the admin Team panel */}
        {!loading && byTrack.length > 0 && (
          <div className="mt-16">
            <h2 className="text-center font-display text-2xl font-extrabold text-brand-navy">Volunteers & Interns</h2>
            {byTrack.map(([track, list]) => (
              <div key={track} className="mt-8">
                <h3 className="text-center font-display text-base font-bold text-slate-500">
                  {track}
                  <span className="ml-2 rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-xs font-bold text-brand-navy">{list.length}</span>
                </h3>
                <div className="mx-auto mt-5 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((m) => (
                    <div key={m.id} className="flex flex-col items-center text-center">
                      <Avatar src={null} name={m.name} className="h-28 w-28" />
                      <h4 className="mt-3 font-display text-base font-extrabold text-brand-navy">{m.name}</h4>
                      <p className="mt-0.5 text-sm font-bold text-brand-goldDark">
                        {kindLabel(m.kind)} · <span className="capitalize">{m.level}</span>
                      </p>
                      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">{tierLabel(m.tier).split(' (')[0]}</span>
                        {m.cohort && <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">{m.cohort}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mx-auto mt-16 flex max-w-3xl flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-navySoft p-6">
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
    </div>
  )
}
