import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './AuthProvider'
import { useAuth } from './context'
import { jsonResponse, sessionFixture } from '../../test/fixtures'

function Harness() {
  const auth = useAuth()
  return <><p data-testid="identity">{auth.session?.user.name || 'Anonymous'}</p><p role="status">{auth.notice}</p>
    <button onClick={() => auth.login({ email: 'learner@example.test', password: 'test-passphrase' })}>Login</button>
    <button onClick={auth.logout}>Logout</button></>
}
afterEach(() => vi.useRealTimers())
describe('in-memory verified session lifecycle', () => {
  it('starts anonymous even if localStorage claims to be an admin or purchaser', () => {
    localStorage.setItem('learnfy_user', '{"role":"admin","id":"fake"}')
    render(<AuthProvider><Harness /></AuthProvider>)
    expect(screen.getByTestId('identity')).toHaveTextContent('Anonymous')
    localStorage.clear()
  })
  it('signs out locally and never lies about a failed server revocation', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(jsonResponse(sessionFixture())).mockRejectedValueOnce(new TypeError('Offline')))
    render(<AuthProvider><Harness /></AuthProvider>)
    fireEvent.click(screen.getByText('Login'))
    await screen.findByText('Test Learner')
    expect(localStorage.getItem('learnfy_token')).toBeNull()
    fireEvent.click(screen.getByText('Logout'))
    await waitFor(() => expect(screen.getByTestId('identity')).toHaveTextContent('Anonymous'))
    await screen.findByText(/Server revocation could not be confirmed/)
  })
  it('expires on schedule, not according to localStorage flags', async () => {
    vi.useFakeTimers()
    const session = { ...sessionFixture(), expiresAt: new Date(Date.now() + 1000).toISOString() }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(session)))
    render(<AuthProvider><Harness /></AuthProvider>)
    await act(async () => fireEvent.click(screen.getByText('Login')))
    expect(screen.getByTestId('identity')).toHaveTextContent('Test Learner')
    await act(async () => vi.advanceTimersByTime(1100))
    expect(screen.getByTestId('identity')).toHaveTextContent('Anonymous')
    expect(screen.getByRole('status')).toHaveTextContent('expired')
  })
  it('does not resurrect a session when login resolves after logout', async () => {
    let resolve!: (response: Response) => void
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise<Response>(done => { resolve = done })))
    render(<AuthProvider><Harness /></AuthProvider>)
    fireEvent.click(screen.getByText('Login')); fireEvent.click(screen.getByText('Logout'))
    await act(async () => resolve(jsonResponse(sessionFixture())))
    expect(screen.getByTestId('identity')).toHaveTextContent('Anonymous')
  })
})
