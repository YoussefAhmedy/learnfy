// Test-only API fixtures; never imported by production components.
export const userFixture = { id: 1, name: 'Test Learner', username: 'test_learner', email: 'learner@example.test', role: 'Student' as const, age: 25, phoneNumber: null }
export const sessionFixture = () => ({ success: true, message: 'Login successful', token: 'test-only-token', user: userFixture, expiresAt: new Date(Date.now() + 15 * 60000).toISOString() })
export const courseFixture = { id: 4, courseName: 'A Real Contract Course', category: 'Software Development', description: 'Course description from the API.', imageUrl: null, instructor: 'Test Instructor', duration: '8 hours', rating: 4.8, price: 99.99 }
export const categoriesFixture = { success: true, message: 'Categories', data: [{ id: 1, name: 'Software Development', description: 'Development', iconUrl: null, color: '#A3319E', courseCount: 1 }] }
export const catalogFixture = { success: true, message: 'Courses', recommendations: [courseFixture], totalCount: 1, currentPage: 1, totalPages: 1 }
export const jsonResponse = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })
