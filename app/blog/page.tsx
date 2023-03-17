import { allPosts } from 'contentlayer/generated'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import Link from 'next/link'

import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog posts',
}

const BlogPage = () => {
  return (
    <section className='max-w-3xl pt-8'>
      <h1 className='mb-5 font-mono text-3xl font-bold'>Blog Posts</h1>
      <div className='flex flex-col gap-10'>
        {allPosts
          .sort((a, b) => {
            if (new Date(a.date) > new Date(b.date)) return -1
            return 1
          })
          .map((post) => {
            return (
              <Link
                key={post.id}
                className='flex flex-col font-mono tracking-tight transition-opacity hover:opacity-60'
                href={post.url}
              >
                <div className='flex w-full flex-col text-2xl tracking-tight lg:text-3xl'>
                  <p>{post.title}</p>
                </div>
                <div className='my-2 text-sm tracking-tighter text-main-gray'>
                  <p>{dayjs(post.date).format('MMM DD, YYYY')}</p>
                </div>
                <div className='mt-1 max-w-xl font-mono tracking-tight text-main-gray'>
                  <p>{post.description}</p>
                </div>
              </Link>
            )
          })}
      </div>
      <Footer />
    </section>
  )
}

export default BlogPage
