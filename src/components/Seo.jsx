import { useEffect } from 'react'

// Lightweight SEO helper (no extra dependency): sets title + meta tags,
// canonical link, and JSON-LD structured data.
// Usage: <Seo title="…" description="…" keywords="…" canonical="https://…"
//             jsonLd={{…}} image="https://…" />
export default function Seo({ title, description, keywords, canonical, image, jsonLd }) {
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

    const setLink = (rel, href) => {
      if (!href) return
      let el = document.head.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    setMeta('meta[name="description"]', description)
    setMeta('meta[name="keywords"]', keywords)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:type"]', 'website')
    setMeta('meta[property="og:url"]', canonical)
    setMeta('meta[property="og:image"]', image)
    setMeta('meta[name="twitter:card"]', image ? 'summary_large_image' : 'summary')
    setLink('canonical', canonical)

    // JSON-LD structured data (one script tag, replaced on change)
    const SCRIPT_ID = 'cr-jsonld'
    document.head.querySelectorAll(`script#${SCRIPT_ID}`).forEach((s) => s.remove())
    if (jsonLd) {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(Array.isArray(jsonLd) ? { '@context': 'https://schema.org', '@graph': jsonLd } : jsonLd)
      document.head.appendChild(script)
    }
  }, [title, description, keywords, canonical, image, jsonLd])

  return null
}
