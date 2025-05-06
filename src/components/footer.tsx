'use client'

import { useEffect } from 'react'

import versionLogger from '@/helper/versionLogger'

const Footer = () => {
  useEffect(() => {
    versionLogger('#81a760')
  }, [])

  return (
    <footer className='relative mt-4 mb-6 flex justify-center'>
      <div className='text-center font-silk text-xs tracking-tight text-neutral-700 opacity-70 dark:text-neutral-300'>
        <p>Have a safe flight 🛫</p>
      </div>
    </footer>
  )
}

export default Footer
