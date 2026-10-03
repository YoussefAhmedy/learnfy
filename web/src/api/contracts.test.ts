import { describe, expect, it } from 'vitest'
import { ApiError } from './client'
import { catalogSchema, decode, decodeSession, userSchema } from './contracts'
import { catalogFixture, sessionFixture, userFixture } from '../test/fixtures'
import { passwordError, safeReturnPath } from '../features/auth/validation'

describe('real API contract boundaries', () => {
  it('decodes server data and strips unexpected private fields', () => {
    expect(decode(userSchema, { ...userFixture, passwordHash: 'must not escape', securityStamp: 'private' })).toEqual(userFixture)
    expect(decode(catalogSchema, catalogFixture).totalCount).toBe(1)
  })
  it.each([{ ...catalogFixture, totalCount: '64K' }, { ...catalogFixture, recommendations: [{ id: 'fake-1' }] }, { ...catalogFixture, totalPages: -1 }])('rejects fake or malformed catalog contracts', input => {
    expect(() => decode(catalogSchema, input)).toThrow(ApiError)
  })
  it.each([{ ...sessionFixture(), token: null }, { ...sessionFixture(), user: null }, { ...sessionFixture(), expiresAt: 'bad' }, { ...sessionFixture(), expiresAt: '2000-01-01T00:00:00Z' }])('does not authenticate an invalid session', input => {
    expect(() => decodeSession(input)).toThrow(ApiError)
  })
  it('only returns a session after a successful full server response', () => {
    expect(decodeSession(sessionFixture()).user.email).toBe(userFixture.email)
    expect(() => decodeSession({ ...sessionFixture(), success: false, message: 'Denied' })).toThrow('Denied')
  })
  it('matches the server UTF-8 password policy', () => {
    expect(passwordError('too short')).toBeTruthy()
    expect(passwordError('a unique long passphrase')).toBeUndefined()
    expect(passwordError('🔒'.repeat(20))).toBeTruthy()
  })
  it.each(['https://evil.test', '//evil.test', '/\\evil.test', 'javascript:alert(1)', '/login'])('rejects unsafe return destination %s', destination => {
    expect(safeReturnPath(destination)).toBe('/account')
  })
  it('keeps a same-origin protected return destination', () => expect(safeReturnPath('/account?section=profile')).toBe('/account?section=profile'))
})
