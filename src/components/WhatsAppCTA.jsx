import { MessageCircle } from 'lucide-react'
import Reveal from './Reveal'
import SiteLogo, { SILogo } from './SiteLogo'

// Canonical channel links — single source of truth for every CTA on the site.
export const WHATSAPP_CHANNELS = {
  main: {
    label: 'CareerRadar — Main',
    link: 'https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X',
  },
  scholarships: {
    label: 'Scholarships & Internships',
    link: 'https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m',
  },
}

export const WEBSITE_URL = 'https://www.career-radar.space/'

// Shared call to action: follow the right WhatsApp channel + visit the website.
// Place at the end of every guide, video page, and post detail page.
export default function WhatsAppCTA({ channel = 'main', title = 'Never miss a post' }) {
  const ch = WHATSAPP_CHANNELS[channel] || WHATSAPP_CHANNELS.main
  return (
    <Reveal className="mt-10 rounded-2xl bg-brand-navy p-6 text-white sm:p-7">
      {channel === 'scholarships' ? (
        <SILogo className="h-12 w-12" />
      ) : (
        <SiteLogo variant="dark" className="h-12 w-12" />
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-5">
        <div className="max-w-xl">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
            Follow {ch.label} on WhatsApp for a new post every day — scholarships, internships, jobs, courses,
            and career guidance, delivered to you.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2.5 sm:items-end">
          <a href={ch.link} target="_blank" rel="noreferrer" className="btn-gold">
            <MessageCircle size={17} /> Follow on WhatsApp
          </a>
          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-brand-gold hover:underline"
          >
            Visit our website: {WEBSITE_URL}
          </a>
        </div>
      </div>
    </Reveal>
  )
}
