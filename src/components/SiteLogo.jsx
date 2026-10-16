import { useState } from 'react'
import { Radar } from 'lucide-react'

// Official CareerRadar logo (user-supplied artwork, used as-is).
// light -> white badge (light backgrounds), dark -> black badge (dark backgrounds).
// The artwork is a square badge, so it is rendered circular (rounded-full +
// object-cover) to show only the badge. If the image file is missing (e.g.
// before the logo files are uploaded), fall back to the previous icon +
// wordmark so the header never renders broken.
const SOURCES = {
  light: '/images/logo-light.png',
  dark: '/images/logo-dark.png',
}

export default function SiteLogo({ variant = 'light', className = 'h-10 w-10', compact = false }) {
  const [failed, setFailed] = useState(false)
  const dark = variant === 'dark'

  if (failed) {
    if (compact) {
      return (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            dark ? 'bg-brand-gold text-brand-navy' : 'bg-brand-navy text-brand-gold'
          }`}
        >
          <Radar size={20} />
        </span>
      )
    }
    return (
      <span className="flex items-center gap-2.5">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            dark ? 'bg-brand-gold text-brand-navy' : 'bg-brand-navy text-brand-gold'
          }`}
        >
          <Radar size={20} />
        </span>
        <span
          className={`font-display text-lg font-extrabold tracking-tight ${
            dark ? 'text-white' : 'text-brand-navy'
          }`}
        >
          Career<span className={dark ? 'text-brand-gold' : 'text-brand-goldDark'}>Radar</span>
        </span>
      </span>
    )
  }

  return (
    <img
      src={SOURCES[variant] || SOURCES.light}
      alt="CareerRadar"
      className={`aspect-square rounded-full object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  )
}

// Scholarships & Internships channel logo (user-supplied artwork, used as-is).
// Navy badge — shown alongside every S&I channel link. Renders nothing if the
// file has not been uploaded yet, so layouts never break.
export function SILogo({ className = 'h-11 w-11' }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <img
      src="/images/logo-si.png"
      alt="CareerRadar Scholarships & Internships"
      className={`aspect-square shrink-0 rounded-full object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
