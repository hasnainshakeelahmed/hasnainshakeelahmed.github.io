import { Link, useParams, Navigate } from 'react-router-dom'
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { UOPEOPLE_GUIDES } from '../../data/uopeopleGuides'
import Seo from '../../components/Seo'

export default function GuideDetail() {
  const { slug } = useParams()
  const index = UOPEOPLE_GUIDES.findIndex((g) => g.slug === slug)
  if (index === -1) return <Navigate to="/guides" replace />
  const guide = UOPEOPLE_GUIDES[index]
  const prev = UOPEOPLE_GUIDES[index - 1]
  const next = UOPEOPLE_GUIDES[index + 1]

  return (
    <div className="container-x max-w-3xl py-10">
      <Seo
        title={guide.title}
        description={guide.summary}
        keywords={`university of the people, uopeople, ${guide.title.toLowerCase()}`}
      />
      <Link to="/guides" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-navy">
        <ArrowLeft size={15} /> All guides
      </Link>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-brand-goldDark">
        Episode {guide.episode} · <Clock size={11} className="inline" /> {guide.duration}
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-slate-600">{guide.summary}</p>

      <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-card">
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${guide.youtubeId}`}
            title={guide.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      <div className="card mt-7 bg-brand-navySoft p-6">
        <h2 className="font-display text-base font-bold text-brand-navy">Key takeaways</h2>
        <ul className="mt-3 space-y-2.5">
          {guide.takeaways.map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-goldDark" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 space-y-8">
        {guide.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl font-bold text-brand-navy">{s.heading}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{s.text}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
        {prev ? (
          <Link to={`/guides/${prev.slug}`} className="btn-outline !px-4 !py-2">
            <ArrowLeft size={15} /> Ep {prev.episode}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/guides/${next.slug}`} className="btn-primary !px-4 !py-2">
            Ep {next.episode}: {next.title} <ArrowRight size={15} />
          </Link>
        )}
      </div>

      <a
        href={`https://youtu.be/${guide.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy"
      >
        Watch on YouTube <ExternalLink size={14} />
      </a>
    </div>
  )
}
