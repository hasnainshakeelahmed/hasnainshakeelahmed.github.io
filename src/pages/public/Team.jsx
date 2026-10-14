import { Link } from 'react-router-dom'
import { Users, ArrowRight } from 'lucide-react'
import Seo from '../../components/Seo'
import { TEAM } from '../../data/siteContent'

export default function Team() {
  return (
    <div className="container-x py-14">
      <Seo
        title="Meet the Career Radar Team"
        description="Meet the volunteers behind Career Radar — the founder, core admin, and developers building a global career platform for students."
        keywords="career radar team, founder, volunteers, about us"
      />
      <span className="badge badge-gold">
        <Users size={14} /> Our team
      </span>
      <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight text-brand-navy">
        A small team with a big job: every student, everywhere.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
        Career Radar is built by volunteers — students and young professionals
        who give a few hours a week so thousands of others can move forward.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {TEAM.map((m) => (
          <article key={m.name} className="card card-hover flex flex-col p-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy font-display text-lg font-extrabold text-brand-gold">
              {m.initials}
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-brand-navy">{m.name}</h2>
            <p className="text-sm font-semibold text-brand-goldDark">{m.role}</p>
            <p className="mt-1 text-xs text-slate-500">{m.education}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{m.bio}</p>
            {m.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
                {m.skills.map((s) => (
                  <span key={s} className="badge badge-slate">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="card mt-8 flex flex-wrap items-center justify-between gap-4 bg-brand-navySoft p-6">
        <div>
          <h2 className="font-display text-lg font-bold text-brand-navy">Want your name here?</h2>
          <p className="mt-1 text-sm text-slate-600">
            Join the volunteer team — content, design, development, mentoring.
          </p>
        </div>
        <Link to="/volunteer" className="btn-primary">
          Become a volunteer <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}
