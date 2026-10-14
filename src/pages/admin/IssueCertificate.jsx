import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, CheckCircle2, AlertCircle } from 'lucide-react'
import { listTemplates, issueCertificate, certificateVerifyUrl } from '../../lib/certificates'

export default function IssueCertificate() {
  const [templates, setTemplates] = useState([])
  const [templateId, setTemplateId] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    title: 'Certificate of Achievement',
    description: '',
    achievement: '',
    issueDate: new Date().toISOString().slice(0, 10),
  })
  const [issuing, setIssuing] = useState(false)
  const [error, setError] = useState('')
  const [issued, setIssued] = useState(null)

  useEffect(() => {
    listTemplates()
      .then((t) => {
        setTemplates(t)
        if (t.length) setTemplateId(t[0].id)
      })
      .catch((e) => setError(e.message))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setIssued(null)
    setIssuing(true)
    try {
      const res = await issueCertificate({ ...form, templateId })
      setIssued(res)
      setForm({
        name: '',
        email: '',
        title: 'Certificate of Achievement',
        description: '',
        achievement: '',
        issueDate: new Date().toISOString().slice(0, 10),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIssuing(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy">Issue Certificate</h1>
      <p className="mt-1 text-sm text-slate-500">
        Email is required — it is how the certificate finds the recipient&apos;s profile. When the email matches an
        account, the certificate appears on their dashboard immediately.
      </p>

      {templates.length === 0 && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          No active certificate template found. Create one in the certificate templates section of the previous admin
          panel first — issuance needs a template design.
        </p>
      )}

      {issued && (
        <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p className="flex items-center gap-2 font-semibold">
            <CheckCircle2 size={16} /> Certificate issued: {issued.certificate.certificate_id}
          </p>
          <p className="mt-1">
            {issued.accountLinked
              ? 'The email matched an account — the certificate is on their dashboard now.'
              : 'No account uses this email yet. The certificate is issued to the email address; it will appear on their profile as soon as they sign up with it.'}
          </p>
          <Link
            to={certificateVerifyUrl(issued.certificate.certificate_id)}
            className="mt-2 inline-block font-semibold text-emerald-800 underline"
          >
            View verification page →
          </Link>
        </div>
      )}

      <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
        {error && (
          <p className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}
        <div>
          <label className="label">Template *</label>
          <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="select">
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.certificate_type})
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Recipient name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="Full name as it should appear"
            />
          </div>
          <div>
            <label className="label">Recipient email *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input"
              placeholder="The email their account uses"
            />
          </div>
        </div>
        <div>
          <label className="label">Certificate title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Achievement</label>
            <input
              value={form.achievement}
              onChange={(e) => setForm({ ...form, achievement: e.target.value })}
              className="input"
              placeholder="e.g. Completed the Full-Stack Bootcamp"
            />
          </div>
          <div>
            <label className="label">Issue date</label>
            <input
              type="date"
              value={form.issueDate}
              onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
              className="input"
            />
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input min-h-[80px]"
            placeholder="What this certificate recognizes…"
          />
        </div>
        <button type="submit" disabled={issuing || !templateId} className="btn-primary">
          <Award size={16} /> {issuing ? 'Issuing…' : 'Issue certificate'}
        </button>
      </form>
    </div>
  )
}
