import { useCallback, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Clock, Star, UserRound } from 'lucide-react'
import { catalogApi } from '../../api/catalog'
import { useResource } from '../../hooks/useResource'
import { ErrorPanel, LoadingPanel } from '../../components/StatusPanel'
import { useAuth } from '../auth/context'

export function CoursePage() {
  const { id } = useParams()
  const numericId = /^\d+$/.test(id || '') ? Number(id) : NaN
  const load = useCallback((signal: AbortSignal) => catalogApi.detail(numericId, signal), [numericId])
  const result = useResource(`course:${id}`, load)
  const auth = useAuth()
  useEffect(() => { document.title = result.status === 'ready' ? `${result.data.courseName} — Learnfy` : 'Course overview — Learnfy' }, [result])
  return <div className="container course-page"><Link className="text-link back-link" to="/courses"><ArrowLeft size={15} aria-hidden="true" />Back to courses</Link>
    {result.status === 'loading' && <LoadingPanel label="Loading course" />}
    {result.status === 'error' && <ErrorPanel error={result.error} retry={result.retry} />}
    {result.status === 'ready' && <div className="detail-grid"><div><span className="eyebrow">{result.data.category}</span><h1>{result.data.courseName}</h1><p className="detail-description">{result.data.description || 'A description has not been published for this course yet.'}</p>
      <div className="detail-meta">{result.data.instructor && <span><UserRound size={17} aria-hidden="true" />{result.data.instructor}</span>}{result.data.duration && <span><Clock size={17} aria-hidden="true" />{result.data.duration}</span>}{result.data.rating !== null && <span><Star size={17} aria-hidden="true" />{result.data.rating.toFixed(1)} / 5</span>}</div>
      <div className="detail-note"><BookOpen aria-hidden="true" /><div><h2>About this course</h2><p>This is the published catalog overview. Curriculum, course access, and purchasing are not available in this recovery checkpoint.</p></div></div>
    </div><aside className="detail-aside"><span className="section-kicker">YOUR NEXT STEP</span><h2>A little curiosity goes a long way.</h2><p>Explore the catalog and keep your account ready for your learning journey.</p>
      {result.data.price !== null && <p className="price-note">Listed numeric price: {result.data.price.toFixed(2)}. The legacy catalog does not specify currency; no payment is requested.</p>}
      <Link className="button" to={auth.session ? '/account' : '/register'}>{auth.session ? 'Your account' : 'Create an account'}<ArrowRight size={16} aria-hidden="true" /></Link><Link className="text-link" to={`/courses?category=${encodeURIComponent(result.data.category)}`}>More in {result.data.category}</Link>
    </aside></div>}
  </div>
}
