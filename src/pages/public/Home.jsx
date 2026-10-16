import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Users,
  Globe2,
  Compass,
  Target,
  HeartHandshake,
  Radar,
  BookOpen,
  Play,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { JobCard, ScholarshipCard } from '../../components/ListingCard'
import AdSlot from '../../components/AdSlot'
import Seo from '../../components/Seo'
import Reveal from '../../components/Reveal'

const GOALS = [
  {
    icon: GraduationCap,
    title: 'I want a scholarship',
    text: 'Fully funded scholarships with deadlines, eligibility, and step-by-step guides.',
    to: '/scholarships',
    cta: 'Browse scholarships',
  },
  {
    icon: Briefcase,
    title: 'I want a job or internship',
    text: 'Verified roles for students and fresh graduates — remote and on-site.',
    to: '/jobs',
    cta: 'Browse jobs',
  },
  {
    icon: BookOpen,
    title: 'I want to study free at UoPeople',
    text: 'The complete 7-part guide: accreditation, cost, scholarships, and how to apply.',
    to: '/guides',
    cta: 'Start the UoPeople guide',
  },
  {
    icon: Play,
    title: 'I want career guidance',
    text: 'Videos and guides on CVs, interviews, freelancing, and study skills.',
    to: '/videos',
    cta: 'Watch guidance videos',
  },
]

const FEATURES = [
  {
    icon: Briefcase,
    title: 'Verified Opportunities',
    text: 'Scholarships, internships, jobs, fellowships and remote roles — researched and verified, never scraped spam.',
  },
  {
    icon: Sparkles,
    title: 'AI Career Guidance',
    text: 'Ask the AI assistant for roadmaps, resume feedback, and next steps tailored to where you are.',
  },
  {
    icon: Target,
    title: 'Career Readiness Score',
    text: 'See exactly how ready you are — and what to fix — with a score that grows as you do.',
  },
  {
    icon: Users,
    title: 'Global Community',
    text: 'Students, graduates, mentors and freelancers across many countries, helping each other win.',
  },
]

