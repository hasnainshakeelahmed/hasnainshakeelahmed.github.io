import { Link } from 'react-router-dom'
import { Radar, Compass, ShieldCheck, Globe2, ArrowRight, CheckCircle2 } from 'lucide-react'
import Seo from '../../components/Seo'
import { ABOUT } from '../../data/siteContent'

export default function About() {
  return (
    <div>
      <Seo
        title="About Career Radar — Mission, Values & Team"
        description="Career Radar helps students and early-career professionals find verified scholarships, internships and jobs, build in-demand skills, and grow with a global community."
        keywords="about career radar, mission, career development, scholarships, internships, global community"
      />
      <section className="bg-brand-navy py-16 text-white">
        <div className="container-x">
          <span className="badge bg-brand-gold/15 text-brand-gold">
            <Radar size={14} /> About Career Radar
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            {ABOUT.storyHeading}
          </h1>
          <p className="mt-3 font-display text-xl font-semibold text-brand-gold">{ABOUT.tagline}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">{ABOUT.story}</p>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="card card-hover bg-brand-navy p-6 text-white md:col-span-1">
            <Compass className="text-brand-gold" size={26} />
            <h2 className="mt-3 font-display text-lg font-bold">Our Mission</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{ABOUT.mission}</p>
          </div>
          <div className="card card-hover p-6 md:col-span-2">
            <ShieldCheck className="text-brand-goldDark" size={26} />
            <h2 className="mt-3 font-display text-lg font-bold text-brand-navy">Core Values</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {ABOUT.values.map((v) => (
                <li key={v.title} className="flex gap-2.5">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-goldDark" />
                  <span className="text-sm leading-relaxed text-slate-600">
                    <strong className="text-brand-navy">{v.title}:</strong> {v.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="container-x grid gap-10 md:grid-cols-2">
          <div>
            <p className="section-kicker">What we do</p>
            <h2 className="section-title mt-1">One ecosystem for your whole career</h2>
            <ul className="mt-6 space-y-4">
              {ABOUT.whatWeDo.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-goldDark" />
                  <span className="text-sm leading-relaxed text-slate-700">
                    <strong className="text-brand-navy">{item.title}:</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="card p-6">
              <p className="section-kicker">Who can join</p>
              <h3 className="mt-1 font-display text-lg font-bold text-brand-navy">Built for people on the move</h3>
              <ul className="mt-4 space-y-2.5">
                {ABOUT.whoCanJoin.map((w) => (
                  <li key={w} className="flex gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" /> {w}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-brand-gold/10 px-4 py-3 text-sm font-medium text-brand-goldDark">
                {ABOUT.whoCanJoinNote}
              </p>
            </div>
            <div className="card mt-5 bg-brand-navy p-6 text-white">
              <h3 className="font-display text-lg font-bold">Why join Career Radar?</h3>
              <ul className="mt-3 space-y-2.5">
                {ABOUT.whyJoin.map((item) => (
                  <li key={item.title} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
                    <Globe2 size={16} className="mt-0.5 shrink-0 text-brand-gold" />
                    <span>
                      <strong className="text-white">{item.title}:</strong> {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/jobs" className="btn-gold mt-5">
                Explore opportunities <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
