import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, GraduationCap } from 'lucide-react'
import { useAuth } from './context'
import { passwordError, safeReturnPath } from './validation'

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [visible, setVisible] = useState(false)
  const register = mode === 'register'
  const destination = safeReturnPath((location.state as { from?: unknown } | null)?.from)
  useEffect(() => { document.title = `${register ? 'Create an account' : 'Sign in'} — Learnfy` }, [register])
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')
    const policyError = register ? passwordError(password) : undefined
    if (policyError) { setError(policyError); return }
    setBusy(true); setError(null)
    try {
      if (register) await auth.register({ email, password, name: String(data.get('name') || '').trim(), username: String(data.get('username') || '').trim() })
      else await auth.login({ email, password })
      navigate(destination, { replace: true })
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Sign-in could not be completed.') }
    finally { setBusy(false) }
  }
  return <div className="auth-layout container"><aside className="auth-editorial"><GraduationCap size={40} aria-hidden="true" /><p className="eyebrow">YOUR LEARNING STORY</p><h2>Good things<br />start with<br /><em>curiosity.</em></h2><p>One account. A world of subjects to explore.</p><Link to="/courses" className="text-link">Take a look around <ArrowRight size={16} aria-hidden="true" /></Link></aside>
    <section className="auth-form-panel"><p className="eyebrow">{register ? 'A FRESH START' : 'WELCOME BACK'}</p><h1>{register ? 'Your next chapter starts here.' : 'Let’s pick up where you left off.'}</h1><p className="muted">{register ? 'Create your Learnfy account.' : 'Sign in to your Learnfy account.'}</p>
      <form onSubmit={submit} aria-busy={busy}><fieldset disabled={busy}>
        {register && <><div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100} /></div><div className="field"><label htmlFor="username">Username</label><input id="username" name="username" autoComplete="username" pattern="[a-zA-Z0-9_]{3,30}" title="Use 3–30 letters, numbers or underscores." required minLength={3} maxLength={30} /></div></>}
        <div className="field"><label htmlFor="email">Email address</label><input type="email" id="email" name="email" autoComplete="email" required maxLength={255} /></div>
        <div className="field"><div className="label-row"><label htmlFor="password">Password</label>{!register && <Link to="/forgot-password">Forgot password?</Link>}</div><div className="password-input"><input type={visible ? 'text' : 'password'} id="password" name="password" autoComplete={register ? 'new-password' : 'current-password'} required minLength={register ? 12 : 1} maxLength={72} aria-describedby={register ? 'password-hint' : undefined} /><button type="button" className="icon-button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(value => !value)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          {register && <p id="password-hint" className="field-hint">At least 12 characters. A unique passphrase works well.</p>}</div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <button className="button full-width" type="submit">{busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}<ArrowRight size={16} aria-hidden="true" /></button>
      </fieldset></form>
      <p className="auth-switch">{register ? 'Already have an account?' : 'New to Learnfy?'} <Link to={register ? '/login' : '/register'} state={{ from: destination }}>{register ? 'Sign in' : 'Create an account'}</Link></p><p className="session-note">For your security, this session is kept in memory and expires automatically. Reloading this page requires signing in again.</p>
    </section>
  </div>
}
