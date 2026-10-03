import { createContext, useContext } from 'react'
import type { Credentials, ProfileUpdate, Registration } from '../../api/auth'
import type { Session, User } from '../../api/contracts'

export interface AuthState {
  session: Session | null
  notice: string | null
  login: (input: Credentials) => Promise<void>
  register: (input: Registration) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (input: ProfileUpdate) => Promise<User>
  clearNotice: () => void
}
export const AuthContext = createContext<AuthState | null>(null)
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider is required.')
  return value
}
