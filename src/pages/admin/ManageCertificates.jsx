import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ShieldX } from 'lucide-react'
import { listAllCertificates, revokeCertificate, certificateVerifyUrl } from '../../lib/certificates'

export default function ManageCertificates() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [revoking, setRevoking] = useState(null)
  const [reason, setReason] = useState('')

  const load = () =>
    listAllCertificates()
      .then(setItems)
      .catch((e) => setError(e.message))

  useEffect(() => {
    load()
  }, [])

  const doRevoke = async (id) => {
    if (!reason.trim()) {
      setError('Enter a revocation reason first.')
      return
    }
    try {
      await revokeCertificate(id, reason)
      setRevoking(null)
      setReason('')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">Manage Certificates</h1>
          <p className="mt-1 text-sm text-slate-500">{items.length} certificates issued.</p>
        </div>
        <Link to="/admin/certificates/issue" className="btn-primary">
          <Plus size={16} /> Issue certificate
        </Link>
      </div>
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-semibold">Certificate ID</th>
              <th className="px-5 py-3 font-semibold">Recipient</th>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Issued</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3.5 font-mono text-xs font-semibold text-brand-navy">{c.certificate_id}</td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-brand-navy">{c.recipient_name}</p>
                  <p className="text-xs text-slate-500">{c.recipient_email || '—'}</p>
                </td>
                <td className="max-w-[220px] truncate px-5 py-3.5 text-slate-600">{c.certificate_title}</td>
                <td className="px-5 py-3.5 text-slate-600">
                  {c.issue_date ? new Date(c.issue_date).toLocaleDateString() : '—'}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`badge ${
                      c.status === 'valid' ? 'badge-green' : c.status === 'revoked' ? 'badge-red' : 'badge-gold'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <Link to={certificateVerifyUrl(c.certificate_id)} className="mr-3 font-semibold text-brand-navy hover:underline">
                    View
                  </Link>
                  {c.status === 'valid' && (
                    <button
                      onClick={() => setRevoking(revoking === c.id ? null : c.id)}
                      className="font-semibold text-red-600 hover:underline"
                    >
                      Revoke
                    </button>
                  )}
                  {revoking === c.id && (
                    <span className="mt-2 flex items-center gap-2">
                      <input
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Revocation reason (required)"
                        className="input !w-52 !py-1.5 !text-xs"
                      />
                      <button
                        onClick={() => doRevoke(c.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        <ShieldX size={13} /> Confirm
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  No certificates issued yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
