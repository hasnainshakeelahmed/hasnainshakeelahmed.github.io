import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Handshake, CheckCircle2, Megaphone, GraduationCap, Building2 } from 'lucide-react'

const OPTIONS = [
  {
    icon: Megaphone,
    title: 'Sponsored posts',
    text: 'Put your opportunity, course or product in front of a global student audience on our channels and site.',
  },
  {
    icon: GraduationCap,
    title: 'Scholarship & program features',
    text: 'Universities and foundations: feature your scholarship with a dedicated guide and video walkthrough.',
  },
  {
    icon: Building2,
    title: 'Hiring & internships',
    text: 'Reach motivated students and fresh graduates for internships, junior roles and freelance gigs.',
  },
]

const TYPES = ['Sponsored post', 'Scholarship feature', 'Hiring / internship', 'Ad placement', 'Other']

export default function Partner() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', org: '', email: '', type: TYPES[0], message: '' })

  const submit = (e) => {
    e.preventDefault()
    // Design phase: success state. Functions phase sends this to the team inbox.
    setSubmitted(true)
  }

  return (
    <div className="container-x py-14">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <span className="badge badge-gold">
            <Handshake size={14} /> Partner with us
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-brand-navy">
            Reach the students the world is looking for.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Career Radar is a global student community with daily WhatsApp
            channels, a growing website, and a YouTube channel. If your
            mission is helping students — scholarships, learning, careers —
            let&apos;s work together.
          </p>
          <div className="mt-8 space-y-5">
            {OPTIONS.map((o) => (
              <div key={o.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-goldDark">
                  <o.icon size={22} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-brand-navy">{o.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{o.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {submitted ? (
          <div className="card flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle2 size={44} className="text-emerald-500" />
            <h2 className="mt-3 font-display text-xl font-bold text-brand-navy">Request received</h2>
            <p className="mt-1 text-sm text-slate-600">
              Thank you, {form.name.split(' ')[0]}. Our team will reply to {form.email} shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="card h-fit p-6">
            <h2 className="font-display text-lg font-bold text-brand-navy">Start a collaboration</h2>
            <label className="label mt-5">Your name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Your name" />
            <label className="label mt-4">Organization</label>
            <input required value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} className="input" placeholder="Company / university / NGO" />
            <label className="label mt-4">Work email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="you@organization.com" />
            <label className="label mt-4">Collaboration type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="select">
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <label className="label mt-4">Tell us about it</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input min-h-[100px] resize-y" placeholder="What would you like to do together?" />
            <button type="submit" className="btn-primary mt-5 w-full">
              Send request
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">We reply to every serious proposal.</p>
          </form>
        )}
      </div>
    </div>
  )
}
