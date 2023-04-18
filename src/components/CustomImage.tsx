import Image from 'next/image'

interface Props {
  src: string
  caption?: string
  alt: string
  width: number
  height: number
}

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
        blurDataURL='/images/placeholder.jpeg'
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
