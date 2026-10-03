// Recover responsive LearnSpring navigation structure without its simulated account/cart.
import { useEffect, useRef } from 'react'
import { ArrowUpRight, BookOpen, GraduationCap, LogOut, Search, UserRound, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context'

export function Layout() {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const main = useRef<HTMLElement>(null)
  const previous = useRef(location.pathname)
  useEffect(() => {
    if (previous.current !== location.pathname) { main.current?.focus(); window.scrollTo(0, 0) }
    previous.current = location.pathname
  }, [location.pathname])
  async function signOut() { await auth.logout(); navigate('/') }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Learnfy home"><span className="brand-mark"><GraduationCap size={23} aria-hidden="true" /></span><span>learnfy<span className="brand-dot">.</span></span></Link>
        <nav aria-label="Main navigation" className="desktop-nav"><NavLink to="/courses">Explore courses</NavLink><NavLink to="/account">My account</NavLink></nav>
        <form className="header-search" role="search" onSubmit={event => { event.preventDefault(); const query = new FormData(event.currentTarget).get('search'); navigate(`/courses?q=${encodeURIComponent(String(query || ''))}`) }}>
          <Search size={16} aria-hidden="true" /><input name="search" aria-label="Search courses" placeholder="What do you want to learn?" maxLength={200} />
        </form>
        <div className="header-actions">{auth.session ? <>
          <Link to="/account" className="account-link"><UserRound size={17} aria-hidden="true" /><span>{auth.session.user.name.split(' ')[0]}</span></Link>
          <button className="icon-button" aria-label="Sign out" onClick={signOut}><LogOut size={17} /></button>
        </> : <><Link className="login-link" to="/login">Sign in</Link><Link className="button small" to="/register">Get started <ArrowUpRight size={14} aria-hidden="true" /></Link></>}</div>
      </div>
    </header>
    {auth.notice && <div className="notice-bar" role="status"><span>{auth.notice}</span><button className="icon-button" aria-label="Dismiss notification" onClick={auth.clearNotice}><X size={15} /></button></div>}
    <main ref={main} id="main" tabIndex={-1}><Outlet /></main>
    <footer className="site-footer"><div className="footer-inner">
      <div><Link className="brand" to="/">learnfy<span className="brand-dot">.</span></Link><p>Space to learn. Room to grow.</p></div>
      <nav aria-label="Footer navigation"><Link to="/courses">Explore courses</Link><Link to="/account">Your account</Link><Link to="/forgot-password">Account recovery</Link></nav>
      <p className="muted">Learnfy · Learning, at your pace.</p>
    </div></footer>
    <nav className="mobile-nav" aria-label="Mobile navigation"><NavLink to="/" end><GraduationCap size={21} aria-hidden="true" />Home</NavLink><NavLink to="/courses"><BookOpen size={21} aria-hidden="true" />Explore</NavLink><NavLink to="/account"><UserRound size={21} aria-hidden="true" />Account</NavLink></nav>
  </>
}
