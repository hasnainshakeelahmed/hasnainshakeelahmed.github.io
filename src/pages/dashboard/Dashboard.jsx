import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, FileText, Target, Bookmark, ArrowRight, CheckCircle2, Circle, RefreshCw, Award } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { generateBlueprint } from '../../lib/ai'
import { listMyCertificates, certificateVerifyUrl } from '../../lib/certificates'

function ScoreRing({ value }) {
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#f2b705"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-extrabold text-brand-navy">{value}</span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">/ 100</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const [score, setScore] = useState(null)
  const [blueprint, setBlueprint] = useState(null)
  const [resume, setResume] = useState(null)
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('career_scores').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('career_blueprints').select('*').eq('user_id', user.id).eq('is_active', true).order('generated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('resumes').select('data').eq('user_id', user.id).maybeSingle(),
      listMyCertificates().catch(() => []),
    ]).then(([scoreRes, bpRes, resumeRes, certs]) => {
      if (!scoreRes.error) setScore(scoreRes.data)
      if (!bpRes.error) setBlueprint(bpRes.data)
      if (!resumeRes.error) setResume(resumeRes.data?.data ?? null)
      setCertificates(certs ?? [])
      setLoading(false)
    })
  }, [user])

  const handleGenerate = async () => {
    setGenerating(true)
    setGenError('')
    try {
      const bp = await generateBlueprint()
      setBlueprint(bp)
    } catch (e) {
      setGenError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const breakdown = score
    ? [
        { label: 'Skills', value: score.skills_score, max: 25 },
        { label: 'Profile', value: score.profile_score, max: 20 },
        { label: 'Activity', value: score.activity_score, max: 20 },
        { label: 'Education', value: score.education_score, max: 20 },
        { label: 'Experience', value: score.experience_score, max: 15 },
      ]
    : []

  const missing = score?.missing_items ?? []
  const resumeSkills = resume?.skills ?? []

  if (loading) {
    return <div className="container-x py-24 text-center text-sm text-slate-500">Loading your dashboard…</div>
  }

  return (
    <div className="container-x py-10">
      <h1 className="font-display text-3xl font-extrabold text-brand-navy">Welcome back, {name}</h1>
      <p className="mt-1 text-sm text-slate-500">Your personal career HQ — score, analysis, roadmap and saved picks.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {/* Score — real career_scores row */}
        <div className="card flex flex-col items-center p-6 text-center">
          <h2 className="font-display text-base font-bold text-brand-navy">Career Readiness Score</h2>
          {score ? (
            <>
              <div className="my-4">
                <ScoreRing value={score.total_score} />
              </div>
              <p className="text-sm text-slate-600">
                Last calculated {new Date(score.last_calculated).toLocaleDateString()}. Upload your CV and
                stay active to raise it.
              </p>
              <div className="mt-5 w-full space-y-2.5">
                {breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>{b.label}</span>
                      <span>
                        {b.value}/{b.max}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-brand-gold" style={{ width: `${(b.value / b.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="my-4">
                <ScoreRing value={0} />
              </div>
              <p className="text-sm text-slate-600">
                No score yet. Upload your CV and complete your profile to get your first score.
              </p>
              <Link to="/dashboard/resume" className="btn-primary mt-5">
                Upload CV
              </Link>
            </>
          )}
        </div>

        {/* AI profile analysis — derived from real rows */}
        <div className="card flex flex-col p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
            <Sparkles size={17} className="text-brand-goldDark" /> AI Profile Analysis
          </h2>
          <p className="mt-1 text-xs text-slate-400">From your CV, score and activity.</p>
          {resume ? (
            <>
              <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-600">On your CV</h3>
              <ul className="mt-2 space-y-1.5">
                <li className="text-sm text-slate-700">
                  {resumeSkills.length} skills listed
                  {resumeSkills.length > 0 ? `: ${resumeSkills.slice(0, 4).join(', ')}${resumeSkills.length > 4 ? '…' : ''}` : ''}
                </li>
                <li className="text-sm text-slate-700">{(resume.experience ?? []).length} experience entries</li>
                <li className="text-sm text-slate-700">{(resume.projects ?? []).length} projects listed</li>
              </ul>
            </>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No CV on file yet — upload one for a real analysis.</p>
          )}
          {missing.length > 0 && (
            <>
              <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-amber-600">Missing from your profile</h3>
              <ul className="mt-2 space-y-1.5">
                {missing.slice(0, 5).map((m) => (
                  <li key={String(m)} className="flex items-start gap-2 text-sm text-slate-700">
                    <Circle size={15} className="mt-0.5 shrink-0 text-amber-500" /> {String(m)}
                  </li>
                ))}
              </ul>
            </>
          )}
          <Link to="/dashboard/resume" className="btn-primary mt-5 w-fit !px-4 !py-2">
            <FileText size={14} /> Review my CV
          </Link>
        </div>

        {/* Roadmap — real career_blueprints row */}
        <div className="card flex flex-col p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
            <Target size={17} className="text-brand-goldDark" /> Your Career Blueprint
          </h2>
          {blueprint ? (
            <>
              <p className="mt-1 text-xs text-slate-400">{blueprint.title || 'Personal roadmap'}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{blueprint.summary}</p>
              <ol className="mt-4 space-y-3">
                {(blueprint.action_steps ?? []).slice(0, 5).map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-slate-700">
                      {typeof step === 'string' ? step : step.step || step.title || step.description || JSON.stringify(step)}
                    </span>
                  </li>
                ))}
              </ol>
              {(blueprint.recommended_skills ?? []).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
                  {(blueprint.recommended_skills ?? []).slice(0, 6).map((s) => (
                    <span key={String(s)} className="badge badge-slate">
                      {String(s)}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                No blueprint yet. Generate one and the AI will build a personalized
                roadmap from your profile.
              </p>
              {genError && <p className="mt-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{genError}</p>}
              <button onClick={handleGenerate} disabled={generating} className="btn-primary mt-5 w-fit">
                {generating ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" /> Generating…
                  </>
                ) : (
                  'Generate my blueprint'
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Saved + quick actions */}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
            <Bookmark size={17} className="text-brand-goldDark" /> Saved opportunities
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Bookmarking arrives with the saved-items update. For now, your roadmap above is the fastest path forward.
          </p>
          <Link to="/jobs" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
            Browse jobs <ArrowRight size={14} />
          </Link>
        </div>

        {/* My certificates — matched by account link OR by the email on the account */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-brand-navy">
            <Award size={17} className="text-brand-goldDark" /> My Certificates
          </h2>
          {certificates.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">
              No certificates yet. Complete a course, bootcamp, or program and your certificate will land here.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {certificates.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-navy">{c.certificate_title}</p>
                    <p className="font-mono text-xs text-slate-500">{c.certificate_id}</p>
                  </div>
                  <Link
                    to={certificateVerifyUrl(c.certificate_id)}
                    className="shrink-0 text-sm font-semibold text-brand-navy hover:underline"
                  >
                    View →
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link to="/verify" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
            Verify any certificate <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="card bg-brand-navy p-6 text-white md:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-base font-bold">
            <Sparkles size={17} className="text-brand-gold" /> Ask the AI assistant
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            “Which scholarships fit my profile?” — the assistant knows the live listings and your goals.
          </p>
          <button
            onClick={() => document.querySelector('[aria-label="Open AI assistant"]')?.click()}
            className="btn-gold mt-4"
          >
            Open AI chat
          </button>
        </div>
      </div>

      {score && (
        <p className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 size={14} className="text-emerald-500" />
          Your data stays yours — scores and blueprints are visible only to your account.
        </p>
      )}
    </div>
  )
}
