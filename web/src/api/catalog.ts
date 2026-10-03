import { ApiError, apiRequest } from './client'
import { catalogSchema, categoriesResponseSchema, courseResponseSchema, decode } from './contracts'

export type Sort = 'rating' | 'price' | 'name' | 'newest' | 'recommended'
export interface CatalogQuery { search?: string; category?: string; sort?: Sort; order?: 'asc' | 'desc'; page?: number }
export const catalogApi = {
  async search(query: CatalogQuery, signal?: AbortSignal) {
    const params = new URLSearchParams({ PageSize: '9', Page: String(query.page || 1), SortBy: query.sort || 'rating', SortOrder: query.order || 'desc' })
    if (query.search?.trim()) params.set('SearchTerm', query.search.trim().slice(0, 200))
    if (query.category) params.set('Category', query.category.slice(0, 100))
    const result = decode(catalogSchema, await apiRequest(`/api/courses?${params}`, { signal }))
    if (!result.success) throw new ApiError(502, result.message)
    return result
  },
  async categories(signal?: AbortSignal) {
    const result = decode(categoriesResponseSchema, await apiRequest('/api/categories', { signal }))
    if (!result.success) throw new ApiError(502, result.message)
    return result.data
  },
  async detail(id: number, signal?: AbortSignal) {
    if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(404, 'Course not found.')
    const result = decode(courseResponseSchema, await apiRequest(`/api/courses/${id}`, { signal }))
    if (!result.success || !result.data) throw new ApiError(404, result.message || 'Course not found.')
    return result.data
  },
}
