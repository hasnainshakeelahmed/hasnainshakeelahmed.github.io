import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const COVERAGES = ['Fully Funded', 'Partial Tuition', 'Monthly Stipend', 'Other']
const EMPTY = {
  title: '',
  provider: '',
  country: '',
  coverage: 'Fully Funded',
  deadline: '',
  description: '',
  eligibility: '',
  apply_url: '',
  image_url: '',
  is_active: true,
}

export default function ManageScholarships() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () =>
    supabase
      .from('scholarships')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setItems(data ?? []))

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    setError('')
    setForm({ ...EMPTY })
  }
  const openEdit = (s) => {
    setError('')
    setForm({ ...s, deadline: s.deadline ?? '' })
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      title: form.title.trim(),
      provider: form.provider.trim(),
      country: form.country.trim(),
      coverage: form.coverage,
      deadline: form.deadline || null,
      description: form.description.trim() || null,
      eligibility: form.eligibility.trim() || null,
      apply_url: form.apply_url.trim(),
      image_url: form.image_url.trim() || null,
      is_active: form.is_active,
    }
    const res = form.id
      ? await supabase.from('scholarships').update(payload).eq('id', form.id)
      : await supabase.from('scholarships').insert([payload])
    setSaving(false)
    if (res.error) {
      setError(res.error.message)
      return
    }
    setForm(null)
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this scholarship?')) return
    const { error } = await supabase.from('scholarships').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  if (form) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">
            {form.id ? 'Edit scholarship' : 'Add scholarship'}
          </h1>
          <button onClick={() => setForm(null)} className="btn-ghost">
            <X size={16} /> Cancel
          </button>
        </div>
        <form onSubmit={save} className="card mt-6 space-y-4 p-6">
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Provider *</label>
              <input required value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Country *</label>
              <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Coverage</label>
              <select value={form.coverage} onChange={(e) => setForm({ ...form, coverage: e.target.value })} className="select">
                {COVERAGES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Apply URL *</label>
              <input required value={form.apply_url} onChange={(e) => setForm({ ...form, apply_url: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Deadline</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input min-h-[100px]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Eligibility</label>
              <input value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Image URL</label>
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active (visible on the public Scholarships page)
          </label>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add scholarship'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">Manage Scholarships</h1>
          <p className="mt-1 text-sm text-slate-500">{items.length} scholarships in the database.</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add scholarship
        </button>
      </div>
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Provider</th>
              <th className="px-5 py-3 font-semibold">Country</th>
              <th className="px-5 py-3 font-semibold">Coverage</th>
              <th className="px-5 py-3 font-semibold">Deadline</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 last:border-0">
                <td className="max-w-[240px] truncate px-5 py-3.5 font-medium text-brand-navy">{s.title}</td>
                <td className="px-5 py-3.5 text-slate-600">{s.provider}</td>
                <td className="px-5 py-3.5 text-slate-600">{s.country}</td>
                <td className="px-5 py-3.5 text-slate-600">{s.coverage}</td>
                <td className="px-5 py-3.5 text-slate-600">{s.deadline || '—'}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => openEdit(s)} className="mr-3 font-semibold text-brand-navy hover:underline">
                    Edit
                  </button>
                  <button onClick={() => remove(s.id)} className="font-semibold text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  No scholarships yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
