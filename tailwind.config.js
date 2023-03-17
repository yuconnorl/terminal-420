/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      fontFamily: {
        'sans-serif': ['var(--font-noto)', 'sans-serif'],
        mono: ['var(--font-jet-brain)'],
      },
      colors: {
        'main-black': '#1d1b1b',
        'main-gray': '#999999',
        mallard: {
          50: '#f5f8f1',
          100: '#e8efdc',
          200: '#cfdebc',
          300: '#abc68f',
          400: '#81a760',
          500: '#608a3f',
          600: '#486e2d',
          700: '#385824',
          800: '#2e461f',
          900: '#233618',
        },
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        'section': '1fr minmax(700px,3fr) 1fr',
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('@tailwindcss/typography')],
}

module.exports = config
