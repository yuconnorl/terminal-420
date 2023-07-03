'use client'

import Image from 'next/image'
import { useEffect } from 'react'

import versionLogger from '@/helper/versionLogger'

const Footer = () => {
  const soberUp = () => {
    const html = document.getElementById('root')
    if (!html) return
    html.style.filter = `hue-rotate(${0}deg)`
  }

  useEffect(() => {
    versionLogger('#81a760')
  }, [])

  return (
    <footer className='relative mb-6 mt-4 flex justify-center text-sm'>
      <div className='text-center text-main-gray'>
        <p>© Terminal 420. Have a safe flight</p>
      </div>
      <button
        type='button'
        className='group absolute bottom-0 right-4 flex animate-bounce md:animate-none'
        onClick={soberUp}
      >
        <Image
          priority
          className='relative h-16 w-16 transition-all md:h-max md:w-max md:group-hover:-translate-y-3 md:group-hover:rotate-6'
          src='/images/weed.svg'
          width={100}
          height={100}
          alt='weeeed boy'
        />
        <div className='sober absolute -left-5 -top-5 h-fit rotate-[345deg] font-mono text-mallard-50 transition-opacity md:opacity-0 md:group-hover:opacity-100'>
          <p>Sober Up!</p>
        </div>
      </button>
    </footer>
  )
}

export default Footer
