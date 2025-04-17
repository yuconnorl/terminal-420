import type { Metadata } from 'next'

import ThemeToggle from '@/components/theme-toggle'

import { BlogPosts } from './blog/blog-post'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog posts',
}

const LandingPage = () => {
  return (
    <section className='w-full max-w-3xl pt-8'>
      <div className='mb-10'>
        <h1 className='mb-8 font-mono text-3xl font-bold md:text-4xl'>Hi 👋</h1>
        <p className='w-1/2 text-gray-800'>
          Welcome to Terminal 420, a blog that focuses on web-related tech,
          cannabis and psychedelic research. Pull up a chair and have fun!
        </p>
      </div>
      <ThemeToggle />
      <div className='flex flex-col gap-2'>
        <BlogPosts />
      </div>
    </section>
  )
}

export default LandingPage
