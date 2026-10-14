import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const TYPES = ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Remote']
const EMPTY = {
  title: '',
  company: '',
  location: '',
  type: 'Full-time',
  description: '',
  apply_url: '',
  contact: '',
  deadline: '',
  tags: '',
  is_featured: false,
  is_active: true,
}

export default function ManageJobs() {
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState(null) // null = list view, {} = add, {…job} = edit
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () =>
    supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setJobs(data ?? []))

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    setError('')
    setForm({ ...EMPTY })
  }
  const openEdit = (job) => {
    setError('')
    setForm({ ...job, tags: (job.tags ?? []).join(', '), deadline: job.deadline ?? '' })
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim() || null,
      type: form.type,
      description: form.description.trim() || null,
      apply_url: form.apply_url.trim() || null,
      contact: form.contact.trim() || null,
      deadline: form.deadline || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      is_featured: form.is_featured,
      is_active: form.is_active,
    }
    const res = form.id
      ? await supabase.from('jobs').update(payload).eq('id', form.id)
      : await supabase.from('jobs').insert([payload])
    setSaving(false)
    if (res.error) {
      setError(res.error.message)
      return
    }
    setForm(null)
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this job listing?')) return
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  if (form) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">
            {form.id ? 'Edit job' : 'Add job'}
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
              <label className="label">Company *</label>
              <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="select">
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Apply URL</label>
              <input value={form.apply_url} onChange={(e) => setForm({ ...form, apply_url: e.target.value })} className="input" />
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
              <label className="label">Contact</label>
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input" placeholder="react, remote, junior" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active (visible on the public Jobs page)
          </label>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add job'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">Manage Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">{jobs.length} listings in the database.</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add job
        </button>
      </div>
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Company</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Deadline</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-b border-slate-100 last:border-0">
                <td className="max-w-[240px] truncate px-5 py-3.5 font-medium text-brand-navy">{j.title}</td>
                <td className="px-5 py-3.5 text-slate-600">{j.company}</td>
                <td className="px-5 py-3.5 text-slate-600">{j.type}</td>
                <td className="px-5 py-3.5 text-slate-600">{j.deadline || '—'}</td>
                <td className="px-5 py-3.5">
                  <span className={`badge ${j.is_active ? 'badge-green' : 'badge-slate'}`}>
                    {j.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => openEdit(j)} className="mr-3 font-semibold text-brand-navy hover:underline">
                    Edit
                  </button>
                  <button onClick={() => remove(j.id)} className="font-semibold text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  No jobs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