const STEPS = [
  { icon: Compass, title: 'Discover', text: 'Explore verified opportunities matched to your goals.' },
  { icon: Sparkles, title: 'Develop', text: 'Build the skills and documents you need with AI guidance.' },
  { icon: Users, title: 'Connect', text: 'Meet mentors, peers and volunteers who have done it before.' },
  { icon: Target, title: 'Grow', text: 'Turn opportunities into offers, admissions and income.' },
]

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setJobs(data ?? []))
    supabase
      .from('scholarships')
      .select('*')
      .order('deadline', { ascending: true, nullsLast: true })
      .limit(3)
      .then(({ data }) => setScholarships((data ?? []).filter((s) => s.is_active !== false)))
  }, [])

  const search = (e) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div>
      <Seo
        title="Find Scholarships, Internships & Jobs"
        description="Career Radar is the career GPS for students everywhere: verified scholarships, internships and jobs, AI career guidance, and a global community."
        keywords="scholarships, internships, jobs, fully funded scholarships, AI career guidance, career radar"
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(600px 300px at 80% -10%, rgba(242,183,5,0.35), transparent), radial-gradient(500px 300px at 10% 110%, rgba(242,183,5,0.2), transparent)',
          }}
        />
        <div className="container-x relative py-16 sm:py-24">
          <span className="badge hero-enter hero-enter-1 bg-brand-gold/15 text-brand-gold">
            <Radar size={14} /> The career GPS for students everywhere
          </span>
          <h1 className="hero-enter hero-enter-2 mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Find opportunities.
            <br />
            Build your future.
          </h1>
          <p className="hero-enter hero-enter-3 mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Verified scholarships, internships and jobs, AI career guidance, and
            a global community — everything you need to move forward, in one place.
          </p>

          <form onSubmit={search} className="hero-enter hero-enter-3 mt-8 flex max-w-xl items-center gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search scholarships, jobs, internships…"
                className="w-full rounded-full border-0 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>
            <button type="submit" className="btn-gold !px-6 !py-3.5">
              Search
            </button>
          </form>

        </div>
      </section>

      {/* Start here — guided path */}
      <section className="container-x py-14">
        <Reveal>
          <p className="section-kicker">Start here</p>
          <h2 className="section-title mt-1">Pick your goal — we&apos;ll show you the path</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            New here? Start with the goal that matches you. Each path leads to verified opportunities, guides,
            and videos — no guesswork.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((g, i) => (
            <Reveal key={g.title} delay={i}>
              <Link to={g.to} className="card lift group flex h-full flex-col p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-goldDark transition-transform duration-300 group-hover:scale-110">
                  <g.icon size={22} />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-brand-navy">{g.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{g.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-navy">
                  {g.cta} <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Startup strip — built like a startup, run like a community */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-x py-10">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="section-kicker">A startup, not just a website</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-brand-navy sm:text-3xl">
                  Built by students, for students everywhere.
                </h2>
              </div>
              <div className="flex flex-wrap gap-6 sm:gap-10">
                <div>
                  <p className="font-display text-3xl font-extrabold text-brand-navy">2,000+</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400">Community members</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold text-brand-navy">28</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400">Videos published</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold text-brand-navy">100%</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400">Free for students</p>
                </div>
              </div>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Ship fast, learn fast',
                text: 'New opportunities, videos, and tools every week — built in the open with the community.',
              },
              {
                title: 'Community-powered',
                text: 'Volunteers verify listings, create content, and deliver services. The community is the product.',
              },
              {
                title: 'Free forever',
                text: 'Students never pay for opportunities, guidance, or certificates. Donations and services keep it that way.',
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i}>
                <div className="card lift h-full p-5">
                  <p className="font-display text-base font-bold text-brand-navy">{c.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <div className="flex flex-wrap gap-3">
              <Link to="/services" className="btn-primary">
                Get work done by our community →
              </Link>
              <Link to="/donate" className="btn-outline">
                Support the mission
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Latest opportunities */}
      <section className="container-x py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Fresh on the radar</p>
            <h2 className="section-title mt-1">Latest opportunities</h2>
          </div>
          <Link to="/jobs" className="btn-outline !px-4 !py-2">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => (
            <Reveal key={job.id} delay={i % 3}>
              <JobCard job={job} />
            </Reveal>
          ))}
          {jobs.length === 0 && (
            <p className="text-sm text-slate-500">New opportunities are being added — check back soon.</p>
          )}
        </div>
      </section>

      {/* Ad slot — AdSense-ready, activates after account approval */}
      <div className="container-x">
        <AdSlot format="leaderboard" />
      </div>

      {/* Scholarships strip */}
      <section className="bg-brand-navySoft py-14">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Funded futures</p>
              <h2 className="section-title mt-1">Scholarships closing soon</h2>
            </div>
            <Link to="/scholarships" className="btn-outline !px-4 !py-2">
              All scholarships <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((s) => (
              <ScholarshipCard key={s.id} item={s} />
            ))}
            {scholarships.length === 0 && (
              <p className="text-sm text-slate-500">New scholarships are being added — check back soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-x py-14">
        <p className="section-kicker">Everything you need</p>
        <h2 className="section-title mt-1">One platform for your whole career journey</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card card-hover p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-goldDark">
                <f.icon size={22} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-brand-navy">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="container-x">
          <p className="section-kicker">How it works</p>
          <h2 className="section-title mt-1">Four steps to momentum</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <span className="font-display text-5xl font-extrabold text-brand-gold/40">{i + 1}</span>
                <h3 className="mt-2 flex items-center gap-2 font-display text-base font-bold text-brand-navy">
                  <s.icon size={18} className="text-brand-goldDark" /> {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI teaser + volunteer CTA */}
      <section className="container-x grid gap-5 py-14 md:grid-cols-2">
        <div className="card overflow-hidden bg-brand-navy p-8 text-white">
          <Sparkles className="text-brand-gold" size={28} />
          <h3 className="mt-4 font-display text-2xl font-bold">Ask the AI Career Assistant</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            “Which scholarships can I apply to with a 3.0 GPA?” — get a real
            answer, grounded in live listings, in seconds.
          </p>
          <Link to="/dashboard" className="btn-gold mt-6">
            Try the AI assistant <ArrowRight size={15} />
          </Link>
        </div>
        <div className="card p-8">
          <HeartHandshake className="text-brand-goldDark" size={28} />
          <h3 className="mt-4 font-display text-2xl font-bold text-brand-navy">Help others win</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Join the volunteer team — research opportunities, write guides,
            design, or mentor. Grow your own skills while lifting others.
          </p>
          <Link to="/volunteer" className="btn-primary mt-6">
            Become a volunteer <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Global strip */}
      <section className="border-t border-slate-200 py-10">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <Globe2 size={16} className="text-brand-goldDark" /> A global student community
          </span>
          <span className="inline-flex items-center gap-2">
            <GraduationCap size={16} className="text-brand-goldDark" /> Scholarships & admissions
          </span>
          <span className="inline-flex items-center gap-2">
            <Briefcase size={16} className="text-brand-goldDark" /> Jobs, internships & freelance
          </span>
        </div>
      </section>
    </div>
  )
}
