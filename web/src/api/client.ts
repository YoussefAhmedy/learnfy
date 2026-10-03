export class ApiError extends Error {
  readonly status: number
  readonly retryAfter?: number

  constructor(status: number, message: string, retryAfter?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.retryAfter = retryAfter
  }
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string
  signal?: AbortSignal
}

function errorMessage(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  for (const field of ['detail', 'message', 'title']) {
    if (field in value) {
      const message = (value as Record<string, unknown>)[field]
      if (typeof message === 'string' && message.trim()) return message
    }
  }
}

// Transport returns unknown; endpoint adapters must validate the response contract.
export async function apiRequest(path: string, options: ApiRequestOptions = {}): Promise<unknown> {
  if (!path.startsWith('/api/') || path.includes('\\')) throw new Error('API requests must use a same-origin /api/ path.')
  const headers = new Headers({ Accept: 'application/json' })
  if (options.body !== undefined) headers.set('Content-Type', 'application/json')
  if (options.token) headers.set('Authorization', `Bearer ${options.token}`)
  let response: Response
  try {
    response = await fetch(path, {
      method: options.method || 'GET', headers, credentials: 'same-origin',
      body: options.body === undefined ? undefined : JSON.stringify(options.body), signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'The Learnfy server could not be reached. Please try again.')
  }
  if (response.status === 204) return null
  let data: unknown
  if (response.headers.get('Content-Type')?.includes('json')) {
    try { data = await response.json() }
    catch { throw new ApiError(response.ok ? 502 : response.status, 'The server returned an unreadable response. Please try again.') }
  }
  if (!response.ok) {
    const retry = Number(response.headers.get('Retry-After'))
    throw new ApiError(response.status, errorMessage(data) ||
      (response.status === 401 ? 'Please sign in again.' : 'The request could not be completed. Please try again.'),
      Number.isFinite(retry) && retry > 0 ? retry : undefined)
  }
  if (data === undefined) throw new ApiError(502, 'The server returned an unexpected response. Please try again.')
  return data
}
