import Image from 'next/image'
import Markdown from 'react-markdown'

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
        <figcaption className='mt-2 pl-1 text-sm text-neutral-800 dark:text-neutral-300'>
          <Markdown
            components={{
              a: ({ node, ...props }) => (
                <span className='not-prose m-0 mr-[2px] text-[#8c796a] transition-opacity hover:opacity-70 dark:text-[#c3bbae]'>
                  <a
                    className='after:contents-[""] relative underline underline-offset-2 after:relative after:left-[2px] after:inline-block after:h-3 after:w-3 after:bg-[url(/images/link-arrow-dark.svg)] after:bg-contain after:bg-center after:bg-no-repeat dark:after:bg-[url(/images/link-arrow.svg)]'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={props.href}
                  >
                    {props.children}
                  </a>
                </span>
              ),
            }}
          >
            {caption}
          </Markdown>
        </figcaption>
      )}
    </figure>
  )
}

export default CustomImage
