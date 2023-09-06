import Image from 'next/image'

interface Props {
  src: string
  caption?: string
  alt: string
  width: number
  height: number
}

const placeholder =
  'data:image/jpeg;base64,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'

const CustomImage = ({ src, caption, alt, width, height }: Props) => {
  return (
    <figure className='mb-8'>
      <Image
        className='rounded-lg'
        src={src}
        alt={alt}
        width={width}
        height={height}
        placeholder='blur'
        blurDataURL={placeholder}
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
