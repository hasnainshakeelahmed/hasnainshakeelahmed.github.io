import { useEffect } from 'react'

// Lightweight SEO helper (no extra dependency): sets title + meta tags.
// Usage: <Seo title="…" description="…" keywords="…" />
export default function Seo({ title, description, keywords }) {
  useEffect(() => {
    const site = 'Career Radar'
    const fullTitle = title ? `${title} | ${site}` : site
    document.title = fullTitle

    const setMeta = (selector, content) => {
      if (!content) return
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const attr = selector.includes('property') ? 'property' : 'name'
        const key = selector.match(/"([^"]+)"/)?.[1] || ''
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('meta[name="description"]', description)
    setMeta('meta[name="keywords"]', keywords)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:type"]', 'website')
  }, [title, description, keywords])

  return null
}
