import Image from 'next/image'

import { IMAGE_PLACEHOLDER_URL } from '@/configs/general'
import { cn } from '@/lib/utils'

type Props = {
  src: string
  caption?: string
  alt: string
  width: number
  height: number
}

const CustomImage = ({ src, caption, alt, width, height }: Props) => {
  return (
    <figure className='relative mb-8'>
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
        <figcaption className='mt-2 pl-1 text-sm text-neutral-800 dark:text-neutral-300'>{caption}</figcaption>
      )}
    </figure>
  )
}

export default CustomImage
