/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      fontSize: {
        m: ['0.95rem', '1.4rem'],
        '1.5xl': ['1.35rem', '1.85rem'],
        '2.5xl': ['1.7rem', '2.1rem'],
      },
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
        'weed-200': '#bedcbf',
        mushroom: '#e293db',
        'mushroom-200': '#f6d8f5',
      },
      gridTemplateColumns: {
        section: '1fr minmax(700px,3fr) 1fr',
      },
      screens: {
        '2xl': '1536px',
        '3xl': '1842px',
        '4xl': '2380px',
      },
      backgroundImage: {
        'link-arrow': "url('/images/link-arrow.svg')",
        galaxy: "url('/images/galaxy.webp')",
        'weed-boi': "url('/images/weed-boi-bg.png')",
        'mushroom-img': "url('/images/mushroom-bg.png')",
      },
      keyframes: {
        weed: {
          '0%': { transform: 'translate(-10%, -10%)' },
          '50%': { transform: 'translate(-40.5%, -40.5%)' },
          '100%': { transform: 'translate(-10%, -10%)' },
        },
        mushroom: {
          '0%': { transform: 'translate(-10%, -10%)' },
          '50%': { transform: 'translate(-40.5%, -40.5%)' },
          '100%': { transform: 'translate(-10%, -10%)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        weed: 'weed 30s ease-in-out infinite',
        mushroom: 'mushroom 25s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
}

module.exports = config
