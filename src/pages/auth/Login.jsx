import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Radar, AlertCircle, ShieldCheck, User } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// One login page, two doors:
// - Member login → the member dashboard.
// - Admin login → the admin panel, only for accounts whose role in the
//   database is admin / super_admin. Admin access is assigned by the team;
//   nobody can self-register as an admin.
export default function Login() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') === 'admin' ? 'admin' : 'member')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchParams.get('tab') === 'admin') setTab('admin')
    if (searchParams.get('reason') === 'admin-required') {
      setNotice('That page needs admin access. Please sign in with an admin account.')
    }
  }, [searchParams])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setLoading(false)
      setError(signInError.message)
      return
    }
    if (tab === 'admin') {
      // Verify the role from the database — never trust a client-side claim.
      const { data: roleRow } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle()
      const role = roleRow?.role
      if (role !== 'admin' && role !== 'super_admin') {
        await supabase.auth.signOut()
        setLoading(false)
        setError('This account does not have admin access. Please use Member login, or contact the Career Radar team.')
        return
      }
      setLoading(false)
      navigate('/admin')
      return
    }
    setLoading(false)
    navigate('/dashboard')
  }

  const isAdminTab = tab === 'admin'

  return (
    <div className="container-x flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navy text-brand-gold">
            <Radar size={26} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy">
            {isAdminTab ? 'Admin sign in' : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isAdminTab
              ? 'Manage listings, certificates, posts, and members.'
              : 'Sign in to continue your career journey.'}
          </p>
        </div>

        {/* Member / Admin tabs */}
        <div className="mt-8 grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1" role="tablist" aria-label="Login type">
          <button
            role="tab"
            aria-selected={!isAdminTab}
            onClick={() => {
              setTab('member')
              setError('')
              setNotice('')
            }}
            className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              !isAdminTab ? 'bg-brand-navy text-white' : 'text-slate-600 hover:text-brand-navy'
            }`}
          >
            <User size={15} /> Member login
          </button>
          <button
            role="tab"
            aria-selected={isAdminTab}
            onClick={() => {
              setTab('admin')
              setError('')
              setNotice('')
            }}
            className={`flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              isAdminTab ? 'bg-brand-navy text-white' : 'text-slate-600 hover:text-brand-navy'
            }`}
          >
            <ShieldCheck size={15} /> Admin login
          </button>
        </div>

        <form onSubmit={submit} className="card mt-4 p-6">
          {notice && (
            <p className="mb-4 rounded-xl bg-amber-50 px-3.5 py-3 text-sm text-amber-800">{notice}</p>
          )}
          {error && (
            <p className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </p>
          )}
          {isAdminTab && (
            <p className="mb-4 rounded-xl bg-brand-navySoft px-3.5 py-3 text-sm text-slate-600">
              Admin access is assigned by the Career Radar team. You cannot sign up as an admin — if your account
              should have access, ask a super admin to grant it.
            </p>
          )}
          <label className="label">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <label className="label mt-4">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Your password"
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? 'Signing in…' : isAdminTab ? 'Sign in as admin' : 'Sign in'}
          </button>
          {!isAdminTab && (
            <p className="mt-4 text-center text-sm text-slate-500">
              No account yet?{' '}
              <Link to="/register" className="font-semibold text-brand-navy">
                Create one
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
