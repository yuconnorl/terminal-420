import Image from 'next/image'

import { cn } from '@/lib/utils'

import { IMAGE_PLACEHOLDER_URL } from '@/configs/general'

interface Props {
  src: string
  caption?: string
  alt: string
  width: number
  height: number
  isOutOfFrame?: boolean
}

const CustomImage = ({
  src,
  caption,
  alt,
  width,
  height,
  isOutOfFrame = false,
}: Props) => {
  return (
    <figure className='mb-8'>
      <Image
        className={cn('rounded-lg', isOutOfFrame && 'w-[725px]')}
        src={src}
        alt={alt}
        width={width}
        height={height}
        placeholder='blur'
        blurDataURL={IMAGE_PLACEHOLDER_URL}
        // unoptimized
      />
      {caption && (
        <figcaption className=' mt-3 border-l border-main-gray/40 pl-3 text-sm text-main-gray'>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default CustomImage
