import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Calendar, ArrowLeft, ArrowRight, ChevronRight, Megaphone } from 'lucide-react'
import Seo from '../../components/Seo'
import Reveal from '../../components/Reveal'
import WhatsAppCTA from '../../components/WhatsAppCTA'
import { supabase } from '../../lib/supabase'

const GUIDE_MARKER = '📖 Detailed Guide'

const CHANNEL_META = {
  scholarships: {
    label: 'Scholarships & Internships',
    link: 'https://whatsapp.com/channel/0029VbCOJrjCxoAtWxwUaB1m',
  },
  main: {
    label: 'CareerRadar — Main',
    link: 'https://whatsapp.com/channel/0029VakD7vA8fewly3jkHO3X',
  },
}

// Split a post description into its caption and its "📖 Detailed Guide" section.
function splitGuide(description = '') {
  const idx = description.indexOf(GUIDE_MARKER)
  if (idx === -1) return { caption: description, guide: '' }
  return {
    caption: description.slice(0, idx).trim(),
    guide: description.slice(idx + GUIDE_MARKER.length).trim(),
  }
}

// Render the plain-text guide: "### " lines are headings, "• " lines are list
// items, "Tips:" is a heading, everything else is a paragraph.
function GuideBody({ text }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  const nodes = []
  let list = []
  const flushList = (key) => {
    if (list.length) {
      nodes.push(
        <ul key={key} className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-700">
          {list.map((item, i) => (
            <li key={i}>{item.replace(/^•\s*/, '')}</li>
          ))}
        </ul>,
      )
      list = []
    }
  }
  blocks.forEach((block, i) => {
    if (block.startsWith('### ')) {
      flushList(`list-${i}`)
      nodes.push(
        <h3 key={i} className="pt-2 font-display text-lg font-bold text-brand-navy">
          {block.replace(/^###\s*/, '')}
        </h3>,
      )
    } else if (block === 'Tips:' || block === 'Tips') {
      flushList(`list-${i}`)
      nodes.push(
        <h3 key={i} className="pt-2 font-display text-lg font-bold text-brand-navy">
          Tips
        </h3>,
      )
    } else if (block.split('\n').every((line) => line.trim().startsWith('•'))) {
      list.push(...block.split('\n').map((line) => line.trim()))
    } else {
      flushList(`list-${i}`)
      nodes.push(
        <p key={i} className="text-[15px] leading-relaxed text-slate-700">
          {block}
        </p>,
      )
    }
  })
  flushList('list-end')
  return <div className="space-y-4">{nodes}</div>
}

export default function PostDetail() {
  const { id } = useParams()
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    supabase
      .from('channel_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => setPosts(data ?? []))
  }, [])

  const post = useMemo(() => (posts || []).find((p) => String(p.id) === String(id)), [posts, id])
  const index = useMemo(() => (posts || []).findIndex((p) => String(p.id) === String(id)), [posts, id])
  const newer = index > 0 ? posts[index - 1] : null
  const older = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null

  if (posts && !post) return <Navigate to="/posts" replace />

  if (!post) {
    return (
      <div className="container-x py-10">
        <div className="mx-auto max-w-3xl">
          <div className="skeleton h-5 w-56" />
          <div className="skeleton mt-6 h-9 w-3/4" />
          <div className="skeleton mt-6 aspect-[4/3] w-full" />
          <div className="skeleton mt-6 h-4 w-full" />
          <div className="skeleton mt-3 h-4 w-5/6" />
          <div className="skeleton mt-3 h-4 w-2/3" />
        </div>
      </div>
    )
  }

  const { caption, guide } = splitGuide(post.description)
  const channelMeta = CHANNEL_META[post.channel] || { label: post.channel, link: '#' }

  return (
    <div className="container-x py-10">
      <Seo
        title={`${post.title} — Career Radar Posts`}
        description={caption.slice(0, 160)}
        keywords={`career radar, ${channelMeta.label}, ${post.title}`}
      />
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-navy hover:underline">Home</Link>
        <ChevronRight size={14} className="text-slate-300" />
        <Link to="/posts" className="hover:text-brand-navy hover:underline">Posts</Link>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="max-w-[55vw] truncate font-medium text-brand-navy">{post.title}</span>
      </nav>
      <Link to="/posts" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:underline">
        <ArrowLeft size={15} /> All posts
      </Link>

      <article className="mx-auto mt-5 max-w-3xl">
        <div className="hero-enter">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Megaphone size={13} className="text-brand-goldDark" /> {channelMeta.label}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-brand-goldDark" />{' '}
              {new Date(post.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-brand-navy sm:text-4xl">
            {post.title}
          </h1>
        </div>

        {post.image_url && (
          <Reveal className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-card">
            <img src={post.image_url} alt={post.title} className="w-full object-cover" />
          </Reveal>
        )}

        {/* Caption */}
        <div className="mt-8 space-y-4">
          {caption.split(/\n\s*\n/).map((para, i) => (
            <p key={i} className="whitespace-pre-line text-base leading-relaxed text-slate-700">
              {para}
            </p>
          ))}
        </div>

        {/* Detailed guide */}
        {guide && (
          <div className="mt-10">
            <p className="section-kicker">Detailed guide</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-brand-navy">
              📖 Detailed Guide — {post.title}
            </h2>
            <div className="mt-5">
              <GuideBody text={guide} />
            </div>
            <WhatsAppCTA channel={post.channel === 'scholarships' ? 'scholarships' : 'main'} />
          </div>
        )}

        {/* Previous / next */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
          {newer ? (
            <Link to={`/posts/${newer.id}`} className="btn-outline max-w-full !px-4 !py-2 sm:max-w-[48%]">
              <ArrowLeft size={15} /> <span className="truncate">{newer.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {older && (
            <Link to={`/posts/${older.id}`} className="btn-primary max-w-full !px-4 !py-2 sm:max-w-[48%]">
              <span className="truncate">{older.title}</span> <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </article>
    </div>
  )
}
