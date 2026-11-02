import { useEffect, useRef, useState } from 'react'
import SiteLogo from './SiteLogo'

// Splash screen: on every full page load, the logo appears centred on navy
// (radar rings + wordmark, like the brand intro), then flies up into the
// header logo position once the page is ready. Respects reduced-motion.
export default function SplashScreen() {
  const [phase, setPhase] = useState('show') // show | fly | done
  const [fading, setFading] = useState(false)
  const logoRef = useRef(null)

  // Wait for the page to be ready (and a minimum display time) before flying.
  useEffect(() => {
    const minTime = 1400
    const start = Date.now()
    let timers = []
    const begin = () => {
      const wait = Math.max(0, minTime - (Date.now() - start))
      timers.push(setTimeout(() => setPhase('fly'), wait))
    }
    if (document.readyState === 'complete') begin()
    else {
      window.addEventListener('load', begin)
      // Safety net: never trap the user behind the splash.
      timers.push(setTimeout(() => setPhase((p) => (p === 'show' ? 'fly' : p)), 4000))
    }
    return () => {
      window.removeEventListener('load', begin)
      timers.forEach(clearTimeout)
    }
  }, [])

  // Fly the logo from the centre to the header logo, then fade the overlay.
  useEffect(() => {
    if (phase !== 'fly') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = logoRef.current
    const target = document.getElementById('site-logo')
    if (!reduce && el && target) {
      const r1 = el.getBoundingClientRect()
      const r2 = target.getBoundingClientRect()
      const dx = r2.left + r2.width / 2 - (r1.left + r1.width / 2)
      const dy = r2.top + r2.height / 2 - (r1.top + r1.height / 2)
      const scale = Math.min(1, r2.width / r1.width)
      el.style.transition = 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    }
    const t1 = setTimeout(() => setFading(true), reduce ? 0 : 550)
    const t2 = setTimeout(() => setPhase('done'), reduce ? 150 : 900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [phase])

  if (phase === 'done') return null

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-navy transition-opacity duration-300 ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex items-center justify-center">
        {/* radar rings */}
        <span className="radar-ring absolute h-40 w-40 rounded-full border border-brand-gold/40" />
        <span
          className="radar-ring absolute h-40 w-40 rounded-full border border-brand-gold/30"
          style={{ animationDelay: '1.1s' }}
        />
        {/* glow + logo */}
        <span className="absolute h-32 w-32 rounded-full bg-brand-gold/25 blur-2xl" />
        <span ref={logoRef} className="relative block">
          <SiteLogo
            variant="light"
            className="h-28 w-28 rounded-full object-cover shadow-[0_0_45px_rgba(242,183,5,0.55)]"
          />
        </span>
      </div>
      <p
        className={`mt-6 font-display text-xl font-extrabold tracking-[0.35em] text-brand-gold transition-opacity duration-300 ${
          phase === 'fly' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        CAREER RADAR
      </p>
      <p
        className={`mt-2 text-[11px] font-medium tracking-[0.25em] text-slate-400 transition-opacity duration-300 ${
          phase === 'fly' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        AI-POWERED CAREER GPS
      </p>
    </div>
  )
}
