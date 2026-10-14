import { useState } from 'react'
import { HeartHandshake, CheckCircle2 } from 'lucide-react'

const ROLES = [
  'Content Research',
  'Graphic Design',
  'Video Editing',
  'Web Development',
  'Social Media',
  'Mentoring',
  'Community Management',
  'Other',
]

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: ROLES[0], message: '' })

  const submit = (e) => {
    e.preventDefault()
    // Design phase: form shows a success state. Functions phase wires this
    // to the volunteers table + admin review queue.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container-x py-20 text-center">
        <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
        <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy">Thank you, {form.name.split(' ')[0]}!</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Your volunteer application is in. Our team reviews every application
          and will reach out to you by email with next steps.
        </p>
      </div>
    )
  }

  return (
    <div className="container-x py-14">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <span className="badge badge-gold">
            <HeartHandshake size={14} /> Volunteer with us
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-brand-navy">
            Help students win. Grow yourself.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Career Radar runs on volunteers. You&apos;ll build real skills,
            real proof of work, and real connections — while helping thousands
            of students find opportunities they&apos;d never find alone.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-700">
            <li>✓ Flexible hours — a few hours a week, remote</li>
            <li>✓ Certificate of contribution for active volunteers</li>
            <li>✓ Learn by doing: research, design, code, mentoring</li>
            <li>✓ A global team that actually ships every week</li>
          </ul>
        </div>

        <form onSubmit={submit} className="card h-fit p-6">
          <h2 className="font-display text-lg font-bold text-brand-navy">Apply to volunteer</h2>
          <label className="label mt-5">Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            placeholder="Your name"
          />
          <label className="label mt-4">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
            placeholder="you@example.com"
          />
          <label className="label mt-4">Role you&apos;re interested in</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="select"
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <label className="label mt-4">Tell us about yourself</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="input min-h-[110px] resize-y"
            placeholder="Your skills, experience, and why you want to join…"
          />
          <button type="submit" className="btn-primary mt-5 w-full">
            Submit application
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            We read every application personally.
          </p>
        </form>
      </div>
    </div>
  )
}
