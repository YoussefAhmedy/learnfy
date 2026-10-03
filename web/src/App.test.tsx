import { StrictMode } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { ApiError } from './api/client'
import { catalogFixture, categoriesFixture, jsonResponse, sessionFixture, userFixture } from './test/fixtures'

function app(path: string, strict = false) {
  const root = <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>
  return render(strict ? <StrictMode>{root}</StrictMode> : root)
}
beforeEach(() => {
  vi.stubGlobal('scrollTo', vi.fn())
  window.history.replaceState(null, '', '/')
})
describe('real account forms', () => {
  it('protects account routes and never renders a forged local user', async () => {
    localStorage.setItem('learnfy_user', JSON.stringify({ name: 'Forged Admin', role: 'admin' }))
    app('/account')
    expect(await screen.findByRole('heading', { name: /pick up where you left off/ })).toBeInTheDocument()
    expect(screen.queryByText('Forged Admin')).not.toBeInTheDocument()
    localStorage.clear()
  })
  it('logs in, saves profile through the API, and signs out through the server', async () => {
    const request = vi.fn().mockImplementation((path: string) => {
      if (path === '/api/auth/login') return Promise.resolve(jsonResponse(sessionFixture()))
      if (path === '/api/auth/profile') return Promise.resolve(jsonResponse({ ...userFixture, name: 'Updated Name' }))
      if (path === '/api/auth/logout') return Promise.resolve(new Response(null, { status: 204 }))
      return Promise.resolve(jsonResponse(catalogFixture))
    })
    vi.stubGlobal('fetch', request)
    const user = userEvent.setup()
    app('/account')
    await user.type(screen.getByLabelText('Email address'), 'learner@example.test')
    await user.type(screen.getByLabelText('Password'), 'a unique long passphrase')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('heading', { name: 'Hello, Test.' })).toBeInTheDocument()
    await user.clear(screen.getByLabelText('Full name')); await user.type(screen.getByLabelText('Full name'), 'Updated Name')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(await screen.findByText('Your profile was saved.')).toBeInTheDocument()
    const call = request.mock.calls.find(([path]) => path === '/api/auth/profile')
    expect(call?.[1].headers.get('Authorization')).toBe('Bearer test-only-token')
    expect(JSON.parse(call?.[1].body)).toEqual({ name: 'Updated Name', age: 25, phoneNumber: null })
    await user.click(screen.getByRole('button', { name: 'Sign out' }))
    await screen.findByText(/active sessions have been revoked/)
  })
  it('shows a real rejected-login error without authenticating', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ message: 'Invalid email or password' }, 401)))
    const user = userEvent.setup(); app('/login')
    await user.type(screen.getByLabelText('Email address'), 'learner@example.test')
    await user.type(screen.getByLabelText('Password'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')
    expect(screen.queryByRole('heading', { name: /Hello/ })).not.toBeInTheDocument()
  })
  it('registers through the real endpoint with separate display name and username', async () => {
    const request = vi.fn().mockResolvedValue(jsonResponse(sessionFixture(), 201)); vi.stubGlobal('fetch', request)
    const user = userEvent.setup(); app('/register')
    await user.type(screen.getByLabelText('Full name'), 'Full Name')
    await user.type(screen.getByLabelText('Username'), 'full_name')
    await user.type(screen.getByLabelText('Email address'), 'learner@example.test')
    await user.type(screen.getByLabelText('Password'), 'a unique long passphrase')
    await user.click(screen.getByRole('button', { name: 'Create account' }))
    await screen.findByRole('heading', { name: 'Hello, Test.' })
    expect(request.mock.calls[0][0]).toBe('/api/auth/register')
    expect(JSON.parse(request.mock.calls[0][1].body)).toEqual({ name: 'Full Name', username: 'full_name', email: 'learner@example.test', password: 'a unique long passphrase' })
  })
  it('does not claim a reset email was sent when the service is unconfigured', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ detail: 'Password reset delivery is unavailable.' }, 503)))
    const user = userEvent.setup(); app('/forgot-password')
    await user.type(screen.getByLabelText('Email address'), 'learner@example.test')
    await user.click(screen.getByRole('button', { name: 'Request reset link' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('unavailable')
    expect(screen.queryByText(/email has been requested/)).not.toBeInTheDocument()
  })
  it('keeps the reset credential in memory, removes the fragment and survives StrictMode', async () => {
    const credential = 'test-only-reset-credential-for-this-contract'
    window.history.replaceState(null, '', `/reset-password#token=${credential}`)
    const request = vi.fn().mockResolvedValue(jsonResponse({ success: true, message: 'Password reset successful. Please sign in again.' })); vi.stubGlobal('fetch', request)
    const user = userEvent.setup(); app('/reset-password', true)
    expect(window.location.hash).toBe('')
    await user.type(screen.getByLabelText('New password'), 'a different secure passphrase')
    await user.type(screen.getByLabelText('Confirm new password'), 'a different secure passphrase')
    await user.click(screen.getByRole('button', { name: 'Reset password' }))
    await screen.findByText(/Password reset successful/)
    expect(JSON.parse(request.mock.calls[0][1].body).resetToken).toBe(credential)
    expect(localStorage.getItem('learnfy_reset_token')).toBeNull()
  })
  it('makes missing reset credentials explicit', async () => {
    app('/reset-password')
    expect(await screen.findByRole('alert')).toHaveTextContent('missing its credential')
  })
})

