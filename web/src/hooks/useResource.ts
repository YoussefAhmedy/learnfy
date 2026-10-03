import { useEffect, useState } from 'react'

export type Resource<T> = { status: 'loading' } | { status: 'ready'; data: T } | { status: 'error'; error: Error }
export function useResource<T>(key: string, load: (signal: AbortSignal) => Promise<T>) {
  const [revision, setRevision] = useState(0)
  const [result, setResult] = useState<{ key: string; revision: number; state: Resource<T> }>()
  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal).then(data => {
      if (!controller.signal.aborted) setResult({ key, revision, state: { status: 'ready', data } })
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResult({ key, revision, state: { status: 'error', error: error instanceof Error ? error : new Error('The request failed.') } })
    })
    return () => controller.abort()
  }, [key, load, revision])
  const state: Resource<T> = result?.key === key && result.revision === revision ? result.state : { status: 'loading' }
  return { ...state, retry: () => setRevision(value => value + 1) }
}
