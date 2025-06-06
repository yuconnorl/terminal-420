'use client'
import { motion, type Variants } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { getAngle } from '@/helper/angle'

type Props = {
  title: string
  slug: string
}

const PostPeekerButton = ({ title, slug }: Props) => {
  const rightEyeRef = useRef<HTMLDivElement | null>(null)
  const leftEyeRef = useRef<HTMLDivElement | null>(null)
  const anchor = useRef<HTMLDivElement | null>(null)

  const eyeballsVariants = {
    hover: {
      x: 0,
      scale: 1.5,
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

    if (leftEyeRef.current) leftEyeRef.current.style.transform = `rotate(${-90 + angleDeg}deg)`
    if (rightEyeRef.current) rightEyeRef.current.style.transform = `rotate(${-90 + angleDeg}deg)`
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
        onHoverStart={handleMouseEnter}
        onHoverEnd={handleMouseLeave}
        className='overflow-hidden border-neutral-200 px-2 py-4 xl:py-6 dark:border-neutral-600'
      >
        <Link
          prefetch={false}
          className='trippy-hover flex items-center transition-opacity hover:opacity-80'
          href={`/blog/${slug}`}
        >
          <div className='flex w-[75%] flex-col font-mono md:w-[90%]'>
            <p className='mb-1 font-silk text-sm tracking-tight text-neutral-600/70 xl:mb-2 dark:text-neutral-400/70'>
              Next
            </p>
            <p className='mb-2 font-cubic text-lg'>{title}</p>
          </div>
          <motion.div
            ref={anchor}
            className='anchor'
            initial='offscreen'
            whileInView='onscreen'
            viewport={{ once: true, amount: 0.8 }}
          >
            <motion.div className='relative' variants={cardVariants}>
              <Image src='/images/empty-eye.png' width={58.5} height={48} alt='Eyes' className='max-w-fit' priority />
              <div className='absolute top-5 left-[6px] h-5 w-5' ref={leftEyeRef}>
                <motion.div
                  variants={eyeballsVariants}
                  animate={isHovered ? 'hover' : 'initial'}
                  className='absolute top-0 right-[4.25px] h-2.5 w-2.5 rounded-full bg-black'
                />
              </div>
              <div className='absolute top-5 right-[4px] h-5 w-5' ref={rightEyeRef}>
                <motion.div
                  variants={eyeballsVariants}
                  animate={isHovered ? 'hover' : 'initial'}
                  className='absolute top-0 right-[4.25px] h-2.5 w-2.5 rounded-full bg-black'
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
