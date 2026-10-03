import { AlertCircle, BookOpen, LoaderCircle } from 'lucide-react'

export function LoadingPanel({ label = 'Loading courses' }: { label?: string }) {
  return <div className="status-panel" role="status"><LoaderCircle className="spin" aria-hidden="true" /><p>{label}…</p></div>
}
export function ErrorPanel({ error, retry }: { error: Error; retry?: () => void }) {
  return <div className="status-panel error-panel" role="alert">
    <AlertCircle aria-hidden="true" /><h2>We couldn’t load this right now</h2><p>{error.message}</p>
    {retry && <button className="button secondary" onClick={retry}>Try again</button>}
  </div>
}
export function EmptyPanel({ message }: { message: string }) {
  return <div className="status-panel"><BookOpen aria-hidden="true" /><h2>Nothing here yet</h2><p>{message}</p></div>
}
