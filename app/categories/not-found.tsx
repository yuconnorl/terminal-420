import Image from 'next/image'

export default function NotFound() {
  return (
    <Image
      src='/images/not-found.png'
      quality={75}
      width={1495}
      height={841}
      alt='not found weed boi'
      className='object-contain'
    />
  )
}
