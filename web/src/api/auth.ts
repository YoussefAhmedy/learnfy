import { apiRequest } from './client'
import { decode, decodeSession, messageSchema, userSchema } from './contracts'

export interface Credentials { email: string; password: string }
export interface Registration extends Credentials { name: string; username: string }
export interface ProfileUpdate { name: string; age: number; phoneNumber: string | null }

export const authApi = {
  async login(body: Credentials) { return decodeSession(await apiRequest('/api/auth/login', { method: 'POST', body })) },
  async register(body: Registration) { return decodeSession(await apiRequest('/api/auth/register', { method: 'POST', body })) },
  async me(token: string) { return decode(userSchema, await apiRequest('/api/auth/me', { token })) },
  async profile(token: string, body: ProfileUpdate) {
    return decode(userSchema, await apiRequest('/api/auth/profile', { method: 'PATCH', body, token }))
  },
  async logout(token: string) { await apiRequest('/api/auth/logout', { method: 'POST', token }) },
  async forgotPassword(email: string) {
    return decode(messageSchema, await apiRequest('/api/auth/forgot-password', { method: 'POST', body: { email } }))
  },
  async resetPassword(resetToken: string, newPassword: string) {
    return decode(messageSchema, await apiRequest('/api/auth/reset-password', { method: 'POST', body: { resetToken, newPassword } }))
  },
}
