export function passwordError(value: string): string | undefined {
  if (value.length < 12) return 'Use at least 12 characters.'
  if (new TextEncoder().encode(value).length > 72) return 'Use no more than 72 UTF-8 bytes.'
}
export function safeReturnPath(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/account'
  const url = new URL(value, window.location.origin)
  if (url.origin !== window.location.origin || ['/login', '/register', '/reset-password', '/forgot-password'].includes(url.pathname)) return '/account'
  return `${url.pathname}${url.search}`
}
