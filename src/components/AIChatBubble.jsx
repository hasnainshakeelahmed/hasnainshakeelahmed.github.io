import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, X, Send, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { callAIChat } from '../lib/ai'

const SUGGESTIONS = [
  'Which scholarships can I apply to?',
  'Review my resume',
  'Build me a career roadmap',
  'How do I start freelancing?',
]

export default function AIChatBubble() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I’m your Career Radar AI assistant. Ask me about scholarships, jobs, resumes, or your next career move.' },
  ])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const scrollRef = useRef(null)

  const push = (msg) => {
    setMessages((m) => [...m, msg])
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50)
  }

  const send = async (text) => {
    const content = (text ?? draft).trim()
    if (!content || typing) return
    push({ role: 'user', text: content })
    setDraft('')
    if (!user) {
      push({
        role: 'assistant',
        text: 'Please sign in to use the AI assistant — your chats stay private to your account.',
        signIn: true,
      })
      return
    }
    setTyping(true)
    try {
      const history = [...messages, { role: 'user', content }].map((m) => ({
        role: m.role,
        content: m.text,
      }))
      const data = await callAIChat(history, sessionId)
      push({ role: 'assistant', text: data.content || 'I could not generate a reply. Please try again.' })
    } catch (e) {
      push({ role: 'assistant', text: `The assistant is unavailable right now (${e.message}). Please try again shortly.` })
    } finally {
      setTyping(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[480px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-cardHover">
          <div className="flex items-center justify-between bg-brand-navy px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={17} className="text-brand-gold" />
              <div>
                <p className="font-display text-sm font-bold">Career Radar AI</p>
                <p className="text-[11px] text-slate-400">Grounded in live listings</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-white/10" aria-label="Close chat">
              <X size={17} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user' ? 'ml-auto bg-brand-navy text-white' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {m.text}
                </div>
                {m.signIn && (
                  <Link
                    to="/login"
                    className="mt-1.5 inline-block rounded-full bg-brand-gold px-3.5 py-1.5 text-xs font-semibold text-brand-navy"
                  >
                    Sign in →
                  </Link>
                )}
              </div>
            ))}
            {typing && (
              <div className="max-w-[85%] rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500">Thinking…</div>
            )}
          </div>

          <div className="border-t border-slate-100 p-3">
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full bg-brand-navySoft px-3 py-1.5 text-xs font-medium text-brand-navy hover:bg-brand-gold/20"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex items-center gap-2"
            >
              <Link
                to="/dashboard/resume"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-navy"
                title="Upload resume for AI review"
              >
                <FileText size={18} />
              </Link>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about scholarships, jobs, resumes…"
                className="input !py-2.5"
              />
              <button type="submit" className="rounded-full bg-brand-navy p-2.5 text-white hover:bg-brand-navyLight" aria-label="Send">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-brand-gold shadow-cardHover transition-transform hover:scale-105"
        aria-label="Open AI assistant"
      >
        {open ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  )
}
