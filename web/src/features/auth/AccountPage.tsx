import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ArrowRight, ShieldCheck, UserRound } from 'lucide-react'
import { useAuth } from './context'
import type { User } from '../../api/contracts'

function ProfileForm({ user }: { user: User }) {
  const auth = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const data = new FormData(event.currentTarget)
    setBusy(true); setError(null); setSaved(false)
    try { await auth.updateProfile({ name: String(data.get('name') || '').trim(), age: Number(data.get('age') || 0), phoneNumber: String(data.get('phone') || '').trim() || null }); setSaved(true) }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Your profile could not be saved.') }
    finally { setBusy(false) }
  }
  return <form onSubmit={submit} aria-busy={busy}><fieldset disabled={busy}><div className="field"><label htmlFor="profile-name">Full name</label><input id="profile-name" name="name" autoComplete="name" defaultValue={user.name} required minLength={2} maxLength={100} /></div>
    <div className="field"><label htmlFor="profile-age">Age</label><input id="profile-age" name="age" type="number" min={0} max={120} step={1} defaultValue={user.age} /><p className="field-hint">Leave as 0 if you prefer not to specify.</p></div>
    <div className="field"><label htmlFor="profile-phone">Phone number (optional)</label><input id="profile-phone" name="phone" type="tel" maxLength={20} autoComplete="tel" defaultValue={user.phoneNumber || ''} /></div>
    {error && <div className="form-error" role="alert">{error}</div>}{saved && <p className="saved-message" role="status">Your profile was saved.</p>}
    <button className="button" type="submit">{busy ? 'Saving…' : 'Save changes'}<ArrowRight size={15} aria-hidden="true" /></button>
  </fieldset></form>
}
export function AccountPage() {
  const auth = useAuth()
  const location = useLocation()
  useEffect(() => { document.title = 'Your account — Learnfy' }, [])
  if (!auth.session) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  const user = auth.session.user
  return <div className="container account-page"><div className="page-heading"><p className="eyebrow">YOUR SPACE</p><h1>Hello, {user.name.split(' ')[0]}.</h1><p>A little about you. Ready for your next chapter.</p></div><div className="account-grid"><aside className="account-summary"><span className="avatar-initial">{user.name.slice(0, 1).toUpperCase()}</span><h2>{user.name}</h2><p>@{user.username}</p><p className="account-email">{user.email}</p><div className="account-security"><ShieldCheck size={18} aria-hidden="true" /><span>Authenticated with Learnfy</span></div><Link className="text-link" to="/courses">Explore courses <ArrowRight size={15} aria-hidden="true" /></Link></aside>
    <section className="profile-panel"><h2><UserRound size={21} aria-hidden="true" />Your profile</h2><p className="muted">Identity and access permissions can’t be changed here.</p><ProfileForm key={user.id} user={user} /><div className="profile-security-note"><h3>Account security</h3><p>Your session expires automatically. <Link to="/forgot-password">Request password recovery</Link> if you need to change your password.</p></div></section></div>
  </div>
}
