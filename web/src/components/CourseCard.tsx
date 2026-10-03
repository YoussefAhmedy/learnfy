// Adapted from preserved 717f902 LearnSpring card layout; no mock ownership/statistics.
import { ArrowUpRight, BookOpen, Clock, Star, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Course } from '../api/contracts'

export function CourseCard({ course }: { course: Course }) {
  const [failedImage, setFailedImage] = useState(false)
  const image = course.imageUrl && /^https?:\/\//.test(course.imageUrl) && !failedImage ? course.imageUrl : null
  return <article className="course-card">
    <Link className="course-image" to={`/courses/${course.id}`} aria-label={`View ${course.courseName}`}>
      {image ? <img src={image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedImage(true)} />
        : <div className="course-art"><BookOpen size={48} aria-hidden="true" /><span>{course.category}</span></div>}
      <span className="image-label">{course.category}</span>
      <span className="image-arrow"><ArrowUpRight size={18} aria-hidden="true" /></span>
    </Link>
    <div className="course-content">
      <div className="course-meta"><span>{course.category}</span>{course.duration && <span><Clock size={13} aria-hidden="true" />{course.duration}</span>}</div>
      <h3><Link to={`/courses/${course.id}`}>{course.courseName}</Link></h3>
      {course.description && <p className="course-description">{course.description}</p>}
      {course.instructor && <p className="instructor"><UserRound size={14} aria-hidden="true" />{course.instructor}</p>}
      <div className="course-footer">
        {course.rating === null ? <span className="muted">Not rated</span> : <span className="rating"><Star size={14} aria-hidden="true" />{course.rating.toFixed(1)}<span className="muted">/ 5</span></span>}
        <Link to={`/courses/${course.id}`} className="text-link">View overview <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>
    </div>
  </article>
}
