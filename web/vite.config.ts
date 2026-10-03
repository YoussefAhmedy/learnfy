import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Backend targets are server-only environment variables, never VITE_* browser URLs.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      allowedHosts: ['.e2b.app', 'localhost'],
      proxy: {
        '/api/auth': { target: env.AUTH_API_TARGET || 'http://127.0.0.1:5204', changeOrigin: true },
        '/api/courses': { target: env.COURSES_API_TARGET || 'http://127.0.0.1:5174', changeOrigin: true },
        '/api/categories': { target: env.CATEGORIES_API_TARGET || 'http://127.0.0.1:5058', changeOrigin: true },
      },
    },
    preview: { host: '0.0.0.0', allowedHosts: ['.e2b.app', 'localhost'] },
  }
})
