'use client'

import { useTheme } from 'next-themes'

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      className='mt-2 rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black'
      onClick={() => {
        console.log(resolvedTheme)

        setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
      }}
    >
      <span className='w-4'>{resolvedTheme === 'light' ? '🌙' : '☀️'}</span>
      Theme
    </button>
  )
}

export default ThemeToggle
