import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import SiteLogo from '../../components/SiteLogo'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // With email confirmation enabled, the user lands in a pending state.
    setDone(true)
  }

  if (done) {
    return (
      <div className="container-x flex justify-center py-16">
        <div className="w-full max-w-md text-center">
          <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
          <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy">Check your inbox</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account, then sign in.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary mt-6">
            Go to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-x flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <SiteLogo variant="light" className="h-16 w-16" />
          <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Free forever. Your career GPS starts here.</p>
        </div>

        <form onSubmit={submit} className="card mt-8 p-6">
          {error && (
            <p className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </p>
          )}
          <label className="label">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Your name"
            autoComplete="name"
          />
          <label className="label mt-4">Email</label>
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-navy">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
