import { Link, useParams, Navigate } from 'react-router-dom'
import { Calendar, Tag, Youtube, ExternalLink, CheckCircle2, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'
import Seo from '../../components/Seo'
import Reveal from '../../components/Reveal'
import WhatsAppCTA from '../../components/WhatsAppCTA'
import { videoBySlug, VIDEOS, youtubeUrl, embedUrl } from '../../data/videos'

export default function VideoBlog() {
  const { slug } = useParams()
  const video = videoBySlug(slug)

  if (!video) return <Navigate to="/videos" replace />

  const index = VIDEOS.findIndex((v) => v.slug === video.slug)
  const prev = index > 0 ? VIDEOS[index - 1] : null
  const next = index >= 0 && index < VIDEOS.length - 1 ? VIDEOS[index + 1] : null

  const related = VIDEOS.filter((v) => v.slug !== video.slug && (v.category === video.category || v.series === video.series)).slice(0, 3)
  const fallbackRelated = related.length
    ? related
    : VIDEOS.filter((v) => v.slug !== video.slug).slice(0, 3)

  return (
    <div className="container-x py-10">
      <Seo
        title={`${video.title} — Career Radar Videos`}
        description={video.description[0]}
        keywords={`career radar, ${video.category}, ${video.title}`}
      />
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-navy hover:underline">Home</Link>
        <ChevronRight size={14} className="text-slate-300" />
        <Link to="/videos" className="hover:text-brand-navy hover:underline">Videos</Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="max-w-[55vw] truncate font-medium text-brand-navy">{video.title}</span>
      </nav>
      <Link to="/videos" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:underline">
        <ArrowLeft size={15} /> All videos
      </Link>

      <article className="mx-auto mt-5 max-w-3xl">
        <div className="hero-enter">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Tag size={13} className="text-brand-goldDark" /> {video.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-brand-goldDark" />{' '}
              {new Date(video.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {video.series && <span className="text-brand-goldDark">{video.series}</span>}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">
            {video.title}
          </h1>
        </div>

        {/* Embedded video */}
        <Reveal className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-card">
          <div className="aspect-video w-full bg-black">
            <iframe
              src={embedUrl(video)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </Reveal>

        {/* Blog body */}
        <div className="mt-8 space-y-5">
          {video.description.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-slate-700 sm:text-lg">
              {para}
            </p>
          ))}
        </div>

        {/* Key takeaways */}
        <Reveal className="mt-8 rounded-2xl bg-brand-navy p-6 text-white sm:p-7">
          <h2 className="font-display text-lg font-bold">
            Key takeaways <span className="text-brand-gold">—</span>
          </h2>
          <ul className="mt-4 space-y-3">
            {video.takeaways.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-200 sm:text-base">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-gold" /> {t}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Detailed guide */}
        {video.guide && (
          <div className="mt-10">
            <p className="section-kicker">Detailed guide</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-brand-navy">
              A step-by-step guide to {video.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-700">{video.guide.intro}</p>
            <ol className="mt-6 space-y-5">
              {video.guide.steps.map((step, i) => (
                <li key={step.title} className="flex gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 font-display text-sm font-extrabold text-brand-goldDark">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-navy">{step.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {video.guide.faq && video.guide.faq.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-lg font-bold text-brand-navy">Questions, answered</h3>
                <div className="mt-4 space-y-4">
                  {video.guide.faq.map((item) => (
                    <div key={item.q} className="card p-5">
                      <p className="font-display text-[15px] font-bold text-brand-navy">{item.q}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {video.officialLink && (
              <p className="mt-8 text-sm leading-relaxed text-slate-700">
                Official website:{' '}
                <a
                  href={video.officialLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-navy underline decoration-brand-gold decoration-2 underline-offset-2 hover:text-brand-goldDark"
                >
                  {video.officialLink.label} <ExternalLink size={13} className="inline" />
                </a>
              </p>
            )}
            <WhatsAppCTA channel="main" showWebsiteLink={false} />
          </div>
        )}

        {/* Links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={youtubeUrl(video)} target="_blank" rel="noreferrer" className="btn-primary">
            <Youtube size={17} /> Watch on YouTube
          </a>
          {video.guideSlug && (
            <Link to={`/guides/${video.guideSlug}`} className="btn-outline">
              Read the written guide <ExternalLink size={14} />
            </Link>
          )}
        </div>

        {/* Previous / next */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
          {prev ? (
            <Link to={`/videos/${prev.slug}`} className="btn-outline max-w-full !px-4 !py-2 sm:max-w-[48%]">
              <ArrowLeft size={15} /> <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/videos/${next.slug}`} className="btn-primary max-w-full !px-4 !py-2 sm:max-w-[48%]">
              <span className="truncate">{next.title}</span> <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {/* Related */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="font-display text-xl font-bold text-brand-navy">More videos</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {fallbackRelated.map((v, i) => (
              <Reveal key={v.slug} delay={i}>
                <Link to={`/videos/${v.slug}`} className="card lift block overflow-hidden">
                  <div className="aspect-video overflow-hidden bg-brand-navy">
                    <img
                      src={`https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`}
                      alt={v.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-brand-goldDark">{v.category}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-brand-navy">{v.title}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
