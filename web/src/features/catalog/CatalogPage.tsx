import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import { catalogApi } from '../../api/catalog'
import type { Sort } from '../../api/catalog'
import { useResource } from '../../hooks/useResource'
import { CourseCard } from '../../components/CourseCard'
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../../components/StatusPanel'

const sorts: Record<string, { label: string; sort: Sort; order: 'asc' | 'desc' }> = {
  rating: { label: 'Highest rated', sort: 'rating', order: 'desc' },
  newest: { label: 'Newest first', sort: 'newest', order: 'desc' },
  name: { label: 'Name: A–Z', sort: 'name', order: 'asc' },
  price: { label: 'Listed price: low to high', sort: 'price', order: 'asc' },
}
export function CatalogPage() {
  useEffect(() => { document.title = 'Explore courses — Learnfy' }, [])
  const [params, setParams] = useSearchParams()
  const search = (params.get('q') || '').slice(0, 200)
  const category = (params.get('category') || '').slice(0, 100)
  const selectedSort = sorts[params.get('sort') || 'rating'] ? params.get('sort') || 'rating' : 'rating'
  const rawPage = Number(params.get('page') || 1)
  const page = Number.isSafeInteger(rawPage) && rawPage >= 1 && rawPage <= 100000 ? rawPage : 1
  const load = useCallback((signal: AbortSignal) => catalogApi.search({ search, category, ...sorts[selectedSort], page }, signal), [search, category, selectedSort, page])
  const courses = useResource(`${search}:${category}:${selectedSort}:${page}`, load)
  const categoryLoad = useCallback((signal: AbortSignal) => catalogApi.categories(signal), [])
  const categories = useResource('catalog-categories', categoryLoad)
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    if (key !== 'page') next.delete('page')
    setParams(next)
  }
  return <div className="container catalog-page"><div className="page-heading"><p className="eyebrow">FOLLOW YOUR CURIOSITY</p><h1>What’s your next chapter?</h1><p>Discover courses across subjects. Find the next skill you want to explore.</p></div>
    <form className="catalog-search" role="search" onSubmit={event => { event.preventDefault(); update('q', String(new FormData(event.currentTarget).get('q') || '').trim()) }}>
      <Search aria-hidden="true" /><input key={search} name="q" aria-label="Search catalog" placeholder="Search a topic, skill, or instructor" defaultValue={search} maxLength={200} /><button className="button small" type="submit">Search</button>
    </form>
    <div className="catalog-toolbar"><div className="filter-control"><SlidersHorizontal size={16} aria-hidden="true" /><label htmlFor="category">Subject</label><select id="category" value={category} onChange={event => update('category', event.target.value)}>
      <option value="">All subjects</option>{categories.status === 'ready' && categories.data.map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
      {category && (categories.status !== 'ready' || !categories.data.some(item => item.name === category)) && <option value={category}>{category}</option>}
    </select></div><div className="filter-control"><label htmlFor="sort">Sort by</label><select id="sort" value={selectedSort} onChange={event => update('sort', event.target.value)}>{Object.entries(sorts).map(([value, item]) => <option value={value} key={value}>{item.label}</option>)}</select></div></div>
    {categories.status === 'error' && <p className="inline-note">Subject filters could not be loaded. <button className="text-button" onClick={categories.retry}>Retry filters</button></p>}
    <div className="results-heading" aria-live="polite">{courses.status === 'ready' ? <span>{courses.data.totalCount} {courses.data.totalCount === 1 ? 'course' : 'courses'}{search ? ` for “${search}”` : ''}</span> : <span>Course catalog</span>}
      {(search || category) && <button className="text-button" onClick={() => setParams({})}>Clear filters</button>}</div>
    {courses.status === 'loading' && <LoadingPanel />}{courses.status === 'error' && <ErrorPanel error={courses.error} retry={courses.retry} />}
    {courses.status === 'ready' && <>{courses.data.recommendations.length ? <div className="course-grid">{courses.data.recommendations.map(course => <CourseCard course={course} key={course.id} />)}</div>
      : <EmptyPanel message="No courses match your search. Try a different topic or clear the filters." />}
      {courses.data.totalPages > 1 && <nav className="pagination" aria-label="Course pages"><button className="button secondary small" disabled={page <= 1} onClick={() => update('page', String(page - 1))}><ArrowLeft size={15} aria-hidden="true" />Previous</button><span>Page {page} of {courses.data.totalPages}</span><button className="button secondary small" disabled={page >= courses.data.totalPages} onClick={() => update('page', String(page + 1))}>Next<ArrowRight size={15} aria-hidden="true" /></button></nav>}
    </>}
  </div>
}
