'use client'

import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant='emoji'
      size='icon'
      onClick={() => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
      }}
    >
      <span>{resolvedTheme === 'light' ? '🌞' : '🌜'}</span>
    </Button>
  )
}

export default ThemeToggle
