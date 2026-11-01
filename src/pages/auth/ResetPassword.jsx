import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, KeyRound } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import SiteLogo from '../../components/SiteLogo'

// Landed from the password-reset email link (/reset-password#access_token=…&type=recovery).
// supabase-js picks the recovery session up from the URL automatically; here the
// user just chooses a new password.
export default function ResetPassword() {
  const [ready, setReady] = useState(false)
  const [valid, setValid] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let sub
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      setValid(!!data.session)
      setReady(true)
    }
    check()
    // The recovery hash can be processed a beat after first render.
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValid(true)
        setReady(true)
      }
    })
    sub = data.subscription
    return () => sub?.unsubscribe()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('The two passwords do not match.')
      return
    }
    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    await supabase.auth.signOut()
    setDone(true)
  }

  return (
    <div className="container-x flex justify-center py-16">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <SiteLogo variant="light" className="h-16 w-16" />
          <h1 className="mt-4 font-display text-3xl font-extrabold text-brand-navy">Reset password</h1>
          <p className="mt-1 text-sm text-slate-500">Choose a new password for your account.</p>
        </div>

        <div className="card mt-8 p-6">
          {!ready ? (
            <p className="text-center text-sm text-slate-500">Checking your reset link…</p>
          ) : done ? (
            <div className="text-center">
              <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
              <p className="mt-3 font-display text-lg font-bold text-brand-navy">Password updated</p>
              <p className="mt-2 text-sm text-slate-600">You can now sign in with your new password.</p>
              <Link to="/login" className="btn-primary mt-6 w-full">
                Go to sign in
              </Link>
            </div>
          ) : !valid ? (
            <div className="text-center">
              <AlertCircle size={40} className="mx-auto text-red-400" />
              <p className="mt-3 font-display text-lg font-bold text-brand-navy">Link invalid or expired</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Reset links expire after 1 hour and work only once. Request a fresh one from the sign-in page.
              </p>
              <Link to="/login" className="btn-primary mt-6 w-full">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              {error && (
                <p className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
                </p>
              )}
              <label className="label flex items-center gap-1.5">
                <KeyRound size={14} /> New password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <label className="label mt-4">Confirm new password</label>
              <input
                required
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input"
                placeholder="Repeat the new password"
                autoComplete="new-password"
              />
              <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
                {loading ? 'Updating…' : 'Set new password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
