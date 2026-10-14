import { useState } from 'react'
import { HeartHandshake, CheckCircle2, Zap, Users, Globe2, Mail, Copy, Check, Smartphone, Landmark, Bitcoin } from 'lucide-react'
import Seo from '../../components/Seo'
import Reveal from '../../components/Reveal'
import { supabase } from '../../lib/supabase'

const PAYMENT_METHODS = ['Easypaisa', 'Nayapay', 'Raast', 'Binance', 'Askari Bank']

// Payment details the founder asked to publish on this page.
const RAAT_ID = '03275878584'

function PaymentMethods() {
  const [copied, setCopied] = useState('')
  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(value)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      // clipboard unavailable — the number is visible to copy manually
    }
  }
  const rows = [
    { icon: Smartphone, name: 'Easypaisa', detail: `Send to ${RAAT_ID}`, copyValue: RAAT_ID },
    { icon: Smartphone, name: 'Nayapay', detail: `Send to ${RAAT_ID}`, copyValue: RAAT_ID },
    { icon: Smartphone, name: 'Raast', detail: `Raast ID: ${RAAT_ID}`, copyValue: RAAT_ID },
    { icon: Bitcoin, name: 'Binance', detail: 'For international donors — message us for the Binance Pay ID.', copyValue: null },
    {
      icon: Landmark,
      name: 'Askari Bank',
      detail: 'Account title: Hasnain Shakeel Ahmed. Account details coming soon.',
      copyValue: null,
    },
  ]
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-display text-base font-bold text-brand-navy">How to pay</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Send your donation with any method below, then our team confirms it. Use your name as the reference where possible.
      </p>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-goldDark">
              <r.icon size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-brand-navy">{r.name}</span>
              <span className="block text-xs leading-relaxed text-slate-500">{r.detail}</span>
            </span>
            {r.copyValue && (
              <button
                type="button"
                onClick={() => copy(r.copyValue)}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                {copied === r.copyValue ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied === r.copyValue ? 'Copied' : 'Copy'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
const AMOUNTS = [1000, 2500, 5000, 10000]

const IMPACT = [
  { icon: Zap, text: 'Keeps the site fast, online and free for every student.' },
  { icon: Users, text: 'Funds volunteer tools, certificates and community events.' },
  { icon: Globe2, text: 'Grows the radar to more countries, languages and opportunities.' },
]

export default function Donate() {
  const [amount, setAmount] = useState(AMOUNTS[1])
  const [custom, setCustom] = useState('')
  const [frequency, setFrequency] = useState('one-time')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [payMethod, setPayMethod] = useState('Easypaisa')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(null)

  const finalAmount = Number(custom || amount)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Please enter your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Please enter a valid email.')
    if (!finalAmount || finalAmount < 100) return setError('Minimum donation is PKR 100.')
    setSaving(true)
    const { data, error: insertError } = await supabase
      .from('donations')
      .insert([
        {
          donor_name: name.trim(),
          donor_email: email.trim().toLowerCase(),
          amount: finalAmount,
          currency: 'PKR',
          frequency,
          message: message.trim() || null,
          payment_method: payMethod,
          status: 'pending',
        },
      ])
      .select('id')
      .single()
    setSaving(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setSubmitted({ ...data, amount: finalAmount, frequency })
  }

  if (submitted) {
    return (
      <div className="container-x max-w-xl py-20 text-center">
        <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
        <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy">Thank you, {name.split(' ')[0]}!</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Your {submitted.frequency === 'monthly' ? 'monthly' : 'one-time'} support of{' '}
          <strong>PKR {submitted.amount.toLocaleString()}</strong> is recorded. Complete it with any method below —
          our team confirms it once received.
        </p>
        <div className="mt-6 text-left">
          <PaymentMethods />
        </div>
        <p className="mx-auto mt-4 flex max-w-md items-center justify-center gap-1.5 text-sm text-slate-500">
          <Mail size={14} /> Questions? Write to us — we reply to every donor.
        </p>
      </div>
    )
  }

  return (
    <div className="container-x py-14">
      <Seo
        title="Donate — Support Career Radar"
        description="Keep Career Radar free for every student. Donate once or monthly to fund verified opportunities, certificates, and community programs."
        keywords="donate career radar, support career radar, student community donations"
      />
      <div className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <div>
            <span className="badge badge-gold">
              <HeartHandshake size={14} /> Support Career Radar
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-brand-navy">
              Keep the radar free for every student.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Career Radar is free for students — and always will be. Your support keeps the servers running, the
              content verified, and the community growing.
            </p>
            <ul className="mt-6 space-y-4">
              {IMPACT.map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-goldDark">
                    <item.icon size={18} />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
              How it works: pick an amount and a payment method, submit the form, then send your donation with
              the details on this page. Our team confirms it once received. Card checkout activates once a
              payment provider is connected — nothing is charged on this page.
            </p>
            <div className="mt-4">
              <PaymentMethods />
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <form onSubmit={submit} className="card h-fit p-6">
            <h2 className="font-display text-lg font-bold text-brand-navy">Choose an amount (PKR)</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFrequency('one-time')}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  frequency === 'one-time' ? 'border-brand-navy bg-brand-navy text-white' : 'border-slate-300 text-slate-700'
                }`}
              >
                One-time
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  frequency === 'monthly' ? 'border-brand-navy bg-brand-navy text-white' : 'border-slate-300 text-slate-700'
                }`}
              >
                Monthly
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setAmount(a)
                    setCustom('')
                  }}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                    amount === a && !custom
                      ? 'border-brand-navy bg-brand-navy text-white'
                      : 'border-slate-300 text-slate-700 hover:border-brand-navy'
                  }`}
                >
                  {a.toLocaleString()}
                </button>
              ))}
            </div>
            <label className="label mt-4">Or enter a custom amount</label>
            <input
              type="number"
              min="100"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="input"
              placeholder="e.g. 7500"
            />
            <label className="label mt-4">Your name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Full name" required />
            <label className="label mt-4">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
              required
            />
            <label className="label mt-4">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input min-h-[70px]"
              placeholder="Why are you supporting Career Radar?"
            />
            <label className="label mt-4">How will you pay? *</label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPayMethod(m)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                    payMethod === m ? 'border-brand-navy bg-brand-navy text-white' : 'border-slate-300 text-slate-700 hover:border-brand-navy'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button type="submit" disabled={saving} className="btn-primary mt-5 w-full">
              {saving ? 'Saving…' : `Support with PKR ${finalAmount ? finalAmount.toLocaleString() : '—'}`}
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">
              We only use your email to send payment details and a thank-you.
            </p>
          </form>
        </Reveal>
      </div>
    </div>
  )
}
