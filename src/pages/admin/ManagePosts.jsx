import { useEffect, useState } from 'react'
import { Plus, X, Upload } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const CHANNELS = [
  { value: 'scholarships', label: 'Scholarships & Internships' },
  { value: 'main', label: 'Main channel' },
]

const EMPTY = {
  channel: 'scholarships',
  category: '',
  title: '',
  description: '',
  image_url: '',
  post_url: '',
  published_at: new Date().toISOString().slice(0, 10),
  is_published: true,
}

export default function ManagePosts() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = () =>
    supabase
      .from('channel_posts')
      .select('*')
      .order('published_at', { ascending: false })
      .then(({ data }) => setPosts(data ?? []))

  useEffect(() => {
    load()
  }, [])

  const uploadImage = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: upErr } = await supabase.storage.from('channel-posts').upload(path, file, {
        contentType: file.type,
        upsert: false,
      })
      if (upErr) throw upErr
      const {
        data: { publicUrl },
      } = supabase.storage.from('channel-posts').getPublicUrl(path)
      setForm((f) => ({ ...f, image_url: publicUrl }))
    } catch (e) {
      setError(`Image upload failed: ${e.message}`)
    } finally {
      setUploading(false)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      channel: form.channel,
      category: form.category.trim() || null,
      title: form.title.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      post_url: form.post_url.trim() || null,
      published_at: form.published_at || new Date().toISOString().slice(0, 10),
      is_published: form.is_published,
    }
    const res = form.id
      ? await supabase.from('channel_posts').update(payload).eq('id', form.id)
      : await supabase.from('channel_posts').insert([{ ...payload, created_by: (await supabase.auth.getUser()).data.user?.id }])
    setSaving(false)
    if (res.error) {
      setError(res.error.message)
      return
    }
    setForm(null)
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this post?')) return
    const { error } = await supabase.from('channel_posts').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  if (form) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">{form.id ? 'Edit post' : 'New post'}</h1>
          <button onClick={() => setForm(null)} className="btn-ghost">
            <X size={16} /> Cancel
          </button>
        </div>
        <form onSubmit={save} className="card mt-6 space-y-4 p-6">
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Channel *</label>
              <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className="select">
                {CHANNELS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
                placeholder="Scholarship, Course, Career Guidance…"
              />
            </div>
          </div>
          <div>
            <label className="label">Title *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input min-h-[100px]"
              placeholder="The full post text / caption…"
            />
          </div>
          <div>
            <label className="label">Post image</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 text-center hover:border-brand-navy">
              {form.image_url ? (
                <img src={form.image_url} alt="Post preview" className="max-h-40 rounded-lg object-cover" />
              ) : (
                <>
                  <Upload size={22} className="text-brand-goldDark" />
                  <span className="mt-2 text-sm font-medium text-brand-navy">
                    {uploading ? 'Uploading…' : 'Upload an image'}
                  </span>
                  <span className="text-xs text-slate-400">PNG, JPG or WEBP</span>
                </>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => uploadImage(e.target.files?.[0])}
              />
            </label>
            <input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              className="input mt-2"
              placeholder="Or paste an image URL"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Link to the post</label>
              <input
                value={form.post_url}
                onChange={(e) => setForm({ ...form, post_url: e.target.value })}
                className="input"
                placeholder="WhatsApp channel link or source URL"
              />
            </div>
            <div>
              <label className="label">Published date</label>
              <input
                type="date"
                value={form.published_at}
                onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            Published (visible on the public Posts page)
          </label>
          <button type="submit" disabled={saving || uploading} className="btn-primary">
            {saving ? 'Saving…' : form.id ? 'Save changes' : 'Publish post'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-brand-navy">Manage Channel Posts</h1>
          <p className="mt-1 text-sm text-slate-500">{posts.length} posts in the archive.</p>
        </div>
        <button onClick={() => setForm({ ...EMPTY })} className="btn-primary">
          <Plus size={16} /> New post
        </button>
      </div>
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Channel</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0">
                <td className="max-w-[260px] truncate px-5 py-3.5 font-medium text-brand-navy">{p.title}</td>
                <td className="px-5 py-3.5 text-slate-600">
                  {p.channel === 'scholarships' ? 'Scholarships & Internships' : 'Main'}
                </td>
                <td className="px-5 py-3.5 text-slate-600">{p.published_at}</td>
                <td className="px-5 py-3.5">
                  <span className={`badge ${p.is_published ? 'badge-green' : 'badge-slate'}`}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setForm({ ...p })} className="mr-3 font-semibold text-brand-navy hover:underline">
                    Edit
                  </button>
                  <button onClick={() => remove(p.id)} className="font-semibold text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                  No posts yet — create the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
