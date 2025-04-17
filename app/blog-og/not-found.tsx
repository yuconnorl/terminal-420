import Image from 'next/image'

export default function NotFound() {
  return (
    <Image
      src='/images/not-found.png'
      quality={85}
      fill
      alt='not found weed boi'
      className='object-contain'
    />
  )
}
