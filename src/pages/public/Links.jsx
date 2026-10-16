import { Youtube, MessageCircle, Globe, Linkedin, Facebook, Instagram, ExternalLink, Newspaper } from 'lucide-react'
import Seo from '../../components/Seo'
import Reveal from '../../components/Reveal'
import SiteLogo, { SILogo } from '../../components/SiteLogo'

// Everywhere to find Career Radar. Only verified links are clickable —
// slots marked "coming soon" need the real URL before they go live.
const GROUPS = [
  {
    heading: 'Watch',
    links: [
      {
        icon: Youtube,
        label: 'YouTube — @CareerRadar',
        desc: 'Scholarships, career guidance, and the complete University of the People guide.',
        url: 'https://www.youtube.com/@CareerRadar',
      },
    ],
  },
  {
    heading: 'WhatsApp channels',
    links: [
      {
        icon: MessageCircle,
        logo: 'main',
        label: 'CareerRadar — Main',
        desc: 'Daily premium educational posts: courses, study skills, career guidance, ed-tech tools.',
        url: 'https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X',
      },
      {
        icon: MessageCircle,
        logo: 'si',
        label: 'Scholarships & Internships',
        desc: 'Daily opportunities: scholarships, internships, and jobs from around the world.',
        url: 'https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m',
      },
      {
        icon: Newspaper,
        label: 'Global Radar',
        desc: 'Short, sourced geopolitical news — separate brand, separate channel.',
        url: null,
      },
    ],
  },
  {
    heading: 'Follow',
    links: [
      { icon: Linkedin, label: 'LinkedIn', desc: 'Career Radar on LinkedIn.', url: null },
      { icon: Facebook, label: 'Facebook', desc: 'Career Radar on Facebook.', url: null },
      { icon: Instagram, label: 'Instagram', desc: 'Career Radar on Instagram.', url: null },
    ],
  },
  {
    heading: 'Website',
    links: [
      {
        icon: Globe,
        label: 'career-radar.space',
        desc: 'The full platform — opportunities, AI tools, certificates, and services.',
        url: 'https://www.career-radar.space/',
      },
    ],
  },
]

export default function Links() {
  return (
    <div className="container-x max-w-xl py-12">
      <Seo
        title="All Links — Career Radar"
        description="Every Career Radar link in one place: YouTube, WhatsApp channels, socials, and the website."
        keywords="career radar links, career radar socials, career radar whatsapp, career radar youtube"
      />
      <Reveal>
        <div className="flex flex-col items-center text-center">
          <SiteLogo variant="light" className="h-14 w-14" />
          <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy">Career Radar</h1>
          <p className="mt-1 text-sm text-slate-500">Find opportunities. Build your future.</p>
        </div>
      </Reveal>

      {GROUPS.map((group) => (
        <div key={group.heading} className="mt-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{group.heading}</h2>
          <div className="mt-3 space-y-3">
            {group.links.map((link, i) => (
              <Reveal key={link.label} delay={i}>
                {link.url ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="card lift flex items-center gap-4 p-4"
                  >
                    {link.logo === 'si' ? (
                      <SILogo className="h-11 w-11" />
                    ) : link.logo === 'main' ? (
                      <SiteLogo variant="light" compact className="h-11 w-11" />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
                        <link.icon size={20} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-base font-bold text-brand-navy">{link.label}</span>
                      <span className="block text-sm leading-snug text-slate-500">{link.desc}</span>
                    </span>
                    <ExternalLink size={16} className="shrink-0 text-slate-400" />
                  </a>
                ) : (
                  <div className="card flex items-center gap-4 p-4 opacity-70">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                      <link.icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-base font-bold text-brand-navy">{link.label}</span>
                      <span className="block text-sm leading-snug text-slate-500">{link.desc}</span>
                    </span>
                    <span className="badge badge-slate shrink-0">Link coming soon</span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
