import { Link } from 'react-router-dom'
import { GraduationCap, Play, Clock, ArrowRight } from 'lucide-react'
import Seo from '../../components/Seo'
import { UOPEOPLE_GUIDES } from '../../data/uopeopleGuides'

export default function Guides() {
  return (
    <div className="container-x py-10">
      <Seo
        title="University of the People — Complete Guide (7 Episodes)"
        description="The complete University of the People guide: accreditation, HEC equivalence in Pakistan, application steps, real cost, scholarships, and the honest verdict — with videos."
        keywords="university of the people, uopeople guide, uopeople accreditation, HEC equivalence, uopeople scholarships, uopeople cost"
      />
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
          <GraduationCap size={22} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-brand-navy">University of the People — Complete Guide</h1>
          <p className="text-sm text-slate-500">
            7 episodes. Every question answered — written guides with the full video for each.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {UOPEOPLE_GUIDES.map((g) => (
          <Link key={g.slug} to={`/guides/${g.slug}`} className="card card-hover group flex gap-4 p-5">
            <div className="relative hidden h-28 w-44 shrink-0 overflow-hidden rounded-xl bg-brand-navy sm:block">
              <img
                src={`https://i.ytimg.com/vi/${g.youtubeId}/hqdefault.jpg`}
                alt={g.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-brand-navy">
                  <Play size={17} className="ml-0.5" />
                </span>
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">
                Episode {g.episode} · <Clock size={11} className="inline" /> {g.duration}
              </p>
              <h2 className="mt-1 font-display text-base font-bold leading-snug text-brand-navy group-hover:underline">
                {g.title}
              </h2>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{g.summary}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
                Read guide <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        Research-desk voice: facts from official sources only. Recognition is always decided case by case.
      </p>
    </div>
  )
}
