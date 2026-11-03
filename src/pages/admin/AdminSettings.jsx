import { useEffect, useState } from 'react'
import { Save, Megaphone, Share2, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { SETTING_DEFAULTS, clearSiteSettingsCache } from '../../lib/siteSettings'

const ANNOUNCE_FIELDS = [
  { key: 'announce_text', label: 'Banner text', placeholder: 'Ask Questions Directly on WhatsApp here.' },
  { key: 'announce_button_label', label: 'Button label', placeholder: 'WhatsApp Broadcast Group' },
  { key: 'announce_button_url', label: 'Button link', placeholder: 'https://…' },
]

const SOCIAL_FIELDS = [
  { key: 'social_youtube', label: 'YouTube URL' },
  { key: 'social_linkedin', label: 'LinkedIn URL' },
  { key: 'social_instagram', label: 'Instagram URL' },
  { key: 'social_facebook', label: 'Facebook URL (leave empty to hide)' },
]

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? 'bg-brand-navy' : 'bg-slate-300'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`}
      />
    </button>
  )
}

export default function AdminSettings() {
  const [values, setValues] = useState(SETTING_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [saving, setSaving] = useState(null)
  const [notice, setNotice] = useState(null)

  const load = async () => {
    setLoading(true)
    setTableMissing(false)
    try {
      const { data, error } = await supabase.from('site_settings').select('key, value')
      if (error) throw error
      const next = { ...SETTING_DEFAULTS }
      for (const row of data ?? []) next[row.key] = row.value ?? ''
      setValues(next)
    } catch (e) {
      // PGRST205 / 42P01 = table doesn't exist yet (migration not run)
      setTableMissing(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (keys, sectionName) => {
    setSaving(sectionName)
    setNotice(null)
    try {
      for (const key of keys) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value: values[key] ?? '', updated_at: new Date().toISOString() }, { onConflict: 'key' })
        if (error) throw error
      }
      clearSiteSettingsCache()
      setNotice({ type: 'ok', text: `${sectionName} saved — live on the site now.` })
    } catch (e) {
      setNotice({ type: 'error', text: `Could not save: ${e.message}` })
    } finally {
      setSaving(null)
    }
  }

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-navy">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Control what visitors see — no code changes needed.</p>

      {notice && (
        <div
          className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${
            notice.type === 'ok'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {notice.type === 'ok' ? <CheckCircle2 size={17} className="mt-0.5 shrink-0" /> : <AlertTriangle size={17} className="mt-0.5 shrink-0" />}
          {notice.text}
        </div>
      )}

      {tableMissing && !loading && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="flex items-center gap-2 font-bold">
            <AlertTriangle size={17} /> One-time setup needed
          </p>
          <p className="mt-2">
            The <code className="rounded bg-amber-100 px-1">site_settings</code> table doesn't exist yet. Run this file
            once in the Supabase SQL editor, then press Retry:
          </p>
          <p className="mt-1 font-mono text-xs">supabase/migrations/202611030001_site_settings.sql</p>
          <button onClick={load} className="btn-outline mt-3 !px-4 !py-2 text-sm">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-4">
          <div className="skeleton h-48 w-full" />
          <div className="skeleton h-48 w-full" />
        </div>
      ) : (
        <>
          {/* Announcement bar */}
          <div className="card mt-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
                <Megaphone size={18} className="text-brand-goldDark" /> Announcement bar
              </h2>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600">
                <Toggle on={values.announce_enabled === 'true'} onChange={(on) => setValues((v) => ({ ...v, announce_enabled: on ? 'true' : 'false' }))} />
                {values.announce_enabled === 'true' ? 'Shown' : 'Hidden'}
              </label>
            </div>

            {/* Live preview */}
            <div className="mt-4 overflow-hidden rounded-xl">
              <div className="bg-gradient-to-r from-brand-navy via-brand-navyLight to-brand-navy px-4 py-2.5 text-center text-white">
                <p className="font-serif text-base">
                  <span className="underline underline-offset-2">{values.announce_text || <span className="text-white/50">Banner text…</span>}</span>
                </p>
                <span className="mt-1.5 inline-block rounded-md bg-white px-4 py-1 font-serif text-sm font-bold text-slate-900">
                  {values.announce_button_label || 'Button'}
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {ANNOUNCE_FIELDS.map((f) => (
                <div key={f.key} className={f.key === 'announce_button_url' ? 'sm:col-span-2' : ''}>
                  <label className="label">{f.label}</label>
                  <input value={values[f.key]} onChange={set(f.key)} placeholder={f.placeholder} className="input" />
                </div>
              ))}
            </div>
            <button
              onClick={() => save(['announce_enabled', ...ANNOUNCE_FIELDS.map((f) => f.key)], 'Announcement bar')}
              disabled={saving || tableMissing}
              className="btn-primary mt-4 !px-5 !py-2 text-sm disabled:opacity-50"
            >
              <Save size={15} /> {saving === 'Announcement bar' ? 'Saving…' : 'Save announcement bar'}
            </button>
          </div>

          {/* Social links */}
          <div className="card mt-6 p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
              <Share2 size={18} className="text-brand-goldDark" /> Social links
            </h2>
            <p className="mt-1 text-sm text-slate-500">These icons appear in the navbar. Empty = hidden.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {SOCIAL_FIELDS.map((f) => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <input value={values[f.key]} onChange={set(f.key)} placeholder="https://…" className="input" inputMode="url" />
                </div>
              ))}
            </div>
            <button
              onClick={() => save(SOCIAL_FIELDS.map((f) => f.key), 'Social links')}
              disabled={saving || tableMissing}
              className="btn-primary mt-4 !px-5 !py-2 text-sm disabled:opacity-50"
            >
              <Save size={15} /> {saving === 'Social links' ? 'Saving…' : 'Save social links'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
