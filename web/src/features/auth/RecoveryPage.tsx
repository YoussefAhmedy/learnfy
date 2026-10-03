import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react'
import { authApi } from '../../api/auth'
import { passwordError } from './validation'

function takeResetToken() {
  const token = new URLSearchParams(window.location.hash.slice(1)).get('token') || ''
  return token // Never persist a reset credential in URL history or local/session storage.
}
export function RecoveryPage({ reset = false }: { reset?: boolean }) {
  const [token] = useState(takeResetToken)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (token) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
  }, [token])
  useEffect(() => { document.title = `${reset ? 'Reset password' : 'Account recovery'} — Learnfy` }, [reset])
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const data = new FormData(event.currentTarget)
    const password = String(data.get('password') || '')
    if (reset) {
      const policy = passwordError(password)
      if (policy) { setError(policy); return }
      if (password !== String(data.get('confirmation') || '')) { setError('The passwords do not match.'); return }
    }
    setBusy(true); setError(null)
    try {
      const response = reset ? await authApi.resetPassword(token, password) : await authApi.forgotPassword(String(data.get('email') || '').trim())
      if (!response.success) throw new Error(response.message)
      setMessage(response.message)
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'The request could not be completed.') }
    finally { setBusy(false) }
  }
  return <div className="recovery-card"><Link to="/login" className="text-link"><ArrowLeft size={15} aria-hidden="true" />Back to sign in</Link><div className="recovery-icon"><KeyRound aria-hidden="true" /></div><h1>{reset ? 'Choose a new password.' : 'Let’s get you back in.'}</h1><p className="muted">{reset ? 'Use a unique passphrase you haven’t used elsewhere.' : 'Enter your account email to request a one-time reset link.'}</p>
    {message ? <div className="success-message" role="status"><CheckCircle2 aria-hidden="true" /><p>{message}</p><Link className="button" to="/login">Back to sign in</Link></div> : reset && !token ? <div className="form-error" role="alert"><p>This reset link is missing its credential. Request a new link.</p><Link to="/forgot-password">Request a reset link</Link></div> : <form onSubmit={submit} aria-busy={busy}><fieldset disabled={busy}>
      {reset ? <><div className="field"><label htmlFor="new-password">New password</label><input id="new-password" type="password" name="password" required minLength={12} maxLength={72} autoComplete="new-password" /></div><div className="field"><label htmlFor="confirmation">Confirm new password</label><input id="confirmation" type="password" name="confirmation" required minLength={12} maxLength={72} autoComplete="new-password" /></div></>
        : <div className="field"><label htmlFor="recovery-email">Email address</label><input id="recovery-email" name="email" type="email" required maxLength={255} autoComplete="email" /></div>}
      {error && <div className="form-error" role="alert">{error}</div>}
      <button className="button full-width" type="submit">{busy ? 'Please wait…' : reset ? 'Reset password' : 'Request reset link'}<ArrowRight size={16} aria-hidden="true" /></button>
    </fieldset></form>}
  </div>
}
