'use client'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'

import { getAngle } from '@/helper/angle'

const routes = [
  {
    name: 'Blog',
    path: '/blog',
  },
  {
    name: 'Categories',
    path: '/categories',
  },
  {
    name: 'About',
    path: '/about',
  },
]

const Navbar = () => {
  const pathname = usePathname()
  const rootPath = pathname && pathname.match(/^\/(\w+)/g)?.[0]
  const logoRef = useRef<HTMLImageElement | null>(null)

  const onMousemove = useCallback((e: MouseEvent) => {
    const html = document.getElementById('root')
    const mouseX = e.clientX
    const mouseY = e.clientY
    const logoRekt = logoRef.current && logoRef.current.getBoundingClientRect()
    const centerX = logoRekt ? logoRekt.left + logoRekt.width / 2 : 0
    const centerY = logoRekt ? logoRekt.top + logoRekt.height / 2 : 0
    const angleDeg = getAngle(mouseX, mouseY, centerX, centerY)

    if (!html) return
    html.style.filter = `hue-rotate(${angleDeg}deg)`
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
    <div className='mx-auto flex items-center justify-between'>
      <Link href={'/'}>
        <Image
          ref={logoRef}
          alt='logo'
          src='images/logo.svg'
          width={32}
          height={32}
        />
      </Link>
      <div className='flex gap-4'>
        {routes.map(({ name, path }) => (
          <div
            key={name}
            className={clsx(
              'font-mono transition-opacity',
              rootPath === path
                ? 'text-mallard-400'
                : 'text-main-gray hover:opacity-70',
            )}
          >
            <Link href={path}>{name}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Navbar
