'use client'

import Image from 'next/image'

const Footer = () => {
  const soberUp = () => {
    const html = document.getElementById('root')
    if (!html) return
    html.style.filter = `hue-rotate(${0}deg)`
  }

  return (
    <footer className='relative mb-6 mt-4 flex justify-center text-sm'>
      <div className='text-center text-main-gray'>
        <p>© Terminal 420. Have a safe flight</p>
      </div>
      <button
        type='button'
        className='group absolute right-4 bottom-0 flex animate-bounce md:animate-none'
        onClick={soberUp}
      >
        <Image
          className='relative h-16 w-16 transition-all md:h-max md:w-max md:group-hover:-translate-y-3 md:group-hover:rotate-6'
          src='/images/weed.svg'
          width={100}
          height={100}
          alt='weeeed boy'
        />
        <div className='sober absolute -top-5 -left-5 h-fit rotate-[345deg] font-mono text-mallard-50 transition-opacity md:opacity-0 md:group-hover:opacity-100'>
          <p>Sober Up!</p>
        </div>
      </button>
    </footer>
  )
}

export default Footer
