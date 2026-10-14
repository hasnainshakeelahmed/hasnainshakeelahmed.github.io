import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Monitor, PenTool, Clapperboard, FileText, Share2, PenLine, CheckCircle2, ArrowRight } from 'lucide-react'
import Seo from '../../components/Seo'
import Reveal from '../../components/Reveal'
import { supabase } from '../../lib/supabase'

const SERVICES = [
  {
    icon: Monitor,
    name: 'Website Design & Development',
    desc: 'Landing pages, portfolios, and full websites — designed and built by vetted members of the Career Radar community.',
    points: ['Portfolio & business websites', 'Landing pages that convert', 'Speed + mobile-first builds'],
  },
  {
    icon: PenTool,
    name: 'Graphic Design & Branding',
    desc: 'Logos, brand kits, social media designs, thumbnails, and pitch decks with a clean, professional look.',
    points: ['Logos & brand identity', 'Social media kits', 'Pitch decks & presentations'],
  },
  {
    icon: Clapperboard,
    name: 'Video Editing & YouTube',
    desc: 'Shorts, long-form edits, thumbnails, and channel setup — from people who produce content every week.',
    points: ['Shorts & reels', 'Long-form editing', 'Thumbnails & titles'],
  },
  {
    icon: FileText,
    name: 'CV & LinkedIn Optimization',
    desc: 'CVs rewritten by people who review hundreds of them — plus LinkedIn profiles that actually get replies.',
    points: ['ATS-friendly CV rewrite', 'LinkedIn headline & About', 'Cover letters'],
  },
  {
    icon: Share2,
    name: 'Social Media Management',
    desc: 'Content calendars, posting, and growth for your brand or society page — handled end to end.',
    points: ['Content calendars', 'Design + captions', 'Growth strategy'],
  },
  {
    icon: PenLine,
    name: 'Content & Copywriting',
    desc: 'Articles, scripts, captions, and website copy written to sound human and sell the idea.',
    points: ['Blog & SEO articles', 'Video scripts', 'Website copy'],
  },
]

const BUDGETS = ['Under PKR 10,000', 'PKR 10,000 – 25,000', 'PKR 25,000 – 50,000', 'PKR 50,000+', 'Not sure yet']

export default function Services() {
  const [form, setForm] = useState({ name: '', email: '', service: SERVICES[0].name, budget: BUDGETS[0], details: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Please enter your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Please enter a valid email.')
    if (!form.details.trim()) return setError('Tell us a little about what you need.')
    setSaving(true)
    const { error: insertError } = await supabase.from('service_requests').insert([
      {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        service: form.service,
        budget: form.budget,
        details: form.details.trim(),
        status: 'new',
      },
    ])
    setSaving(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="container-x py-10">
      <Seo
        title="Services — Get the Work You Need"
        description="Need a website, logo, video edit, CV rewrite, or content? Career Radar's community of skilled students and freelancers gets it done."
        keywords="career radar services, website design, graphic design, video editing, cv writing, freelancers"
      />
      <Reveal>
        <div className="max-w-2xl">
          <p className="section-kicker">Career Radar Services</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-brand-navy sm:text-4xl">
            Need work done? Our community gets it done.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
            Career Radar is a community of thousands of skilled students and young professionals — designers,
            developers, editors, writers, and marketers. Tell us what you need and we match you with the right
            person, at a fair student-friendly price.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.name} delay={i % 3}>
            <div className="card lift flex h-full flex-col p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-brand-gold">
                <s.icon size={20} />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold text-brand-navy">{s.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={15} className="shrink-0 text-emerald-500" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-navy">How it works</h2>
            <ol className="mt-5 space-y-5">
              {[
                ['Tell us what you need', 'Fill in the form — service, budget range, and details. Takes two minutes.'],
                ['We match you', 'Our team finds the right community member for your project and confirms the scope and price.'],
                ['You get the work', 'Review the delivery, ask for revisions, and pay only for work you approve.'],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy font-display text-sm font-bold text-brand-gold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-display text-base font-bold text-brand-navy">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Want to offer your skills instead?{' '}
              <Link to="/volunteer" className="font-semibold text-brand-navy underline">
                Join as a volunteer
              </Link>{' '}
              and get matched to paid work.
            </p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          {submitted ? (
            <div className="card p-6 text-center">
              <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
              <h3 className="mt-3 font-display text-xl font-bold text-brand-navy">Request received!</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                Thank you, {form.name.split(' ')[0]}. Our team will email <strong>{form.email}</strong> shortly
                with the match and a quote for your <strong>{form.service}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="card p-6">
              <h3 className="font-display text-lg font-bold text-brand-navy">Request a service</h3>
              {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Your name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Service needed *</label>
                  <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="select">
                    {SERVICES.map((s) => (
                      <option key={s.name}>{s.name}</option>
                    ))}
                    <option>Something else</option>
                  </select>
                </div>
                <div>
                  <label className="label">Budget range</label>
                  <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="select">
                    {BUDGETS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="label mt-4">Project details *</label>
              <textarea
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                className="input min-h-[110px]"
                placeholder="What do you need? Deadline, style, references, anything that helps us match you well…"
                required
              />
              <button type="submit" disabled={saving} className="btn-primary mt-5 w-full">
                {saving ? 'Sending…' : 'Request this service'} <ArrowRight size={15} />
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                We reply by email — usually within a day.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  )
}
