import Image from 'next/image'

import { cn } from '@/lib/utils'

import { IMAGE_PLACEHOLDER_URL } from '@/configs/general'

interface Props {
  src: string
  caption?: string
  alt: string
  width: number
  height: number
}

const CustomImage = ({ src, caption, alt, width, height }: Props) => {
  return (
    <figure className='relative my-12 md:my-16'>
      <Image
        className={cn('w-full rounded-lg')}
        src={src}
        alt={alt}
        width={width}
        height={height}
        placeholder='blur'
        blurDataURL={IMAGE_PLACEHOLDER_URL}
        // unoptimized
      />
      {caption && (
        <figcaption className='mt-4 pl-3 text-center text-sm text-main-gray'>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default CustomImage
