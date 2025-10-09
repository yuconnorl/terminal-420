'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'

import { Moon, Sun } from '@/components/icons'

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      className='p-3 text-neutral-800 dark:text-neutral-200'
      onClick={() => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
      }}
    >
      <span>{resolvedTheme === 'light' ? <Sun className='size-6' /> : <Moon className='size-6' />}</span>
    </button>
  )
}

export default ThemeToggle
