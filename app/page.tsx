import { allPosts } from 'contentlayer/generated'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog posts',
}

const LandingPage = () => {
  const sortPosts = allPosts.sort((a, b) => {
    if (new Date(a.date) > new Date(b.date)) return -1
    return 1
  })

  return (
    <section className='w-full max-w-3xl pt-8'>
      <div className='mb-10'>
        <h1 className='mb-8 font-mono text-3xl font-bold md:text-4xl'>Hi 👋</h1>
        <p className='w-1/2 text-gray-800'>
          Welcome to Terminal 420, a blog that focuses on web-related tech,
          cannabis and psychedelic research. Pull up a chair and have fun!
        </p>
      </div>
      <div className='flex flex-col gap-2'>
        {sortPosts.map((post) => (
          <Link
            key={post.id}
            href={post.url}
            className='flex flex-col tracking-tight transition-opacity hover:opacity-60'
          >
            <p className='text-blue-500'>{post.title}</p>
            <p className='font-mono text-sm text-gray-400'>
              {dayjs(post.date).format('MMM DD, YYYY')}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default LandingPage
