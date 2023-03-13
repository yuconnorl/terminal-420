/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      fontFamily: {
        'sans-serif': ['var(--font-noto)', 'Roboto', 'sans-serif'],
        mono: ['var(--font-jet-brain)'],
      },
      colors: {
        'main-green': '#81A760',
        'main-black': '#111010',
        'main-white': '#F5F8F1',
        'main-gray': '#999999',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('@tailwindcss/typography')],
}

module.exports = config
