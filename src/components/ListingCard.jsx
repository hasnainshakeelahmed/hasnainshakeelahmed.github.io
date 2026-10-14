import { Link } from 'react-router-dom'
import { MapPin, CalendarClock, ExternalLink, Share2 } from 'lucide-react'
import { format, differenceInDays, parseISO } from 'date-fns'

export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const d = parseISO(dateStr)
  const days = differenceInDays(new Date(), d)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  return format(d, 'MMM d, yyyy')
}

export function DeadlineBadge({ deadline }) {
  if (!deadline) return <span className="badge badge-slate">No deadline</span>
  const days = differenceInDays(parseISO(deadline), new Date())
  if (days < 0) return <span className="badge badge-red">Expired</span>
  if (days <= 7) return <span className="badge badge-red">Closing in {days}d</span>
  if (days <= 30) return <span className="badge badge-gold">Deadline {format(parseISO(deadline), 'MMM d, yyyy')}</span>
  return <span className="badge badge-slate">Deadline {format(parseISO(deadline), 'MMM d, yyyy')}</span>
}

export function ShareButton({ title, url }) {
  const share = async () => {
    const text = `${title} — via Career Radar`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
    window.open(waUrl, '_blank', 'noopener')
  }
  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-navy"
      title="Share on WhatsApp"
    >
      <Share2 size={14} /> Share
    </button>
  )
}

export function JobCard({ job }) {
  return (
    <article className="card card-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold leading-snug text-brand-navy">{job.title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{job.company}</p>
        </div>
        <span className="badge badge-navy shrink-0">{job.type}</span>
      </div>
      {job.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{job.description}</p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        {job.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> {job.location}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <CalendarClock size={13} /> {timeAgo(job.created_at)}
        </span>
      </div>
      {job.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="badge badge-slate">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <DeadlineBadge deadline={job.deadline} />
        <div className="flex items-center gap-1">
          <ShareButton title={job.title} url={job.apply_url || window.location.href} />
          {job.apply_url ? (
            <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn-primary !px-4 !py-2 !text-xs">
              Apply <ExternalLink size={13} />
            </a>
          ) : (
            <Link to="/jobs" className="btn-primary !px-4 !py-2 !text-xs">
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

export function ScholarshipCard({ item }) {
  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      {item.image_url && (
        <div className="h-40 overflow-hidden bg-brand-navySoft">
          <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-bold leading-snug text-brand-navy">{item.title}</h3>
          <span className="badge badge-gold shrink-0">{item.coverage}</span>
        </div>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {item.provider} · {item.country}
        </p>
        {item.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
        )}
        {item.eligibility && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
            <span className="font-semibold text-slate-700">Eligibility: </span>
            {item.eligibility}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <DeadlineBadge deadline={item.deadline} />
          <div className="flex items-center gap-1">
            <ShareButton title={item.title} url={item.apply_url} />
            <a href={item.apply_url} target="_blank" rel="noopener noreferrer" className="btn-primary !px-4 !py-2 !text-xs">
              Apply <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
