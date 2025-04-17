'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import ThemeToggle from '@/components/theme-toggle'

import { getAngle } from '@/helper/angle'

const Navbar = () => {
  const logoRef = useRef<HTMLImageElement | null>(null)
  const [hueAngle, setHueAngle] = useState(0)

  const onMousemove = useCallback((e: MouseEvent) => {
    const mouseX = e.clientX
    const mouseY = e.clientY
    const logoRekt = logoRef.current && logoRef.current.getBoundingClientRect()
    const centerX = logoRekt ? logoRekt.left + logoRekt.width / 2 : 0
    const centerY = logoRekt ? logoRekt.top + logoRekt.height / 2 : 0
    const angleDeg = getAngle(mouseX, mouseY, centerX, centerY)
    setHueAngle(angleDeg)
  }, [])

  useEffect(() => {
    if (!logoRef.current) return
    logoRef.current.addEventListener('mousemove', onMousemove)

    return () => {
      if (!logoRef.current) return
      logoRef.current.removeEventListener('mousemove', onMousemove)
    }
  }, [onMousemove])

  return (
    <div
      className='mx-auto flex items-center justify-between'
      style={{ filter: `hue-rotate(${hueAngle}deg)` }}
    >
      <Link prefetch={false} href='/'>
        <Image
          ref={logoRef}
          alt='logo'
          src='/images/logo.svg'
          width={32}
          height={32}
        />
      </Link>
      <ThemeToggle />
    </div>
  )
}

export default Navbar
