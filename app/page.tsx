import type { Metadata } from 'next'
import Image from 'next/image'
import homer from 'public/images/homer.webp'

import { BlogPosts } from './blog/blog-post'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog posts',
}

const LandingPage = () => {
  return (
    <section className='w-full max-w-3xl pt-8'>
      <div className='mb-10'>
        <h1 className='mb-8 font-mono text-3xl font-bold md:text-4xl'>👋 👋 👋</h1>
        <p className='text-neutral-700 dark:text-neutral-300'>
          Welcome to Terminal 420, a blog that focuses on web-related tech, cannabis and{' '}
          <Image className='inline align-middle' src={homer} alt='Homer' width={328} /> psychedelic research. Pull up a
          chair and have fun!
        </p>
      </div>
      <div className='flex flex-col gap-2'>
        <BlogPosts />
      </div>
    </section>
  )
}

export default LandingPage
