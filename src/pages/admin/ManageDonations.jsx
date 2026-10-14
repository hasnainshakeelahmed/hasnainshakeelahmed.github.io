import { useEffect, useState } from 'react'
import { HeartHandshake, Briefcase, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Admin inbox for donations + service requests: see every submission, mark
// donations confirmed, and move service requests through the pipeline.
export default function ManageDonations() {
  const [tab, setTab] = useState('donations')
  const [donations, setDonations] = useState([])
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: e }) => {
        if (!e) setDonations(data ?? [])
        else setError(e.message)
      })
    supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error: e }) => {
        if (!e) setRequests(data ?? [])
      })
  }

  useEffect(() => {
    load()
  }, [])

  const setDonationStatus = async (id, status) => {
    const { error: e } = await supabase.from('donations').update({ status }).eq('id', id)
    if (e) setError(e.message)
    else load()
  }
  const setRequestStatus = async (id, status) => {
    const { error: e } = await supabase.from('service_requests').update({ status }).eq('id', id)
    if (e) setError(e.message)
    else load()
  }

  const totalConfirmed = donations.filter((d) => d.status === 'confirmed').reduce((s, d) => s + Number(d.amount), 0)

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy">Donations & Service Requests</h1>
      <p className="mt-1 text-sm text-slate-500">
        PKR {totalConfirmed.toLocaleString()} confirmed in donations · {requests.filter((r) => r.status === 'new').length} new service requests.
      </p>

      <div className="mt-5 flex gap-1 rounded-full bg-slate-100 p-1 w-fit" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'donations'}
          onClick={() => setTab('donations')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            tab === 'donations' ? 'bg-brand-navy text-white' : 'text-slate-600'
          }`}
        >
          <HeartHandshake size={15} /> Donations ({donations.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === 'requests'}
          onClick={() => setTab('requests')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            tab === 'requests' ? 'bg-brand-navy text-white' : 'text-slate-600'
          }`}
        >
          <Briefcase size={15} /> Service requests ({requests.length})
        </button>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {tab === 'donations' ? (
        <div className="card mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold">Donor</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Frequency</th>
                <th className="px-5 py-3 font-semibold">Message</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-b border-slate-100 align-top last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-brand-navy">{d.donor_name}</p>
                    <p className="text-xs text-slate-500">{d.donor_email}</p>
                    <p className="text-xs text-slate-400">{new Date(d.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-brand-navy">
                    {d.currency} {Number(d.amount).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{d.frequency}</td>
                  <td className="max-w-[200px] px-5 py-3.5 text-slate-600">{d.message || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${d.status === 'confirmed' ? 'badge-green' : d.status === 'cancelled' ? 'badge-red' : 'badge-gold'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <a href={`mailto:${d.donor_email}`} className="mr-3 inline-flex items-center gap-1 font-semibold text-brand-navy hover:underline">
                      <Mail size={13} /> Email
                    </a>
                    {d.status === 'pending' && (
                      <button onClick={() => setDonationStatus(d.id, 'confirmed')} className="font-semibold text-emerald-600 hover:underline">
                        Mark received
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No donations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold">Requester</th>
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-5 py-3 font-semibold">Budget</th>
                <th className="px-5 py-3 font-semibold">Details</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 align-top last:border-0">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-brand-navy">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.email}</p>
                    <p className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{r.service}</td>
                  <td className="px-5 py-3.5 text-slate-600">{r.budget || '—'}</td>
                  <td className="max-w-[220px] px-5 py-3.5 text-slate-600">{r.details}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${r.status === 'done' ? 'badge-green' : r.status === 'in-progress' ? 'badge-gold' : 'badge-navy'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <a href={`mailto:${r.email}?subject=${encodeURIComponent(`Re: ${r.service} — Career Radar Services`)}`} className="mr-3 inline-flex items-center gap-1 font-semibold text-brand-navy hover:underline">
                      <Mail size={13} /> Reply
                    </a>
                    {r.status === 'new' && (
                      <button onClick={() => setRequestStatus(r.id, 'in-progress')} className="mr-3 font-semibold text-amber-600 hover:underline">
                        Start
                      </button>
                    )}
                    {r.status !== 'done' && (
                      <button onClick={() => setRequestStatus(r.id, 'done')} className="font-semibold text-emerald-600 hover:underline">
                        Mark done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No service requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
