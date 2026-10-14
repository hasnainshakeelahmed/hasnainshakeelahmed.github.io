import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Search,
  Award,
  Calendar,
  User,
  Download,
  Loader2,
} from 'lucide-react'
import Seo from '../../components/Seo'
import { verifyCertificate, getCertificatePdfUrl, certificateVerifyUrl } from '../../lib/certificates'

const PRESENTATION = {
  valid: {
    Icon: ShieldCheck,
    heading: 'Valid certificate',
    blurb: 'This certificate is authentic and currently valid.',
    ring: 'border-emerald-200 bg-emerald-50',
    text: 'text-emerald-700',
  },
  revoked: {
    Icon: ShieldX,
    heading: 'Revoked certificate',
    blurb: 'This certificate is no longer valid.',
    ring: 'border-red-200 bg-red-50',
    text: 'text-red-700',
  },
  superseded: {
    Icon: ShieldAlert,
    heading: 'Replaced certificate',
    blurb: 'This certificate was replaced by a newer version.',
    ring: 'border-amber-200 bg-amber-50',
    text: 'text-amber-700',
  },
}

export default function VerifyCertificate() {
  const { token } = useParams()
  const [input, setInput] = useState(token || '')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState('')

  const verify = useCallback(
    async (ref) => {
      const value = (ref ?? input).trim()
      if (!value) return
      setLoading(true)
      setError('')
      setResult(null)
      try {
        const res = await verifyCertificate(value)
        setResult(res)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    },
    [input],
  )

  useEffect(() => {
    if (token) verify(token)
  }, [token, verify])

  const downloadPdf = async () => {
    if (!result?.certificate?.id) return
    setPdfLoading(true)
    setPdfError('')
    try {
      const url = await getCertificatePdfUrl(result.certificate.id)
      window.open(url, '_blank', 'noopener')
    } catch (e) {
      setPdfError(e.message)
    } finally {
      setPdfLoading(false)
    }
  }

  const cert = result?.certificate
  const status = (result?.status || cert?.status || 'valid').toLowerCase()
  const tone = PRESENTATION[status] || PRESENTATION.valid

  return (
    <div className="container-x max-w-2xl py-14">
      <Seo
        title="Verify Certificate"
        description="Verify a Career Radar certificate instantly. Enter the certificate ID or scan the QR code to confirm authenticity."
        keywords="verify certificate, career radar certificate verification, certificate check"
      />
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navy text-brand-gold">
          <Award size={24} />
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy">Verify a Certificate</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter the certificate ID (e.g. CR-2026-000001) or open a verification link from a QR code.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          verify()
        }}
        className="card mt-8 flex items-center gap-2 p-3"
      >
        <Search size={18} className="ml-2 shrink-0 text-slate-400" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Certificate ID, e.g. CR-2026-000001"
          className="flex-1 border-0 bg-transparent px-1 py-2 text-sm focus:outline-none"
        />
        <button type="submit" disabled={loading} className="btn-primary !px-5 !py-2.5">
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Verify'}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">{error}</p>
      )}

      {cert && (
        <div className="mt-6">
          <div className={`rounded-2xl border p-6 text-center sm:p-8 ${tone.ring}`}>
            <tone.Icon size={36} className={`mx-auto ${tone.text}`} />
            <h2 className={`mt-3 font-display text-2xl font-bold ${tone.text}`}>{tone.heading}</h2>
            <p className="mt-1 text-sm text-slate-600">{tone.blurb}</p>
            <p className="mt-4 inline-block rounded-lg bg-white px-3 py-1.5 font-mono text-sm text-slate-700 shadow-sm">
              {cert.certificate_id}
            </p>
          </div>

          <div className="card mt-5 p-6">
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <User size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-400">Recipient</dt>
                  <dd className="font-semibold text-brand-navy">{cert.recipient_name}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-400">Certificate</dt>
                  <dd className="font-semibold text-brand-navy">{cert.certificate_title}</dd>
                  {cert.achievement && <dd className="mt-0.5 text-slate-600">{cert.achievement}</dd>}
                  {cert.description && <dd className="mt-0.5 text-slate-600">{cert.description}</dd>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-400">Issued</dt>
                  <dd className="font-semibold text-brand-navy">
                    {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : '—'} · {cert.organization_name || 'Career Radar'}
                  </dd>
                </div>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
              <button onClick={downloadPdf} disabled={pdfLoading} className="btn-primary !px-4 !py-2">
                <Download size={15} /> {pdfLoading ? 'Preparing PDF…' : 'Download PDF'}
              </button>
              <Link to={certificateVerifyUrl(cert.certificate_id)} className="btn-outline !px-4 !py-2">
                Copy verification link
              </Link>
            </div>
            {pdfError && <p className="mt-3 text-sm text-red-600">{pdfError}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
