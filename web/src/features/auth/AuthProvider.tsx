import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError } from '../../api/client'
import { authApi } from '../../api/auth'
import type { Credentials, ProfileUpdate, Registration } from '../../api/auth'
import type { Session } from '../../api/contracts'
import { AuthContext } from './context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const current = useRef<Session | null>(null)
  const generation = useRef(0)
  const apply = useCallback((next: Session | null) => {
    current.current = next
    setSession(next)
  }, [])
  const login = useCallback(async (input: Credentials) => {
    const request = ++generation.current
    const next = await authApi.login(input)
    if (request !== generation.current) return
    apply(next); setNotice(null)
  }, [apply])
  const register = useCallback(async (input: Registration) => {
    const request = ++generation.current
    const next = await authApi.register(input)
    if (request !== generation.current) return
    apply(next); setNotice(null)
  }, [apply])
  const logout = useCallback(async () => {
    const token = current.current?.token
    generation.current++
    apply(null) // Remove local access immediately; a failed server revocation is not hidden.
    if (!token) return
    try { await authApi.logout(token); setNotice('Signed out. Your active sessions have been revoked.') }
    catch { setNotice('Signed out on this device. Server revocation could not be confirmed; the token will expire automatically.') }
  }, [apply])
  const updateProfile = useCallback(async (input: ProfileUpdate) => {
    const active = current.current
    if (!active || active.expiresAt <= Date.now()) throw new ApiError(401, 'Please sign in again.')
    try {
      const user = await authApi.profile(active.token, input)
      if (current.current?.token !== active.token) throw new ApiError(401, 'The session changed. Please sign in again.')
      apply({ ...active, user })
      return user
    } catch (error) {
      if (error instanceof ApiError && error.status === 401 && current.current?.token === active.token) {
        generation.current++; apply(null); setNotice('Your session is no longer valid. Please sign in again.')
      }
      throw error
    }
  }, [apply])
  useEffect(() => {
    if (!session) return
    const expire = () => {
      if (current.current?.token !== session.token || Date.now() < session.expiresAt) return
      generation.current++; apply(null); setNotice('Your session expired. Please sign in again.')
    }
    const timer = window.setTimeout(expire, Math.max(0, session.expiresAt - Date.now()))
    window.addEventListener('focus', expire)
    return () => { window.clearTimeout(timer); window.removeEventListener('focus', expire) }
  }, [session, apply])
  const clearNotice = useCallback(() => setNotice(null), [])
  const value = useMemo(() => ({ session, notice, login, register, logout, updateProfile, clearNotice }),
    [session, notice, login, register, logout, updateProfile, clearNotice])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
