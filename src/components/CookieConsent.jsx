import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cookie } from 'lucide-react'

const KEY = 'cr-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true)
    } catch {
      setVisible(false)
    }
  }, [])

  const choose = (value) => {
    try {
      localStorage.setItem(KEY, value)
    } catch {
      // private mode — consent simply isn't persisted
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-cardHover backdrop-blur">
      <div className="container-x flex flex-wrap items-center justify-between gap-4">
        <p className="flex max-w-2xl items-start gap-2.5 text-sm leading-relaxed text-slate-600">
          <Cookie size={18} className="mt-0.5 shrink-0 text-brand-goldDark" />
          <span>
            We use cookies and local storage to keep you signed in and remember your preferences. See our{' '}
            <Link to="/privacy-policy" className="font-semibold text-brand-navy underline">
              Privacy Policy
            </Link>
            .
          </span>
        </p>
        <div className="flex gap-2">
          <button onClick={() => choose('essential')} className="btn-outline !px-4 !py-2">
            Essential only
          </button>
          <button onClick={() => choose('all')} className="btn-primary !px-4 !py-2">
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
