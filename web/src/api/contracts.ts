import { z } from 'zod'
import { ApiError } from './client'

export const userSchema = z.object({
  id: z.number().int().positive(), name: z.string(), username: z.string(), email: z.string(),
  role: z.enum(['Student', 'Admin', 'Instructor']), age: z.number().int().min(0).max(120),
  phoneNumber: z.string().nullable(),
})
export type User = z.infer<typeof userSchema>
export const authResponseSchema = z.object({
  success: z.boolean(), message: z.string(), token: z.string().nullable(), user: userSchema.nullable(), expiresAt: z.string().nullable(),
})
export interface Session { token: string; user: User; expiresAt: number }
export const messageSchema = z.object({ success: z.boolean(), message: z.string() })

export const courseSchema = z.object({
  id: z.number().int().positive(), courseName: z.string(), category: z.string(),
  imageUrl: z.string().nullable(), description: z.string().nullable(), instructor: z.string().nullable(),
  duration: z.string().nullable(), rating: z.number().min(0).max(5).nullable(), price: z.number().nonnegative().nullable(),
})
export type Course = z.infer<typeof courseSchema>
export const catalogSchema = z.object({
  success: z.boolean(), message: z.string(), recommendations: z.array(courseSchema),
  totalCount: z.number().int().nonnegative(), currentPage: z.number().int().positive(), totalPages: z.number().int().nonnegative(),
})
export type Catalog = z.infer<typeof catalogSchema>
export const courseResponseSchema = z.object({ success: z.boolean(), message: z.string(), data: courseSchema.nullable() })
export const categorySchema = z.object({
  id: z.number().int().positive(), name: z.string(), description: z.string().nullable(),
  iconUrl: z.string().nullable(), color: z.string(), courseCount: z.number().int().nonnegative(),
})
export type Category = z.infer<typeof categorySchema>
export const categoriesResponseSchema = z.object({ success: z.boolean(), message: z.string(), data: z.array(categorySchema) })

export function decode<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value)
  if (!result.success) throw new ApiError(502, 'The server returned an unexpected data format. Please try again or contact support.')
  return result.data
}

export function decodeSession(value: unknown, now = Date.now()): Session {
  const result = decode(authResponseSchema, value)
  const expiry = result.expiresAt ? Date.parse(result.expiresAt) : NaN
  if (!result.success || !result.token || !result.user || !Number.isFinite(expiry) || expiry <= now) {
    throw new ApiError(401, result.success ? 'The sign-in session is invalid or expired. Please sign in again.' : result.message)
  }
  return { token: result.token, user: result.user, expiresAt: expiry }
}
