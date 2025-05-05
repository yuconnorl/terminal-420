import type { Metadata } from 'next'
import Image from 'next/image'
import homer from 'public/images/homer.webp'

import { BlogPosts } from './blog/blog-post'

export const metadata: Metadata = {
  title: 'Terminal 420',
  description: 'Terminal 420, happy tripping!',
}

const LandingPage = () => {
  return (
    <section className='w-full max-w-2xl pt-8'>
      <div className='mb-10'>
        <h1 className='mb-8 text-3xl font-bold md:text-4xl'>👋 👋 👋</h1>
        <Image className='mb-6 inline align-middle' src={homer} alt='Homer' width={240} />
        <div className='font-silk text-xl font-bold md:text-2xl'>
          What’s good? Terminal 420’s all about web dev, weed, and{' '}
          <span className='trippy inline-block'>trippy studies</span>. Take a load off and enjoy!
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h3 className='mb-4 text-xl md:text-2xl'>🧠</h3>
        <BlogPosts />
      </div>
    </section>
  )
}

export default LandingPage
