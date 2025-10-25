'use client'

import { useRef } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

const SoberUpButton = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timer = 2000
  const tick = 100
  const intervals = timer / tick

  const soberUp = () => {
    const html = document.getElementById('root')
    if (!html) return

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const filterValue = html.style.filter
    const match = filterValue.match(/hue-rotate\((-?\d+\.?\d*)deg\)/)
    const currentAngle = match?.[1] ? parseFloat(match[1]) : 0

    if (currentAngle === 0) {
      toast(<span className='font-mono'>You're sober already! 🧽</span>)
      return
    }

    toast(
      <div className='flex items-center gap-2 font-mono'>
        <svg className='h-6 w-6 -rotate-90' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'>
          <circle cx='18' cy='18' r='16' fill='none' className='stroke-current opacity-25' strokeWidth='3' />
          <circle
            cx='18'
            cy='18'
            r='16'
            fill='none'
            className='animate-progress stroke-current'
            strokeWidth='3'
            strokeDasharray='100'
            strokeDashoffset='100'
            strokeLinecap='round'
            style={{
              animation: 'progress 2s linear forwards',
            }}
          />
        </svg>
        <span className='text-xl'>💉</span>
        <span>Applying epinephrine...</span>
      </div>,
      {
        duration: 2000,
      },
    )

    const step = Math.abs(currentAngle) / intervals
    const isNegative = currentAngle < 0
    let angle = currentAngle

    intervalRef.current = setInterval(() => {
      if (isNegative) {
        angle += step
      } else {
        angle -= step
      }

      const reachedZero = isNegative ? angle >= 0 : angle <= 0

      if (reachedZero) {
        angle = 0
        html.style.filter = `hue-rotate(0deg)`

        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }

        toast.success(<span className='font-mono'>Whoa, you're sober now!</span>, {
          duration: 2000,
        })
      } else {
        html.style.filter = `hue-rotate(${angle}deg)`
      }
    }, tick)
  }

  return (
    <Button variant='emoji' size='icon' className='group relative flex md:animate-none' onClick={soberUp}>
      🧽
      <span className='absolute bottom-0 block translate-y-8 animate-blink font-silk text-xs text-neutral-700 group-hover:block md:translate-x-7 md:translate-y-2 dark:text-neutral-50'>
        <span className='block'>Get</span>
        <span className='block'>sober</span>
      </span>
    </Button>
  )
}

export default SoberUpButton
