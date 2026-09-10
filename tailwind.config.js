/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050403',
          900: '#0a0908',
          850: '#0f0e0c',
          800: '#141311',
          700: '#1c1a17',
          600: '#26221d',
          500: '#3a342c',
          400: '#5c5347'
        },
        bone: {
          50: '#f8f4ec',
          100: '#f5f0e6',
          200: '#e8e0d0',
          300: '#c9bfa9'
        },
        champagne: {
          400: '#e0c99a',
          500: '#c9a878',
          600: '#a88760',
          700: '#8a7654'
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        tightest: '-0.04em',
        wideish: '0.12em',
        widest2: '0.24em'
      }
    }
  },
  plugins: []
}
