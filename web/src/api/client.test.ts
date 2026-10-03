import { describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest } from './client'

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } })

describe('same-origin API transport', () => {
  it('keeps credentials on relative API requests and serializes JSON', async () => {
    const request = vi.fn().mockResolvedValue(json({ success: true }))
    vi.stubGlobal('fetch', request)
    expect(await apiRequest('/api/auth/login', { method: 'POST', body: { email: 'learner@example.test' }, token: 'test-token' })).toEqual({ success: true })
    const [path, options] = request.mock.calls[0]
    expect(path).toBe('/api/auth/login')
    expect(options.credentials).toBe('same-origin')
    expect(options.headers.get('Authorization')).toBe('Bearer test-token')
    expect(options.body).toBe('{"email":"learner@example.test"}')
  })
  it.each(['https://example.com/api/auth', '//example.com/api/auth', '/other', '/api/\\evil.test'])('rejects external or malformed path %s', async path => {
    const request = vi.fn(); vi.stubGlobal('fetch', request)
    await expect(apiRequest(path)).rejects.toThrow('same-origin')
    expect(request).not.toHaveBeenCalled()
  })
  it('does not disguise authorization errors as success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ message: 'Invalid email or password' }, 401)))
    await expect(apiRequest('/api/auth/login')).rejects.toMatchObject({ status: 401, message: 'Invalid email or password' })
  })
  it('reports missing external configuration explicitly', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ detail: 'Email delivery is not configured.' }, 503)))
    await expect(apiRequest('/api/auth/forgot-password')).rejects.toMatchObject({ status: 503, message: 'Email delivery is not configured.' })
  })
  it('retains rate limiting metadata', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ title: 'Too many requests' }, 429, { 'Retry-After': '30' })))
    await expect(apiRequest('/api/auth/login')).rejects.toMatchObject({ status: 429, retryAfter: 30 })
  })
  it('handles no-content responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))
    expect(await apiRequest('/api/auth/logout', { method: 'POST' })).toBeNull()
  })
  it('fails when a proxy returns HTML instead of the API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>Proxy error</html>', { status: 502 })))
    await expect(apiRequest('/api/courses')).rejects.toBeInstanceOf(ApiError)
  })
  it('does not replace network failure with fake courses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(apiRequest('/api/courses')).rejects.toMatchObject({ status: 0 })
  })
  it('preserves cancellation', async () => {
    const abort = new DOMException('Cancelled', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abort))
    await expect(apiRequest('/api/courses')).rejects.toBe(abort)
  })
  it('fails if a success response is malformed JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{bad', { headers: { 'Content-Type': 'application/json' } })))
    await expect(apiRequest('/api/courses')).rejects.toMatchObject({ status: 502 })
  })
})
