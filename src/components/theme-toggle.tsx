'use client'

import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant='emoji'
      size='icon'
      className='cursor-pointer'
      asChild
      onClick={() => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
      }}
    >
      <span>{resolvedTheme === 'light' ? '🌞' : '🌜'}</span>
    </Button>
  )
}

export default ThemeToggle
