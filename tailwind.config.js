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
        info: '#12b59d',
        warn: '#f59e0b',
        danger: '#e53e3e',
        weed: '#5b9764',
      },
      gridTemplateColumns: {
        'section': '1fr minmax(700px,3fr) 1fr',
      },
      screens: {
        '2xl': '1536px',
        '3xl': '1842px',
        '4xl': '2380px',
      },
      backgroundImage: {
        'link-arrow': "url('/images/link-arrow.svg')",
        'galaxy': "url('/images/galaxy.webp')",
        'weed-boi': "url('/images/weed-boi-bg.png')",
      },
      typography: ({ theme }) => ({
        'only-dark': {
          css: {
            '--tw-prose-body': '#d4d4d4',
            '--tw-prose-headings': '#fff',
            '--tw-prose-lead': '#a3a3a3',
            '--tw-prose-links': '#fff',
            '--tw-prose-bold': '#fff',
            '--tw-prose-counters': '#a3a3a3',
            '--tw-prose-bullets': '#525252',
            '--tw-prose-hr': '#404040',
            '--tw-prose-quotes': '#f5f5f5',
            '--tw-prose-quote-borders': '#404040',
            '--tw-prose-captions': '#a3a3a3',
            '--tw-prose-code': '#fff',
            '--tw-prose-pre-code': '#d4d4d4',
            '--tw-prose-pre-bg': 'rgba(0, 0, 0, 0.5)',
            '--tw-prose-th-borders': '#525252',
            '--tw-prose-td-borders': '#404040',
            '--tw-prose-invert-body': '#d4d4d4',
            '--tw-prose-invert-headings': '#fff',
            '--tw-prose-invert-lead': '#a3a3a3',
            '--tw-prose-invert-links': '#fff',
            '--tw-prose-invert-bold': '#fff',
            '--tw-prose-invert-counters': '#a3a3a3',
            '--tw-prose-invert-bullets': '#525252',
            '--tw-prose-invert-hr': '#404040',
            '--tw-prose-invert-quotes': '#f5f5f5',
            '--tw-prose-invert-quote-borders': '#404040',
            '--tw-prose-invert-captions': '#a3a3a3',
            '--tw-prose-invert-code': '#fff',
            '--tw-prose-invert-pre-code': '#d4d4d4',
            '--tw-prose-invert-pre-bg': 'rgba(0, 0, 0, 0.5)',
            '--tw-prose-invert-th-borders': '#525252',
            '--tw-prose-invert-td-borders': '#404040',
          },
        },
      }),
      keyframes: {
        weed: {
          '0%': { transform: 'translate(-10%, 0%)'},
          '50%': { transform: 'translate(-40.5%, -40.5%)' },
          '100%': { transform: 'translate(-10%, 0%)'},
        }
      },
      animation: {
        'weed': 'weed 30s ease-in-out infinite',
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('@tailwindcss/typography')],
}

module.exports = config
