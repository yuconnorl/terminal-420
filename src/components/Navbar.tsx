'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import SoberUpButton from '@/components/sober-up-button'
import ThemeToggle from '@/components/theme-toggle'

import { getAngle } from '@/helper/angle'

const Navbar = () => {
  const logoRef = useRef<HTMLImageElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const onMousemove = useCallback((e: MouseEvent) => {
    const mouseX = e.clientX
    const mouseY = e.clientY
    const logoRekt = logoRef.current && logoRef.current.getBoundingClientRect()
    const centerX = logoRekt ? logoRekt.left + logoRekt.width / 2 : 0
    const centerY = logoRekt ? logoRekt.top + logoRekt.height / 2 : 0
    const angleDeg = getAngle(mouseX, mouseY, centerX, centerY)

    const html = document.documentElement
    if (html) {
      html.style.filter = `hue-rotate(${angleDeg}deg)`
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !logoRef.current) return

    logoRef.current.addEventListener('mousemove', onMousemove)

    return () => {
      if (logoRef.current) {
        logoRef.current.removeEventListener('mousemove', onMousemove)
      }
    }
  }, [isMounted, onMousemove])

  return (
    <div className='max-w-2xl mx-auto flex items-center justify-between'>
      <Link prefetch={false} href='/'>
        <Image ref={logoRef} alt='logo' src='/images/logo.svg' width={32} height={32} />
      </Link>
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        <SoberUpButton />
      </div>
    </div>
  )
}

export default Navbar
