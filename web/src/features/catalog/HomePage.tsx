// LearnSpring landing layout recovered from 717f902; metrics/promises are evidence-based.
import { ArrowRight, ArrowUpRight, BookOpen, Compass, GraduationCap, Layers3 } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { catalogApi } from '../../api/catalog'
import { useResource } from '../../hooks/useResource'
import { CourseCard } from '../../components/CourseCard'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../../components/StatusPanel'

export function HomePage() {
  useEffect(() => { document.title = 'Learnfy — Find your next chapter' }, [])
  const load = useCallback((signal: AbortSignal) => catalogApi.search({ sort: 'rating' }, signal), [])
  const catalog = useResource('home-catalog', load)
  const categoryLoad = useCallback((signal: AbortSignal) => catalogApi.categories(signal), [])
  const categories = useResource('home-categories', categoryLoad)
  return <>
    <section className="hero"><div className="container hero-inner">
      <div className="hero-copy"><span className="eyebrow"><span className="tiny-square" />A LITTLE CURIOSITY. A NEW POSSIBILITY.</span>
        <h1>Make room for<br />your <span>next chapter.</span></h1>
        <p>Follow your curiosity, build practical skills, and discover a course that moves you forward. Your next step starts here.</p>
        <div className="hero-actions"><Link to="/courses" className="button">Explore courses <ArrowRight size={17} aria-hidden="true" /></Link><Link to="/register" className="button secondary">Create an account <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        <div className="hero-note"><BookOpen size={16} aria-hidden="true" /><span>Different subjects. One place to discover them.</span></div>
      </div>
      <div className="hero-editorial" aria-hidden="true"><div className="editorial-top"><span>THE LEARNING NOTEBOOK</span><span>01 / START HERE</span></div>
        <div className="editorial-title">Curiosity is<br />a good place<br /><em>to begin.</em></div><div className="editorial-line" />
        <div className="editorial-footer"><GraduationCap size={45} /><span>Small steps.<br />New perspectives.</span><ArrowUpRight size={30} /></div>
      </div>
    </div></section>
    <section className="category-strip"><div className="container"><p className="section-kicker">FIND YOUR DIRECTION</p>
      {categories.status === 'ready' && <div className="category-links"><Link to="/courses" className="category-link">All courses <ArrowUpRight size={14} aria-hidden="true" /></Link>
        {categories.data.map(category => <Link className="category-link" key={category.id} to={`/courses?category=${encodeURIComponent(category.name)}`}>{category.name}<span>{category.courseCount}</span><ArrowUpRight size={14} aria-hidden="true" /></Link>)}
      </div>}
      {categories.status === 'loading' && <p className="muted" role="status">Loading subjects…</p>}
      {categories.status === 'error' && <p className="muted">Subjects are unavailable right now. <Link to="/courses">Browse the catalog</Link></p>}
    </div></section>
    <section className="section container"><div className="section-heading"><div><p className="eyebrow">A PLACE TO START</p><h2>Find something worth learning.</h2><p>Explore the highest-rated courses in the current catalog.</p></div><Link className="text-link" to="/courses">View all courses <ArrowRight size={16} aria-hidden="true" /></Link></div>
      {catalog.status === 'loading' && <LoadingPanel />}
      {catalog.status === 'error' && <ErrorPanel error={catalog.error} retry={catalog.retry} />}
      {catalog.status === 'ready' && (catalog.data.recommendations.length ? <div className="course-grid">{catalog.data.recommendations.slice(0, 6).map(course => <CourseCard key={course.id} course={course} />)}</div>
        : <EmptyPanel message="The catalog is empty. Published courses will appear here when they are added." />)}
    </section>
    <section className="learning-values"><div className="container"><div className="values-heading"><p className="eyebrow">LEARNING, WITHOUT THE NOISE</p><h2>A clearer path to discovery.</h2></div>
      <div className="values-grid"><div><Compass aria-hidden="true" /><h3>Find your direction</h3><p>Explore by subject, search for a skill, or sort by what matters to you.</p></div><div><Layers3 aria-hidden="true" /><h3>Look a little closer</h3><p>Read course descriptions, meet instructors, and compare what’s in the catalog.</p></div><div><BookOpen aria-hidden="true" /><h3>Make it yours</h3><p>Create your own account and keep your profile up to date.</p></div></div>
    </div></section>
  </>
}
