import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { getSiteSettings, SETTING_DEFAULTS } from '../lib/siteSettings'

const STORAGE_KEY = 'cr-announce-dismissed'

// Dismissible top banner. Text, button and link are editable from
// /admin/settings (site_settings table); falls back to defaults.
export default function AnnouncementBar() {
  const [settings, setSettings] = useState(SETTING_DEFAULTS)
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1'
    } catch {
      return true
    }
  })

  useEffect(() => {
    getSiteSettings().then(setSettings)
  }, [])

  if (!visible || settings.announce_enabled !== 'true') return null

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const link = settings.announce_button_url || SETTING_DEFAULTS.announce_button_url

  return (
    <div className="relative bg-gradient-to-r from-brand-navy via-brand-navyLight to-brand-navy text-white">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2.5 pr-10 text-center">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="font-serif text-base underline underline-offset-2 hover:text-brand-gold sm:text-lg"
        >
          {settings.announce_text}
        </a>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-white px-5 py-1.5 font-serif text-base font-bold text-slate-900 shadow transition-transform duration-200 hover:scale-105"
        >
          {settings.announce_button_label}
        </a>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  )
}
