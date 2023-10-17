'use client'
import { motion, type Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { getAngle } from '@/helper/angle'

interface Props {
  title: string
  slug: string
  description: string
}

const PostPeekerButton = ({ title, slug, description }: Props) => {
  const rightEyeRef = useRef<HTMLDivElement | null>(null)
  const leftEyetRef = useRef<HTMLDivElement | null>(null)
  const anchor = useRef<HTMLDivElement | null>(null)

  const eyeballsVariants = {
    hover: {
      x: 0,
      scale: 1.7,
    },
    initial: {
      x: 0,
      scale: 1,
    },
  }

  const cardVariants: Variants = {
    offscreen: {
      y: 300,
    },
    onscreen: {
      y: 10,
      rotate: -10,
      transition: {
        bounce: 0.4,
        type: 'spring',
        duration: 0.8,
      },
    },
  }

  const [isHovered, setIsHovered] = useState(false)
  function handleMouseEnter() {
    setIsHovered(true)
  }

  function handleMouseLeave() {
    setIsHovered(false)
  }

  const onMousemove = useCallback((e: MouseEvent) => {
    const mouseX = e.clientX
    const mouseY = e.clientY
    const rekt = anchor.current && anchor.current.getBoundingClientRect()

    const centerX = rekt ? rekt.left + rekt.width / 2 : 0
    const centerY = rekt ? rekt.top + rekt.height / 2 : 0
    const angleDeg = getAngle(mouseX, mouseY, centerX, centerY)

    if (leftEyetRef.current)
      leftEyetRef.current.style.transform = `rotate(${-90 + angleDeg}deg)`
    if (rightEyeRef.current)
      rightEyeRef.current.style.transform = `rotate(${-90 + angleDeg}deg)`
  }, [])

  useEffect(() => {
    if (!anchor.current) return
    document.addEventListener('mousemove', onMousemove)

    return () => {
      if (!anchor.current) return
      document.removeEventListener('mousemove', onMousemove)
    }
  }, [onMousemove])

  return (
    <>
      <motion.div
        initial='initial'
        animate='initial'
        whileHover='animate'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='border-b border-t overflow-hidden border-mallard-50 border-opacity-20 py-4 xl:py-6 px-2'
      >
        <Link
          className='flex text-lg tracking-tight transition-opacity hover:opacity-60 lg:text-xl items-center'
          href={`/blog/${slug}`}
        >
          <div className='flex flex-col w-[75%] md:w-[90%] font-mono'>
            <div className=' text-sm text-main-gray opacity-50 mb-1 xl:mb-2'>
              <p>Next</p>
            </div>
            <div className='mb-2 xl:mb-2'>
              <p>{title}</p>
            </div>
            <div className='font-sans-serif text-m tracking-wide w-2/3 text-main-gray truncate'>
              {description}
            </div>
          </div>
          <motion.div
            ref={anchor}
            className='anchor'
            initial='offscreen'
            whileInView='onscreen'
            viewport={{ once: true, amount: 0.8 }}
          >
            <motion.div className='relative' variants={cardVariants}>
              <Image
                src='/images/empty-eye.png'
                width={74}
                height={66}
                alt='Eyes'
                className='max-w-fit'
                priority
              />
              <div className='absolute top-5 left-3 w-5 h-5' ref={leftEyetRef}>
                <motion.div
                  variants={eyeballsVariants}
                  animate={isHovered ? 'hover' : 'initial'}
                  className='w-2.5 h-2.5 absolute right-[4.25px] top-0 bg-black rounded-full'
                />
              </div>
              <div
                className='absolute top-5 right-[4px] w-5 h-5'
                ref={rightEyeRef}
              >
                <motion.div
                  variants={eyeballsVariants}
                  animate={isHovered ? 'hover' : 'initial'}
                  className='w-2.5 h-2.5 absolute right-[4.25px] top-0 bg-black rounded-full'
                />
              </div>
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>
    </>
  )
}

export default PostPeekerButton
