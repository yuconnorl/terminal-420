'use client'

import { useEffect } from 'react'

import versionLogger from '@/helper/versionLogger'

const Footer = () => {
  useEffect(() => {
    versionLogger('#81a760')
  }, [])

  return (
    <footer className='relative mt-4 mb-6 flex justify-center text-sm'>
      <div className='font-silk text-center tracking-tight text-neutral-700 opacity-70 dark:text-neutral-300'>
        <p>Have a safe flight 🛫</p>
      </div>
      {/* <button
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
        <div className='sober absolute -left-5 -top-5 h-fit rotate-[345deg] font-mono text-neutral-50 transition-opacity md:opacity-0 md:group-hover:opacity-100'>
          <p>Sober Up!</p>
        </div>
      </button> */}
    </footer>
  )
}

export default Footer
