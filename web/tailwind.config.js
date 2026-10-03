/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F3EDE0',
          300: '#E7DCB3',
        },
        surface: {
          light: '#F8F9FA',
          subtle: '#F3F4F6',
          border: '#E5E7EB',
          darkBorder: '#D1D5DB',
        },
        coral: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        brand: {
          red: '#DC2626',
          dark: '#111827',
          muted: '#6B7280',
          bg: '#FAFAFA',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
