import { useState } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'cr-announce-dismissed'
const GROUP_LINK = 'https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m'

// Dismissible top banner inviting visitors to ask questions on WhatsApp.
// Matches the owner's reference: purple gradient, serif headline, white
// button, cross at the end. Dismissal persists in localStorage.
export default function AnnouncementBar() {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1'
    } catch {
      return true
    }
  })

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2.5 pr-10 text-center">
        <p className="font-serif text-base sm:text-lg">
          Ask Questions Directly on{' '}
          <a
            href={GROUP_LINK}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-brand-gold"
          >
            WhatsApp here.
          </a>
        </p>
        <a
          href={GROUP_LINK}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-white px-5 py-1.5 font-serif text-base font-bold text-slate-900 shadow transition-transform duration-200 hover:scale-105"
        >
          WhatsApp Broadcast Group
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
