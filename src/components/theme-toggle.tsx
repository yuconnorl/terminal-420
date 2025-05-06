'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Moon, Sun } from '@/components/icons'

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <button
      className='p-3 text-neutral-800 dark:text-neutral-200'
      onClick={() => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
      }}
    >
      <span>
        {mounted ? (
          resolvedTheme === 'light' ? (
            <Sun className='size-6' />
          ) : (
            <Moon className='size-6' />
          )
        ) : (
          <Sun className='size-6' />
        )}
      </span>
    </button>
  )
}

export default ThemeToggle
