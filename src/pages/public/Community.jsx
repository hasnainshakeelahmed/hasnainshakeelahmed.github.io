import { Link } from 'react-router-dom'
import { Users, MessagesSquare, GraduationCap, Briefcase, ArrowUpRight, HeartHandshake, ArrowRight } from 'lucide-react'
import Seo from '../../components/Seo'
import { COMMUNITY_CTA } from '../../data/siteContent'
import SiteLogo, { SILogo } from '../../components/SiteLogo'

const CHANNELS = [
  {
    icon: GraduationCap,
    logo: 'main',
    name: 'Career Radar — Main Channel',
    tag: 'Education',
    text: 'Premium educational posts: courses, study skills, edu updates, career guidance and ed-tech tools. Daily at 8:00 PM.',
    url: 'https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X',
  },
  {
    icon: Briefcase,
    logo: 'si',
    name: 'Career Radar — Scholarships & Internships',
    tag: 'Opportunities',
    text: 'A fresh verified opportunity every day — scholarships, internships and jobs, with a global-first mix. Daily at 4:00 PM.',
    url: 'https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m',
  },
]

const VALUES = [
  {
    icon: Users,
    title: 'Students first',
    text: 'Every post, tool and decision is judged by one question: does this help a student move forward?',
  },
  {
    icon: MessagesSquare,
    title: 'Help in public',
    text: 'Guidance shared openly helps more people than guidance locked behind paywalls.',
  },
  {
    icon: HeartHandshake,
    title: 'Pay it forward',
    text: 'Members who got help come back to help the next person. That is how the community grows.',
  },
]

export default function Community() {
  return (
    <div>
      <Seo
        title="Join the Career Radar Community"
        description="Join a global community of students, graduates, mentors and freelancers sharing verified scholarships, internships, jobs and honest career guidance every day."
        keywords="career radar community, whatsapp channel, scholarships community, students community"
      />
      <section className="bg-brand-navy py-16 text-white">
        <div className="container-x">
          <span className="badge bg-brand-gold/15 text-brand-gold">
            <Users size={14} /> Community
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            {COMMUNITY_CTA.heading}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">{COMMUNITY_CTA.text}</p>
        </div>
      </section>

      <section className="container-x py-14">
        <p className="section-kicker">Join the channels</p>
        <h2 className="section-title mt-1">Daily posts, straight to your WhatsApp</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {CHANNELS.map((c) => (
            <article key={c.name} className="card card-hover flex flex-col p-6">
              <div className="flex items-center justify-between">
                {c.logo === 'si' ? (
                  <SILogo className="h-11 w-11" />
                ) : c.logo === 'main' ? (
                  <SiteLogo variant="light" compact className="h-11 w-11" />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-goldDark">
                    <c.icon size={22} />
                  </span>
                )}
                <span className="badge badge-navy">{c.tag}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-brand-navy">{c.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{c.text}</p>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5 w-fit">
                Follow channel <ArrowUpRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="container-x">
          <p className="section-kicker">How we roll</p>
          <h2 className="section-title mt-1">Three rules of the community</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
                  <v.icon size={22} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-brand-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14 text-center">
        <h2 className="section-title">Want to do more than follow?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Join the volunteer team and help run the community — research,
          design, mentoring and more.
        </p>
        <Link to="/volunteer" className="btn-primary mt-6">
          Become a volunteer <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  )
}