describe('server-backed catalog discovery', () => {
  it('renders API records without invented learner metrics and updates query filters', async () => {
    const request = vi.fn().mockImplementation((path: string) => Promise.resolve(jsonResponse(path.startsWith('/api/categories') ? categoriesFixture : catalogFixture)))
    vi.stubGlobal('fetch', request)
    const user = userEvent.setup(); app('/courses')
    expect(await screen.findByRole('heading', { name: 'A Real Contract Course' })).toBeInTheDocument()
    expect(screen.queryByText('64K+')).not.toBeInTheDocument()
    await user.type(screen.getByLabelText('Search catalog'), 'typescript')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    await waitFor(() => expect(request.mock.calls.some(([path]) => path.includes('SearchTerm=typescript'))).toBe(true))
    await user.selectOptions(screen.getByLabelText('Subject'), 'Software Development')
    await waitFor(() => expect(request.mock.calls.some(([path]) => path.includes('Category=Software+Development'))).toBe(true))
  })
  it('shows a recoverable server failure rather than replacing it with demo courses', async () => {
    let failed = true
    vi.stubGlobal('fetch', vi.fn().mockImplementation((path: string) => Promise.resolve(path.startsWith('/api/categories') ? jsonResponse(categoriesFixture) : failed ? jsonResponse({ message: 'Catalog unavailable' }, 503) : jsonResponse(catalogFixture))))
    const user = userEvent.setup(); app('/courses')
    expect(await screen.findByRole('alert')).toHaveTextContent('Catalog unavailable')
    expect(screen.queryByText('Modern Fullstack Architecture')).not.toBeInTheDocument()
    failed = false; await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('heading', { name: 'A Real Contract Course' })).toBeInTheDocument()
  })
  it('renders a genuine empty state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation((path: string) => Promise.resolve(jsonResponse(path.startsWith('/api/categories') ? categoriesFixture : { ...catalogFixture, recommendations: [], totalCount: 0, totalPages: 0 }))))
    app('/courses'); expect(await screen.findByText(/No courses match your search/)).toBeInTheDocument()
  })
  it('does not query an arbitrary or invalid course identifier', async () => {
    const request = vi.fn(); vi.stubGlobal('fetch', request); app('/courses/not-a-number')
    expect(await screen.findByRole('alert')).toHaveTextContent('Course not found')
    expect(request).not.toHaveBeenCalled()
  })
  it('cancels old catalog requests when the search route changes', async () => {
    let firstSignal: AbortSignal | undefined
    vi.stubGlobal('fetch', vi.fn().mockImplementation((path: string, options: RequestInit) => {
      if (path.startsWith('/api/categories')) return Promise.resolve(jsonResponse(categoriesFixture))
      if (path.includes('SearchTerm=old')) { firstSignal = options.signal as AbortSignal; return new Promise(() => {}) }
      return Promise.resolve(jsonResponse(catalogFixture))
    }))
    app('/courses?q=old')
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    await screen.findByRole('heading', { name: 'A Real Contract Course' })
    expect(firstSignal?.aborted).toBe(true)
  })
})

// The failure type is public, rather than replaced by silent empty data.
it('preserves typed API errors', () => expect(new ApiError(403, 'Forbidden').status).toBe(403))
