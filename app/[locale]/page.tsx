import type { Metadata } from 'next'

import ASCIIAnimation from '@/components/ascii-animation-color'
import { loadFrame } from '@/helper/loadFrames'

import { BlogPosts } from './blog/blog-post'

export const metadata: Metadata = {
  title: 'Mind Agonist',
  description: 'Mind Agonist',
}

const LandingPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const initialFrame = loadFrame({ frameNumber: 1, frameFolder: 'frames' })

  return (
    <section className='w-full max-w-2xl'>
      <div className='mb-4'>
        <ASCIIAnimation fps={30} frameCount={150} frameFolder='frames' initialFrame={initialFrame} />
        <span className='mb-6 block font-mono text-xs text-neutral-300 dark:text-neutral-700'>
          The Simpsons - Season 8, Episode 9 ("The Mysterious Voyage of Homer")
        </span>
        <div className='font-silk text-xl font-semibold'>Way to go. Take a load off and relax.</div>
      </div>
      <div className='flex flex-col gap-2'>
        <h3 className='mb-4 text-xl md:text-2xl'>🧠</h3>
        <BlogPosts locale={locale} />
      </div>
    </section>
  )
}

export default LandingPage
