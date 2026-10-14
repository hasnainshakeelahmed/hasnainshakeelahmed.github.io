import { useEffect, useState } from 'react'
import { FileText, Upload, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import * as pdfjs from 'pdfjs-dist'
import { extractRawText } from 'mammoth'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { parseResumeText } from '../../lib/ai'

// pdf.js worker bundled by Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

async function extractText(file) {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const buf = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: buf }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((it) => it.str).join(' ') + '\n'
    }
    return text
  }
  if (file.name.toLowerCase().endsWith('.docx')) {
    const buf = await file.arrayBuffer()
    const { value } = await extractRawText({ arrayBuffer: buf })
    return value
  }
  return await file.text()
}

function analyze(parsed) {
  const suggestions = []
  const skills = parsed.skills ?? []
  const exp = parsed.experience ?? []
  const projects = parsed.projects ?? []
  const education = parsed.education ?? []
  if (!parsed.personal?.bio) suggestions.push('Add a 2–3 line professional summary at the top of your CV.')
  if (skills.length < 5) suggestions.push(`List more skills — you have ${skills.length}. Aim for 8–12 relevant ones.`)
  if (exp.length === 0) suggestions.push('Add experience — internships, freelance work, and volunteering all count.')
  else if (!exp.some((e) => /\d/.test(e.description || ''))) {
    suggestions.push('Quantify your experience: add numbers (users reached, % improved, items shipped) to each role.')
  }
  if (projects.length === 0) suggestions.push('Add 1–2 projects with links — proof of work beats claims.')
  if (education.length === 0) suggestions.push('Add your education with institution, degree, and years.')
  if (!parsed.personal?.linkedin) suggestions.push('Add your LinkedIn URL so recruiters can find you.')
  return suggestions
}

export default function ResumeReview() {
  const { user } = useAuth()
  const [parsed, setParsed] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [status, setStatus] = useState('idle') // idle | extracting | analyzing | done | error
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from('resumes')
      .select('data')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.data && Object.keys(data.data).length > 0) {
          setParsed(data.data)
          setSuggestions(analyze(data.data))
          setStatus('done')
          setSaved(true)
        }
      })
  }, [user])

  const handleFile = async (file) => {
    if (!file) return
    setError('')
    setSaved(false)
    try {
      setStatus('extracting')
      const text = await extractText(file)
      if (!text || text.trim().length < 20) {
        throw new Error('Could not read enough text from this file. Try a text-based PDF or DOCX.')
      }
      setStatus('analyzing')
      const data = await parseResumeText(text.slice(0, 12000))
      setParsed(data)
      setSuggestions(analyze(data))
      setStatus('done')
      // Save to the user's own resumes row (RLS: own data only)
      const { error: upsertError } = await supabase
        .from('resumes')
        .upsert({ user_id: user.id, data }, { onConflict: 'user_id' })
      if (!upsertError) setSaved(true)
    } catch (e) {
      setError(e.message || 'Something went wrong while analyzing your CV.')
      setStatus('error')
    }
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">AI CV Review</h1>
      <p className="mt-1 text-sm text-slate-500">
        Upload your CV. The AI extracts your details, scores the gaps, and tells you exactly what to fix.
      </p>

      <div className="card mt-8 p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 px-6 py-10 text-center transition-colors hover:border-brand-navy">
          <Upload size={28} className="text-brand-goldDark" />
          <span className="mt-3 font-display text-base font-bold text-brand-navy">
            {status === 'extracting' ? 'Reading your file…' : status === 'analyzing' ? 'AI is analyzing…' : 'Choose a CV file'}
          </span>
          <span className="mt-1 text-sm text-slate-500">PDF, DOCX or TXT · processed securely, visible only to you</span>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        {error && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}
        {saved && (
          <p className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 size={16} /> Saved to your account.
          </p>
        )}
      </div>

      {parsed && (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
              <FileText size={17} className="text-brand-goldDark" /> What the AI extracted
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Name</dt>
                <dd className="font-medium text-brand-navy">{parsed.personal?.fullName || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Title</dt>
                <dd className="font-medium text-brand-navy">{parsed.personal?.title || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-brand-navy">{parsed.personal?.email || '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Location</dt>
                <dd className="font-medium text-brand-navy">{parsed.personal?.location || '—'}</dd>
              </div>
            </dl>
            <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(parsed.skills ?? []).length > 0 ? (
                parsed.skills.map((s) => (
                  <span key={s} className="badge badge-slate">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No skills found.</span>
              )}
            </div>
            <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Experience</h3>
            <ul className="mt-2 space-y-2">
              {(parsed.experience ?? []).length > 0 ? (
                parsed.experience.map((e, i) => (
                  <li key={i} className="text-sm text-slate-700">
                    <strong className="text-brand-navy">{e.title || 'Role'}</strong> — {e.company || 'Company'}
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-500">No experience entries found.</li>
              )}
            </ul>
          </div>

          <div className="card bg-brand-navy p-6 text-white">
            <h2 className="flex items-center gap-2 font-display text-base font-bold">
              <Sparkles size={17} className="text-brand-gold" /> AI suggestions
            </h2>
            {suggestions.length === 0 ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                Solid CV — all the core sections are present. Keep it to 1–2 pages and tailor it per application.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {suggestions.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-200">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-gold" /> {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
