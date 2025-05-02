'use client'

import { toast } from 'sonner'

const SoberUpButton = () => {
  const soberUp = () => {
    const html = document.getElementById('root')
    if (!html) return
    html.style.filter = `hue-rotate(${0}deg)`
    toast(<div className='flex items-center gap-2'>
      <span className='text-2xl'>🍺</span>
      <span className='font-silk'>Whoa, you're sober now</span>
    </div>, {
      duration: 2000,
    })
  }

  return (
    <button type='button' className='group relative flex md:animate-none' onClick={soberUp}>
      <div className='h-fit text-neutral-50 transition'>
        <span className='text-2xl group-hover:opacity-60 transition-opacity'>🧽</span>
      </div>
      <span className='font-silk animate-blink absolute bottom-0 block translate-y-8 md:translate-x-7 md:translate-y-2 text-xs text-neutral-700 group-hover:block dark:text-neutral-50'>
        Get sober
      </span>
    </button>
  )
}

export default SoberUpButton
